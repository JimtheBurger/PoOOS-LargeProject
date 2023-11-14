import { Card, CardBody, CardHeader, Container, Button } from "react-bootstrap";
import { connectAPI } from "./Forms/connectAPI";

//Shows user profile
function Profile(user) {
  const resendVerification = async () => {
    let reply = await connectAPI({ fill: "fill" }, "resend-verify");
    console.log(reply);
  };

  return (
    <Container>
      <Card
        className="shadow mx-auto my-5"
        style={{ minWidth: "300px", width: "50%" }}>
        <CardHeader>{user.Username}'s Profile</CardHeader>
        <CardBody>
          <p>Email: {user.Email}</p>
          <p>Verified: {user.Verified ? "Yes" : "No"} </p>
          {!user.Verified && (
            <Button onClick={() => resendVerification()}>
              Resend Verification
            </Button>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default Profile;
