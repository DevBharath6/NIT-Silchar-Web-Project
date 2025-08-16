import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import api from "../services/api";

const AboutPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/about");
        setSections(res.data.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error("Error fetching about sections:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <h4 className="fw-semibold text-secondary">Loading About Page...</h4>
      </div>
    );

  return (
    <div className="about-page">
      {sections.map((section) => {
        const isOdd = section.order % 2 !== 0;
        return (
          <div
            key={section._id}
            className={`py-5 ${isOdd ? "bg-light" : "bg-white"}`}
            style={{ transition: "opacity 0.6s ease-in-out" }}
          >
            <Container>
              <SectionHeader title={section.title} subtitle={section.subtitle} />
              <SectionLayout section={section} alternate={isOdd} />
            </Container>
          </div>
        );
      })}

      <style>{`
        .hover-card {
          transition: all 0.3s ease-in-out;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-4">
    <h2 className="fw-bold">{title}</h2>
    {subtitle && <p className="text-muted small">{subtitle}</p>}
    <div
      style={{
        width: 60,
        height: 3,
        background: "#0d6efd",
        margin: "10px auto 0",
        borderRadius: 2,
      }}
    />
  </div>
);

const SectionLayout = ({ section, alternate }) =>
  section.paragraphs.map((para, idx) =>
    alternate ? (
      <Row
        key={idx}
        className="align-items-center my-5 flex-md-row-reverse"
        style={{ transition: "opacity 0.6s ease-in-out" }}
      >
        {para.imageUrl && (
          <Col md={5} className="text-center">
            {renderImage(para.imageUrl)}
          </Col>
        )}
        <Col md={para.imageUrl ? 7 : 12}>
          <ParagraphContent para={para} />
        </Col>
      </Row>
    ) : (
      <Row
        key={idx}
        className="justify-content-center"
        style={{ transition: "opacity 0.6s ease-in-out" }}
      >
        <Col md={10} lg={8}>
          <div className="hover-card p-4 mb-4 bg-white rounded text-center">
            {para.imageUrl && <div className="mb-3">{renderImage(para.imageUrl)}</div>}
            <ParagraphContent para={para} />
          </div>
        </Col>
      </Row>
    )
  );

const ParagraphContent = ({ para }) => (
  <div style={{ transition: "opacity 0.6s ease-in-out" }}>
    {para.text && (
      <p
        className="lead"
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.6,
          color: "#444",
          textAlign: "justify",
        }}
      >
        {para.text}
      </p>
    )}
    {renderBullets(para.bullets)}
    {renderLinks(para.links)}
    {renderButtons(para.buttons)}
  </div>
);

const renderImage = (src) => (
  <img
    src={src}
    alt="about"
    className="img-fluid rounded shadow-sm"
    style={{ transition: "transform 0.3s ease", cursor: "pointer" }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  />
);

const renderBullets = (bullets) =>
  bullets?.length ? (
    <ul className="ps-3" style={{ textAlign: "justify" }}>
      {bullets.map((b, i) => (
        <li key={i} className="text-secondary mb-1">
          {b}
        </li>
      ))}
    </ul>
  ) : null;

const renderLinks = (links) =>
  links?.length ? (
    <div className="mb-2">
      {links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="d-block text-primary fw-semibold text-decoration-none"
        >
          {l.label}
        </a>
      ))}
    </div>
  ) : null;

const renderButtons = (buttons) =>
  buttons?.length ? (
    <div className="mt-3">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          variant="primary"
          className="me-2 mt-2"
          style={{ borderRadius: 6 }}
          onClick={() => window.open(btn.url, "_blank")}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  ) : null;
