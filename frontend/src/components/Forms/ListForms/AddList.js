import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FloatingLabel,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { connectAPI } from "../connectAPI";

function AddList({ keyVal, handleSetKey }) {
  //yup validation schema
  const validationSchema = Yup.object().shape({
    listName: Yup.string().required("List Name is required"),
    allowedUsers: Yup.string(),
  });

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      listName: "",
      allowedUsers: "",
    },
    mode: "onTouched",
    //Pass our yup resolver into the form
    resolver: yupResolver(validationSchema),
  });

  //this lets us control user feedback (normal, loading, error)
  const [isLoading, setIsLoading] = useState(false);
  const [addListError, setAddListError] = useState("");
  const [addListSuccess, setAddListSuccess] = useState("");

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    setAddListSuccess("");
    setAddListError("");
    setIsLoading(true); // Show spinner and disable button
    data.private = showUsers;
    if (!showUsers) {
      data.allowedUsers = "";
    }
    var reply = await connectAPI(data, "addList");

    if (reply.Error !== "") {
      setAddListError(reply.Error);
    } else {
      setAddListSuccess("List Created Successfully!");
      handleSetKey(keyVal + 1);
      reset();
      setShowUsers(false);
      //close modal after x seconds i guess
    }
    setIsLoading(false); // Stop showing spinner and reenable button
  };

  //extra input state (show/hide)
  const [showUsers, setShowUsers] = useState(false);
  const handleChange = () => {
    setShowUsers(!showUsers);
  };

  return (
    <>
      {/*
        Start Form Declaration, noValidate b/c we validate with react-hook-form (RHF) instead.
        Pass formSubmit through RHF handleSubmit hook, which is called when the form is submitted (onSubmit)
        */}
      <Form noValidate onSubmit={handleSubmit(formSubmit)}>
        <Row>
          <Col>
            {/* Username section of the form*/}
            <Form.Group controlId="listName" className="my-2">
              <FloatingLabel label="List's Name">
                <Controller
                  name="listName"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      isInvalid={errors.listName}
                      isValid={touchedFields.listName && !errors.listName}
                      type="text"
                      {...field}
                      placeholder=""
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.listName?.message}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col className="my-4 col-auto">
            {/* Private/Public section of the form*/}
            <Form.Check
              type="switch"
              id="private"
              label="Private?"
              checked={showUsers}
              onChange={handleChange}></Form.Check>
          </Col>
        </Row>
        {showUsers && (
          <Row>
            <Col>
              {/* Allowed Users section of the form*/}
              <Form.Group controlId="allowedUsers" className="my-2">
                <Controller
                  name="allowedUsers"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Form.Label>
                        Enter usernames to allow access to this list. Separate
                        each username by a comma.
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...field}
                        placeholder=""
                      />
                    </>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
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
      {addListError !== "" && (
        <Alert variant="danger" dismissible onClose={() => setAddListError("")}>
          {addListError}
        </Alert>
      )}
      {addListSuccess !== "" && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setAddListSuccess("")}>
          {addListSuccess}
        </Alert>
      )}
    </>
  );
}

export default AddList;
