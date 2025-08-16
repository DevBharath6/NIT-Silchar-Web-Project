import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Badge,
  Tabs,
  Tab,
  Modal,
  Form,
  Alert,
  Spinner,
} from 'react-bootstrap';
import {
  FaDownload,
  FaPlus,
  FaFilter,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import api from '../services/api';

const Schedules = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTrack, setActiveTrack] = useState('all');
  const [activeDay, setActiveDay] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [newMeetingData, setNewMeetingData] = useState({
    title: '',
    speaker: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    track: '',
    type: 'session',
    reminder: '',
    capacity: '',
  });

  const tracks = [
    { id: 'all', label: 'All Tracks', color: 'secondary' },
    { id: 'keynote', label: 'Keynotes', color: 'primary' },
    { id: 'workshop', label: 'Workshops', color: 'success' },
    { id: 'session', label: 'Sessions', color: 'warning' },
    { id: 'social', label: 'Social Events', color: 'info' },
  ];

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings');
      const data = res.data.map((m) => ({
        ...m,
        date: new Date(m.date),
      }));
      setMeetings(data);
      if (data.length > 0) {
        setActiveDay(data[0].date.toDateString());
      }
    } catch (err) {
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAddModal = () => {
    setNewMeetingData({
      title: '',
      speaker: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      track: '',
      type: 'session',
      reminder: '',
      capacity: '',
    });
    setIsEditMode(false);
    setShowMeetingModal(true);
  };

  const handleShowEditModal = (meeting) => {
    setCurrentMeeting(meeting);
    setNewMeetingData({
      ...meeting,
      date: new Date(meeting.date).toISOString().split('T')[0],
    });
    setIsEditMode(true);
    setShowMeetingModal(true);
  };

  const handleCloseMeetingModal = () => {
    setShowMeetingModal(false);
  };

  const handleMeetingFormChange = (e) => {
    const { name, value } = e.target;
    setNewMeetingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveMeeting = async () => {
    setLoading(true);
    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/meetings/${currentMeeting._id}`, newMeetingData);
        setMeetings((prevMeetings) =>
          prevMeetings.map((m) =>
            m._id === currentMeeting._id
              ? { ...newMeetingData, _id: m._id, date: new Date(newMeetingData.date) }
              : m
          )
        );
      } else {
        response = await api.post('/meetings', newMeetingData);
        setMeetings((prev) => [...prev, { ...response.data, date: new Date(response.data.date) }]);
      }
      setShowMeetingModal(false);
    } catch (err) {
      setError('Failed to save meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (id) => {
    try {
      await api.delete(`/meetings/${id}`);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  const getSessionClass = (type) => {
    switch (type) {
      case 'keynote': return 'border-primary';
      case 'workshop': return 'border-success';
      case 'session': return 'border-warning';
      case 'social': return 'border-info';
      case 'break': return 'border-secondary';
      default: return 'border-dark';
    }
  };

  const getTrackBadge = (track) => {
    const match = tracks.find((t) => t.id === track);
    if (match) {
      return <Badge bg={match.color} className="ms-2">{match.label}</Badge>;
    }
    return null;
  };

  const getFilteredSchedule = () => {
    return meetings.filter((m) => {
      const matchDay = m.date.toDateString() === activeDay;
      const matchTrack = activeTrack === 'all' || m.track === activeTrack;
      return matchDay && matchTrack;
    });
  };

  const meetingDates = [...new Set(meetings.map((m) => m.date.toDateString()))];

  return (
    <div>
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold">Conference Schedule</h1>
              <p className="lead">
                Plan your conference experience with our comprehensive schedule of keynotes, sessions, workshops, and networking events.
              </p>
              <Button variant="outline-light" className="d-inline-flex align-items-center gap-2 mt-2">
                <FaDownload /> Download PDF Schedule
              </Button>
              <Button variant="success" className="d-inline-flex align-items-center gap-2 mt-2 ms-3" onClick={handleShowAddModal}>
                <FaPlus /> Add New Meeting
              </Button>
            </Col>
            <Col lg={5} className="text-lg-end">
              <img
                src="https://placehold.co/250x250?text=Schedule"
                alt="Schedule Icon"
                className="img-fluid rounded-circle"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Schedule Content */}
      <Container className="mt-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading schedule...</p>
          </div>
        ) : (
          <Row>
            <Col lg={3} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-light fw-bold">
                  <FaFilter className="me-2" /> Filter by Track
                </Card.Header>
                <ListGroup variant="flush">
                  {tracks.map((track) => (
                    <ListGroup.Item
                      key={track.id}
                      action
                      onClick={() => setActiveTrack(track.id)}
                      active={activeTrack === track.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {track.label}
                      {track.id !== 'all' && (
                        <Badge bg={track.color} className="ms-2">
                          {meetings.filter(m => m.track === track.id && m.date.toDateString() === activeDay).length}
                        </Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>

            <Col lg={9}>
              <Tabs
                id="schedule-tabs"
                activeKey={activeDay}
                onSelect={(k) => setActiveDay(k)}
                className="mb-4"
                justify
              >
                {meetingDates.map((dateString) => (
                  <Tab
                    key={dateString}
                    eventKey={dateString}
                    title={new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  >
                    <Row>
                      {getFilteredSchedule().length > 0 ? (
                        getFilteredSchedule().map((session) => (
                          <Col md={12} key={session._id} className="mb-4">
                            <Card className={`shadow-sm border-start border-5 ${getSessionClass(session.type)}`}>
                              <Card.Body>
                                <Row className="align-items-center">
                                  <Col md={3} className="text-center">
                                    <p className="fw-bold mb-1">
                                      <FaClock className="me-1" />{session.startTime} - {session.endTime}
                                    </p>
                                    {session.reminder && (
                                      <small className="text-muted mt-1 d-block">
                                        <FaCalendarAlt className="me-1" />Reminder: {new Date(session.reminder).toLocaleString()}
                                      </small>
                                    )}
                                  </Col>
                                  <Col md={9}>
                                    <h5 className="fw-bold">
                                      {session.title}
                                      {getTrackBadge(session.track)}
                                    </h5>
                                    {session.speaker && (
                                      <p className="text-muted mb-0"><FaUser className="me-1" />{session.speaker}</p>
                                    )}
                                    {session.location && (
                                      <p className="text-muted mb-0"><FaMapMarkerAlt className="me-1" />{session.location}</p>
                                    )}
                                    {session.capacity && (
                                      <p className="text-muted mb-0">Capacity: {session.capacity}</p>
                                    )}
                                    <p className="mt-2">{session.description}</p>
                                    <div className="mt-3">
                                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEditModal(session)}>
                                        <FaEdit /> Edit
                                      </Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMeeting(session._id)}>
                                        <FaTrash /> Delete
                                      </Button>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col>
                          <Alert variant="info" className="text-center">
                            No meetings scheduled for this day or track.
                          </Alert>
                        </Col>
                      )}
                    </Row>
                  </Tab>
                ))}
              </Tabs>
            </Col>
          </Row>
        )}
      </Container>

      {/* Add/Edit Meeting Modal */}
      <Modal show={showMeetingModal} onHide={handleCloseMeetingModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Meeting' : 'Add New Meeting'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formMeetingTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newMeetingData.title}
                  onChange={handleMeetingFormChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingSpeaker">
                <Form.Label>Speaker</Form.Label>
                <Form.Control
                  type="text"
                  name="speaker"
                  value={newMeetingData.speaker}
                  onChange={handleMeetingFormChange}
                  placeholder="Optional"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formMeetingDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newMeetingData.description}
                onChange={handleMeetingFormChange}
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formMeetingDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={newMeetingData.date}
                  onChange={handleMeetingFormChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingStartTime">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="startTime"
                  value={newMeetingData.startTime}
                  onChange={handleMeetingFormChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingEndTime">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="endTime"
                  value={newMeetingData.endTime}
                  onChange={handleMeetingFormChange}
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formMeetingLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={newMeetingData.location}
                  onChange={handleMeetingFormChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingTrack">
                <Form.Label>Track</Form.Label>
                <Form.Control
                  as="select"
                  name="track"
                  value={newMeetingData.track}
                  onChange={handleMeetingFormChange}
                >
                  {tracks.filter(t => t.id !== 'all').map(track => (
                    <option key={track.id} value={track.id}>
                      {track.label}
                    </option>
                  ))}
                  <option value="">No Specific Track</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={newMeetingData.type}
                  onChange={handleMeetingFormChange}
                >
                  <option value="session">Session</option>
                  <option value="keynote">Keynote</option>
                  <option value="workshop">Workshop</option>
                  <option value="break">Break</option>
                  <option value="social">Social</option>
                  <option value="panel">Panel</option>
                </Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formMeetingReminder">
                <Form.Label>Reminder Date/Time (Optional)</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="reminder"
                  value={newMeetingData.reminder}
                  onChange={handleMeetingFormChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMeetingCapacity">
                <Form.Label>Capacity (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="capacity"
                  value={newMeetingData.capacity}
                  onChange={handleMeetingFormChange}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMeetingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveMeeting} disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Meeting' : 'Add Meeting')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Schedules;
