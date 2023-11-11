import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Welcome() {
  const cardStyle = {
    width: "calc(100% - 20px)", // 25% width with 10px horizontal margin on each side
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

      <Row style={{ marginTop: "50px" }} className="text-center">
        <Col>
          <h2>Trending</h2>
        </Col>
      </Row>
      <Row>
        {[1, 2, 3, 4].map((cardNumber) => (
          <Col key={cardNumber} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src="holder.js/285px380" />
              <Card.Body>
                <Card.Title>Card Title {cardNumber}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
              <Card.Footer>Game Title</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="text-center">
        <Col>
          <h2>Top Rated</h2>
        </Col>
      </Row>
      <Row>
        {[5, 6, 7, 8].map((cardNumber) => (
          <Col key={cardNumber} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src="holder.js/285px380" />
              <Card.Body>
                <Card.Title>Card Title {cardNumber}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
              <Card.Footer>Game Title</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="text-center">
        <Col>
          <h2>Best Selling</h2>
        </Col>
      </Row>
      <Row>
        {[9, 10, 11, 12].map((cardNumber) => (
          <Col key={cardNumber} md={3}>
            <Card style={cardStyle}>
              <Card.Img variant="top" src="holder.js/285px380" />
              <Card.Body>
                <Card.Title>Card Title {cardNumber}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
              <Card.Footer>Game Title</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default Welcome;
