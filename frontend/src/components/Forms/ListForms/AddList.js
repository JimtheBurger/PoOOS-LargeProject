import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FloatingLabel,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useContext } from "react";
import { connectAPI } from "../connectAPI";
import { Link, useNavigate } from "react-router-dom";

function AddList() {
  //yup validation schema
  const validationSchema = Yup.object().shape({
    listName: Yup.string().required("List Name is required"),
    allowedUsers: Yup.string(),
  });

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    register,
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
      //close modal after x seconds i guess
    }
    setIsLoading(false); // Stop showing spinner and reenable button
  };

  //Modal state (show/hide)
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    setShowUsers(false);
  };
  const handleShow = () => setShow(true);

  //extra input state (show/hide)
  const [showUsers, setShowUsers] = useState(false);
  const handleChange = () => {
    setShowUsers(!showUsers);
  };

  return (
    <div>
      <Button onClick={handleShow}>Click me</Button>
      <Modal show={show} onHide={handleClose}>
        {/* Bootstrap modal with header and body*/}
        <Modal.Header closeButton>
          <Modal.Title>Add List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*
              Start Form Declaration, noValidate b/c we validate with react-hook-form (RHF) instead.
              Pass formSubmit through RHF handleSubmit hook, which is called when the form is submitted (onSubmit)
              */}
          <Form noValidate onSubmit={handleSubmit(formSubmit)}>
            <Row>
              <Col xs={8}>
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
              <Col xs={2} className="my-4">
                {/* Private/Public section of the form*/}
                <Form.Check
                  type="switch"
                  id="private"
                  label="Private?"
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
                            Enter allowed usernames, separated by commas
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
            <Alert
              variant="danger"
              dismissible
              onClose={() => setAddListError("")}>
              {addListError}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddList;
