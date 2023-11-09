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
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { connectAPI } from "./connectAPI.js";

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

  //this is called when the form is submitted
  const formSubmit = async (data) => {
    console.log(data);
    var reply = await connectAPI(data, "login");
    console.log(reply);
  };

  //this lets us toggle showing the passwords or not
  const [showPass, setShowPass] = useState(false);

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
            <Card.Header>Login</Card.Header>
            <Card.Body>
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
                      {showPass ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                    </Button>
                  </Col>
                </Row>
                <Row className="mx-auto my-3">
                  <Button
                    type="submit"
                    size="lg"
                    style={{ width: "50%" }}
                    className="mx-auto text-light rounded-pill"
                    variant="accent">
                    Login
                  </Button>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer>
              Don't Have an Account? <a href="/register">Register Here</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HookLogin;
