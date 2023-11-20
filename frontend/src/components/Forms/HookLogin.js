import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FloatingLabel,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useContext, useEffect } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { connectAPI } from "./connectAPI.js";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext.js";
import QRCode from "react-qr-code";
import ForgotPassword from "./ForgotPassword.jsx";

function HookLogin() {
  //yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  //react-hook-form useForm hook for username and password
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
    //Pass our yup resolver into the form
    resolver: yupResolver(validationSchema),
  });

  //Context hook for controlling login context
  const { user, setUser } = useContext(AppContext);

  //navigation hook for stateful redirect
  let navigate = useNavigate();

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    setIsLoading(true); // Show spinner and disable button
    var reply = await connectAPI(data, "login");

    if (reply.Error !== "") {
      setLoginError(reply.Error);
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

    setIsLoading(false); // Stop showing spinner and reenable button
  };

  //this lets us toggle showing the passwords or not
  const [showPass, setShowPass] = useState(false);

  //this lets us control user feedback (normal, loading, error)
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [QRError, setQRError] = useState("");

  //mobile logon qr stuff
  const [showQR, setShowQR] = useState("");
  const [QRToken, setQRToken] = useState("");
  const [attempt, setAttempt] = useState();
  const toggleShowQR = () => {
    setShowQR(!showQR);
  };

  const cycleCheckToken = async () => {
    const reply = await connectAPI({ QRToken: QRToken }, "checkLogin");
    if (reply.Error !== "") {
      //setQRError(reply.Error);
      console.log(reply.Error);
    } else if (reply.User !== "") {
      //Log in user
      const now = new Date();
      setUser({
        User: reply.User,
        ListInfo: reply.ListInfo,
        IsLoggedIn: true,
        expiry: now.getTime() + 60 * 60 * 1000,
      });
      navigate("/profile");
      return;
    }
  };

  //setting qr stuff when enabled
  useEffect(() => {
    async function getQRToken() {
      const token = await connectAPI({ Empty: "empty" }, "newQRToken");
      if (token.Error !== "") {
        setQRError(token.Error);
      } else {
        setQRToken(token.QRToken);
        cycleCheckToken(token.QRToken);
      }
    }
    getQRToken();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showQR) {
        cycleCheckToken();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showQR]);

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
            <Card.Header>Login Options</Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="Login" id="AddTabs" className="mb-3">
                <Tab
                  eventKey="Login"
                  title="Login"
                  onClick={() => setShowQR(false)}>
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
                                isValid={
                                  touchedFields.username && !errors.username
                                }
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
                    <Row>
                      <Col>
                        {/* Password section of the form*/}
                        <Form.Group controlId="username" className="my-2">
                          <FloatingLabel label="Password">
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <Form.Control
                                  isInvalid={errors.password}
                                  isValid={
                                    touchedFields.password && !errors.password
                                  }
                                  type={showPass ? "text" : "password"}
                                  {...field}
                                  placeholder=""
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
                          {showPass ? (
                            <BsFillEyeSlashFill />
                          ) : (
                            <BsFillEyeFill />
                          )}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mx-auto my-3">
                      <Button
                        type="submit"
                        size="lg"
                        style={{ width: "50%" }}
                        className="mx-auto text-light rounded-pill"
                        variant="accent"
                        disabled={isLoading}>
                        {isLoading ? (
                          <Spinner
                            animation="border"
                            size="lg"
                            variant="primary"
                          />
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </Row>
                  </Form>
                  {loginError !== "" && (
                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setLoginError("")}>
                      {loginError}
                    </Alert>
                  )}
                </Tab>
                <Tab
                  eventKey="QRLogin"
                  title="QR Login"
                  onClick={() => setShowQR(true)}>
                  <Container className="text-center my-5">
                    <QRCode value={QRToken} />
                    {QRError !== "" && (
                      <Alert
                        variant="danger"
                        dismissible
                        onClose={() => setQRError("")}
                        className="my-3">
                        {QRError}
                      </Alert>
                    )}
                  </Container>
                </Tab>
              </Tabs>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <div>
                Don't Have an Account? <Link to="/register">Register Here</Link>
              </div>
              <Link to="/forgotPassword">Forgot Password?</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HookLogin;
