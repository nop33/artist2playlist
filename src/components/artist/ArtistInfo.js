import React, { useEffect, useState } from "react";
import {
  FingerPrintIcon,
  UsersIcon,
  MusicNoteIcon,
} from "@heroicons/react/solid";

import spotify from "../../apis/spotify";
import { arrayChunks } from "../../utils";
import Card from "../common/Card";
import CardInfoIconedText from "../common/CardInfoIconedText";
import CreateUserPlaylistButton from "../user/CreateUserPlaylistButton";
import LoadingText from "../common/LoadingText";

const ArtistInfo = ({ artistInfo }) => {
  const [artistTracks, isLoadingArtistTracks] = useArtistTracks(artistInfo);

  const cardButtons = artistTracks.length ? (
    <CreateUserPlaylistButton artist={artistInfo} tracks={artistTracks} />
  ) : null;

  return (
    <Card
      imageUrl={artistInfo.images[0].url}
      title={artistInfo.name}
      buttons={cardButtons}
    >
      {artistInfo.genres.length > 0 && (
        <CardInfoIconedText IconComponent={FingerPrintIcon} title="Genres">
          {artistInfo.genres
            .map((genre) => <span key={genre}>{genre}</span>)
            .reduce((prev, curr) => [prev, ", ", curr])}
        </CardInfoIconedText>
      )}
      <CardInfoIconedText IconComponent={UsersIcon}>
        {artistInfo.followers.total.toLocaleString()} followers
      </CardInfoIconedText>
      <CardInfoIconedText IconComponent={MusicNoteIcon}>
        {isLoadingArtistTracks ? (
          <LoadingText text="Loading tracks" />
        ) : (
          `${artistTracks.length.toLocaleString()} tracks`
        )}
      </CardInfoIconedText>
    </Card>
  );
};

const useArtistTracks = (artistInfo) => {
  const [isLoadingArtistTracks, setIsLoadingArtistTracks] = useState(false);
  const [artistTracks, setArtistTracks] = useState([]);

  useEffect(() => {
    setArtistTracks([]);

    const fetchArtistTracks = async () => {
      setIsLoadingArtistTracks(true);
      const artistAlbums = [];
      const params = { include_groups: "album,single", limit: 20 };
      let artistAlbumsResults = await spotify.get(
        `/artists/${artistInfo.id}/albums`,
        { params }
      );
      while (artistAlbums.length < artistAlbumsResults.data.total) {
        let artistAlbumsChunk = artistAlbumsResults.data.items;
        artistAlbums.push(...artistAlbumsChunk);
        params.offset = artistAlbums.length;
        artistAlbumsResults = await spotify.get(
          `/artists/${artistInfo.id}/albums`,
          {
            params,
          }
        );
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

      const tracks = [];
      i = 0;
      while (i < albumsResults.length) {
        let albumTracks = albumsResults[i].tracks.items;
        while (albumTracks.length < albumsResults[i].tracks.total) {
          let albumTracksChunk = await spotify.get(
            `/albums/${albumsResults[i].id}/tracks`,
            {
              params: { offset: albumTracks.length },
            }
          );
          albumTracks.push(...albumTracksChunk.data.items);
        }
        tracks.push(...albumTracks);
        i++;
      }

      setArtistTracks(tracks);
      setIsLoadingArtistTracks(false);
    };

    if (artistInfo.id) {
      fetchArtistTracks();
    }
  }, [artistInfo]);

  return [artistTracks, isLoadingArtistTracks];
};

export default ArtistInfo;
