import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import arrowNext from "../assets/images/no1arrow-left.png";
import arrowPrev from "../assets/images/arrowno1-left.png";
import { useState } from "react";
import { assembleWeekEventsByName, computeWeeks } from "../utils";
import useExamScheduleStore from "../store/admission/useExamScheduleStore";

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, date }) => {
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
};

const BigCalender = ({handleScheduleForDay}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {toggleSelectedDate, selectedDate, availableDates} = useExamScheduleStore()
  const today = new Date();
  const handleNavigate = (date) => {
    setCurrentDate(date);
  };


  // Months Components
  const MonthView = ({ date, events = [] }) => {
    const weeks = computeWeeks(date);

    return (
      <div
        className="rbc-month-view"
        style={{
          gridTemplateRows: `auto repeat(${weeks.length}, 1fr)`,
        }}
      >
        <MonthHeader />
        {weeks.map((week) => (
          <MonthRow
            key={week[0].toString()}
            date={date}
            events={events}
            week={week}
          />
        ))}
      </div>
    );
  };

  MonthView.title = (date) => {
    return `${localizer.format(date, "MMMM YYYY")}`;
  };

  MonthView.navigate = (date, action) => {
    switch (action) {
      case "PREV":
        return moment(date).subtract(1, "month").toDate();
      case "NEXT":
        return moment(date).add(1, "month").toDate();
      default:
        return date;
    }
  };

  const MonthRow = ({ date, events, week }) => {
    return (
      <div className="rbc-month-row">
        <MonthRowBackground week={week} date={date} />
        {/* <MonthRowContent week={week} events={events} /> */}
      </div>
    );
  };

  const MonthRowBackground = ({ week, date }) => {
    return (
      <div className="rbc-row-bg items-center">
        {week.map((day, dayIndex) => (
          <Day key={dayIndex} date={date} day={day} selectedDate={selectedDate} toggleSelectedDate={toggleSelectedDate} />
        ))}
      </div>
    );
  };

  const MonthHeader = () => {
    const weekDays = moment.weekdays().slice(1, 6);
    return (
      <div className="rbc-month-header">
        {weekDays.map((day, index) => (
          <div key={index} className="rbc-header !font-light ">
            {day === "Thursday" ? "Th" : day.charAt(0)}
          </div>
        ))}
      </div>
    );
};

  const Day = ({ date, day, selectedDate, toggleSelectedDate }) => {
    const formattedDate = moment(day).format("YYYY-MM-DD"); // Ensure correct format

  
    const isAvailable = availableDates.some(date => moment(date).isSame(formattedDate, "day"));
    const isSelected = selectedDate && moment(day).isSame(selectedDate, "day");
    const isPast = moment(day).isBefore(moment(today), "day");
    const isToday = moment(day).isSame(moment().startOf("day"));
    const isOutsideMonth =
      moment(day).isBefore(moment(date).startOf("month")) ||
      moment(day).isAfter(moment(date).endOf("month"));

    const handleClick = () => {
      if(moment(day).isSameOrAfter(moment(today), "day")){
        console.log("NOT PAST")
        toggleSelectedDate(day); // ✅ Update selected date
        handleScheduleForDay(day)
      } else {
        alert("You can't select past dates")
      }
    };

    const dayClassName = `rbc-day-bg w-[6.75rem] h-[9rem] font-light cursor-pointer hover:opacity-[0.7] text-[1.55rem] rounded-[11px] flex m-[2px] justify-center !box-border xl:h-[70%] xl:text-[2rem] ${
      // isToday ? "bg-blue-50 text-blue-500" : ""
      isSelected
        ? "bg-blueAccent text-white !border-[4px] !border-yellowAccent"
        : isPast
        ? "bg-[#e0e0e0] !border-0 text-greyAccent"
        : isAvailable
        ? "bg-blueAccent text-white"
        : "bg-[#e0e0e0]"
    } ${isOutsideMonth ? "text-gray-200 !bg-white" : ""} ${
      isSelected ? "white" : isPast ? "#a0a0a0" : "black"
    }`;

    return (
      <div key={day.toISOString()} className={dayClassName} onClick={handleClick}>
        {day.getDate().toString().padStart(2, "0")}
      </div>
    );
  };



  return (
    <div className="h-[85vh]">
      {/* <h2 style={{ textAlign: "center" }}>{moment().format("MMMM YYYY")}</h2> */}
      <Calendar
        localizer={localizer}
        events={[]}
        date={currentDate}
        onNavigate={handleNavigate}
        startAccessor="start"
        endAccessor="end"
        components={{
          toolbar: (props) => <CustomToolbar {...props} />,
        }}
        views={{
          month: MonthView,
        }}
        selectable={true}
        onSelectEvent={(event) => toggleSelectedDate(event.start)}
        
      />
    </div>
  );
};

export default BigCalender;
