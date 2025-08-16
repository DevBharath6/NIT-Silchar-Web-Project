import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { FaCalendarCheck } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

const isPastEvent = (date, dateRange) => {
  const now = new Date();
  if (dateRange?.length) return new Date(dateRange[dateRange.length - 1]) < now;
  return new Date(date) < now;
};

const formatRange = (range) => {
  if (!range || range.length !== 2) return "";
  const [start, end] = [new Date(range[0]), new Date(range[1])];
  const opts = { month: "long", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}`;
};

const getComparableDate = (item) =>
  item.dateRange?.length ? new Date(item.dateRange[0]) : new Date(item.date);

const CalendarSection = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/important-dates");
        const sorted = (res.data || []).sort((a, b) => getComparableDate(a) - getComparableDate(b));
        setDates(sorted);
      } catch (err) {
        console.error("Failed to fetch important dates", err);
      }
      setLoading(false);
    })();
  }, []);

  const lastDate =
    dates.length > 0
      ? dates[dates.length - 1].dateRange?.length
        ? formatRange(dates[dates.length - 1].dateRange)
        : dates[dates.length - 1].date
      : "Loading...";

  return (
    <section className="calendar-section py-5" style={{ background: "#f8f9fa" }}>
      <Container>
        <Row className="align-items-center">
          <Col lg={5} className="mb-4 mb-lg-0">
            <h2 className="fw-bold">Mark Your Calendar</h2>
            <p className="text-muted">Don’t miss the key deadlines for the upcoming conference.</p>
            <div className="d-flex align-items-center mb-3">
              <FaCalendarCheck size={32} className="me-3 text-primary" />
              <div>
                <h5 className="mb-0">Conference Dates</h5>
                <p className="mb-0">{lastDate}</p>
              </div>
            </div>
            <Button as={Link} to="/callforpaper" variant="outline-primary">
              View Full Details <FaArrowRight className="ms-2" />
            </Button>
          </Col>

          <Col lg={7}>
            <div className="shadow-sm rounded overflow-hidden">
              <div
                className="px-3 py-2"
                style={{
                  background: "linear-gradient(90deg, #1a4dc4, #3b82f6)",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Conference Dates Overview
              </div>
              <div className="p-3">
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading dates...</p>
                  </div>
                ) : dates.length === 0 ? (
                  <p className="text-center text-muted">No important dates available.</p>
                ) : (
                  <Table striped hover responsive className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "65%" }}>Title</th>
                        <th style={{ width: "35%", textAlign: "right" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dates.map((item, idx) => {
                        const past = isPastEvent(item.date, item.dateRange);
                        const displayDate = item.dateRange?.length ? formatRange(item.dateRange) : item.date;
                        return (
                          <tr key={idx} className={past ? "text-muted" : ""}>
                            <td style={{ fontWeight: past ? "normal" : "500" }}>{item.title}</td>
                            <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{displayDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CalendarSection;
