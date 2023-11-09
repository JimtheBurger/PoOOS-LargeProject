import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { connectAPI } from "./connectAPI";
import { Alert, Spinner } from "react-bootstrap";

function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    async function verify() {
      if (token) {
        setIsLoading(true);
        const response = await connectAPI({ token: token }, "verify-email");
        setIsLoading(false);

        if (response.error !== "") {
          setError(true);
        } else {
          setValid(true);
        }
      } else {
        setError(true);
      }
    }
    verify();
  }, []);

  return (
    <div>
      {isLoading && <Spinner animation="border" size="lg" variant="primary" />}
      {error && (
        <Alert variant="danger">
          Oh No! It looks like something went wrong...
        </Alert>
      )}
      {valid && <Alert variant="success">Email Successfully Verified!</Alert>}
    </div>
  );
}

export default VerifyEmail;
