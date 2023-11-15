import { Row, Col, Card, Form, Container } from "react-bootstrap";

function ListSearch({ setSearch, setGenre }) {
  return (
    <Container>
      <Row style={{ marginTop: "60px" }} className="justify-content-left">
        <Col md={6}>
          <Card className="text-left ">
            <Card.Body>
              <Card.Title className="tagline welcome-title">Search</Card.Title>
              <Form className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter game name"
                  onChange={(e) => setSearch(e.target.value)}
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
                  onChange={(e) => setGenre(e.target.value)}>
                  <option value="">Any</option>
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
    </Container>
  );
}

export default ListSearch;
