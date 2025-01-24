import React, { Component } from 'react';
import './HealthcarePortal.css';

class HealthcarePortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [], // Holds appointment data
      currentDate: new Date(), // Current month/year
      selectedDate: new Date(), // Selected date
      doctorDetails: null, // Holds doctor details from localStorage
    };
  }

  componentDidMount() {
    // Load doctor details from localStorage
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      this.setState({ doctorDetails: JSON.parse(storedDoctorDetails) }, () => {
        this.fetchAppointments(this.state.selectedDate);
      });
    }
  }

  fetchAppointments = async (date) => {
    const { doctorDetails } = this.state;
    if (!doctorDetails) {
      console.error("Doctor details are not available.");
      return;
    }

    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const doctorRegNum = doctorDetails.regestrationNum; // Assuming "registrationNum" is the correct key

    const apiUrl = `http://localhost:8081/api/book-appointment/appointments-with-issues?date=${formattedDate}&doctorRegNum=${doctorRegNum}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      this.setState({ appointments: data });
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };

  handleDateClick = (day) => {
    const { currentDate } = this.state;
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0);
    this.setState({ selectedDate }, () => {
      this.fetchAppointments(selectedDate);
    });
  };

  handleNextMonth = () => {
    const { currentDate } = this.state;
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    this.setState({ currentDate: nextMonth });
  };

  handlePreviousMonth = () => {
    const { currentDate } = this.state;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    this.setState({ currentDate: prevMonth });
  };

  handleStatusUpdate = async (appointmentId, status) => {
    // Append status as a query parameter
    const apiUrl = `http://localhost:8081/api/book-appointment/${appointmentId}/?status=${status}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Headers can remain as they are
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Fetch updated appointments after status change
      this.fetchAppointments(this.state.selectedDate);
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  

  renderAppointments = () => {
    const { appointments } = this.state;

    if (!appointments.length) {
      return <p>No appointment requests available for the selected date.</p>;
    }

    return appointments.map((appointment, index) => (
      <div key={index} className="appointment-card">
        <div>
          <span className="patient-name">
            {appointment.firstName} {appointment.lastName}
          </span>
          <div className="patient-issue">
            {appointment.issues.join(', ')}
          </div>
        </div>
        <div className="appointment-actions">
        <button
    className="accept-btn"
    onClick={() => this.handleStatusUpdate(appointment.appointmentId, "ACCEPTED")}
  >
    ✔
  </button>
  <button
    className="reject-btn"
    onClick={() => this.handleStatusUpdate(appointment.appointmentId, "REJECTED")}
  >
    ✘
  </button>
        </div>
      </div>
    ));
  };

  renderCalendarDates = () => {
    const { currentDate, selectedDate } = this.state;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)

    const dates = [];
    // Add empty placeholders for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      dates.push(<span key={`empty-${i}`} className="day empty"></span>);
    }

    // Add actual dates of the month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month;
      dates.push(
        <span
          key={i}
          className={`day ${isSelected ? 'selected' : ''}`}
          onClick={() => this.handleDateClick(i)}
        >
          {i}
        </span>
      );
    }

    return dates;
  };

  render() {
    const { currentDate } = this.state;
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
      <div className="healthcare-portal">
        {/* Appointment Section */}
        <div className="appointments-section">
          <h3>Appointment Requests</h3>
          {this.renderAppointments()}
        </div>

        {/* Calendar Section */}
        <div className="calendar-widget">
          <h3>Calendar</h3>
          <div className="calendar-header">
            <button onClick={this.handlePreviousMonth} className="prev-month-btn">&lt;</button>
            <span className="current-month">{monthName} - {year}</span>
            <button onClick={this.handleNextMonth} className="next-month-btn">&gt;</button>
          </div>
          <div className="weekdays-row">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
            <span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="days-grid">
            {this.renderCalendarDates()}
          </div>
        </div>

    
      </div>
    );
  }
}

export default HealthcarePortal;
