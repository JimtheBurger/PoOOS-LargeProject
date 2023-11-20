import { useState, useContext } from "react";
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
  Spinner,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { connectAPI } from "./connectAPI";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

function HookRegister() {
  YupPassword(Yup);
  //yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(50, "Username cannot be more than 50 characters long"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password cannot be more than 50 characters long")
      .minLowercase(1, "Password must contain at least 1 lowercase letter")
      .minUppercase(1, "Password must contain at least 1 uppercase letter")
      .minNumbers(1, "Password must contain at least number")
      .minSymbols(1, "Password must contain at least 1 symbol"),
    passwordValidation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords do not match"
    ),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  //login helpers
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      passwordValidation: "",
      email: "",
    },
    mode: "onTouched",
    //Pass our yup resolver into the form
    resolver: yupResolver(validationSchema),
  });

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    setIsLoading(true); // show spinner and disable button

    var reply = await connectAPI(data, "register");
    if (reply.Error !== "") {
      setRegisterError(reply.Error);
    } else {
      setRegisterSuccess("User successfully registered! Redirecting...");
      var reply = await connectAPI(data, "login");
      setTimeout(() => {
        if (reply.Error !== "") {
          setRegisterError(reply.Error);
        } else {
          //Log in user
          const now = new Date();
          setUser({
            User: reply.User,
            ListInfo: reply.ListInfo,
            IsLoggedIn: true,
            expiry: now.getTime() + 60 * 60 * 1000,
          });
          navigate("/profile");
        }
      }, 2000);
    }
    setIsLoading(false); // Stop showing spinner and reenable button
  };

  //this lets us toggle showing the passwords or not
  const [showPass, setShowPass] = useState(false);
  const [showPassVal, setShowPassVal] = useState(false);

  //this lets us control user feedback (normal, loading, error)
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

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
            <Card.Header>Register</Card.Header>
            <Card.Body>
              {/*
              Start Form Declaration, noValidate b/c we validate with react-hook-form (RHF) instead.
              Pass formSubmit through RHF handleSubmit hook, which is called when the form is submitted (onSubmit)
              */}
              <Form noValidate onSubmit={handleSubmit(formSubmit)}>
                <Row>
                  {/* Username section of the form*/}
                  <Form.Group controlId="username">
                    <FloatingLabel label="Username" className="my-2">
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            aria-label="Username"
                            isInvalid={errors.username}
                            isValid={touchedFields.username && !errors.username}
                            type="text"
                            {...field}
                            placeholder="Username"
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username?.message}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
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
                <Row>
                  {/* Email section of the form*/}
                  <Form.Group controlId="email">
                    <FloatingLabel label="Email" className="my-2">
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            aria-label="Email"
                            isInvalid={errors.email}
                            isValid={touchedFields.email && !errors.email}
                            type="text"
                            {...field}
                            placeholder="Email"
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row className="my-3 text-center">
                  <Button
                    aria-label="Submit"
                    type="submit"
                    size="lg"
                    style={{ width: "50%" }}
                    className="mx-auto text-light rounded-pill"
                    variant="accent"
                    disabled={isLoading}>
                    {isLoading ? (
                      <Spinner animation="border" size="lg" variant="primary" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Row>
              </Form>
              {registerError !== "" && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setRegisterError("")}>
                  {registerError}
                </Alert>
              )}
              {registerSuccess !== "" && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setRegisterSuccess("")}>
                  {registerSuccess}
                </Alert>
              )}
            </Card.Body>
            <Card.Footer>
              Already Have an Account? <Link to="/login">Login Here</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HookRegister;
