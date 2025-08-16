import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import api from "../services/api";

const Announcements = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/announcements");
        setMessages(res.data.map((a) => a.message));
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    })();
  }, []);

  if (!messages.length) return null;

  return (
    <div className="conference-ticker position-relative overflow-hidden border-bottom shadow-sm bg-primary text-light">
      <Container className="ps-3">
        <div className="scroll-content d-inline-block">
          {messages.map((msg, idx) => (
            <span key={idx} className="me-5 fw-semibold">{msg}</span>
          ))}
        </div>
      </Container>

      <div className="ticker-fade" />

      <style>{`
        .scroll-content {
          animation: scroll-left 25s linear infinite;
          white-space: nowrap;
        }
        .conference-ticker:hover .scroll-content {
          animation-play-state: paused;
        }
        .ticker-fade {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 50px;
          background: linear-gradient(to left, rgba(13,110,253,1), transparent);
          pointer-events: none;
        }
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @media (max-width: 768px) {
          .scroll-content span { margin-right: 2rem; font-size: 0.9rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-content { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Announcements;
