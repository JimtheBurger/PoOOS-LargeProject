import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListDisplay from "../Lists/ListDisplay";
import { connectAPI } from "../Forms/connectAPI";
import ListSearch from "../Lists/ListSearch";

function BrowseHandler() {
  const [games, setGames] = useState([{}]);

  //search states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    const getGames = async () => {
      const reply = await connectAPI(
        { Name: search, Genre: genre },
        "searchGames"
      );
      if (reply.Error === "") {
        setGames(reply.Games);
      } else {
        console.log(reply.Error);
      }
    };
    getGames();
  }, [search, genre]);

  return (
    <>
      <ListSearch setSearch={setSearch} setGenre={setGenre} />
      <ListDisplay
        games={games}
        title={genre === "" ? "All Genres" : genre}
        owner={"Non"}
        listId={0}
      />
    </>
  );
}

export default BrowseHandler;
