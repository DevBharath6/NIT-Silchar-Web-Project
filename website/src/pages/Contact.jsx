import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Contact = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/footer")
      .then((res) => setFooterData(res.data))
      .catch((err) => console.error("Failed to fetch footer data", err))
      .finally(() => setLoading(false));
  }, []);

  const renderSocialLink = (url, Icon) =>
    url && (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary"
      >
        <Icon size={26} />
      </a>
    );

  return (
    <div>
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead">
                Reach out anytime—we’re here to answer your questions and help
                you get the most out of the event.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading contact details...</p>
        </div>
      )}

      {!loading && footerData && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="justify-content-center text-center mb-4">
              <Col lg={8}>
                <h2 className="fw-bold">Get in Touch</h2>
                <p className="text-muted">
                  Quick ways to connect, find resources, and stay updated.
                </p>
                <div
                  style={{
                    width: "60px",
                    height: "3px",
                    backgroundColor: "#0d6efd",
                    margin: "10px auto 0",
                    borderRadius: "2px",
                  }}
                />
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="shadow-sm border-0 p-4 text-center">
                  {footerData?.contactEmail && (
             <p className="mb-4">
         📧{" "}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${footerData.contactEmail}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary fw-semibold text-decoration-none"
           >
              {footerData.contactEmail}
              </a>
               </p>
                 )}

                  {footerData?.socialLinks && (
                    <div className="d-flex justify-content-center gap-4 mb-4">
                      {renderSocialLink(footerData.socialLinks.facebook, FaFacebook)}
                      {renderSocialLink(footerData.socialLinks.twitter, FaTwitter)}
                      {renderSocialLink(footerData.socialLinks.linkedin, FaLinkedin)}
                      {renderSocialLink(footerData.socialLinks.instagram, FaInstagram)}
                    </div>
                  )}

                  {footerData?.usefulLinks?.length > 0 && (
                    <>
                      <h5 className="fw-bold mb-3">Useful Links</h5>
                      <ul className="list-unstyled">
                        {footerData.usefulLinks.map((link, idx) => (
                          <li key={idx} className="mb-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-decoration-none"
                            >
                              🔗 {link.label || link.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Contact;
