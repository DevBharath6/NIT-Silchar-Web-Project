import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaArrowRight } from "react-icons/fa";

import CalenderSection from "../components/CalenderSection";
import Announcements from "../components/announcements";
import CarouselDisplay from "../components/CarouselDisplay";
import SpeakersSlider from "../components/SpeakersSlider";
import HeroSection from "../components/HeroSection";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Announcements />
      <HeroSection />
      
      <CarouselDisplay />
      
      <section className="speakers-section">
        <SpeakersSlider />
      </section>

      <section className="video-section py-5">
        <Container className="text-center">
          <h2 className="section-title mb-4">About Our Organization</h2>
          <div
            className="video-wrapper mx-auto"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              position: "relative",
              paddingBottom: "50%",
              height: 0,
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/0G7wYoGmwA8?rel=0&vq=hd1080"
              title="About Our Organization"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            ></iframe>
          </div>
        </Container>
      </section>

      <CalenderSection />

      <section className="py-5 text-center bg-primary text-white position-relative">
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <h2 className="display-5 fw-bold mb-3">Ready to Elevate Your Career?</h2>
          <p className="lead mb-4">
            Register today and join thousands of professionals shaping the future.
          </p>

          <Button
            as={Link}
            to="/register"
            variant="light"
            size="lg"
            className="fw-semibold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm"
          >
            Register Now <FaArrowRight />
          </Button>

          <p className="mt-3 text-white-50">
            Early bird pricing ends on <strong>June 30th, 2025</strong>
          </p>
        </Container>
      </section>
    </div>
  );
};

export default Home;
