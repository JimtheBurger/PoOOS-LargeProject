import { useState } from "react";
import { Card } from "react-bootstrap";
import { connectAPI } from "../Forms/connectAPI";
import "./GameCard.css";

function GameCard(props) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [appid, setAppID] = useState("");

  async function getGameObj(appid) {
    const game = await connectAPI({ AppID: appid }, "searchAppID");
    loadData(game.Game);
  }

  function loadData(gameObj) {
    if (gameObj) {
      setName(gameObj.Name);
      setImageURL(gameObj.Image);
      setDescription(gameObj.Description);
      setGenres(gameObj.Genres);
      setReleaseDate(gameObj.Release.date);
      setAppID(gameObj.AppID);
    }
  }

  //Update items once when initially loaded
  if (props.id && appid === "") {
    getGameObj(props.id);
  } else if (props.game && appid === "") {
    loadData(props.game);
  }

  return (
    <Card className="shadow">
      <div className="image">
        <Card.Img variant="top" src={imageURL} />
        <div className="p-3 image__overlay image__overlay--blur d-none d-md-block">
          {description}
        </div>
      </div>
      <Card.Footer>{name}</Card.Footer>
    </Card>
  );
}

export default GameCard;
