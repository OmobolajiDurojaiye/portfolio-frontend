import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import apiClient from "../../services/api";

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    await apiClient.post("/api/booking/admin/availability", data);
    fetchData();
    e.target.reset();
  };

  const handleDeleteAvailability = async (id) => {
    await apiClient.delete(`/api/booking/admin/availability/${id}`);
    fetchData();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={7}>
          <h3>Booking Requests</h3>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Client</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.meeting_time).toLocaleString()}</td>
                  <td>
                    {b.client_name} (
                    <a href={`mailto:${b.client_email}`}>{b.client_email}</a>)
                  </td>
                  <td>{b.meeting_duration} min</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={5}>
          <h3>Set Your Availability</h3>
          <Form onSubmit={handleAddAvailability} className="mb-4">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Day</Form.Label>
                  <Form.Select name="day_of_week" required>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <Form.Control type="time" name="start_time" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control type="time" name="end_time" required />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="mt-3 w-100">
              Add Slot
            </Button>
          </Form>
          <Table striped bordered hover variant="dark" size="sm">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map((a) => (
                <tr key={a.id}>
                  <td>{a.day_of_week}</td>
                  <td>
                    {a.start_time} - {a.end_time}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteAvailability(a.id)}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default BookingManager;
