import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';

function Game() {
  const { AppID } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState([]);

  //Gets game data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (process.env.NODE_ENV === 'production') {
          response = await fetch('https://mysteamlist.com/api/games');
        } else {
          response = await fetch('http://localhost:5000/api/games');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data);
        const foundGame = data.find((game) => game.AppID === AppID);
        if (foundGame) {
          setGame(foundGame); // Set the found game
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [AppID]);

  return (
    <Container>
      <Col md={6}>
        <Card className="text-center">
          <Card.Img variant="top" src={game.Image} alt={game.Name} />
          <Card.Body>
            <h5>{game.Name}</h5>
            <p>{game.Description}</p>
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
