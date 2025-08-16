import React, { useEffect, useState } from "react";
import { Carousel, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";

const CarouselDisplay = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/carousel");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load carousel items", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading carousel...</p>
      </div>
    );

  if (!items.length) return null;

  return (
    <div className="carousel-wrapper mx-auto my-4">
      <Carousel interval={4000} pause="hover" fade>
        {items.map((item) => (
          <Carousel.Item key={item._id}>
            <div className="carousel-image-container">
              <img src={item.imageUrl} alt={item.title} className="d-block w-100 carousel-image" />
              <div className="carousel-overlay" />
            </div>
            <Carousel.Caption className="carousel-caption-custom">
              <h4 className="fw-bold">{item.title}</h4>
              {item.description && <p className="small">{item.description}</p>}
              {item.link && (
                <Button variant="light" size="sm" as={Link} to={item.link} className="fw-semibold shadow-sm">
                  Learn More
                </Button>
              )}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .carousel-wrapper {
          max-width: 1000px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .carousel-image-container {
          position: relative;
          height: 450px;
        }
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
        }
        .carousel-caption-custom {
          bottom: 20px;
          z-index: 2;
        }
        .carousel-caption-custom h4 {
          color: #fff;
          text-shadow: 0 2px 6px rgba(0,0,0,0.6);
        }
        .carousel-caption-custom p {
          color: #f8f9fa;
          text-shadow: 0 2px 6px rgba(0,0,0,0.5);
        }
        @media (max-width: 768px) {
          .carousel-image-container {
            height: 280px;
          }
          .carousel-caption-custom h4 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CarouselDisplay;
