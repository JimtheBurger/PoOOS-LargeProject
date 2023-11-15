import { Col, Row, Container } from "react-bootstrap";
import GameCard from "../Cards/GameCard";

//Shows a list of games, takes a list of game objects
function ListDisplay({ games, title }) {
  return (
    <Container>
      <Row style={{ marginTop: "50px" }} className="text-center">
        <Col>
          <h2>{title}</h2>
        </Col>
      </Row>
      <Row className="g-4">
        {games.map((game, index) => (
          <Col lg={4} md={6} xs={6}>
            <GameCard key={index} game={game} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ListDisplay;
