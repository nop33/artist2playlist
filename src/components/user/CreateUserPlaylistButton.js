import React, { useState, useEffect, useContext } from "react";

import spotify from "../../apis/spotify";
import { arrayChunks } from "../../utils";
import Button from "../common/Button";
import UserContext from "../../contexts/UserContext";

const CreateUserPlaylistButton = ({ artistName, tracks }) => {
  const [loadingCreatingPlaylist, setLoadingCreatingPlaylist] = useState(false);
  const [newlyCreatedPlaylistUrl, setNewlyCreatedPlaylistUrl] = useState(null);
  const [clickedCreatePlaylist, setClickedCreatePlaylist] = useState(false);
  const [successfullyCreatedPlaylist, setSuccessfullyCreatedPlaylist] =
    useState(false);
  const user = useContext(UserContext);

  const createPrivatePlaylist = async () => {
    setLoadingCreatingPlaylist(true);
    const newPrivatePlaylist = await spotify.post(
      `/users/${user.id}/playlists`,
      {
        name: `to curate artist: ${artistName}`,
        public: false,
      }
    );

    setNewlyCreatedPlaylistUrl(newPrivatePlaylist.data.external_urls.spotify);

    const artistTracksChunks = [...arrayChunks(tracks, 100)];

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

  const createArtistPlaylist = () => {
    setClickedCreatePlaylist(true);
    createPrivatePlaylist();
  };

  useEffect(() => {
    setClickedCreatePlaylist(false);
    setSuccessfullyCreatedPlaylist(false);
  }, [artistName]);

  return !clickedCreatePlaylist && !loadingCreatingPlaylist ? (
    <Button onClick={createArtistPlaylist}>
      Create private playlist with artist's tracks
    </Button>
  ) : clickedCreatePlaylist && loadingCreatingPlaylist ? (
    <Button disabled>Creating playlist...</Button>
  ) : clickedCreatePlaylist && successfullyCreatedPlaylist ? (
    <Button onClick={() => window.open(newlyCreatedPlaylistUrl)}>
      Playlist created! Have fun!
    </Button>
  ) : clickedCreatePlaylist &&
    !loadingCreatingPlaylist &&
    !successfullyCreatedPlaylist ? (
    <Button disabled>There was an error while creating the playlist...</Button>
  ) : (
    ""
  );
};

export default CreateUserPlaylistButton;
