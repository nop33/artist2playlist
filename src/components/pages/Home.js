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
  const [currentUser, fetchCurrentUser] = useCurrentUser(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!(await isLoggedIn())) {
        setRedirectToLogin(true);
      } else if (!currentUser) {
        fetchCurrentUser();
      }
    };
    fetchData();
  }, [currentUser, fetchCurrentUser]);

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <PageLayout>
      <div className="w-full lg:w-1/2">
        <UserContext.Provider value={currentUser}>
          <TopBar />
          <SearchArtist onArtistInfoFetched={setArtistInfo} />
          {artistInfo && <ArtistInfo artistInfo={artistInfo} />}
        </UserContext.Provider>
      </div>
    </PageLayout>
  );
};

const useCurrentUser = (initialValue) => {
  const [currentUser, setCurrentUser] = useState(initialValue);

  const fetchCurrentUser = async () => {
    const { data } = await spotify.get("/me");
    setCurrentUser({
      id: data.id,
      imageUrl: data.images[0].url,
      name: data.display_name,
    });
  };

  return [currentUser, fetchCurrentUser];
};

export default Home;
