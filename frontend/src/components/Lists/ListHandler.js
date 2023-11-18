import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ListDisplay from "./ListDisplay";
import { connectAPI } from "../Forms/connectAPI";
import ListSearch from "./ListSearch";
import ListMenu from "./ListMenu";
import AppContext from "../../context/AppContext";
import { Container, Alert, Spinner } from "react-bootstrap";
import { BsInfoCircleFill } from "react-icons/bs";

function ListHandler() {
  const [games, setGames] = useState([{}]);
  const [finalGames, setFinalGames] = useState([{}]);
  const [listInfo, setListInfo] = useState({
    Name: "",
    Owner: "Non",
    Private: true,
  });

  //  get context
  const { user } = useContext(AppContext);
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
      {listId && user.IsLoggedIn && (
        <>
          <ListSearch setSearch={setSearch} setGenre={setGenre} />
          {isLoading ? (
            <Spinner animation="border" size="lg" variant="accent" />
          ) : (
            <ListDisplay games={finalGames} listInfo={listInfo} />
          )}
        </>
      )}
      {!listId && (
        <Container className="my-5">
          {!user.IsLoggedIn && (
            <Alert variant="info" className="mx-auto">
              <BsInfoCircleFill /> You must login to view your lists. Please
              login <Link to="/login">here.</Link>
            </Alert>
          )}
          {user.IsLoggedIn && <ListMenu />}
        </Container>
      )}
    </>
  );
}

export default ListHandler;
