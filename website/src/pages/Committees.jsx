import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "../services/api";

const Committees = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCommittees = async () => {
    try {
      const res = await api.get("/committee");
      setCommittees(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load organizing committee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  return (
    <div>
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Committee Members SIPCOV 2025
              </h1>
              <p className="lead">
                Providing strategic guidance and expertise to ensure the success
                of the conference.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          {loading ? (
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading committee members...</p>
              </Col>
            </Row>
          ) : error ? (
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <div className="alert alert-danger">{error}</div>
              </Col>
            </Row>
          ) : committees.length === 0 ? (
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <p className="text-center text-muted">
                  No committee data available
                </p>
              </Col>
            </Row>
          ) : (
            committees.map((section, idx) => (
              <div key={idx} className="mb-5">
                <Row className="justify-content-center text-center mb-4">
                  <Col lg={8}>
                    <h2 className="fw-bold">{section.sectionTitle}</h2>
                    {section.sectionDescription && (
                      <p className="lead text-muted">
                        {section.sectionDescription}
                      </p>
                    )}
                  </Col>
                </Row>

                <Row className="justify-content-center">
                  <Col md={10} lg={8}>
                    <Card className="shadow-sm p-4">
                      <Card.Body>
                        <h5 className="fw-bold text-center mb-4">
                          {section.cardTitle}
                        </h5>
                        {section.roles.map((role, rIndex) => (
                          <div key={rIndex} className="mb-3">
                            <h6 className="fw-bold">{role.memberRole}:</h6>
                            <ul
                              style={{
                                listStyleType: "disc",
                                paddingLeft: "20px",
                              }}
                            >
                              {role.bullets.map((member, mIndex) => (
                                <li key={mIndex}>{member}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {idx < committees.length - 1 && <hr className="my-5" />}
              </div>
            ))
          )}
        </Container>
      </section>
    </div>
  );
};

export default Committees;
