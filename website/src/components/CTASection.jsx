import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const CTASection = () => {
  return (
    <section className="cta-section text-center py-5 bg-primary text-white">
      <div className="container">
        <h2 className="mb-3">Ready to Elevate Your Career?</h2>
        <p className="mb-4">
          Register today and join thousands of professionals shaping the future.
        </p>

        <Button as={Link} to="/register" size="lg" variant="light" className="fw-semibold shadow-sm">
          Register Now <FaArrowRight className="ms-2" />
        </Button>

        <p className="mt-3">
          Early bird pricing ends on <strong>June 30th, 2025</strong>
        </p>
      </div>

      <style>{`
        .cta-section h2 {
          font-weight: 700;
        }
        .cta-section p {
          font-size: 1.1rem;
        }
        .cta-section button {
          padding: 0.6rem 1.4rem;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
