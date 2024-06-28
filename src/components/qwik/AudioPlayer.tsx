import {
  component$,
  $,
  useSignal,
  useOnDocument,
  useStore,
} from "@builder.io/qwik";

import type {
  SongEvent,
  SongEventAddToQueue,
  SongEventRetriveFromQueue,
  SongNextRequest,
  SongReduced,
} from "../../js/types";
import { Slave } from "./AudioPlayerSlave";
export const Nut = component$(() => {
  const songSignal = useSignal<{
    song: SongReduced;
    cover?: string;
    queue: string;
  }>();
  const previousTracks = useStore(
    [] as {
      song: SongReduced;
      cover?: string;
      queue: string;
    }[],
  );

  useOnDocument(
    "songEvent",
    $((e: CustomEvent<SongEvent>) => {
      e.stopImmediatePropagation();
      const content = e.detail;
      console.log(e, "songEvent\n\n");
      switch (content.type) {
        case "addSong":
          if (songSignal.value == undefined) {
            songSignal.value = { ...content.payload, queue: "user" };
          } else {
            document.dispatchEvent(
              new CustomEvent("songQueue", {
                detail: {
                  type: "addToQueue",
                  queueName: "queue",
                  payload: content.payload,
                } as SongEventAddToQueue,
              }),
            );
          }
          break;
        case "retriveFromQueueResponse":
          if (content.payload) {
            if (songSignal.value != undefined) {
              previousTracks.push(songSignal.value);
            }
            songSignal.value = { ...content.payload, queue: content.queueName };
          } else {
            document.dispatchEvent(
              new CustomEvent("songNext", {
                detail: {
                  type: "retriveNextSong",
                } as SongNextRequest,
              }),
            );
          }
          break;
        case "prevSongRequest":
          if (previousTracks.length > 0) {
            const track = previousTracks.pop();
            songSignal.value = track;
          }
          break;
        case "songEventNextReady":
          document.dispatchEvent(
            new CustomEvent("songNext", {
              detail: {
                type: "retriveNextSong",
              } as SongNextRequest,
            }),
          );
          break;
        case "NextSongRequest":
          document.dispatchEvent(
            new CustomEvent("songQueue", {
              detail: {
                type: "retriveFromQueue",
                queueName: "queue",
              } as SongEventRetriveFromQueue,
            }),
          );
          break;
      }
    }),
  );
  return <Slave songSignal={songSignal} />;
});
