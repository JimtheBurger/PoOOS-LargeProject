import React, { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import AddButtonGP from "../Forms/ListForms/AddButtonGP";
import AppContext from "../../context/AppContext";

function Game() {
  const { AppID } = useParams();
  const [games, setGames] = useState([]);
  const [SelectedGame, setSelectedGame] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);

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
      <Card className="shadow my-3">
        <Card.Body>
          <Row>
            <Col lg={4}>
              <Card.Img src={SelectedGame.Image} />
            </Col>
            <Col>
              <div style={{ marginTop: "10px" }} className="text-align-center">
                <h3>{SelectedGame.Name}</h3>
                <p>{SelectedGame.Description}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {user.IsLoggedIn && <AddButtonGP appid={SelectedGame.AppID} />}
            </Col>
          </Row>

          {/* <Button style={{ marginTop: "10px" }} variant="purple">
              <BsStarFill size={20} style={{ color: "#FFD700" }} />{" "}
               Star-shaped button 
            </Button>*/}
        </Card.Body>
      </Card>

      <Card
        style={{
          marginTop: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, .2)",
        }}>
        <Card.Body>
          <p className="mb-2">
            <strong>Title:</strong> {SelectedGame.Name}{" "}
          </p>
          <p className="mb-2">
            <strong>Genres:</strong>{" "}
            {SelectedGame.Genres && SelectedGame.Genres.join(", ")}{" "}
          </p>
          <p className="mb-2">
            <strong>Developers:</strong>{" "}
            {SelectedGame.Developers && SelectedGame.Developers.join(", ")}{" "}
          </p>
          <p className="mb-2">
            <strong>Publishers:</strong>{" "}
            {SelectedGame.Publishers && SelectedGame.Publishers.join(", ")}{" "}
          </p>
          <p className="mb-2">
            <strong>Publishers:</strong>{" "}
            {SelectedGame.Price ? SelectedGame.Price.final_formatted : "N/A"}{" "}
          </p>
          <p className="mb-0">
            <strong>Release Date:</strong>{" "}
            {SelectedGame.Release ? SelectedGame.Release.date : "N/A"}{" "}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default Game;
