import React from "react";
import "./Calendar.css";

const Calendar = ({ currentMonth, onDateSelect, selectedDate }) => {
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();

  const weeks = [];
  let currentWeek = [];

  // Fill the first week with empty days
  for (let i = 0; i < firstDay.getDay(); i++) {
    currentWeek.push(null);
  }

  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => onDateSelect("prev")}>{"<"}</button>
        <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => onDateSelect("next")}>{">"}</button>
      </div>
      <div className="calendar-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => (
              <button
                key={dayIndex}
                className={`calendar-day ${
                  day
                    ? selectedDate?.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth()
                      ? "selected"
                      : ""
                    : "empty"
                }`}
                onClick={() => day && onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              >
                {day || ""}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
