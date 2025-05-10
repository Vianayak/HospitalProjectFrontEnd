import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const NurseCalendar = ({ requests, onEventClick }) => {
  const events = requests.map((req) => ({
    title: `${req.name} - ${req.reason}`,
    start: new Date(`${req.date}T${req.time}`),
    end: new Date(`${req.date}T${req.time}`),
    ...req,
  }));

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Calendar View of Appointments</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={onEventClick}
      />
    </div>
  );
};

export default NurseCalendar;
