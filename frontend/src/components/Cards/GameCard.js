import { useEffect, useState, useContext } from "react";
import { Card } from "react-bootstrap";
import { connectAPI } from "../Forms/connectAPI";
import "./GameCard.css";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import AddButton from "../Forms/ListForms/AddButton";
import RemoveButton from "../Forms/ListForms/RemoveButton";

function GameCard(props) {
  const [game, setGame] = useState("");
  const { user } = useContext(AppContext);

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
    <Card className="shadow pointer-cursor h-100">
      <div onClick={() => handleGameClick(game.AppID)} className="image">
        <Card.Img variant="top" src={game.Image} />
        <div className="p-3 image__overlay image__overlay--blur d-none d-md-block">
          {game.Description}
        </div>
      </div>
      <Card.Body onClick={() => handleGameClick(game.AppID)}>
        {game.Name}
      </Card.Body>

      {user.IsLoggedIn && (
        <Card.Footer className="d-flex justify-content-between">
          <AddButton appid={game.AppID} />
          {user.IsLoggedIn && user.User.Username === props.owner && (
            <RemoveButton
              appid={game.AppID}
              name={game.Name}
              list={props.title}
              listId={parseInt(props.listId)}
            />
          )}
        </Card.Footer>
      )}
    </Card>
  );
}

export default GameCard;
