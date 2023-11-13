import { useState } from "react";
import { Card } from "react-bootstrap";
import { connectAPI } from "./Forms/connectAPI";
import "./GameCard.css";

function GameCard(props) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [appid, setAppID] = useState("");

  async function loadData() {
    console.log(props.id);
    var gameObj = await connectAPI({ AppID: props.id }, "searchAppID");
    console.log(gameObj);
    if (gameObj.Game) {
      setName(gameObj.Game.Name);
      setImageURL(gameObj.Game.Image);
      setDescription(gameObj.Game.Description);
      setGenres(gameObj.Game.Genres);
      setReleaseDate(gameObj.Game.Release.date);
      setAppID(gameObj.Game.AppID);
    }
  }

  //Update items once when initially loaded
  if (props.id && appid === "") {
    loadData();
  }

  return (
    <Card>
      <div className="image">
        <Card.Img variant="top" src={imageURL} />
        <div className="p-3 image__overlay image__overlay--blur">
          {description}
        </div>
      </div>
      <Card.Footer>{name}</Card.Footer>
    </Card>
  );
}

export default GameCard;
