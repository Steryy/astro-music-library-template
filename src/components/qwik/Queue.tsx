import {
  $,
  component$,
  Slot,
  useOnDocument,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import {
  MatCloseFilled,
  MatDragHandleFilled,
  MatPlayArrowFilled,
  MatSettingsFilled,
} from "@qwikest/icons/material";
import type {
  AlbumReduced,
  QueueEvent,
  SongEventRemoveFromQueue,
  SongEventRetriveFromQueueResponse,
  SongNextReady,
  SongNextRequest,
  SongReduced,
} from "../../js/types";

const Helper = component$((props: { name: string }) => {
  const { name } = props;
  return (
    <div class="flex w-full flex-col lg:min-h-[30vh]">
      <span class="relative m-1 block p-1 text-center text-2xl">
        {name == "queue" && (
          <button
            aria-label="Open settings"
            aria-expanded="false"
            class={"absolute left-4 top-0"}
          >
            <MatSettingsFilled style={{ fontSize: "32px" }} />
          </button>
        )}{" "}
        Song {name}
      </span>
      <div class="m-2 flex h-full flex-col items-center gap-1 rounded-xl bg-gray-900 p-0">
        <Slot></Slot>
      </div>
    </div>
  );
});

// const NextSongSlave = component$((props: { songQueue: any[]; name: string }) => {
// return (
//
//
// )
// }

const NextSongSlave = component$((props: { songQueue: any }) => {
  const { songQueue } = props;
  const name = "Next";
  return (
    <Helper name={name}>
      {songQueue.map(
        (item: { song: SongReduced; cover: string }, index: number) => {
          const { song, cover } = item;
          // console.log(a);
          return (
            <div
              key={item.song.id + index}
              class="m-1 flex w-full flex-row justify-between rounded-xl bg-gray-800 py-3 text-white"
            >
              <div class="ml-4 mr-8 flex w-max items-center">
                {cover && (
                  <img src={cover} class="size-12 rounded-full ring-4" />
                )}

                <div class="ml-8">
                  <span class="block text-lg">{song.data.title}</span>
                  <span class="block">{song.data.album}</span>
                </div>
              </div>

              <div class="mr-4 flex h-12 items-center justify-between gap-8">
                <div class="flex gap-4">
                  <button
                    aria-label="Remove song from queue"
                    onClick$={() => {
                      console.log("fdsfdsafdas");
                      document.dispatchEvent(
                        new CustomEvent("songQueue", {
                          detail: {
                            type: "removeFromQueue",
                            queueName: name,
                            id: song.id,
                          } as SongEventRemoveFromQueue,
                        }),
                      );
                    }}
                  >
                    <MatCloseFilled style={{ fontSize: "32px" }} />
                    {/* <Icon name={"mdi:close"} size={32} /> */}
                  </button>
                </div>
              </div>
            </div>
          );
        },
      )}
    </Helper>
  );
});
const QueueSlave = component$((props: { songQueue: any }) => {
  const { songQueue } = props;
  const name = "queue";
  return (
    <Helper name={name}>
      {songQueue.map(
        (item: { song: SongReduced; cover: string }, index: number) => {
          const { song, cover } = item;
          // console.log(a);
          return (
            <div
              key={item.song.id + index}
              class="m-1 flex w-full flex-row justify-between rounded-xl bg-gray-800 py-3 text-white"
            >
              <div class="ml-4 mr-8 flex w-max items-center">
                <button aria-label="Move in queue">
                  <MatDragHandleFilled style={{ fontSize: "32px" }} />
                  {/* <Icon name={"mdi:drag"} class={"mr-4 rotate-90"} size={32} /> */}
                </button>
                {cover && (
                  <img src={cover} class="size-12 rounded-full ring-4" />
                )}

                <div class="ml-8">
                  <span class="block text-lg">{song.data.title}</span>
                  <span class="block">{song.data.album}</span>
                </div>
              </div>

              <div class="mr-4 flex h-12 items-center justify-between gap-8">
                <div class="flex gap-4">
                  <button aria-label="Start playing the song">
                    <MatPlayArrowFilled style={{ fontSize: "32px" }} />
                    {/* <Icon name={"mdi:play"} size={32} /> */}
                  </button>
                  <button
                    aria-label="Remove song from queue"
                    onClick$={() => {
                      console.log("fdsfdsafdas");
                      document.dispatchEvent(
                        new CustomEvent("songQueue", {
                          detail: {
                            type: "removeFromQueue",
                            queueName: name,
                            id: song.id,
                          } as SongEventRemoveFromQueue,
                        }),
                      );
                    }}
                  >
                    <MatCloseFilled style={{ fontSize: "32px" }} />
                    {/* <Icon name={"mdi:close"} size={32} /> */}
                  </button>
                </div>
              </div>
            </div>
          );
        },
      )}
    </Helper>
  );
});
export const NextSongs = component$((props: { data: AlbumReduced[] }) => {
  const songQueue = useStore([] as { song: SongReduced; cover?: string }[]);
  const allAlbums = useSignal<AlbumReduced[]>(props.data);
  const pointer = useSignal(0);

  const getNext$ = $(
    (pointer: number, array: { song: SongReduced; cover?: string }[]) => {
      let shipped = 0;
      let added = 0;
      if (allAlbums.value) {
        for (let album of allAlbums.value) {
          for (let i = 0; i < album.songs.length; i++) {
            if (shipped < pointer) {
              shipped++;
              continue;
            }
            if (array.length >= 5) {
              return added;
            }
            array.push({ song: album.songs[i], cover: album.cover });
            added++;
          }
        }
      }
      return added;
    },
  );

  useTask$(() => {
    getNext$(pointer.value, songQueue);
    pointer.value += 5;
    if (!isServer){}
  });
  // const getFive$ = $(() => {
  //   getNext$(pointer.value, songQueue);
  //   pointer.value += 5;
  //   console.log(songQueue);
  // });

  useVisibleTask$(
    () => {
      document.dispatchEvent(
        new CustomEvent("songEvent", {
          detail: {
            type: "songEventNextReady",
          } as SongNextReady,
        }),
      );
    },
    { strategy: "document-ready" },
  );

  useOnDocument(
    "songNext",
    $(async (e: CustomEvent<SongNextRequest>) => {
      const content = e.detail;
      e.stopPropagation();
      e.stopImmediatePropagation();
      switch (content.type) {
        case "retriveNextSong":
          const tosend = songQueue.shift();
          if (songQueue.length < 5) {
            const added = await getNext$(pointer.value, songQueue);
            if (songQueue.length < 5) {
              getNext$(0, songQueue);
              pointer.value = 5;
            }
            pointer.value += added;
          }

          document.dispatchEvent(
            new CustomEvent("songEvent", {
              detail: {
                type: "retriveFromQueueResponse",
                queueName: "Next",
                payload: tosend,
              } as SongEventRetriveFromQueueResponse,
            }),
          );

          break;
        // case "addToQueue":
        //   songQueue.push(content.payload);
        //   break;
      }
    }),
  );
  return (
    <div class="w-full">
      <NextSongSlave songQueue={songQueue} />
    </div>
  );
});
export const Queue = component$((props: { name: string }) => {
  const songQueue = useStore([] as { song: SongReduced; cover?: string }[]);

  const { name } = props;

  useOnDocument(
    "songQueue",
    $((e: CustomEvent<QueueEvent>) => {
      const content = e.detail;
      console.log("Why", content.queueName, content.type, e.target);
      if (content.queueName == name) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        switch (content.type) {
          case "retriveFromQueue":
            const tosend = songQueue.shift();

            document.dispatchEvent(
              new CustomEvent("songEvent", {
                detail: {
                  type: "retriveFromQueueResponse",
                  queueName: "queue",
                  payload: tosend,
                } as SongEventRetriveFromQueueResponse,
              }),
            );

            break;
          case "addToQueue":
            songQueue.push(content.payload);
            break;

          case "removeFromQueue":
            console.log(songQueue);
            const index = songQueue.findIndex(
              (obj) => obj.song.id === content.id,
            );
            if (index !== -1) {
              songQueue.splice(index, 1);
            }
            break;
        }
      }
    }),
  );
  return (
    <div class="w-full">
      <QueueSlave songQueue={songQueue} />
    </div>
  );
});
