import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardLine from "../Cards/CardLine";
import GameCard from "../Cards/GameCard";

function Welcome() {
  const [games, setGames] = useState([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Stores four Adventure Games
  const adventureGames = games.filter((game) =>
    game.Genres.includes("Adventure")
  );
  const firstFourAdventureGames = adventureGames.slice(0, 6);

  //Stores four Strategy Games
  const strategyGames = games.filter((game) =>
    game.Genres.includes("Strategy")
  );
  const firstFourStrategyGames = strategyGames.slice(6, 12);

  //Stores four Simulation Games
  const simulationGames = games.filter((game) =>
    game.Genres.includes("Simulation")
  );
  const firstFourSimulationGames = simulationGames.slice(12, 18);

  const cardStyle = {
    width: "calc(100% - 20px)", // 100% width with 20px horizontal margin on each side
    margin: "0 10px 50px 10px", // 10px horizontal margin, 50px vertical margin
  };

  return (
    <Container>
      <Row style={{ marginTop: "60px" }} className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="tagline welcome-title">
                All Your Favorite Games, In One Convenient Place
              </Card.Title>
              <Card.Text className="detail-text">
                Create and share game lists with friends, leave reviews on
                titles you own, and keep track of what you’ve played - and what
                you haven’t - all on MySteamList!
              </Card.Text>
              <div className="button-container">
                <Button
                  style={{ marginRight: "10px" }}
                  href="register"
                  variant="primary"
                  className="mr-2"
                >
                  JOIN NOW
                </Button>
                <Button href="login" variant="success">
                  LOGIN
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CardLine title="Strategy">
        {firstFourStrategyGames.map((game) => (
          <GameCard game={game} />
        ))}
      </CardLine>

      <CardLine title="Adventure">
        {firstFourAdventureGames.map((game) => (
          <GameCard game={game} />
        ))}
      </CardLine>

      <CardLine title="Simulation">
        {firstFourSimulationGames.map((game) => (
          <GameCard game={game} />
        ))}
      </CardLine>
    </Container>
  );
}
export default Welcome;
