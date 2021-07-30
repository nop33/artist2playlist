import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn } from "../auth";
import { isValidHttpUrl } from "../utils";
import spotify from "../apis/spotify";
import UserInfo from "../components/UserInfo";
import PageLayout from "../components/layout/PageLayout";
import ArtistInfo from "../components/ArtistInfo";
import SearchArtist from "../components/SearchArtist";

const Home = () => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");
  const [artist, setArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!(await isLoggedIn())) {
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

  return (
    <PageLayout>
      <div className="w-full lg:w-1/2">
        {currentUser && (
          <UserInfo
            imageUrl={currentUser.images[0].url}
            name={currentUser.display_name}
          />
        )}
        <SearchArtist
          spotifyArtistUrl={spotifyArtistUrl}
          setSpotifyArtistUrl={setSpotifyArtistUrl}
        />
        {artist && (
          <ArtistInfo
            artist={artist}
            artistTracks={artistTracks}
            setArtistTracks={setArtistTracks}
            clickedCreatePlaylist={clickedCreatePlaylist}
            successfullyCreatedPlaylist={successfullyCreatedPlaylist}
            setSuccessfullyCreatedPlaylist={setSuccessfullyCreatedPlaylist}
            setClickedCreatePlaylist={setClickedCreatePlaylist}
            currentUserId={currentUser.id}
          />
        )}
      </div>
    </PageLayout>
  );
};

function isValidSpotifyArtistUrl(hostname, pathname) {
  return hostname === "open.spotify.com" && pathname.includes("/artist/");
}

export default Home;
