import type { CollectionEntry } from "astro:content";
import {
  KeyofSongReduced,
  type Album,
  type AlbumReduced,
  type Song,
  type SongData,
  type SongDataReduced,
  type SongReduced,
  type SongReducedKeys,
} from "./types";
export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
export function formatDuration(duration: number) {
  const seconds = duration;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds - hours * 3600 - minutes * 60);
  function padNumb(number: number) {
    if (number > 9) return number.toString();
    return "0" + number;
  }
  return (
    (hours > 0 ? padNumb(hours) + ":" : "") +
    padNumb(minutes) +
    ":" +
    padNumb(sec)
  );
}
export function getAlbumsNames(songs: Song[], {} = {}) {
  const albums: Album[] = getAlbums(songs, {});

  return albums.map((album) => album.slug);
}

function getSongAlbum(song: Song) {
  const data = song.data;
  const album = data.album;
  const artists = data.artists?.join("_");
  if (album != undefined) {
    return album;
  } else if (artists != undefined) {
    return artists;
  } else {
    return song.id;
  }
}
export function songToAlbumSlug(song: Song) {
  return slugify(getSongAlbum(song));
}
export function getAlbums(songs: Song[], {} = {}) {
  // const albums = getAlbums(songs);
  const albums: Album[] = [];
  function findAlbumWithSlug(albums: Album[], slug: string) {
    for (const album of albums) {
      if (album.slug == slug) {
        return album;
      }
    }
    return undefined;
  }
  function pushToAlbum(albums: Album[], song: Song) {
    const slug = songToAlbumSlug(song);
    const album = findAlbumWithSlug(albums, slug);
    if (album == undefined) {
      const newAlbum: Album = {
        slug: slug,
        songs: [song],
        cover: song.data.cover,
        name: getSongAlbum(song),
        // song:
        duration: song.data.duration,
      };
      albums.push(newAlbum);
    } else {
      album.duration += song.data.duration;
      album.songs.push(song);
    }
  }

  songs.forEach((song) => {
    pushToAlbum(albums, song);
  });
  return albums;
}
export function returnReduced(albums: Album[]) {
  const albs = structuredClone(albums);
  const red: AlbumReduced[] = albs.map((album) => {
    const { songs, ...rest } = album;
    const reducedSongs: SongReduced[] = songs.map((song) => {
      const data: any = song.data;

      Object.keys(KeyofSongReduced).forEach((key) => {
        delete data[key];
      });
      let reducedData: SongDataReduced = data as SongDataReduced;
      return {
        id: song.id,
        data: reducedData,
      };
    });
    const reduced: AlbumReduced = { songs: reducedSongs, ...rest };
    return reduced;
  });
  return red;
  // albums.
}
