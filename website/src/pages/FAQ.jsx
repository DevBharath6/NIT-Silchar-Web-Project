import React, { useState, useEffect } from "react";
import { Container, Row, Col, Collapse, Spinner } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("/api/faqs");
      setFaqData(res.data);
    } catch (err) {
      console.error("Failed to fetch FAQs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
        <Container className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading FAQs...</p>
        </Container>
      </section>
    );
  }

  return (
    <div>
    <section className="hero-section">
            <Container>
              <Row className="justify-content-center text-center">
                <Col lg={8} className="fade-in">
                  <h1 className="display-4 fw-bold mb-4">FAQ SIPCOV 2025</h1>
                  {<p className="lead">
                    Find quick answers to the most common questions about SIPCOV 2025, including paper submission, registration, accommodation, and event details.
                  </p>}
                </Col>
              </Row>
            </Container>
          </section>
    <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <Container>
        <h2 className="text-center fw-bold mb-5" style={{ color: "#2666f6" }}>
        Frequently Asked Questions
        </h2>

        <Row>
          {faqData.map((item, index) => (
            <Col key={item._id || index} md={6} className="mb-4">
              <div
                onClick={() => toggleFAQ(index)}
                style={{
                  background: "#2666f6",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow:
                    openIndex === index
                      ? "0 8px 20px rgba(0,0,0,0.25)"
                      : "0 4px 12px rgba(0,0,0,0.15)",
                }}
                className="faq-card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  {item.question}
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <Collapse in={openIndex === index}>
                  <div>
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "#fff",
                        borderRadius: "8px",
                        color: "#333",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.answer}{" "}
                      {item.link && (
                        <>
                          {" "}
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#2666f6", fontWeight: "600" }}
                          >
                            {item.linkText || "Click here"}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </Collapse>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ✅ Extra CSS for hover effect */}
      <style>
        {`
          .faq-card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </section>
    </div>
  );
};


export default FAQ;
