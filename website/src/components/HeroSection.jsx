import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";

const HeroSection = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const BROCHURE_PDF_URL = "/brochure.pdf";

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get("/hero");
        setHero(res.data);
      } catch (err) {
        console.error("Failed to load hero section:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="hero-section text-center py-5">
        <h2>Loading...</h2>
      </section>
    );
  }

  if (!hero) {
    return (
      <section className="hero-section text-center py-5">
        <h2>Failed to load Hero Section</h2>
      </section>
    );
  }

  const backgroundImage = hero.backgroundImageUrl
    ? `url('${hero.backgroundImageUrl}'), linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)`
    : "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)";

  const heroImage = hero.heroImageUrl || "/fallback-hero.png";

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <h1 className="hero-title mb-3">{hero.title}</h1>
            <div className="hero-subtitle mb-4">
              {hero.subtitle?.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </div>

            <div className="hero-buttons">
              {hero.primaryButton?.text && (
                <Button
                  as="a"
                  href={hero.primaryButton.link || "#"}
                  className="hero-btn"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hero.primaryButton.text.toUpperCase()}
                </Button>
              )}

              {hero.secondaryButton?.text && (
                <Button
                  as="a"
                  href={BROCHURE_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-outline"
                  size="lg"
                >
                  {hero.secondaryButton.text.toUpperCase()}
                </Button>
              )}
            </div>
          </Col>

          <Col lg={6} className="d-none d-lg-block text-end">
            <img
              src={heroImage}
              alt="Conference Hero"
              className="img-fluid hero-image hero-image-animate"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
