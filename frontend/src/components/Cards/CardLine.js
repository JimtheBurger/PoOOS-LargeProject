import { Children } from "react";
import { Container, Row, Col } from "react-bootstrap";

//For use on home page and preview on browse. Not for use when showing result that span more than a single row (this loses data when it gets smaller)
//Shows 8 cards at lg and xl, 8 at medium (4*2 grid), 4 at small (2*2 grid)
//takes 8 children GameCards and a title prop
export default function CardLine({ title, children }) {
  const cards = Children.toArray(children);
  return (
    <Container className="justify">
      <Row style={{ marginTop: "50px" }} className="text-center">
        <Col>
          <h2>{title}</h2>
        </Col>
      </Row>
      <Row className="g-4">
        <Col lg={4} md={6} xs={6}>
          {cards[0]}
        </Col>
        <Col lg={4} md={6} xs={6}>
          {cards[1]}
        </Col>
        <Col lg={4} md={6} xs={6}>
          {cards[2]}
        </Col>
        <Col lg={4} md={6} xs={6}>
          {cards[3]}
        </Col>
        <Col lg={4} md={6} xs={6} className="d-none d-lg-block">
          {cards[4]}
        </Col>
        <Col lg={4} md={6} xs={6} className="d-none d-lg-block">
          {cards[5]}
        </Col>
      </Row>
    </Container>
  );
}
