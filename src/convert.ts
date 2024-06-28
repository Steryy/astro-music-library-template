import ffmpeg from "node-fluent-ffmpeg";
import { parseFile, selectCover } from "music-metadata";
import { slug } from "github-slugger";
import argg from "minimist";
const argv = argg(process.argv.slice(2));
import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
const fsp = fs.promises;
import { glob } from "glob";
// console.log(argv);
enum BUILD {
  NONE = 0,
  JSON = 1 << 0, // 0001 -- the bitshift is unnecessary, but done for consistency
  MUSIC = 1 << 1, // 0010
  ARTWORK = 1 << 2, // 0100
  ALL = ~(~0 << 3), // 1111
  OVERWEITEFILES = 1 << 3,
  REMOVEFOLDERS = 1 << 4,
}
let buildValue = BUILD.NONE;
let defaultbitrate = 15;

function Clean() {
  process.exit(0);
}

if (argv.C === true) {
  Clean();
}
if (argv.Bj === true) {
  buildValue = buildValue | BUILD.JSON;
}
if (argv.Bm === true) {
  buildValue = buildValue | BUILD.MUSIC;
}
if (argv.Ba === true) {
  buildValue = buildValue | BUILD.ARTWORK;
}
if (argv.B === true) {
  buildValue = buildValue | BUILD.ALL;
}
if (argv.b && typeof argv.b == "number") {
  defaultbitrate = argv.b;
}

const mainquestion = ["Clear generated files", "Build"];
async function AskWhatToDo() {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: mainquestion,
  });

  return mainquestion.indexOf(action);
}
async function OverwriteExisting() {
  const { overwriteBuild } = await inquirer.prompt({
    type: "confirm",
    name: "overwriteBuild",
    message:
      "Do you want to overwrite existing files during the build process?",
    default: true,
  });
  if (overwriteBuild === true) {
    buildValue = buildValue | BUILD.OVERWEITEFILES;
  }
}
async function AskAboutBuild() {
  const builds = [
    { name: "Create JSON files", value: BUILD.JSON },
    { name: "Convert music from songs/", value: BUILD.MUSIC },
    { name: "Create artworks", value: BUILD.ARTWORK },
  ];
  const { answers } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "answers",
      message: "Which reptiles do you love?",
      validate: (answer) =>
        answer.length < 1
          ? "You must choose at least one target to build."
          : true,
      choices: builds,
    },
  ]);

  buildValue = answers.reduce(
    (acc: any, build: any) => acc | build,
    BUILD.NONE,
  );
}
async function SetBitrate() {
  const { number } = await inquirer.prompt([
    {
      type: "input",
      name: "number",
      message: "Please enter a number between 10 and 300:",
      validate: function (value) {
        const parsedValue = parseInt(value);
        if (Number.isNaN(parsedValue)) {
          return "Please enter a valid number.";
        }
        if (parsedValue < 10 || parsedValue > 300) {
          return "Please enter a number between 10 and 300.";
        }
        return true;
      },
    },
  ]);
  defaultbitrate = number;
}

if (buildValue == BUILD.NONE) {
  if ((await AskWhatToDo()) === 0) {
    Clean();
  } else {
    await OverwriteExisting();
    await AskAboutBuild();
    if (buildValue & BUILD.MUSIC) {
      await SetBitrate();
    }
  }
}
function removePublic(s: string): string {
    return s.replace(/^\/?public/, '');
}
function saveMusicFile(input: string, output: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        "-vn",
        "-codec:a libmp3lame", // Use the libmp3lame codec for compression
        `-b:a ${defaultbitrate}32k`, // Set bitrate to 128k (adjust as needed)
        "-map_metadata -1", // Remove all metadata
      ]) // Exclude video stream (cover art)
      .output(output)
      .on("end", () => {
        // console.log("Music file saved without artwork!");
        // resolve();
      })
      .on("error", (err: any) => {
        // // console.error(
        //   "An error occurred during music file saving:",
        //   err.message,
        // );
        reject(err);
      })
      .run();
  });
}
const outputMusicPath = "./public/songs/";
const outputArtworkPath = "./public/img/";
const outputJsonPath = "./src/content/songs/";
const MusicRootDir = "./public/music/";
async function extractArtwork(input: string) {
  const metadata = await parseFile(input);

  const { common } = metadata;
  const { albumbcover, artPath } = paths(input, common.album);
  const cover = selectCover(common.picture);
  if (albumbcover != undefined) {
    if (!fs.existsSync(albumbcover)) {
      if (cover) await fsp.writeFile(albumbcover, cover.data);
    }

    return;
  }
  //
  // if (albumbcover != undefined && !fs.existsSync(albumbcover)) {
  console.log("fdsafdsafdsa" + artPath);
  if (cover) await fsp.writeFile(artPath, cover.data);
  // }
  // console.log("created" + input)
  // return new Promise((resolve, reject) => {
  //   ffmpeg(input)
  //     .outputOptions("-an") // Extract video stream (cover art)
  //     .outputOptions("-f image2") // Force format
  //     .output(output)
  //     .on("end", () => {
  //       console.log("Artwork extraction finished!");
  //       resolve();
  //     })
  //     .on("error", (err) => {
  //       console.error(
  //
  //
  //         "An error occurred during artwork extraction:",
  //         err.message,
  //       );
  //       reject(err);
  //     })
  //     .run();
  // });
}

