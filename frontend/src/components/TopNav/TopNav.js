import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { BsJoystick } from "react-icons/bs";
import AppContext from "../../context/AppContext";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { connectAPI } from "../Forms/connectAPI";

const TopNav = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    let error = await connectAPI({ empty: "empty" }, "logout");
    setUser({ Username: "", ListInfo: "", IsLoggedIn: false });
    navigate("/");
  };

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
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/browse">
              Browse
            </Nav.Link>
            {!user.IsLoggedIn && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!user.IsLoggedIn && (
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            )}
            {user.IsLoggedIn && (
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            )}
            {user.IsLoggedIn && (
              <Button variant="outline-accent" onClick={() => handleLogout()}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
