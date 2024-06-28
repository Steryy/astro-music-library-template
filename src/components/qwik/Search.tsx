// src/components/simple-search.jsx

import { component$, $, useSignal, Slot } from "@builder.io/qwik";
import { MatPlayArrowFilled } from "@qwikest/icons/material";

import {
  getAlbums,
  formatDuration,
  returnReduced,
  slugify,
} from "../../js/utils";
import type {
  Album,
  AlbumReduced,
  Song,
  SongEventAddSong,
  SongEventAddToQueue,
  SongReduced,
} from "../../js/types";
const Search = component$((props: { data: AlbumReduced[] }) => {
  const { data } = props;
  const all = useSignal(data);
  const filtered = useSignal(data);

  const handleInput = $(async (event) => {
    const {
      target: { value },
    } = event;

    const FuseModule = await import("fuse.js");
    const Fuse = FuseModule.default;

    const fuse = new Fuse(all.value, {
      threshold: 0.2,
      includeMatches: true,
      keys: ["name", "songs.data.title"],
    });

    const results = fuse.search(value).map((toFilter) => {
      const { item: album, matches } = toFilter;
      if (
        matches &&
        matches.some((match) => match.key === "songs.data.title")
      ) {
        const filteredReviews = album.songs.filter((review) =>
          matches.some((match) => match.value === review.data.title),
        );
        if (filteredReviews.length > 0)
          return {
            ...album,
            songs: filteredReviews,
          };
      }
      // If matches are found in the songs.data.title, filter those songs
      // const item = res.item;
      // if (res.matches?.some((match) => match.key === "songs.data.title")) {
      //   item.songs = item.songs.filter((song) =>
      //     res.matches?.some(
      //       (match) =>
      //         match.key === "songs.data.title" && match.value === song.data.title,
      //     ),
      //   );
      // }
      return album;
    });
    if (value) {
      filtered.value = results;
    } else {
      filtered.value = all.value;
    }
  });

  return (
    <div class="flex h-full flex-col">
      <input
        type="text"
        class="mx-auto my-20 w-40 pb-1 pt-1 text-black"
        placeholder="Search"
        onInput$={handleInput}
      />

      <ul
        class="flex-1 overflow-x-hidden overflow-y-scroll px-24"
        tabIndex={-1}
      >
        {filtered.value.length > 0
          ? filtered.value.map((album: AlbumReduced, index) => {
              return (
                <div key={album.slug} class="min-h-44 w-full">
                  <div class="relative h-6">
                    <div class="line lline" />
                    <div class="title ttitle">{album.name}</div>
                    <div class="timealbum">
                      {formatDuration(album.duration)}
                    </div>
                    {album.cover && (
                      <a class="block p-1.5" href={"/albums/" + album.slug}>
                        <img
                          src={album.cover}
                          class="absolute top-12 size-32"
                        />
                      </a>
                    )}
                  </div>
                  <div class="cont">
                    {album.songs?.map((song: SongReduced) => {
                      const e = song.data;
                      return (
                        <div class="grid grid-cols-[auto_max-content] p-1.5">
                          <a
                            class={"flex items-center justify-between"}
                            href={"/songs/" + song.id}
                          >
                            <span>{e.title}</span>
                            <span>{formatDuration(e.duration)}</span>
                          </a>

                          <button
                            onClick$={() => {
                              console.log("fdsfdsafdas");
                              document.dispatchEvent(
                                new CustomEvent("songEvent", {
                                  detail: {
                                    type: "addSong",
                                    payload: { song: song, cover: album.cover },
                                  } as SongEventAddSong,
                                }),
                              );
                            }}
                            // onClick$={() => {
                            //   document.dispatchEvent(
                            //     new CustomEvent("songEvent", {
                            //       detail: {
                            //         type: "addToQueue",
                            //         payload: { song: song, cover: album.cover },
                            //       } as SongEventAddToQueue ,
                            //     }),
                            //   );
                            // }}
                          >
                            <MatPlayArrowFilled style={{ fontSize: "32px" }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
              // return (
              //   <li key={index}>
              //     <a href={""}>{"fdsfsda"}</a>
              //   </li>
            })
          : null}
      </ul>
    </div>
  );
});

export default Search;
