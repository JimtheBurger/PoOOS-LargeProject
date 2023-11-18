import { Stack, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ListMenu({ listInfo, setSearchParams }) {
  return (
    <Card
      className="shadow mx-auto my-5"
      style={{ minWidth: "300px", width: "50%" }}>
      <Card.Header>Your Lists</Card.Header>
      <Card.Body>
        {listInfo.length > 0 ? (
          <Stack gap={1}>
            {listInfo.map(({ ListId, Name }) => {
              return <a href={"/list/" + ListId.toString()}>{Name}</a>;
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
