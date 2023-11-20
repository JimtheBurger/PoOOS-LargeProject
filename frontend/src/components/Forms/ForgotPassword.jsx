import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FloatingLabel,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { connectAPI } from "./connectAPI.js";
import { useState } from "react";

function ForgotPassword() {
  //yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      username: "",
    },
    mode: "onTouched",
    //Pass our yup resolver into the form
    resolver: yupResolver(validationSchema),
  });

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    var reply = await connectAPI(data, "forgotPassword");
    if (reply.Error !== "") {
      setError(reply.Error);
    } else {
      setSuccess(
        "A reset email has been sent to the email associated with the entered username. Please check your email and follow the prompts to reset your password."
      );
    }
  };

  //returned object
  return (
    <Container className="my-auto">
      {/* Bootstrap container for following form card*/}
      <Row>
        <Col>
          <Card
            className="shadow mx-auto my-5"
            style={{ minWidth: "300px", width: "50%" }}>
            {/* Bootstrap card with header and body*/}
            <Card.Header>Forgot Password</Card.Header>
            <Card.Body>
              <p className="my-3">
                Enter the username of your account to reset your password.
              </p>
              {/*
              Start Form Declaration, noValidate b/c we validate with react-hook-form (RHF) instead.
              Pass formSubmit through RHF handleSubmit hook, which is called when the form is submitted (onSubmit)
              */}
              <Form noValidate onSubmit={handleSubmit(formSubmit)}>
                <Row>
                  {/* Username section of the form*/}
                  <Form.Group controlId="username" className="my-2">
                    <FloatingLabel label="Username">
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            isInvalid={errors.username}
                            isValid={touchedFields.username && !errors.username}
                            type="text"
                            {...field}
                            placeholder=""
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username?.message}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row className="mx-auto my-3">
                  <Button
                    type="submit"
                    size="lg"
                    style={{ width: "50%" }}
                    className="mx-auto text-light rounded-pill"
                    variant="accent">
                    Continue
                  </Button>
                </Row>
              </Form>
              {error !== "" && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}>
                  {error}
                </Alert>
              )}
              {success !== "" && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}>
                  {success}
                </Alert>
              )}
            </Card.Body>
            <Card.Footer>
              Return to <a href="/login">Login here</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
