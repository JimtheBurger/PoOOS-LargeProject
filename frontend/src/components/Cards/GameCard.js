import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { connectAPI } from "../Forms/connectAPI";
import "./GameCard.css";
import { useNavigate } from "react-router-dom";

function GameCard(props) {
  const [game, setGame] = useState("");

  async function getGameObj(appid) {
    const game = await connectAPI({ AppID: appid }, "searchAppID");
    setGame(game.Game);
  }

  useEffect(() => {
    //Update items once when initially loaded
    if (props.appid) {
      getGameObj(props.appid);
    } else if (props.game) {
      setGame(props.game);
    }
  }, [props.game]);

  const navigate = useNavigate();

  const handleGameClick = (gameAppID) => {
    navigate(`/game/${gameAppID}`);
  };

  return (
    <Card className="shadow" onClick={() => handleGameClick(game.AppID)}>
      <div className="image">
        <Card.Img variant="top" src={game.Image} />
        <div className="p-3 image__overlay image__overlay--blur d-none d-md-block">
          {game.Description}
        </div>
      </div>
      <Card.Footer>{game.Name}</Card.Footer>
    </Card>
  );
}

export default GameCard;
