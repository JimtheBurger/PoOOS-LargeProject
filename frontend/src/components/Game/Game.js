import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";

function Game() {
  const { AppID } = useParams();
  const [games, setGames] = useState([]);
  const [SelectedGame, setSelectedGame] = useState({});
  const [loading, setLoading] = useState(true);

  //Gets game data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (process.env.NODE_ENV === "production") {
          response = await fetch("https://mysteamlist.com/api/games");
        } else {
          response = await fetch("http://localhost:5000/api/games");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("AppID:", AppID);
    console.log("Games:", games);
    // Check if games are available and AppID is valid before finding the game
    if (games.length > 0 && AppID) {
      const foundGame = games.find((game) => game.AppID === Number(AppID));
      console.log("Found Game:", foundGame);
      if (foundGame) {
        setSelectedGame(foundGame);
      }
    }
  }, [games, AppID]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <Container>
      <Col md={6}>
        <Card className="text-center">
          {SelectedGame.Image && (
            <Card.Img
              variant="top"
              src={SelectedGame.Image}
              alt={SelectedGame.Name}
            />
          )}
          <Card.Body>
            {SelectedGame.Name && <h5>{SelectedGame.Name}</h5>}
            {SelectedGame.Description && <p>{SelectedGame.Description}</p>}
            <Button variant="primary">
              Add to List <i className="bi bi-caret-down-fill"></i>
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}
export default Game;
