import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FloatingLabel,
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { connectAPI } from "./connectAPI.js";

function ResetPassword() {
  //yup validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password cannot be more than 50 characters long"),
    passwordValidation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords do not match"
    ),
  });

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      password: "",
      passwordValidation: "",
    },
    mode: "onTouched",
    //Pass our yup resolver into the form
    resolver: yupResolver(validationSchema),
  });

  //UseSearchParams to grab token from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    //Add reset token to data before shipping it off
    data.token = token;
    console.log(data);
    var reply = await connectAPI(data, "resetPassword");
    console.log(reply);
  };

  //this lets us toggle showing the passwords or not
  const [showPass, setShowPass] = useState(false);
  const [showPassVal, setShowPassVal] = useState(false);

  //returned object
  return (
    <Container>
      {/* Bootstrap container for following form card*/}
      <Row>
        <Col>
          <Card
            className="shadow mx-auto my-5"
            style={{ minWidth: "300px", width: "50%" }}>
            {/* Bootstrap card with header and body*/}
            <Card.Header>Reset Password</Card.Header>
            <Card.Body>
              {/*
              Start Form Declaration, noValidate b/c we validate with react-hook-form (RHF) instead.
              Pass formSubmit through RHF handleSubmit hook, which is called when the form is submitted (onSubmit)
              */}
              <Form noValidate onSubmit={handleSubmit(formSubmit)}>
                <Row>
                  {/* Password section of the form*/}
                  <Col>
                    <Form.Group controlId="password">
                      <FloatingLabel label="Password" className="my-2">
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              aria-label="Password"
                              isInvalid={errors.password}
                              isValid={
                                touchedFields.password && !errors.password
                              }
                              type={showPass ? "text" : "password"}
                              {...field}
                              placeholder="Password"
                            />
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col className="col-auto">
                    <Button
                      className="my-3 mx-auto text-light rounded-pill"
                      variant="accent"
                      onClick={() => setShowPass(!showPass)}>
                      {showPass ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  {/* Password Reentry section of the form*/}
                  <Col>
                    <Form.Group controlId="passwordValidation">
                      <FloatingLabel label="Retype Password" className="my-2">
                        <Controller
                          name="passwordValidation"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              aria-label="Retype Password"
                              isInvalid={errors.passwordValidation}
                              isValid={
                                touchedFields.passwordValidation &&
                                !errors.passwordValidation
                              }
                              type={showPassVal ? "text" : "password"}
                              {...field}
                              placeholder="Retype Password"
                            />
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.passwordValidation?.message}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col className="col-auto">
                    <Button
                      className="my-3 mx-auto text-light rounded-pill"
                      variant="accent"
                      onClick={() => setShowPassVal(!showPassVal)}>
                      {showPassVal ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                    </Button>
                  </Col>
                </Row>
                <Row className="my-3 text-center">
                  <Button
                    aria-label="Submit"
                    type="submit"
                    size="lg"
                    style={{ width: "50%" }}
                    className=" mx-auto text-light rounded-pill"
                    variant="accent">
                    Set Password
                  </Button>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer>
              Make sure to use a memorable and secure password!
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
