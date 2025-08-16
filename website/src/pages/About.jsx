import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHandshake, FaLightbulb, FaChartLine } from 'react-icons/fa';


import AboutDisplay from "../components/AboutDisplay";

const About = () => {
  return (
    <div>
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} className="fade-in">
              <h1 className="display-4 fw-bold mb-4">About SIPCOV 2025</h1>
              {<p className="lead">
                Our annual conference brings together industry leaders, innovators, and professionals to share knowledge,
                inspire collaboration, and shape the future of technology and business.
              </p>}
            </Col>
          </Row>
        </Container>
      </section>
      <AboutDisplay />

    </div>
  );
};

export default About;