function generateJSOn() {
  // console.log("fdsafdsafsda");
  audiofile.forEach((file) => {
    (async () => {
      try {
        const metadata = await parseFile(file);
        const { common } = metadata;
        const { jsonpath, albumbcover, artPath, musicPath } = paths(
          file,
          common.album,
        );
        let coverFile = albumbcover;
        const cover = selectCover(common.picture);
        if (metadata.format.duration == 0) {
          return console.error("Duration 0" + file);
        }
        if (fs.existsSync(artPath)) {
          coverFile = artPath;
        }
        coverFile = coverFile && removePublic(coverFile);
        const filePath =  removePublic(buildValue & BUILD.MUSIC ? musicPath : file)

        // console.log( cover );
        const json = {
          title: common.title,
          track: common.track,
          duration: metadata.format.duration,
          artists: common.artists,
          comment: common.comment,
          date: formatDate(common.date),

          cover: cover ? coverFile : undefined,
          filepath: filePath,
          album: common.album,
          lyrics: common.lyrics,
        };
        const jstring = JSON.stringify(json);
        console.log(json)
        await fsp.writeFile(jsonpath, jstring);
        // console.log(inspect(metadata, { showHidden: false, depth: null }));
      } catch (error) {}
    })();
  });
}
if (buildValue & BUILD.REMOVEFOLDERS) {
  fs.rmdirSync(outputMusicPath, { recursive: true });
  fs.rmdirSync(outputArtworkPath, { recursive: true });
  fs.rmdirSync(outputJsonPath, { recursive: true });
}
fs.mkdirSync(outputMusicPath, { recursive: true });
fs.mkdirSync(outputJsonPath, { recursive: true });
fs.mkdirSync(outputArtworkPath, { recursive: true });
let audiofile = await glob(MusicRootDir + "**/*.{m4a,mp3,wav}", {
  ignore: [
    MusicRootDir + "**/*Deleted*/**/*",
    MusicRootDir + "**/*Instrumental*/**/*",
  ],
});
// audiofile = audiofile.filter((filePath) => {
//   return !/Deleted/.test(filePath);
// });
let processed = 0;
function paths(file: string, album: string | undefined) {
  const ext = path.extname(file);
  const relative = path.relative(MusicRootDir, file);
  const slugg = slug(path.join(relative, path.basename(relative, ext)));
  const artPath = path.join(outputArtworkPath, slugg) + ".jpg";
  const musicPath = path.join(outputMusicPath, slugg) + ".mp3";

  const jsonpath = path.join(outputJsonPath, slugg + ".json");
  const albumbcover = album
    ? path.join(outputArtworkPath, slug(album) + ".jpg")
    : undefined;
  return {
    artPath,
    musicPath,
    ext,
    albumbcover,
    jsonpath,
    relative,
    slugg: slugg,
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) {
    return undefined;
  }
  const stringg =
    dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6) + "-" + dateStr.slice(6, 8);
  if (dateStr.slice(6, 8) == "") {
    return undefined;
  }

  return stringg;
  // Format the date string
}

// console.log(buildValue);
// console.log(audiofile);
audiofile.forEach((file) => {
  // console.log(file);
  (async () => {
    try {
      const { artPath, musicPath } = paths(file, undefined);

      if (buildValue & BUILD.MUSIC) await saveMusicFile(file, musicPath);
      if (buildValue & BUILD.ARTWORK) await extractArtwork(file);
      processed++;
      if (processed == audiofile.length) {
        if (buildValue & BUILD.JSON) generateJSOn();
      }
    } catch (error) {
      processed++;
      // console.error(error.message);
    }
  })();
});
