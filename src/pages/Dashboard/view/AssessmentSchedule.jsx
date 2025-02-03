import React from "react";
import ApplicationHeader from "../../../components/ui/ApplicationHeader";
import BigCalender from "../../../components/BigCalender";
import useExamScheduleStore from "../../../store/admission/useExamScheduleStore";
import { useEffect } from "react";
import useAdmissionStore from "../../../store/admission/useAdmissionStore";
import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { convertMilitaryToAMPM } from "../../../utils";
import Button from "../../../components/ui/Button";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { PiXCircleThin } from "react-icons/pi";

const ScheduleItem = ({
  scheduleId,
  timeStart,
  timeEnd,
  location,
  handleSelectedTime,
  handleScheduleDetails,
  date,
  isSelected,
}) => {
  const formDate = new Date(date);
  function convertMilitaryToAMPM(militaryTime) {
    const [hours, minutes] = militaryTime.split(":").map(Number);

    // Create a Date object with the given time (assuming today's date)
    const date = new Date();
    date.setHours(hours, minutes);

    // Use toLocaleString to format the time in 12-hour AM/PM format
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  }

  return (
    <button
      className={`w-full px-4 py-3 border-b border-greyAccent mb-4 transition duration-200 ease-in-out
      ${
        isSelected
          ? "bg-blueAccent text-white font-bold !border-[3px] !border-yellowAccent"
          : "bg-white text-black"
      }`}
      onClick={() => {
        handleScheduleDetails({
          scheduleId,
          timeStart: convertMilitaryToAMPM(timeStart),
          timeEnd: convertMilitaryToAMPM(timeEnd),
          location,
          date: formDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
        handleSelectedTime();
      }}
    >
      <span className="text-[1.55rem] font-light">
        {`${convertMilitaryToAMPM(timeStart)}`} -{" "}
        {`${convertMilitaryToAMPM(timeEnd)}`}
      </span>
    </button>
  );
};

const AssessmentSchedule = () => {
  const {
    getExamSchedule,
    examSchedules,
    selectedDate,
    toggleUpdateScheduleDetail,
    scheduleForSelectedDay,
    handleReserveDate,
    scheduleDetails,
    toggleUpdateScheduleForSelectedDay,
    isLoading,
  } = useExamScheduleStore();
  const {
    selectedUserAdmission,
    getUserSelectedData,
    isLoading: admissionLoading,
  } = useAdmissionStore();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showReschedModal, setShowReschedModal] = useState(true);
  const navigate = useNavigate();

  const levelApplyingFor =
    selectedUserAdmission?.db_admission_table?.level_applying_for;
  const existedExamSchedule =
    selectedUserAdmission?.db_admission_table.db_exam_admission_schedule;
  const exam_date =
    existedExamSchedule[0]?.db_exam_schedule_table?.exam_date ?? "";
  const start_time =
    existedExamSchedule[0]?.db_exam_schedule_table?.start_time ?? "";
  const end_time =
    existedExamSchedule[0]?.db_exam_schedule_table?.end_time ?? "";
  const location =
    existedExamSchedule[0]?.db_exam_schedule_table?.location ?? "";

  const handleScheduleForDay = (day) => {
    // console.log(day);
    const date = new Date(day);
    const formattedDate = date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
    const finalDate = formattedDate.replaceAll("-", "-");
    console.log(finalDate);
    toggleUpdateScheduleForSelectedDay(
      examSchedules.filter((el) => el["exam_date"] == finalDate)
    );
    console.log(levelApplyingFor);
  };

  const handleOnBack = () => {
    // if (isPaying) return resetIsPaying();
    navigate(-1);
  };
  const handleShowCalendarModal = () => {
    setShowScheduleModal((prev) => !prev);
  };

  const handleSelectedTime = (index) => {
    console.log("Selected Index:", index);
    setSelectedTime(index); // Update the selected index
  };

  const handleCloseExistingSchedule = () => {};

  const submitReserveDate = async () => {
    const response = await handleReserveDate(
      scheduleDetails.scheduleId,
      levelApplyingFor
    );
  };

  useEffect(() => {
    getUserSelectedData();
    getExamSchedule(levelApplyingFor);
  }, []);

  console.log(selectedTime);

  if (isLoading || admissionLoading) {
    return (
      <ReactLoading className="app-loader" type={"bubbles"} color="#012169" />
    );
  }

  return (
    <section className="h-screen section-container !overflow-visible lg:!overflow-y-auto">
      <ApplicationHeader
        callBack={handleOnBack}
        title={"Assessment Exam Schedule"}
        footer={
          <>
            <button
              className={`px-[2.5em] py-2 rounded-[10px]  ${
                selectedTime !== null
                  ? "bg-blueAccent text-white"
                  : "bg-[#D9D9D9] text-white"
              }`}
              onClick={() => setShowScheduleModal((prev) => !prev)}
            >
              <span className="text-[1.55rem]">Confirm</span>
            </button>
          </>
        }
      />

      {existedExamSchedule.length === 0 && (
        <Modal
          // onClose={handleSuccessCloseModal}
          bodyContent={
            <div className="flex flex-col items-center gap-10">
              <div className="text-redAccent">
                <PiXCircleThin size={124} />
              </div>
              <h2 className="text-[1.75rem] font-normal text-center">
                No Available Schedule Yet
              </h2>
              <p className="text-gray-600 text-center font-extralight text-[1rem]">
                Please wait for further announcements and updates for the next
                available schedule. Thank you.
              </p>
            </div>
          }
          footerContent={
            <div className="flex flex-col gap-4">
              <button
                // onClick={handleSuccessCloseModal}
                className="w-full bg-blueAccent text-white py-2 rounded-md hover:bg-blue-700"
              >
                Back to Admission Process
              </button>
            </div>
          }
        ></Modal>
      )}

      {existedExamSchedule.length > 0 && (
        <Modal
          bodyContent={
            <div>
              <h1 className="text-center text-[2.25rem] font-bold mb-4">
                Your Assessment Exam Schedule:{" "}
              </h1>
              <div className="flex flex-col gap-4 items-center ">
                <h3 className="text-[1.55rem]">
                  Date: <strong>{exam_date ? exam_date : ""}</strong>
                </h3>
                <h3 className="text-[1.55rem]">
                  Time:{" "}
                  <strong>
                    {convertMilitaryToAMPM(start_time)} -{" "}
                    {convertMilitaryToAMPM(end_time)}
                  </strong>
                </h3>
                <h3 className="text-[1.55rem]">
                  Location: <strong>{location}</strong>
                </h3>
              </div>

              <div className="flex flex-col gap-2 mt-12">
                {/* <button>Ok, got it!</button>
                <button>Reschedule</button> */}
                <Button
                  body="Ok, got it!"
                  className="bg-blueAccent text-white font-light !text-[1.25rem] rounded-none p-[0.55rem] hover:bg-opacity-75"
                />
                <Button
                  body="Reschedule"
                  className="bg-redAccent text-white font-light !text-[1.25rem] rounded-none p-[0.55rem] hover:bg-opacity-75"
                />
              </div>
            </div>
          }
        />
      )}

      {showScheduleModal && (
        <Modal
          onClose={handleShowCalendarModal}
          bodyContent={
            <div className="payment-box">
              {/* <img src={wallet} className="logo-verification" /> */}
              <h1>Are you sure you want to select this exam schedule?</h1>
              <h3>
                Date: <strong>{scheduleDetails.date}</strong>
              </h3>
              <h3>
                Time:{" "}
                <strong>
                  {scheduleDetails.timeStart}-{scheduleDetails.timeEnd}
                </strong>
              </h3>
              <h3>
                Location: <strong>{scheduleDetails.location}</strong>
              </h3>
            </div>
          }
          footerContent={
            <>
              <button
                className="btn btn-blue"
                onClick={async () => {
                  await submitReserveDate();
                  // reserveDate(
                  //   scheduleDetails.scheduleId,
                  //   admissions["admissionsArr"][dataIndex]["db_admission_table"][
                  //     "level_applying_for"
                  //   ]
                  // );
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-grey"
                onClick={handleShowCalendarModal}
              >
                No
              </button>
            </>
          }
        />
      )}

      {existedExamSchedule.length > 0 && showReschedModal && (
        <Modal
          bodyContent={
            <div>
              <h1>Cancel this schedule ?</h1>
              <h3>
                Date: <strong>{exam_date ? exam_date : ""}</strong>
              </h3>
              <h3>
                Time:{" "}
                <strong>
                  {convertMilitaryToAMPM(start_time)} -{" "}
                  {convertMilitaryToAMPM(end_time)}
                </strong>
              </h3>
              <h3>
                <span
                  style={{
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    display: "flex",
                    color: "grey",
                    fontSize: "1.35rem",
                  }}
                >
                  Reason for cancellation:
                </span>

                <textarea rows={5} className="form-control"></textarea>
              </h3>
            </div>
          }
        />
      )}

      {/* Content Container */}
      <div className="lg:flex ">
        <div className="p-8 w-full lg:w-full border-r border-r-black">
          <BigCalender handleScheduleForDay={handleScheduleForDay} />
        </div>
        {/* Schedule selection */}
        <div className="w-full lg:w-full px-4">
          <h3 className="block text-start my-4 border-b border-b-greyAccent font-light">
            Time
          </h3>
          <>
            {selectedDate === null ? (
              <h2>Please select a date</h2>
            ) : scheduleForSelectedDay.length === 0 ? (
              <h2 className="time-no-date-header">
                No available schedules for this date
              </h2>
            ) : (
              <>
                {scheduleForSelectedDay.map((sched, idx) => (
                  <ScheduleItem
                    handleSelectedTime={() => handleSelectedTime(idx)}
                    scheduleId={sched.schedule_id}
                    key={sched.schedule_id}
                    timeStart={sched.start_time}
                    timeEnd={sched.end_time}
                    location={sched.location}
                    handleScheduleDetails={toggleUpdateScheduleDetail}
                    date={sched.exam_date}
                    isSelected={selectedTime === idx}
                  />
                ))}
              </>
            )}
          </>
        </div>
      </div>
    </section>
  );
};

export default AssessmentSchedule;
