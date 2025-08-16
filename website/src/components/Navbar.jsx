import React, { useEffect, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

const Navbar = ({ onNavClick }) => {
  const [items, setItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    api
      .get("/navbar")
      .then((res) => {
        const visibleItems = res.data.filter((item) => item.visible);
        visibleItems.forEach((item) => {
          item.children = item.children?.filter((child) => child.visible) || [];
        });
        setItems(visibleItems);
      })
      .catch((err) => console.error("Failed to fetch navbar:", err));
  }, []);

  const normalizePath = (path) => {
    if (!path) return "/";
    return path.startsWith("/") ? path.toLowerCase() : `/${path.toLowerCase()}`;
  };

  const isActive = (path) => {
    return location.pathname.toLowerCase() === normalizePath(path);
  };

  const isDropdownActive = (item) => {
    if (isActive(item.url)) return true;
    return item.children?.some((child) => isActive(child.url));
  };

  return (
    <Nav className="ms-auto align-items-center">
      {items.map((item, idx) =>
        Array.isArray(item.children) && item.children.length > 0 ? (
          <NavDropdown
            key={idx}
            title={
              <Link
                to={normalizePath(item.url)}
                className={`text-decoration-none fw-medium px-2 ${
                  isDropdownActive(item) ? "text-primary fw-semibold" : "text-dark"
                }`}
                onClick={() => onNavClick()}
              >
                {item.title}
              </Link>
            }
            id={`nav-dropdown-${idx}`}
            className="nav-item-custom"
          >
            {item.children.map((child, cidx) => (
              <NavDropdown.Item
                key={cidx}
                as={Link}
                to={normalizePath(child.url)}
                className={`py-2 ${isActive(child.url) ? "active fw-semibold" : ""}`}
                onClick={onNavClick}
              >
                {child.title}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        ) : (
          <Nav.Link
            key={idx}
            as={Link}
            to={normalizePath(item.url)}
            className={`fw-medium px-3 ${
              isActive(item.url) ? "text-primary fw-semibold" : "text-dark"
            }`}
            onClick={onNavClick}
          >
            {item.title}
          </Nav.Link>
        )
      )}
    </Nav>
  );
};

export default Navbar;
