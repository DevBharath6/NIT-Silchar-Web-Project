import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaBus, FaPlane, FaTrain } from "react-icons/fa";

const HowToReach = () => {
  const travelOptions = [
    {
      icon: <FaBus size={30} />,
      color: "#2563eb",
      title: "Reach By Road",
      description: (
        <>
          Silchar is well connected with various cities through road. A{" "}
          <strong>326 km long National Highway</strong> directly connects Silchar with Guwahati.  
          Daily buses operate between Guwahati and Silchar.  
          From <strong>ISBT-Silchar</strong>, auto-rickshaw fare to NIT Campus is approx. <strong>₹300–350</strong>.
        </>
      ),
    },
    {
      icon: <FaPlane size={30} />,
      color: "#16a34a",
      title: "Reach By Air",
      description: (
        <>
          <strong>Daily direct flights</strong> operate from cities like Kolkata & Guwahati.  
          The campus is <strong>35 km</strong> from Silchar airport.  
          Private taxi service is available (fare approx. <strong>₹1000–1500</strong>).
        </>
      ),
    },
    {
      icon: <FaTrain size={30} />,
      color: "#dc2626",
      title: "Reach By Train",
      description: (
        <>
          Silchar has a <strong>direct rail link</strong> with Lumding/Guwahati.  
          The campus is around <strong>10 km</strong> from the railway station.  
          Auto-rickshaw fare is approx. <strong>₹300</strong>.
        </>
      ),
    },
  ];

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
        padding: "80px 0",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
            How to Reach <span style={{ color: "#2563eb" }}>NIT Silchar</span>
          </h2>
          <p
            className="text-muted"
            style={{ maxWidth: "600px", margin: "10px auto 0" }}
          >
            Choose the most convenient travel option to reach the campus.
          </p>
        </div>

        <Row className="g-3 mb-5">
          {travelOptions.map((option, idx) => (
            <Col key={idx} md={6} lg={4}>
              <div
                className="how-card"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "15px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: option.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "#fff",
                    boxShadow: `0 6px 15px ${option.color}55`,
                  }}
                >
                  {option.icon}
                </div>
                <h4 className="fw-bold mb-3">{option.title}</h4>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    textAlign: "justify",
                  }}
                >
                  {option.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mb-4">
          <h2 className="fw-bold">
            Explore <span style={{ color: "#16a34a" }}>North East India</span>
          </h2>
          <p
            className="text-muted"
            style={{ maxWidth: "600px", margin: "10px auto 0" }}
          >
            Discover the beauty and culture of Assam and Meghalaya during your
            visit.
          </p>
        </div>

        <Row className="gy-4 mt-4">
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm"
              style={{ background: "#fff", textAlign: "justify" }}
            >
              <h4 className="fw-bold text-primary">Assam Tourism</h4>
              <p className="text-muted" style={{ lineHeight: "1.6" }}>
                Assam is the most charming state in North East India, waiting to
                be explored. Known for its tea gardens and wildlife sanctuaries,
                Assam offers breathtaking landscapes and serene experiences.
                <br />
                <br />
                <strong>Best places to visit:</strong>
              </p>
              <ul className="text-muted">
                <li>Kaziranga National Park – Home to One-horned Rhinoceros</li>
                <li>Manas National Park – UNESCO Biosphere Reserve</li>
                <li>Kamakhya Temple – A Religious Expedition</li>
                <li>Haflong Lake & Haflong Hill – For Nature & Adventure</li>
                <li>Silchar – Enchanting Landscapes</li>
              </ul>
            </div>
          </Col>

          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm"
              style={{ background: "#fff", textAlign: "justify" }}
            >
              <h4 className="fw-bold text-success">Meghalaya Tourism</h4>
              <p className="text-muted" style={{ lineHeight: "1.6" }}>
                Meghalaya, “The Abode of Clouds”, is famous for its misty hills,
                waterfalls, and caves. Shillong, the capital city, is a perfect
                blend of modernity and natural beauty.
                <br />
                <br />
                <strong>Best places to visit:</strong>
              </p>
              <ul className="text-muted">
                <li>Shillong – Scotland of the East</li>
                <li>Cherrapunji – Living Root Bridges & Rainfall</li>
                <li>Dawki – Crystal Clear River</li>
                <li>Krang Suri & Wei Sawdong Waterfalls</li>
                <li>Mawsmai, Arwah & Siju Caves</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowToReach;
