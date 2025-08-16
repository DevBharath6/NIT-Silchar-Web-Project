import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SpeakersSlider.css";

const SpeakersSlider = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await api.get("/speakers");
        setSpeakers(res.data);
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeakers();
  }, []);

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "20px",
    slidesToShow: 3,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  };

  const handleCardClick = (index) => {
    if (index === currentSlide) {
      navigate("/speakers");
    } else {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6">Featured Speakers</h2>
        <p className="text-muted">
          Meet the brilliant minds who will inspire you at SIPCOV 2025
        </p>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && speakers.length === 0 && (
        <p className="text-center text-muted">No speakers available</p>
      )}

      {!loading && speakers.length > 0 && (
        <Slider ref={sliderRef} {...sliderSettings}>
          {speakers.map((speaker, index) => (
            <div
              key={speaker._id}
              className="speaker-center-slide"
              onClick={() => handleCardClick(index)}
            >
              <div className="speaker-center-card shadow">
                <div className="speaker-center-img-wrapper">
                  <img
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    className="speaker-center-img"
                  />
                </div>
                <h4 className="speaker-center-name">{speaker.name}</h4>
                <p className="speaker-center-title">{speaker.title}</p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SpeakersSlider;
