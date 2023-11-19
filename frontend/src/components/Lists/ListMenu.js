import { Stack, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { connectAPI } from "../Forms/connectAPI";

export default function ListMenu() {
  const [listInfo, setListInfo] = useState([]);
  const [error, setError] = useState("");
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
  }, []);

  return (
    <Card
      className="shadow mx-auto my-5"
      style={{ minWidth: "300px", width: "50%" }}>
      <Card.Header>Your Lists</Card.Header>
      <Card.Body>
        {isLoading && <Spinner animation="border" size="lg" variant="accent" />}
        {!isLoading && listInfo.length > 0 ? (
          <Stack gap={1}>
            {listInfo.map(({ ListId, Name }, index) => {
              return (
                <a key={index} href={"/list/" + ListId.toString()}>
                  {Name}
                </a>
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
