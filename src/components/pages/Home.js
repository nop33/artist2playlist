import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn } from "../../auth";
import spotify from "../../apis/spotify";
import TopBar from "../layout/TopBar";
import PageLayout from "../layout/PageLayout";
import ArtistInfo from "../artist/ArtistInfo";
import SearchArtist from "../artist/SearchArtist";
import UserContext from "../../contexts/UserContext";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [artist, setArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const fetchCurrentUser = async () => {
    const { data } = await spotify.get("/me");
    setCurrentUser({
      id: data.id,
      imageUrl: data.images[0].url,
      name: data.display_name,
    });
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

  const onNewArtistDataFetched = async (artistData) => {
    setArtist(artistData);
    setArtistTracks([]);
  };

  return (
    <PageLayout>
      <div className="w-full lg:w-1/2">
        <UserContext.Provider value={currentUser}>
          <TopBar />
          <SearchArtist onNewArtistDataFetched={onNewArtistDataFetched} />
          {artist && (
            <ArtistInfo
              artist={artist}
              artistTracks={artistTracks}
              setArtistTracks={setArtistTracks}
            />
          )}
        </UserContext.Provider>
      </div>
    </PageLayout>
  );
};

export default Home;
