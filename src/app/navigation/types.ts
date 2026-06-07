import type { Track } from '../../shared/types';

export type RootStackParamList = {
  MainTabs: undefined;
  NowPlaying: undefined;
  Equalizer: undefined;
  TrackDetails: { trackId: string };
  AlbumDetails: { albumId: string };
  ArtistDetails: { artistId: string };
  PlaylistDetails: { playlistId: string };
};

export type MainTabsParamList = {
  Library: undefined;
  Playlists: undefined;
  Albums: undefined;
  Artists: undefined;
};
