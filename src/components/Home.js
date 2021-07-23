import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  FingerPrintIcon,
  UsersIcon,
  MusicNoteIcon,
} from "@heroicons/react/solid";

import { isLoggedIn, refreshToken } from "../auth";
import { isValidHttpUrl, arrayChunks } from "../utils";
import spotify from "../apis/spotify";
import Button from "../components/Button";
import Card from "../components/Card";
import CardInfoIconedText from "../components/CardInfoIconedText";

const Home = () => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");
  const [artist, setArtist] = useState(null);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [artistTracks, setArtistTracks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loadingCreatingPlaylist, setLoadingCreatingPlaylist] = useState(false);
  const [clickedCreatePlaylist, setClickedCreatePlaylist] = useState(false);
  const [successfullyCreatedPlaylist, setSuccessfullyCreatedPlaylist] =
    useState(false);

  const fetchCurrentUser = async () => {
    const { data } = await spotify.get("/me");
    setCurrentUser(data);
  };

  const fetchArtistInfo = async (artistId) => {
    const { data } = await spotify.get(`/artists/${artistId}`);
    setArtist(data);
    setArtistTracks([]);
    setClickedCreatePlaylist(false);
    setSuccessfullyCreatedPlaylist(false);
  };

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
      `/users/${currentUser.id}/playlists`,
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

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn() && !(await refreshToken())) {
        setRedirectToLogin(true);
      } else {
        fetchCurrentUser();
        if (spotifyArtistUrl) {
          const url =
            spotifyArtistUrl && isValidHttpUrl(spotifyArtistUrl)
              ? new URL(spotifyArtistUrl)
              : {};
          if (isValidSpotifyArtistUrl(url.hostname, url.pathname)) {
            const artistId = url.pathname.replace("/artist/", "");
            fetchArtistInfo(artistId);
          }
        }
      }
    };
    fetchData();
  }, [spotifyArtistUrl]);

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  if (!currentUser) {
    return null;
  }

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
    <div className="min-h-screen bg-gray-800 flex flex-col justify-between">
      <div className="container mx-auto p-10 flex justify-center">
        <div className="w-full lg:w-1/2">
          {currentUser && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <img
                  className="rounded-full h-5 w-5"
                  src={currentUser.images[0].url}
                  alt={currentUser.display_name}
                />
                <span className="text-white">{currentUser.display_name}</span>
              </div>
            </div>
          )}
          <input
            type="text"
            value={spotifyArtistUrl}
            onChange={(e) => setSpotifyArtistUrl(e.target.value)}
            className="w-full rounded outline-none border-white border-2 h-16 text-lg px-4 shadow"
            placeholder="Paste Spotify artist link"
          />
          {artist && (
            <Card
              imageUrl={artist.images[0].url}
              title={artist.name}
              buttons={cardButton}
            >
              <CardInfoIconedText
                IconComponent={FingerPrintIcon}
                title="Genres"
              >
                {artist.genres
                  .map((genre) => <span key={genre}>{genre}</span>)
                  .reduce((prev, curr) => [prev, ", ", curr])}
              </CardInfoIconedText>
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
          )}
        </div>
      </div>
      <div className="container mx-auto p-10 flex justify-center text-white">
        <div>
          Created with ❤️ and 🤩 by{" "}
          <a
            href="https://www.iliascreates.com/music"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-400"
          >
            Fetamin
          </a>
        </div>
      </div>
    </div>
  );
};

function isValidSpotifyArtistUrl(hostname, pathname) {
  return hostname === "open.spotify.com" && pathname.includes("/artist/");
}

export default Home;
