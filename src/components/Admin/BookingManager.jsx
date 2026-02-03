import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaUser, FaTrash, FaPlus, FaEnvelope } from "react-icons/fa";
import apiClient from "../../services/api";

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSlot, setShowAddSlot] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsRes, availRes] = await Promise.all([
        apiClient.get("/api/booking/admin/bookings"),
        apiClient.get("/api/booking/admin/availability"),
      ]);
      setBookings(bookingsRes.data);
      setAvailabilities(availRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    try {
        await apiClient.post("/api/booking/admin/availability", data);
        fetchData();
        setShowAddSlot(false);
    } catch (err) {
        alert("Failed to add slot");
    }
  };

  const handleDeleteAvailability = async (id) => {
    if(!window.confirm("Delete this slot?")) return;
    try {
        await apiClient.delete(`/api/booking/admin/availability/${id}`);
        fetchData();
    } catch (err) {
        alert("Failed to delete slot");
    }
  };

  if (loading) return (
      <div className="d-flex justify-content-center align-items-center" style={{height: "50vh"}}>
          <Spinner animation="border" variant="primary" />
      </div>
  );

  // Group availabilities by day
  const groupedAvailability = availabilities.reduce((acc, curr) => {
    if (!acc[curr.day_of_week]) acc[curr.day_of_week] = [];
    acc[curr.day_of_week].push(curr);
    return acc;
  }, {});

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="booking-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="text-white fw-bold mb-1">Bookings & Availability</h2>
            <p className="text-secondary mb-0">Manage client sessions and your schedule.</p>
        </div>
        <Button onClick={() => setShowAddSlot(true)} variant="primary" className="d-flex align-items-center gap-2">
            <FaPlus size={14} /> Add Time Slot
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {/* Left Column: Bookings List */}
        <Col lg={8}>
            <Card className="bg-dark border-secondary h-100">
                <Card.Header className="bg-transparent border-secondary py-3">
                    <h5 className="text-white mb-0 fw-bold">Upcoming Sessions</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {bookings.length === 0 ? (
                        <div className="text-center py-5">
                            <FaCalendarAlt size={32} className="text-secondary opacity-50 mb-3" />
                            <p className="text-secondary">No bookings found.</p>
                        </div>
                    ) : (
                        <div className="booking-list">
                            {bookings.map((b) => (
                                <div key={b.id} className="p-3 border-bottom border-secondary hover-bg-light-dark transition-all">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex gap-3">
                                            <div className="avatar-placeholder rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px"}}>
                                                <FaUser size={20} />
                                            </div>
                                            <div>
                                                <h6 className="text-white fw-bold mb-1">{b.client_name}</h6>
                                                <div className="text-secondary small d-flex flex-column gap-1">
                                                    <span className="d-flex align-items-center gap-2">
                                                        <FaClock size={12} /> 
                                                        {new Date(b.meeting_time).toLocaleString(undefined, {
                                                            weekday: 'short', 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            hour: '2-digit', 
                                                            minute: '2-digit'
                                                        })}
                                                        <Badge bg="secondary" className="text-dark bg-opacity-25 ms-2">{b.meeting_duration} min</Badge>
                                                    </span>
                                                    <a href={`mailto:${b.client_email}`} className="text-decoration-none text-info d-flex align-items-center gap-2 mt-1">
                                                        <FaEnvelope size={12} /> {b.client_email}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge bg={b.status === 'confirmed' ? 'success' : 'warning'} text="white" className="text-uppercase">
                                            {b.status}
                                        </Badge>
                                    </div>
                                    {b.message && (
                                        <div className="mt-3 bg-black bg-opacity-25 p-2 rounded small text-secondary fst-italic">
                                            "{b.message}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Col>

        {/* Right Column: Availability */}
        <Col lg={4}>
            <Card className="bg-dark border-secondary">
                <Card.Header className="bg-transparent border-secondary py-3">
                    <h5 className="text-white mb-0 fw-bold">Weekly Schedule</h5>
                </Card.Header>
                <Card.Body>
                    {daysOrder.map(day => (
                        <div key={day} className="mb-4 last-mb-0">
                            <h6 className="text-secondary text-uppercase small fw-bold mb-2 ls-1">{day}</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {groupedAvailability[day]?.length > 0 ? (
                                    groupedAvailability[day].map(slot => (
                                        <div key={slot.id} className="availability-chip d-flex align-items-center gap-2 bg-darker border border-secondary rounded-pill px-3 py-1 text-white small">
                                            <span>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                                            <button 
                                                onClick={() => handleDeleteAvailability(slot.id)}
                                                className="btn btn-link p-0 text-danger opacity-50 hover-opacity-100 d-flex"
                                                title="Remove slot"
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-secondary small fst-italic opacity-50">Unavailable</span>
                                )}
                            </div>
                        </div>
                    ))}
                </Card.Body>
            </Card>
        </Col>
      </Row>

      {/* Add Slot Modal */}
      <Modal show={showAddSlot} onHide={() => setShowAddSlot(false)} centered contentClassName="bg-dark border-secondary text-white">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title>Add Availability</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAvailability}>
            <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Day of Week</Form.Label>
                  <Form.Select name="day_of_week" required className="bg-darker text-white border-secondary">
                    {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
                  </Form.Select>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control type="time" name="start_time" required className="bg-darker text-white border-secondary" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>End Time</Form.Label>
                          <Form.Control type="time" name="end_time" required className="bg-darker text-white border-secondary" />
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="border-secondary">
                <Button variant="outline-secondary" onClick={() => setShowAddSlot(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Slot</Button>
            </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingManager;
