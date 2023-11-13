import React from "react";
import GameCard from "../components/GameCard";
import TopNav from "../components/TopNav/TopNav";
import CardLine from "../components/CardLine";

const ProfilePage = () => {
  return (
    <div>
      <TopNav />
      <CardLine title="Example">
        <GameCard id={427520}></GameCard>
        <GameCard id={686810}></GameCard>
        <GameCard id={2311920}></GameCard>
        <GameCard id={1868140}></GameCard>
        <GameCard id={107410}></GameCard>
        <GameCard id={266410}></GameCard>
        <GameCard id={319510}></GameCard>
        <GameCard id={346110}></GameCard>
      </CardLine>
    </div>
  );
};

export default ProfilePage;
