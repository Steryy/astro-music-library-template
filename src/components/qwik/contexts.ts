import { createContextId, type Signal } from "@builder.io/qwik";
import type { AlbumReduced } from "../../js/types";

 
export const AllAlbumsReduced = createContextId<Signal<AlbumReduced[]>>(
  'main.data.all.albums.reduced'
);
