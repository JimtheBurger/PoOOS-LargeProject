import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Browse() {
  const [games, setGames] = useState([]);
  const [originalGames, setOriginalGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  //Gets game data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (process.env.NODE_ENV === "production") {
          response = await fetch(
            "https://cop4331-g4-ed21fec8c26b.herokuapp.com/api/games"
          );
        } else {
          response = await fetch("http://localhost:5000/api/games");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data);
        setOriginalGames(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const filteredGames = originalGames.filter((game) =>
      game.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Update the state with the filtered games
    setGames(filteredGames);
  };

  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    // Update the state with the selected genre
    setSelectedGenre(selectedGenre);
  };

  const filteredGamesByGenre = selectedGenre
    ? games.filter((game) => game.Genres.includes(selectedGenre))
    : games;

  //Stores four Adventure Games
  const adventureGames = games.filter((game) =>
    game.Genres.includes("Adventure")
  );
  const firstFourAdventureGames = adventureGames.slice(7, 11);

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
      <Row style={{ marginTop: "60px" }} className="justify-content-left">
        <Col md={6}>
          <Card className="text-left ">
            <Card.Body>
              <Card.Title className="tagline welcome-title">Search</Card.Title>
              <Form onSubmit={handleSearch} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter game name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="text-left pb-3">
            <Card.Body>
              <Form.Group controlId="genreDropdown">
                <Card.Title className="tagline welcome-title">Genre</Card.Title>
                <Form.Control
                  as="select"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                >
                  <option value="">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Casual">Casual</option>
                  <option value="Free to Play">Free to Play</option>
                  <option value="Indie">Indie</option>
                  <option value="Massively Multiplayer">
                    Massively Multiplayer
                  </option>
                  <option value="Racing">Racing</option>
                  <option value="RPG">RPG</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Sports">Sports</option>
                  <option value="Strategy">Strategy</option>
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "50px" }}>
        <Col className="text-center">
          <h2>{selectedGenre}</h2>
        </Col>
      </Row>
      <Row>
        {filteredGamesByGenre.map((game) => (
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
export default Browse;
