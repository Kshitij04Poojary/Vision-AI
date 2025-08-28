import { UserContext } from "../context/userContext";
import React, { useContext } from "react";
import Home from "./Home";

const HomePage = () => {
  const { setUser, user, setIsAuthen, setLoading, setError, setIsAgent } =
    useContext(UserContext);
  return (
    <div>
      <Home />
    </div>
  );
};

export default HomePage;
