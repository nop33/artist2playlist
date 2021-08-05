import React, { useState } from "react";

import spotify from "../../apis/spotify";
import { arrayChunks } from "../../utils";
import Button from "../common/Button";
import Card from "../common/Card";
import CardInfoIconedText from "../common/CardInfoIconedText";
import {
  FingerPrintIcon,
  UsersIcon,
  MusicNoteIcon,
} from "@heroicons/react/solid";
import CreateUserPlaylistButton from "../user/CreateUserPlaylistButton";

const ArtistInfo = ({ artist, artistTracks, setArtistTracks }) => {
  const [loadingTracks, setLoadingTracks] = useState(false);

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

  const onFetchDiscographyClicked = () => {
    fetchArtistTracks();
  };

  const cardButtons = artistTracks.length ? (
    <CreateUserPlaylistButton artist={artist} tracks={artistTracks} />
  ) : null;

  return (
    <Card
      imageUrl={artist.images[0].url}
      title={artist.name}
      buttons={cardButtons}
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
