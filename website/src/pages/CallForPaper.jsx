import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHandshake, FaLightbulb, FaChartLine } from 'react-icons/fa';


import CallForPaperDisplay from "../components/CallForPaperDisplay";
import ImportantDates from '../components/ImportantDates';


const CallForPaper = () => {
  return (
    <div>
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} className="fade-in">
              <h1 className="display-4 fw-bold mb-4">Call For Paper SIPCOV 2025</h1>
              {<p className="lead">
                Conference will be held in hybrid mode (Online/Offline).
              </p>}
            </Col>
          </Row>
        </Container>
      </section>

      <CallForPaperDisplay/>
      <ImportantDates/>

    </div>
  );
};

export default CallForPaper;