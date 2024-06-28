//
import { getAlbums, formatDuration, returnReduced, slugify } from "../../js/utils";
import type { AlbumReduced, SongReduced } from "../../js/types";
//
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
// // export async function GET({params, request}) {
// //
// //   return new Response(
// //     JSON.stringify(reduced
// //     )
// //   )
// // }
// // }
// //
// //
export async function GET({params, request}) {

const songs = await getCollection("songs");

const albums = getAlbums(songs, {});
  return new Response(
    JSON.stringify(albums)
  )
}

