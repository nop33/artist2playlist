import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn } from "../auth";
import spotify from "../apis/spotify";
import TopBar from "../components/TopBar";
import PageLayout from "../components/layout/PageLayout";
import ArtistInfo from "../components/ArtistInfo";
import SearchArtist from "../components/SearchArtist";

const Home = () => {
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

  const onNewArtistDataFetched = async (artistData) => {
    setArtist(artistData);
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
      }
    };
    fetchData();
  }, []);

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
          <TopBar
            userImageUrl={currentUser.images[0].url}
            userName={currentUser.display_name}
          />
        )}
        <SearchArtist onNewArtistDataFetched={onNewArtistDataFetched} />
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

export default Home;
