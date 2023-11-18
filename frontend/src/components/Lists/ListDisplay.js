import { Col, Row, Container } from "react-bootstrap";
import GameCard from "../Cards/GameCard";
import EditButton from "../Forms/ListForms/EditButton";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

//Shows a list of games, takes a list of game objects and list object
function ListDisplay({ games, listInfo }) {
  const { user } = useContext(AppContext);

  console.log(user);

  return (
    <Container>
      <Row className="text-center my-5">
        <Col>
          <h2>
            {listInfo.Name}{" "}
            {user.User.Username === listInfo.Owner && (
              <EditButton listInfo={listInfo} />
            )}
          </h2>
        </Col>
      </Row>
      <Row className="g-4 align-items-stretch">
        {games[0] &&
          games.map((game, index) => (
            <Col lg={4} md={6} xs={6}>
              <GameCard
                key={index}
                game={game}
                title={listInfo.Name}
                owner={listInfo.Owner}
                listId={listInfo.ListId}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default ListDisplay;
