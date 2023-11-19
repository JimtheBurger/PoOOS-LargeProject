import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Container, Alert } from "react-bootstrap";
import { BsInfoCircleFill } from "react-icons/bs";
import ListMenu from "./ListMenu";
import { Link } from "react-router-dom";

export default function ListMenuHandler() {
  const { user } = useContext(AppContext);
  return (
    <Container className="my-5">
      {!user.IsLoggedIn && (
        <Alert variant="info" className="mx-auto">
          <BsInfoCircleFill /> You must login to view your lists. Please login{" "}
          <Link to="/login">here.</Link>
        </Alert>
      )}
      {user.IsLoggedIn && <ListMenu />}
    </Container>
  );
}
