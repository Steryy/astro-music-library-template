import type { CollectionEntry } from "astro:content";

export type Song = CollectionEntry<"songs">;
export type Album = {
  slug: string;
  duration: number;
  name: string;
  cover?: string;
  songs: Song[];
};
export type SongData = Song["data"];
interface SongReducedKeys {
  artists: string;
  comment: string;
  cover: string;
  lyrics: string;
}

export type SongEventBase = {
  type: string;
};

export type SongEventAddToQueue = {
  type: "addToQueue";
  queueName: string;
  payload: {
    song: SongReduced;
    cover?: string;
  };
};
export type SongEventAddSong = {
  type: "addSong";

  payload: {
    song: SongReduced;
    cover?: string;
  };
};
export type SongEventPrevRequest = {
  type: "prevSongRequest";
};
export type SongNextReady = {
  type: "songEventNextReady";
};
export type SongEventNextRequest = {
  type: "NextSongRequest";
};
export type SongEventRetriveFromQueueResponse = {
  type: "retriveFromQueueResponse";

  queueName: string;
  payload: {
    song: SongReduced;
    cover?: string;
  };
};

export type SongEventRetriveFromQueue = {
  type: "retriveFromQueue";

  queueName: string;
  // Define payload if needed
};
export type SongEventRemoveFromQueue = {
  type: "removeFromQueue";

  queueName: string;
  id: string;
  // Define payload if needed
};
export type SongNext = {
  payload: {
    song: SongReduced;
    cover?: string;
  };
};

export type SongNextRequest = {
  type: "retriveNextSong";
};
export type SongEvent =
  | SongEventAddSong
  | SongEventRetriveFromQueueResponse
  | SongEventPrevRequest
  | SongNextReady
  | SongEventNextRequest;
export type QueueEvent =
  | SongEventAddToQueue
  | SongEventRemoveFromQueue
  | SongEventRetriveFromQueue;
// export type SongReducedKeys = 'artists' | 'comment' | 'album' | 'cover' | 'lyrics';

export const KeyofSongReduced: SongReducedKeys = {
  artists: "true",
  comment: "true",
  cover: "true",
  lyrics: "true",
};
export type SongDataReduced = Omit<SongData, keyof SongReducedKeys>;

// Step 3: Create the SongReduced type based on the modified data type
export type SongReduced = {
  id: string;
  data: SongDataReduced;
};
export type AlbumReduced = Omit<Album, "songs"> & {
  songs: SongReduced[];
};
