import React, { useEffect, useState } from "react";
import { Container, Spinner, Button, Row, Col, Card } from "react-bootstrap";
import api from "../services/api";

const SpeakersList = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get("/speakers");
      setSpeakers(res.data);
    } catch (error) {
      console.error("Failed to fetch speakers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!loading && speakers.length === 0) {
    return (
      <p className="text-center text-muted">
        No speakers available right now.
      </p>
    );
  }

  return (
    <Container className="py-5">
      {speakers.map((speaker) => (
        <Card
          key={speaker._id}
          className="mb-4 border-0 shadow-sm"
          style={{
            borderRadius: "15px",
            background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
          }}
        >
          <Card.Body>
            <Row className="align-items-center g-4">
              <Col xs={12} md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    maxWidth: "90vw",
                  }}
                >
                  <img
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "6px solid #fff",
                      boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              </Col>

              <Col xs={12} md={8} className="text-center text-md-start">
                <h3
                  className="fw-bold mb-1"
                  style={{ color: "#0d6efd", letterSpacing: "0.5px" }}
                >
                  {speaker.name}
                </h3>
                <h5
                  className="text-dark fw-semibold mb-3"
                  style={{ fontStyle: "italic" }}
                >
                  {speaker.title}
                </h5>

                <p className="text-muted" style={{ textAlign: "justify" }}>
                  {speaker.bio}
                </p>

                {speaker.blog && speaker.blogVisible && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={speaker.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📖 Read Blog
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default SpeakersList;
