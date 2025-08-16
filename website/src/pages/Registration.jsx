import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";
import axios from "axios";

const Registration = () => {
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    axios
      .get("/api/registration")
      .then((res) => setRegistration(res.data))
      .catch((err) => console.error("Failed to fetch registration data", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading registration details...</p>;
  if (!registration) return <p className="text-center mt-5 text-danger">No registration data available.</p>;

  return (
    <div>
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Registration</h1>
              <p className="lead">
                Secure your spot at SIPCOV 2025 by completing the registration process.
                Find details about fees, payment methods, and guidelines below.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="section-title text-center mb-4">Registration Fees</h2>
          <Card className="shadow-sm">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Category</th>
                  <th>Fees</th>
                </tr>
              </thead>
              <tbody>
                {registration.fees?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.category}</td>
                    <td>{item.fee}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-4">Registration Guidelines</h2>
          <Card className="p-4 shadow-sm">
            <ul>{registration.guidelines?.map((g, i) => <li key={i}>{g}</li>)}</ul>
            {registration.importantNote && (
              <Alert variant="danger" className="mt-3">
                <strong>Important Note:</strong> {registration.importantNote}
              </Alert>
            )}
          </Card>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="section-title text-center mb-4">Payment Details</h2>
          <Card className="p-4 shadow-sm">
            <h5>Indian Authors:</h5>
            <p>
              <a
                href={registration.payment?.indianAuthorsLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-warning fw-semibold"
              >
                CLICK HERE TO PAY VIA SBI COLLECT
              </a>
            </p>
            <p>Select <strong>Payment Category:</strong> SIPCOV 2025 Registration fee.</p>
            <p><em>Note:</em> Do not use commas or special characters in SBI Collect.</p>

            <h5 className="mt-4">Foreign Authors:</h5>
            <ul>
              {Object.entries(registration.payment?.foreignAuthors || {}).map(([k, v]) => (
                <li key={k}>
                  <strong>{k.replace(/([A-Z])/g, " $1")}: </strong> {v}
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-4">Steps to Register</h2>
          <Card className="p-4 shadow-sm">
            <ol>
              {registration.steps?.map((step, i) => <li key={i}>{step}</li>)}
              {registration.googleFormLink && (
                <li>
                  Fill out the mandatory registration form:{" "}
                  <a
                    href={registration.googleFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-danger btn-sm"
                  >
                    GOOGLE FORM LINK
                  </a>
                </li>
              )}
            </ol>
            {registration.googleFormNote && (
              <Alert variant="info" className="mt-3">{registration.googleFormNote}</Alert>
            )}
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Registration;
