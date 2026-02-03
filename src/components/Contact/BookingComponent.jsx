import { useState, useEffect } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import apiClient from "../../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Booking.css";

const BookingComponent = () => {
  const [availability, setAvailability] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    apiClient
      .get("/api/booking/availability")
      .then((res) => setAvailability(res.data));
  }, []);

  const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const availableSlots = availability.filter(
    (a) => a.day_of_week === dayOfWeek
  );

  const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    while (currentTime < endTime) {
      slots.push(
        currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    return slots;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    const [hour, minute] = selectedTime.split(":");
    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(hour, minute, 0, 0);

    try {
      await apiClient.post("/api/booking/bookings", {
        ...formData,
        time: finalDateTime.toISOString(),
        duration: selectedDuration,
      });
      setStatus({
        loading: false,
        success: "Booking request sent! Check your email for confirmation.",
        error: null,
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: "Failed to send booking.",
        success: null,
      });
    }
  };

  if (status.success) return <Alert variant="success">{status.success}</Alert>;

  return (
    <div className="booking-component">
      {step === 1 && (
        <>
          <h5 className="mb-4" style={{ color: "var(--text-primary)" }}>1. Select a Date & Time</h5>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
          />
          <div className="time-slots-container mt-4">
            <h6 style={{color: "var(--text-secondary)", marginBottom: "10px"}}>Available Slots for {dayOfWeek}</h6>
            <div className="time-slots">
              {availableSlots.length > 0 ? (
                generateTimeSlots(
                  availableSlots[0].start_time,
                  availableSlots[0].end_time,
                  30
                ).map((slot) => (
                  <button
                    key={slot}
                    className={selectedTime === slot ? "time-slot-selected" : ""}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>No slots available for this day.</p>
              )}
            </div>
          </div>
          <Button
            onClick={() => setStep(2)}
            disabled={!selectedTime}
            className="mt-4 w-100 theme-button"
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <Form onSubmit={handleBookingSubmit}>
          <h5 className="mb-4" style={{ color: "var(--text-primary)" }}>2. Your Details</h5>
          {status.error && <Alert variant="danger">{status.error}</Alert>}
          <p className="text-secondary mb-4">
            You are booking a <strong>{selectedDuration} minute</strong> session
            on <strong>{selectedDate.toLocaleDateString()}</strong> at{" "}
            <strong>{selectedTime}</strong>.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={() => setStep(1)} style={{border: "1px solid var(--border-color)", color: "var(--text-primary)"}}>
              Back
            </Button>
            <Button
              type="submit"
              className="w-100 theme-button"
              disabled={status.loading}
            >
              {status.loading ? <Spinner size="sm" /> : "Confirm Booking"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default BookingComponent;
