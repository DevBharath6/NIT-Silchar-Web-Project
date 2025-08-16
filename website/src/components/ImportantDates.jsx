import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const isPastEvent = (date, dateRange) => {
  const now = new Date();
  if (dateRange && dateRange.length > 0) {
    const lastDate = new Date(dateRange[dateRange.length - 1]);
    return lastDate < now;
  }
  return new Date(date) < now;
};

const formatRange = (range) => {
  if (!range || range.length !== 2) return "";
  const start = new Date(range[0]);
  const end = new Date(range[1]);
  const options = { month: "long", day: "numeric" };
  const year = end.getFullYear();
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString(
    "en-US",
    options
  )}, ${year}`;
};

const getComparableDate = (item) => {
  if (item.dateRange && item.dateRange.length > 0) {
    return new Date(item.dateRange[0]);
  }
  return new Date(item.date);
};

const ImportantDates = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImportantDates = async () => {
    try {
      const res = await axios.get("/api/important-dates");
      const sortedDates = (res.data || []).sort(
        (a, b) => getComparableDate(a) - getComparableDate(b)
      );
      setDates(sortedDates);
    } catch (err) {
      console.error("❌ Failed to fetch important dates", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImportantDates();
  }, []);

  if (loading) {
    return (
      <section style={{ background: "#f8f9fa", padding: "50px 0" }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold">Important Dates</h2>
          <p className="text-center">Loading dates...</p>
        </Container>
      </section>
    );
  }

  return (
    <section style={{ background: "#f8f9fa", padding: "50px 0" }}>
      <Container>
        <h2 className="text-center mb-5 fw-bold">Important Dates</h2>
        <Row className="g-4">
          {dates.length === 0 ? (
            <p className="text-center">No important dates available.</p>
          ) : (
            dates.map((item, index) => {
              const past = isPastEvent(item.date, item.dateRange);
              const displayDate = item.dateRange?.length
                ? formatRange(item.dateRange)
                : item.date;

              return (
                <Col key={index} md={6} lg={4}>
                  <Card
                    className="text-center h-100 border-0 shadow-sm"
                    style={{
                      opacity: past ? 0.6 : 1,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <Card.Body>
                      <FaCalendarAlt
                        size={36}
                        color={past ? "#999" : "#0B3D91"}
                        className="mb-3"
                      />
                      <h4
                        className="fw-bold mb-2"
                        style={{
                          color: past ? "#666" : "#0B3D91",
                          fontSize: "1.4rem",
                        }}
                      >
                        {displayDate}
                      </h4>
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "1rem",
                          fontWeight: past ? "normal" : "500",
                          color: past ? "#888" : "#333",
                        }}
                      >
                        {item.title}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ImportantDates;
