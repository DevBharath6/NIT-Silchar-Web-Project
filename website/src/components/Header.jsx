import React, { useEffect, useState } from "react";
import { Container, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";

const Header = () => {
  const [brand, setBrand] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const res = await api.get("/header-brand");
        setBrand(res.data);
      } catch (err) {
        console.error("Failed to fetch header brand:", err);
      }
    };
    fetchBrandData();
  }, []);

  if (!brand) return null;

  const renderIcons = (size) =>
    brand.icons
      ?.sort((a, b) => a.order - b.order)
      .map((icon) => (
        <a
          key={icon._id}
          href={icon.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={icon.imageUrl}
            alt="Header Icon"
            style={{
              height: `${size}px`,
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </a>
      ));

  return (
    <header className="bg-white shadow-sm sticky-top">
      <Container fluid className="px-4">
        <BootstrapNavbar
          expand="lg"
          className="py-3 w-100"
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 text-primary"
            onClick={() => setExpanded(false)}
          >
            <span className="text-dark">{brand.titlePrimary}</span>{" "}
            <span className="text-primary">{brand.titleSecondary}</span>
          </BootstrapNavbar.Brand>

          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto">
            {renderIcons(32)}
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
          </div>

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Navbar onNavClick={() => setExpanded(false)} />
          </BootstrapNavbar.Collapse>

          <div className="ms-auto d-none d-lg-flex align-items-center gap-3">
            {renderIcons(40)}
          </div>
        </BootstrapNavbar>
      </Container>
    </header>
  );
};

export default Header;
