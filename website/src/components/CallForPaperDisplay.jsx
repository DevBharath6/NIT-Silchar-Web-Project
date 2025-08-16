import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import api from "../services/api";

const CallForPaperDisplay = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/paper");
        setSections(res.data);
      } catch {
        setError("Failed to load sections");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderBullets = (bullets, isCard = false) =>
    bullets?.length ? (
      <ul
        style={{
          textAlign: "left",
          margin: isCard ? "20px 0" : "20px auto",
          display: isCard ? "block" : "inline-block",
          paddingLeft: 20,
          listStyle: "disc",
        }}
      >
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            {b}
          </li>
        ))}
      </ul>
    ) : null;

  const renderButton = (text, link) =>
    text && link ? (
      <div className="mt-3">
        <Button variant="primary" href={link} target="_blank" rel="noopener noreferrer" className="me-2 mb-2">
          {text}
        </Button>
      </div>
    ) : null;

  const renderParagraph = (p, isCard = false) => (
    <div key={p._id || Math.random()} className="mb-4">
      {p.imageUrl && (
        <div className={isCard ? "mb-3" : "text-center mb-4"}>
          <img
            src={p.imageUrl}
            alt=""
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 8,
              boxShadow: isCard ? "none" : "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}
      {p.text && (
        <p
          style={{
            textAlign: "justify",
            maxWidth: isCard ? "100%" : 800,
            margin: isCard ? "0 auto 15px" : "20px auto",
            fontWeight: isCard ? "bold" : "normal",
          }}
        >
          {p.text}
        </p>
      )}
      {renderBullets(p.bullets, isCard)}
      <div className="text-center">{renderButton(p.buttonText, p.buttonLink)}</div>
    </div>
  );

  const renderOddSection = (s) => (
    <section
      key={s._id}
      style={{ background: "linear-gradient(135deg, #f3f4f6, #ffffff)", padding: "60px 20px" }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={12} className="text-center">
            <h2 style={{ letterSpacing: 2, fontWeight: 400, textTransform: "uppercase" }}>{s.title}</h2>
            {s.subtitle && <h4 style={{ fontWeight: 300, color: "#666" }}>{s.subtitle}</h4>}
            {s.paragraphs?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((p) => renderParagraph(p))}
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderEvenSection = (s) => {
    const sorted = s.paragraphs?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    const mid = Math.ceil(sorted.length / 2);
    const [left, right] = [sorted.slice(0, mid), sorted.slice(mid)];

    const renderCard = (paras) => (
      <Card className="h-100 hover-shadow">
        <Card.Body className="text-center">
          {paras.length ? paras.map((p) => renderParagraph(p, true)) : <p className="text-muted">More content coming soon</p>}
        </Card.Body>
      </Card>
    );

    return (
      <section key={s._id} className="py-5">
        <Container>
          <Row className="mb-4 text-center">
            <Col lg={12}>
              <h2 style={{ letterSpacing: 1, fontWeight: 500 }}>{s.title}</h2>
              {s.subtitle && <h4 style={{ fontWeight: 300, color: "#666" }}>{s.subtitle}</h4>}
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={6}>{renderCard(left)}</Col>
            <Col lg={6}>{renderCard(right)}</Col>
          </Row>
        </Container>
      </section>
    );
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!sections.length) return <div className="alert alert-info m-4">No sections available yet.</div>;

  return (
    <div>
      {sections
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s, i) => ((s.order ?? i + 1) % 2 ? renderOddSection(s) : renderEvenSection(s)))}

      <style jsx>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease-in-out;
        }
        .hover-shadow:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        .card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
        }
        .card-body {
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .card-body {
            padding: 1.5rem;
          }
          section {
            padding: 40px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CallForPaperDisplay;
