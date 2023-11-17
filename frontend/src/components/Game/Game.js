import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";

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
    // Check if games are available and AppID is valid before finding the game
    if (games.length > 0 && AppID) {
      const foundGame = games.find((game) => game.AppID === Number(AppID));
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
      <Card>
        <Card.Body>
          <Row>
            <Col xs={12} md={4}>
              <Card.Img src={SelectedGame.Image} />
            </Col>
            <Col xs={12} md={8} className="d-flex align-items-center">
              <div>
                <h3>{SelectedGame.Name}</h3>
                <p>{SelectedGame.Description}</p>
              </div>
            </Col>
          </Row>
          <Button
            style={{ marginTop: "10px", marginRight: "5px" }}
            variant="purple">
            Add to List <i className="bi bi-caret-down-fill"></i>
          </Button>
          <Button style={{ marginTop: "10px" }} variant="warning">
            <BsStarFill size={20} /> {/* Star-shaped button */}
          </Button>
        </Card.Body>
      </Card>

      <Card style={{ height: "100%" }}>
        <Card.Body>
          <p className="mb-2">Title: {SelectedGame.Name} </p>
          <p className="mb-2">
            Genres: {SelectedGame.Genres && SelectedGame.Genres.join(", ")}{" "}
          </p>
          <p className="mb-2">
            Developers:{" "}
            {SelectedGame.Developers && SelectedGame.Developers.join(", ")}{" "}
          </p>
          <p className="mb2">
            Publishers:{" "}
            {SelectedGame.Publishers && SelectedGame.Publishers.join(", ")}{" "}
          </p>
          <p className="mb-2">
            Price:{" "}
            {SelectedGame.Price ? SelectedGame.Price.final_formatted : "N/A"}{" "}
          </p>
          <p className="mb-0">
            Release Date:{" "}
            {SelectedGame.Release ? SelectedGame.Release.date : "N/A"}{" "}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default Game;
