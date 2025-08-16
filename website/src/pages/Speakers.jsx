import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SpeakersList from "../components/SpeakersList";

const SpeakersPage = () => {
  return (
    <div>
      <section className="hero-section text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="fade-in">
              <h1 className="display-4 fw-bold mb-4">Key Speakers SIPCOV 2025</h1>
              <p className="lead">

              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container className="text-center mb-5">
          <h2 className="section-title fw-bold">Our Keynote Speakers</h2>
          <p className="section-subtitle text-muted">
            Inspiring talks and sessions from top professionals
          </p>
        </Container>

        <SpeakersList />
      </section>
    </div>
  );
};

export default SpeakersPage;
