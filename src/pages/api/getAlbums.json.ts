//
import { getAlbums } from "../../js/utils";
//
import { getCollection } from "astro:content";
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
export async function GET() {

  const songs = await getCollection("songs");

  const albums = getAlbums(songs, {});
  return new Response(
    JSON.stringify(albums)
  )
}

