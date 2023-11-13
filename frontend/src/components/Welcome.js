import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Welcome() {
  const [games, setGames] = useState([]);

  //Gets game data from database
  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        if (process.env.NODE_ENV === "production") {
          response = await fetch(
            "https://cop4331-g4-ed21fec8c26b.herokuapp.com/api/games"
          );
        } else {
          response = await fetch("http://localhost:5000/api/games");
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
  const firstFourAdventureGames = adventureGames.slice(8, 12);

  //Stores four Strategy Games
  const strategyGames = games.filter((game) =>
    game.Genres.includes("Strategy")
  );
  const firstFourStrategyGames = strategyGames.slice(4, 8);

  //Stores four Simulation Games
  const simulationGames = games.filter((game) =>
    game.Genres.includes("Simulation")
  );
  const firstFourSimulationGames = simulationGames.slice(10, 14);

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
              <Card.Title className="tagline">
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

      <Row style={{ marginTop: "50px" }}>
        <Col className="text-center">
          <h2>Strategy</h2>
        </Col>
      </Row>
      <Row>
        {firstFourStrategyGames.map((game) => (
          <Col key={game._id} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src={game.Image} />

              <Card.Footer>{game.Name}</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col className="text-center">
          <h2>Adventure</h2>
        </Col>
      </Row>
      <Row>
        {firstFourAdventureGames.map((game) => (
          <Col key={game._id} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src={game.Image} />
              <Card.Footer>{game.Name}</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col className="text-center">
          <h2>Simulation</h2>
        </Col>
      </Row>
      <Row>
        {firstFourSimulationGames.map((game) => (
          <Col key={game._id} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src={game.Image} />
              <Card.Footer>{game.Name}</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default Welcome;
