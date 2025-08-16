import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [loading, setLoading] = useState(true);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/footer")
      .then((res) => {
        setFooterData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch footer data", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <footer className="text-center py-4" style={{ background: "#1E57C8", color: "#fff" }}>
        <p className="mb-0">Loading footer...</p>
      </footer>
    );

  if (!footerData)
    return (
      <footer className="text-center py-4" style={{ background: "#1E57C8", color: "#fff" }}>
        <p className="mb-0">No footer data available.</p>
      </footer>
    );

  return (
    <footer style={{ background: "#0B3D91", color: "#fff" }}>
      <Container className="pt-5 pb-3">
        <Row className="align-items-start">
          <Col lg={6} md={12} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              {footerData.logo?.url && (
                <img src={footerData.logo.url} alt="Footer Logo" style={{ maxHeight: "50px" }} className="me-2" />
              )}
              <div className="d-flex align-items-baseline gap-1">
                <span className="fw-bold fs-4">{footerData.logo?.textPrimary}</span>
                <span className="fs-4 fw-light">{footerData.logo?.textSecondary}</span>
              </div>
            </div>

            {footerData.description && <p className="small">{footerData.description}</p>}

            {footerData.socialLinks && (
              <div className="d-flex gap-3 mt-3">
                {footerData.socialLinks.facebook && (
                  <a href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white">
                    <FaFacebook size={20} />
                  </a>
                )}
                {footerData.socialLinks.twitter && (
                  <a href={footerData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white">
                    <FaTwitter size={20} />
                  </a>
                )}
                {footerData.socialLinks.linkedin && (
                  <a href={footerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {footerData.socialLinks.instagram && (
                  <a href={footerData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white">
                    <FaInstagram size={20} />
                  </a>
                )}
              </div>
            )}
          </Col>

          <Col lg={6} md={12} className="text-md-end text-center">
            {footerData.contactEmail && (
              <p className="small mb-0">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${footerData.contactEmail}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  {footerData.contactEmail}
                </a>
              </p>
            )}
          </Col>
        </Row>

        <hr className="border-light my-3" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 small text-white-50">
              © {new Date().getFullYear()} All Rights Reserved {footerData?.copyright}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
