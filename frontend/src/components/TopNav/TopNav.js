import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { BsJoystick } from "react-icons/bs";
import AppContext from "../../context/AppContext";
import { useContext } from "react";

const TopNav = () => {
  const { user } = useContext(AppContext);
  console.log("TopNav sees ", user, user.IsLoggedIn);
  return (
    <Navbar expand="md" className="bg-purple" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <BsJoystick /> MySteamList
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/about">
              about
            </Nav.Link>
            <Nav.Link as={Link} to="/browse">
              browse
            </Nav.Link>
            {!user.IsLoggedIn && (
              <Nav.Link as={Link} to="/login">
                login
              </Nav.Link>
            )}
            {!user.IsLoggedIn && (
              <Nav.Link as={Link} to="/register">
                register
              </Nav.Link>
            )}
            {user.IsLoggedIn && (
              <Nav.Link as={Link} to="/profile">
                profile
              </Nav.Link>
            )}
            {user.IsLoggedIn && (
              <Nav.Link as={Link} to="/logout">
                logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
