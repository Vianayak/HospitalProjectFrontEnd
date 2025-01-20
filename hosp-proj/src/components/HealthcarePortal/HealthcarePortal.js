import React, { Component } from 'react';
import './HealthcarePortal.css';

class HealthcarePortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
    };
  }

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

  renderCalendarDates = () => {
    const { currentDate } = this.state;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const dates = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      dates.push(i);
    }

    return dates;
  };

  render() {
    const { currentDate } = this.state;
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const dates = this.renderCalendarDates();

    return (
      <div className="healthcare-portal">
        {/* Patients Feedback Section */}
        <div className="patients-feedback">
          <h3>Patients Feedback</h3>
          <div className="feedback-row">
            <span>Excellent</span>
            <div className="progress-bar excellent"></div>
          </div>
          <div className="feedback-row">
            <span>Great</span>
            <div className="progress-bar great"></div>
          </div>
          <div className="feedback-row">
            <span>Good</span>
            <div className="progress-bar good"></div>
          </div>
          <div className="feedback-row">
            <span>Average</span>
            <div className="progress-bar average"></div>
          </div>
        </div>

        {/* Appointment Section */}
        <div className="appointments-section">
          <h3>Appointment Requests</h3>
          <div className="appointment-card">
            <img src="/Assets/Images/love.jpeg" alt="Maria" />
            <div>
              <span className="patient-name">Maria Sarafat</span>
              <span className="patient-issue">Cold</span>
            </div>
            <div className="appointment-actions">
              <button className="accept-btn">✔</button>
              <button className="reject-btn">✘</button>
              <button className="chat-btn">💬</button>
            </div>
          </div>
          <div className="appointment-card">
            <img src="/Assets/Images/love.jpeg" alt="John" />
            <div>
              <span className="patient-name">Jhon Deo</span>
              <span className="patient-issue">Over switting</span>
            </div>
            <div className="appointment-actions">
              <button className="accept-btn">✔</button>
              <button className="reject-btn">✘</button>
              <button className="chat-btn">💬</button>
            </div>
          </div>
          <a href="#see-all">See All</a>
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
            {dates.map((date, index) => (
              <span key={index} className="day">{date}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default HealthcarePortal;
