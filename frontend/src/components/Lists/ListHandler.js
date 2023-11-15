import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListDisplay from "./ListDisplay";
import { connectAPI } from "../Forms/connectAPI";
import ListSearch from "./ListSearch";

function ListHandler() {
  const [games, setGames] = useState([{}]);
  const [finalGames, setFinalGames] = useState([{}]);
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const listId = searchParams.get("listId");

  //search states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    async function getGames() {
      if (listId) {
        const reply = await connectAPI({ listId: listId }, "getGamesFromList");
        if (reply.Error === "") {
          setGames(reply.Games);
          setTitle(reply.Title);
        } else {
          console.log(reply.Error);
        }
      } else {
        console.log("No list Id");
      }
    }
    getGames();
  }, []);

  useEffect(() => {
    if (games[0].Name) {
      setFinalGames(
        games.filter(
          (game) =>
            game.Name.toLowerCase().includes(search.toLowerCase()) &&
            (genre === "" || game.Genres.includes(genre))
        )
      );
    }
  }, [search, genre, games]);

  return (
    <>
      <ListSearch setSearch={setSearch} setGenre={setGenre} />
      <ListDisplay games={finalGames} title={title} />
    </>
  );
}

export default ListHandler;
