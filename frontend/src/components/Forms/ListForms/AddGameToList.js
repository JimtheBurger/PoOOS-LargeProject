import React, { useState } from "react";

import AsyncSelect from "react-select/async";
import { Container, Form, Button, Spinner, Alert, Row } from "react-bootstrap";
import makeAnimated from "react-select/animated";
import { connectAPI } from "../connectAPI";
import { useForm } from "react-hook-form";

function AddGameToList({ appid, keyVal, handleSetKey }) {
  const [selected, setSelected] = useState([]);
  const { handleSubmit } = useForm();
  const animatedComponents = makeAnimated();

  //Loads list values for select menu
  async function attempGetList() {
    const reply = await connectAPI({ AppID: appid }, "gameInList");
    if (reply.Error !== "") {
      setError(reply.Error);
    } else {
      console.log(reply.Options);
      return reply.Options;
    }
  }

  //Can't pass async function to react-select, this is a handler (super BS)
  const getList = () => {
    return attempGetList();
  };

  //every time an option is selected, this is called and updates the "selected" state var
  const handleChange = (options) => {
    setSelected(options);
  };

  //this lets us control user feedback (normal, loading, error)
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //Handles form submission (selected items)
  const onSubmit = async (formData) => {
    console.log("Selected: ", selected);
    const reply = await connectAPI(
      { Selected: selected, AppID: appid },
      "addGameToLists"
    );
    setSuccess("");
    setError("");
    setIsLoading(true); // Show spinner and disable button

    if (reply.Error !== "") {
      setError(reply.Error);
    } else {
      setSuccess("Game added successfully!");
      handleSetKey(keyVal + 1);
    }
    setIsLoading(false); // Stop showing spinner and reenable button
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <p>
          Select the lists to add this game to. Disabled options already contain
          this game.
        </p>
        <AsyncSelect
          key={keyVal}
          closeMenuOnSelect={false}
          components={animatedComponents}
          onChange={handleChange}
          isMulti
          defaultOptions
          cacheOptions={false}
          loadOptions={getList}
          isOptionDisabled={(option) => option.disabled}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "#0DF3B3",
              primary50: "#56D0AE",
              primary75: "#110939",
              primary: "#130533",
            },
          })}
        />
        <Row className="mx-auto my-3">
          <Button
            type="submit"
            size="lg"
            style={{ width: "50%" }}
            className="mx-auto text-light rounded-pill"
            variant="accent"
            disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="lg" variant="primary" />
            ) : (
              "Submit"
            )}
          </Button>
        </Row>
      </Form>
      {error !== "" && (
        <Alert
          variant="danger"
          dismissible
          style={{ zIndex: 0 }}
          onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success !== "" && (
        <Alert
          variant="success"
          dismissible
          style={{ zIndex: 0 }}
          onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
    </Container>
  );
}

export default AddGameToList;
