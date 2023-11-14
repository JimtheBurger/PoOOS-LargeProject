import React from "react";
import GameCard from "../components/GameCard";
import TopNav from "../components/TopNav/TopNav";
import CardLine from "../components/CardLine";
import { Button } from "react-bootstrap";
import { connectAPI } from "../components/Forms/connectAPI";

async function test() {
  const reply = await connectAPI({ this: "this" }, "testJWT");
  console.log(reply);
}

const ProfilePage = () => {
  return (
    <div>
      <TopNav />
      <Button onClick={() => test()}>test button</Button>
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
