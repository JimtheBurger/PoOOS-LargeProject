import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { connectAPI } from "./Forms/connectAPI";
import { useState, useContext } from "react";
import { BsCheckCircle } from "react-icons/bs";
import AppContext from "../context/AppContext";

//Shows user profile
function Profile() {
  //State vars
  const [isLoading, setIsLoading] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Context
  const { user } = useContext(AppContext);

  // handles resending verification email
  const resendVerification = async () => {
    setIsLoading(true);
    let reply = await connectAPI({ fill: "fill" }, "resend-verify");
    if (reply.Error !== "") {
      setError(reply.Error);
    } else {
      setAlreadySent(true);
      setSuccess("Verification Email Successfully Resent!");
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <Card
        className="shadow mx-auto my-5"
        style={{ minWidth: "300px", width: "50%" }}>
        <CardHeader>{user.User.Username}'s Profile</CardHeader>
        <CardBody>
          <p>Email: {user.User.Email}</p>
          <p>Verified: {user.User.Verified ? "Yes" : "No"} </p>
          {!user.User.Verified && (
            <Button
              onClick={() => resendVerification()}
              size="lg"
              style={{ width: "50%" }}
              className="mx-auto text-light rounded-pill"
              variant="accent"
              disabled={isLoading || alreadySent}>
              {isLoading && (
                <Spinner animation="border" size="lg" variant="purple" />
              )}
              {alreadySent && <BsCheckCircle />}
              {!isLoading && !alreadySent && "Resend Verification"}
            </Button>
          )}
          {error !== "" && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {success !== "" && (
            <Alert variant="success" dismissible onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default Profile;
