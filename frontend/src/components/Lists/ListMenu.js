import { Stack, Card, Spinner, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { connectAPI } from "../Forms/connectAPI";
import DeleteListButton from "../Forms/ListForms/DeleteListButton";

export default function ListMenu() {
  const [listInfo, setListInfo] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("this ran");
    async function getLists() {
      const reply = await connectAPI({ Empty: "empty" }, "getLists");
      console.log(reply);
      if (reply.Error !== "") {
        setError(reply.Error);
      } else {
        setListInfo(reply.listInfo);
      }
    }
    getLists();
    setIsLoading(false);
  }, [error, success]);

  return (
    <Card
      className="shadow mx-auto my-5"
      style={{ minWidth: "300px", width: "50%" }}>
      <Card.Header>Your Lists</Card.Header>
      <Card.Body>
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
        {isLoading && <Spinner animation="border" size="lg" variant="accent" />}
        {!isLoading && listInfo.length > 0 ? (
          <Stack gap={1}>
            {listInfo.map(({ ListId, Name }, index) => {
              return (
                <Container
                  key={"Container-" + index}
                  className="d-flex justify-content-between">
                  <a key={"List-" + index} href={"/list/" + ListId.toString()}>
                    {Name}
                  </a>
                  <DeleteListButton
                    key={"DelButton-" + index}
                    listId={ListId}
                    ListName={Name}
                    setError={setError}
                    setSuccess={setSuccess}
                  />
                </Container>
              );
            })}
          </Stack>
        ) : (
          <div className="p-2">
            You don't have any lists. You can go to the{" "}
            <Link to="/browse">browse page</Link> to start creating lists.
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
