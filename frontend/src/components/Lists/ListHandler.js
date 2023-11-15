import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListDisplay from "./ListDisplay";
import { connectAPI } from "../Forms/connectAPI";

function ListHandler() {
  const [games, setGames] = useState([{}]);
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const listId = searchParams.get("listId");

  useEffect(() => {
    async function getGames() {
      if (listId) {
        const reply = await connectAPI({ listId: listId }, "getGamesFromList");
        if (reply.Error === "") {
          setGames(reply.Games);
          setTitle(reply.Title);
          console.log(games);
        } else {
          console.log(reply.Error);
        }
      } else {
        console.log("No list Id");
      }
    }
    getGames();
  }, []);

  return <ListDisplay games={games} title={title} />;
}

export default ListHandler;
