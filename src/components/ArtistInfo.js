import React, { useState } from "react";

import spotify from "../apis/spotify";
import { arrayChunks } from "../utils";
import Button from "../components/Button";
import Card from "../components/Card";
import CardInfoIconedText from "../components/CardInfoIconedText";
import {
  FingerPrintIcon,
  UsersIcon,
  MusicNoteIcon,
} from "@heroicons/react/solid";

const ArtistInfo = ({
  artist,
  artistTracks,
  setArtistTracks,
  clickedCreatePlaylist,
  successfullyCreatedPlaylist,
  setSuccessfullyCreatedPlaylist,
  setClickedCreatePlaylist,
  currentUserId,
}) => {
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [loadingCreatingPlaylist, setLoadingCreatingPlaylist] = useState(false);

  const fetchArtistTracks = async () => {
    setLoadingTracks(true);
    const artistAlbums = [];
    const params = { include_groups: "album,single", limit: 20 };
    let artistAlbumsResults = await spotify.get(
      `/artists/${artist.id}/albums`,
      { params }
    );
    while (artistAlbums.length < artistAlbumsResults.data.total) {
      let artistAlbumsChunk = artistAlbumsResults.data.items;
      artistAlbums.push(...artistAlbumsChunk);
      params.offset = artistAlbums.length;
      artistAlbumsResults = await spotify.get(`/artists/${artist.id}/albums`, {
        params,
      });
    }

    const artistAlbumsIds = artistAlbums.map((album) => album.id);
    const artistAlbumsIdsChunks = [...arrayChunks(artistAlbumsIds, 20)];

    const albumsResults = [];
    let i = 0;
    while (i < artistAlbumsIdsChunks.length) {
      let albumsResultsChunk = await spotify.get(`/albums`, {
        params: { ids: artistAlbumsIdsChunks[i].join(",") },
      });
      albumsResults.push(...albumsResultsChunk.data.albums);
      i++;
    }

    const artistTracks = [];

    let j = 0;
    while (j < albumsResults.length) {
      let albumTracks = albumsResults[j].tracks.items;
      while (albumTracks.length < albumsResults[j].tracks.total) {
        let albumTracksChunk = await spotify.get(
          `/albums/${albumsResults[j].id}/tracks`,
          {
            params: { offset: albumTracks.length },
          }
        );
        albumTracks.push(...albumTracksChunk.data.items);
      }
      artistTracks.push(...albumTracks);
      j++;
    }

    setArtistTracks(artistTracks);
    setLoadingTracks(false);
  };

  const createPrivatePlaylist = async () => {
    setLoadingCreatingPlaylist(true);
    const newPrivatePlaylist = await spotify.post(
      `/users/${currentUserId}/playlists`,
      {
        name: `to curate artist: ${artist.name}`,
        public: false,
      }
    );

    const artistTracksChunks = [...arrayChunks(artistTracks, 100)];

    const snapshotIds = [];
    for (let i = 0; i < artistTracksChunks.length; i++) {
      const tracks = artistTracksChunks[i];
      const response = await spotify.post(
        `/playlists/${newPrivatePlaylist.data.id}/tracks`,
        {
          uris: tracks.map((track) => track.uri),
        }
      );
      snapshotIds.push(response.data.snapshot_id);
    }
    if (snapshotIds.length === artistTracksChunks.length) {
      setLoadingCreatingPlaylist(false);
      setSuccessfullyCreatedPlaylist(true);
    }
  };

  const onFetchDiscographyClicked = () => {
    fetchArtistTracks();
  };

  const createArtistPlaylist = () => {
    setClickedCreatePlaylist(true);
    createPrivatePlaylist();
  };

  const cardButton = artistTracks.length ? (
    <Button onClick={createArtistPlaylist}>
      {!clickedCreatePlaylist &&
        !loadingCreatingPlaylist &&
        `Create private playlist with artist's tracks`}
      {clickedCreatePlaylist &&
        loadingCreatingPlaylist &&
        `Creating playlist...`}
      {clickedCreatePlaylist &&
        successfullyCreatedPlaylist &&
        `Playlist created! Have fun!`}
      {clickedCreatePlaylist &&
        !loadingCreatingPlaylist &&
        !successfullyCreatedPlaylist &&
        `There was an error while creating the playlist...`}
    </Button>
  ) : null;

  return (
    <Card
      imageUrl={artist.images[0].url}
      title={artist.name}
      buttons={cardButton}
    >
      {artist.genres.length > 0 && (
        <CardInfoIconedText IconComponent={FingerPrintIcon} title="Genres">
          {artist.genres
            .map((genre) => <span key={genre}>{genre}</span>)
            .reduce((prev, curr) => [prev, ", ", curr])}
        </CardInfoIconedText>
      )}
      <CardInfoIconedText IconComponent={UsersIcon}>
        <div>{artist.followers.total.toLocaleString()} followers</div>
      </CardInfoIconedText>
      <CardInfoIconedText IconComponent={MusicNoteIcon}>
        <div>
          {loadingTracks ? (
            "Loading..."
          ) : artistTracks.length === 0 ? (
            <Button onClick={onFetchDiscographyClicked}>
              Fetch discography
            </Button>
          ) : (
            `${artistTracks.length.toLocaleString()} tracks`
          )}
        </div>
      </CardInfoIconedText>
    </Card>
  );
};

export default ArtistInfo;
