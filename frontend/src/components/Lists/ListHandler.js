import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListDisplay from "./ListDisplay";
import { connectAPI } from "../Forms/connectAPI";
import ListSearch from "./ListSearch";
import { Spinner } from "react-bootstrap";

function ListHandler() {
  const [games, setGames] = useState([]);
  const [finalGames, setFinalGames] = useState([{}]);
  const [listInfo, setListInfo] = useState({
    Name: "",
    Owner: "Non",
    Private: true,
  });

  //  get context
  const { listId } = useParams();

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  //search states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    setIsLoading(true);
    async function getGames() {
      if (listId) {
        const reply = await connectAPI({ listId: listId }, "getGamesFromList");
        if (reply.Error === "") {
          setGames(reply.Games);
          setListInfo(reply.ListInfo);
        } else {
          console.log(reply.Error);
        }
      } else {
        console.log("No list Id");
      }
    }
    getGames();
    setIsLoading(false);
  }, [listId]);

  useEffect(() => {
    if (games.length > 0) {
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
      {isLoading ? (
        <Spinner animation="border" size="lg" variant="accent" />
      ) : (
        <ListDisplay games={finalGames} listInfo={listInfo} />
      )}
    </>
  );
}

export default ListHandler;
