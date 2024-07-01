import { $, type Signal } from "@builder.io/qwik";
import type {
  SongData,
  SongEventNextRequest,
  SongEventPrevRequest,
} from "../../js/types";

export function setMediaSession(
  songData: SongData,
  artwork: MediaImage[] | undefined,
) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: songData?.title,
    artist: songData?.artists?.join("&"),
    album: songData?.album,

    artwork: artwork,
  });
}

export const previous = $(() => {
  document.dispatchEvent(
    new CustomEvent("songEvent", {
      detail: {
        type: "prevSongRequest",
      } as SongEventPrevRequest,
    }),
  );
  // isPlaying.value = !audioRef.value?.paused;
});
export const onEnded = $(() => {
  document.dispatchEvent(
    new CustomEvent("songEvent", {
      detail: {
        type: "NextSongRequest",
      } as SongEventNextRequest,
    }),
  );
  // isPlaying.value = !audioRef.value?.paused;
  console.log("end");
});

export const onLoadedMetadata = $(
  (
    progressRef: Signal<HTMLInputElement>,
    audioRef: Signal<HTMLAudioElement>,
  ) => {
    console.log("Can Play");
    if (progressRef.value && audioRef.value) {
      progressRef.value.max = audioRef.value.duration.toString();

      console.log(progressRef.value.max);
    }
  },
);
export const onTimeChange = $(
  (
    progressRef: Signal<HTMLInputElement>,
    audioRef: Signal<HTMLAudioElement>,
    changing: Signal<boolean>
  ) => {
    if (audioRef.value) {
      // currTIme.value = audioRef.value.currentTime;

      if (changing.value != true && audioRef.value && progressRef.value) {
        progressRef.value.value = audioRef.value.currentTime.toString();
      }
    }
  },
);
// if (navigator.mediaSession) {
//   navigator.mediaSession.setActionHandler("seekbackward", function () {
//     console.log('> User clicked "Seek Backward" icon.');
//   });
//
//   navigator.mediaSession.setActionHandler("seekforward", function () {
//     console.log('> User clicked "Seek Forward" icon.');
//   });
//   navigator.mediaSession.setActionHandler("previoustrack", function () {
//     console.log('> User clicked "Previous Track" icon.');
//   });
//   navigator.mediaSession.setActionHandler("play", async function () {
//     console.log('> User clicked "Play" icon.');
//     audioRef.value?.play();
//     // Do something more than just playing audio...
//   });
//   try {
//     navigator.mediaSession.setActionHandler("seekto", function (event) {
//       console.log('> User clicked "Seek To" icon.');
//
//       if (audioRef.value && event.seekTime) {
//         audioRef.value.currentTime = event.seekTime;
//       }
//     });
//   } catch (error) {}
//
//   navigator.mediaSession.setActionHandler("pause", function () {
//     console.log('> User clicked "Pause" icon.');
//     audioRef.value?.pause();
//     // Do something more than just pausing audio...
//   });
//
//   navigator.mediaSession.setActionHandler("nexttrack", function () {
//     console.log('> User clicked "Next Track" icon.');
//   });
// }
//
//
// if ("setPositionState" in navigator.mediaSession) {
//   console.log("Updating position state...");
//   // navigator.mediaSession.setPositionState({
//   //   duration: audioRef.value.duration,
//   //   playbackRate: audioRef.value.playbackRate,
//   //   position: audioRef.value.currentTime,
//   // });
// }
