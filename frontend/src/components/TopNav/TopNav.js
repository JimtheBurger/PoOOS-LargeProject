import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { BsJoystick } from "react-icons/bs";

const TopNav = () => {
  return (
    <Navbar expand="md" className="bg-purple" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <BsJoystick /> MySteamList
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link href="about">about</Nav.Link>
            <Nav.Link href="browse">browse</Nav.Link>
            <Nav.Link href="login">login</Nav.Link>
            <Nav.Link href="register">register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
