import {
  component$,
  $,
  useSignal,
  type Signal,
  // type QRL,
  useOnDocument,
  useStore,
} from "@builder.io/qwik";

import { formatDuration } from "../../js/utils";
import type {
  Song,
  SongEvent,
  SongEventAddToQueue,
  SongEventNextRequest,
  SongEventPrevRequest,
  SongEventRetriveFromQueue,
  SongNextRequest,
  SongReduced,
} from "../../js/types";
import {
  MatArrowUpwardFilled,
  MatLoopFilled,
  MatMenuFilled,
  MatPauseFilled,
  MatPlayArrowFilled,
  MatShuffleFilled,
  MatSkipNextFilled,
  MatSkipPreviousFilled,
} from "@qwikest/icons/material";
export const Slave = component$((props: { songSignal: any }) => {
  const { songSignal } = props;
  const song = songSignal?.value?.song;
  const cover = songSignal?.value?.cover;
  // const { song, cover } = songSignal.value;
  const songData = song?.data || undefined;
  const audioRef = useSignal<HTMLAudioElement>();

  const progressRef = useSignal<HTMLInputElement>();
  const isPlaying = useSignal(false);
  const currTIme = useSignal(0);
  const changing = useSignal(false);
  if (songData) {
    const artwork = cover
      ? [
          {
            src: cover,
            sizes: "96x96",
            type: "image/jpeg",
          },
        ]
      : undefined;
  }
  const previous = $(() => {
    document.dispatchEvent(
      new CustomEvent("songEvent", {
        detail: {
          type: "prevSongRequest",
        } as SongEventPrevRequest,
      }),
    );
    isPlaying.value = !audioRef.value?.paused;
  });
  const onEnded = $(() => {
    document.dispatchEvent(
      new CustomEvent("songEvent", {
        detail: {
          type: "NextSongRequest",
        } as SongEventNextRequest,
      }),
    );
    isPlaying.value = !audioRef.value?.paused;
    console.log("end");
  });
  const onLoadedMetadata = $(() => {
    console.log("Can Play");
    if (progressRef.value && audioRef.value) {
      progressRef.value.max = audioRef.value.duration.toString();

      console.log(progressRef.value.max);
    }
  });
  const onTimeChange = $(() => {
    if (audioRef.value) {
      // currTIme.value = audioRef.value.currentTime;

      if (changing.value != true && audioRef.value && progressRef.value) {
        progressRef.value.value = audioRef.value.currentTime.toString();
      }
    }
  });
  return (
    <div class="z-30 flex h-full w-full items-center rounded-xl bg-gray-800">
      <div class="ml-4 block w-20">
        {cover && (
          <div
            class={`h-max w-max ${isPlaying.value && "animate-[spin_3s_linear_infinite]"} `}
          >
            <img src={cover} class="size-16 rounded-full ring-4" />
          </div>
        )}
      </div>
      <div class="ml-8 mr-4 block w-full lg:-mr-2">
        <Player
          source={songSignal}
          autoplay={true}
          audioRef={audioRef}
          onEnded={onEnded}
          onTimeUpdate={onTimeChange}
          isPlaying={isPlaying}
          onLoadedMetadata={onLoadedMetadata}
        />
        <div class="mr-4 grid w-full grid-cols-[1fr_min-content_min-content] lg:grid-cols-[1fr_min-content_min-content_4fr_min-content_min-content_min-content]">
          <div class="order-1 mr-3 flex h-16 flex-col justify-between truncate">
            {songData?.title && (
              <span class="block truncate text-2xl">{songData?.title}</span>
            )}
            {songData?.album && (
              <span class="block truncate text-lg">{songData?.album}</span>
            )}
          </div>

          <div class="order-2 flex w-max items-center justify-end gap-4 lg:mx-3 lg:gap-0">
            <button aria-label="Previous song" onClick$={previous}>
              <MatSkipPreviousFilled style={{ fontSize: "32px" }} />
              {/* <Slot name="prev" /> */}
            </button>
            <button
              aria-label="Toggle playback"
              aria-expanded={isPlaying.value}
              onClick$={() => {
                // const target = e.target as HTMLButtonElement;

                console.log(audioRef.value);
                if (isPlaying.value == true) {
                  audioRef.value?.pause();
                } else {
                  audioRef.value?.play();
                }
              }}
            >
              <MatPlayArrowFilled
                class="playicon"
                style={{ fontSize: "32px" }}
              />
              <MatPauseFilled class="pauseicon" style={{ fontSize: "32px" }} />
              {/* <Slot name="toggleplay" /> */}
            </button>
            <button aria-label="Next song" onClick$={onEnded}>
              <MatSkipNextFilled style={{ fontSize: "32px" }} />
            </button>
          </div>

          {
            <input
              type="range"
              id="slider"
              min={0}
              value={0}
              ref={progressRef}
              onInput$={() => {
                changing.value = true;
                // e.target.disabled = true;
              }}
              // ref={progressRef}
              onChange$={(e) => {
                const target = e.target as HTMLInputElement;

                changing.value = false;
                if (audioRef.value) {
                  audioRef.value.currentTime = target.valueAsNumber;
                }
              }}
              class="slider z-10 order-4 col-span-3 w-full lg:col-span-1"
            />
          }
          <div class="order-3 flex items-center justify-end gap-4 lg:order-6">
            <button aria-label="Toggle Shuffle" aria-pressed="false">
              <MatShuffleFilled style={{ fontSize: "32px" }} />
              {/* <Slot name="shuffle" /> */}
            </button>

            <button aria-label="Toggle loop" aria-pressed="false">
              <MatLoopFilled style={{ fontSize: "32px" }} />
              {/* <Slot name="loop" /> */}
            </button>
          </div>

          <span class="order-6 col-span-2 mx-1 flex items-center justify-start lg:order-3 lg:col-span-1">
            {formatDuration(currTIme.value)}
          </span>
          <span class="order-7 mx-1 flex items-center justify-end lg:order-5">
            {formatDuration(songData ? songData?.duration : 0)}
          </span>

          <label
            for="menu"
            aria-label="Open menu"
            class="group/nut group absolute -top-8 left-1/2 ml-6 flex size-20 -translate-x-1/2 cursor-pointer items-center justify-end rounded-full outline-white lg:static lg:order-8 lg:h-full lg:w-min lg:rounded-none lg:bg-transparent"
          >
            <input type="checkbox" id="menu" class="sr-only" />

            <div
              slot="menu"
              class="absolute top-6 flex h-full w-full items-center justify-end group-has-[:checked]/nut:rotate-180 group-has-[:focus-visible]/nut:ring-8 lg:static"
            >
              <MatMenuFilled
                class={"hidden lg:block"}
                style={{ fontSize: "32px" }}
              />

              <MatArrowUpwardFilled
                style={{ fontSize: "32px" }}
                class={
                  "z-40 m-auto rounded-full bg-gray-800 hover:animate-bounce lg:hidden"
                }
              />
            </div>
            {/* <Slot name="menu" /> */}
          </label>
        </div>
      </div>
    </div>
  );
});

 const Player = component$(
  (props: {
    source: Signal<{ song: Song }>;
    audioRef: Signal;
    isPlaying: Signal;
    onLoadedMetadata: any;
    onTimeUpdate: any;
    onEnded: any;
    autoplay: boolean;
  }) => {
    const {
      source,
      audioRef,
      onLoadedMetadata,
      isPlaying,
      onTimeUpdate,
      autoplay,
      onEnded,
    } = props;
    return (
      <div>
        <audio
          id="audiof"
          autoplay={autoplay}
          onCanPlay$={onLoadedMetadata}
          onPlay$={() => {
            if (source.value) {
              isPlaying.value = true;
            }
          }}
          onPause$={() => {
            isPlaying.value = false;
          }}
          onEnded$={(e) => {
            onEnded(e);
          }}
          onTimeUpdate$={(e) => {
            const target = e.target as HTMLAudioElement;
            if (target) {
              onTimeUpdate();
            }
          }}
          src={
            source.value && source.value.song && source.value.song.data.filepath
          }
          ref={audioRef}
        />
      </div>
    );
  },
);
