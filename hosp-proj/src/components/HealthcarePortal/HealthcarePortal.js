import React, { Component } from 'react';
import './HealthcarePortal.css';

class HealthcarePortal extends Component {
  constructor(props) {  
    super(props);  
    const today = new Date();  
    this.state = {  
      currentDate: today, // Current month/year  
      selectedDate: today, // Initially selected date  
    };  
  }  

  handleDateClick = (day) => {  
    const { currentDate } = this.state;  
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);  
    this.setState({ selectedDate });  

    if (this.props.setSelectedDate) {  
      this.props.setSelectedDate(selectedDate);  
    }  
  };  

  handleNextMonth = () => {  
    this.setState((prevState) => ({
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() + 1, 1),
    }));
  };  

  handlePreviousMonth = () => {  
    this.setState((prevState) => ({
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() - 1, 1),
    }));
  };  

  renderCalendarDates = () => {  
    const { currentDate, selectedDate } = this.state;  
    const year = currentDate.getFullYear();  
    const month = currentDate.getMonth();  
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1);  
    const lastDayOfMonth = new Date(year, month + 1, 0);  
    const startDayOfWeek = firstDayOfMonth.getDay();  

    const dates = [];  
    for (let i = 0; i < startDayOfWeek; i++) {  
      dates.push(<span key={`empty-${i}`} className="day empty"></span>);  
    }  

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {  
      const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;  
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
