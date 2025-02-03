import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import arrowNext from "../../../assets/images/no1arrow-left.png";
import arrowPrev from "../../../assets/images/arrowno1-left.png";

const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, date }) {
  const today = new Date();
  const isPrevDisabled = moment(date).isSameOrBefore(moment(today), "month");

  return (
    <div
      style={{
        display: "flex",
        gap: "5rem",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
        marginBottom: "60px",
      }}
    >
      {/* Back Arrow */}
      <img
        src={arrowPrev}
        alt="Previous"
        style={{
          cursor: isPrevDisabled ? "not-allowed" : "pointer",
          opacity: isPrevDisabled ? 0.5 : 1,
        }}
        onClick={() => !isPrevDisabled && onNavigate("PREV")}
      />
      <h2
        style={{
          margin: 0,
          fontWeight: "lighter",
          fontSize: "2.5rem",
          minWidth: "25rem",
          textAlign: "center",
          display: "inline-block",
          // backgroundColor: "red",
        }}
      >
        {label}
      </h2>
      {/* Next Arrow */}
      <img
        src={arrowNext}
        alt="Next"
        style={{ cursor: "pointer" }}
        onClick={() => onNavigate("NEXT")}
      />
    </div>
  );
}

function CustomToolbarCalendar({
  selectedDate,
  setSelectedDate,
  currentDate,
  setCurrentDate,
  availableDates,
  schedules,
  handleScheduleForDay,
}) {
  const today = new Date();

  const handleSelectDate = (slotInfo) => {
    // Only allow selection of today or future dates
    if (moment(slotInfo.start).isSameOrAfter(moment(today), "day")) {
      setSelectedDate(slotInfo.start);
      handleScheduleForDay(slotInfo.start);
    } else {
      alert("You can't select past dates");
    }
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const dayPropGetter = (date) => {
    const isPast = moment(date).isBefore(moment(today), "day");
    const isSelected = selectedDate && moment(date).isSame(selectedDate, "day");
    const formattedDate = date.toISOString().split("T")[0];
    // console.log(formattedDate);
    // console.log(availableDates);
    const isAvailable = availableDates.includes(formattedDate);
    return {
      className: "day",
      style: {
        backgroundColor: isSelected
          ? "#b5e2ff"
          : isPast
          ? "#e0e0e0" 
          : isAvailable
          ? "#4A7AB7"
          : "white",
        color: isSelected ? "white" : isPast ? "#a0a0a0" : "black",
        pointerEvents: isPast ? "none" : "auto",
        borderRadius: "4px", // Slightly rounded corners
        padding: "10px", // Padding for the cell
        textAlign: "left", // Align date numbers to the left
        display: "flex",
        alignItems: "flex-start", //
        justifyContent: "flex-start",
        margin: "2px",
        boxSizing: "border-box",
      },
    };
  };

  return (
    <div style={{ height: "600px", margin: "20px", marginTop: "3rem" }}>
      {/* <p>
        {selectedDate
          ? `Selected Date: ${moment(selectedDate).format("MMMM Do YYYY")}`
          : "No date selected yet."}
      </p> */}
      <Calendar
        localizer={localizer}
        selectable
        events={[]}
        defaultView="month"
        views={["month"]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 650 }}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectSlot={handleSelectDate}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: (props) => <CustomToolbar {...props} />,
        }}
      />
    </div>
  );
}

export default CustomToolbarCalendar;
