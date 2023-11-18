import { Col, Row, Container } from "react-bootstrap";
import GameCard from "../Cards/GameCard";

//Shows a list of games, takes a list of game objects
function ListDisplay({ games, title, owner, listId }) {
  return (
    <Container>
      <Row className="text-center my-5">
        <Col>
          <h2>{title}</h2>
        </Col>
      </Row>
      <Row className="g-4 align-items-stretch">
        {games[0] &&
          games.map((game, index) => (
            <Col lg={4} md={6} xs={6}>
              <GameCard
                key={index}
                game={game}
                title={title}
                owner={owner}
                listId={listId}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default ListDisplay;
