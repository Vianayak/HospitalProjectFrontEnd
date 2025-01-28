import React, { Component } from 'react';
import './HealthcarePortal.css';

class HealthcarePortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(), // Current month/year
      selectedDate: new Date(), // Selected date
    };
  }

  handleDateClick = (day) => {
    const { currentDate } = this.state;
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0);
    this.setState({ selectedDate });
    this.props.setSelectedDate(selectedDate);
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
