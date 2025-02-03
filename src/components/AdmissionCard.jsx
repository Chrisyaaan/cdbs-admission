import { useMemo } from "react";
import cn from "classnames";
import UserImage from "../assets/images/logo.png";

const AdmissionCard = ({ data, onClick, active }) => {
  // console.log(data);
  const { db_admission_table, application_id } = data;
  const {
    first_name,
    last_name,
    middle_name,
    admission_status,
    is_application_created,
    is_complete_view,
    is_all_required_file_uploaded,
    db_required_documents_table,
    is_for_assessment,
    is_final_result,
    db_exam_admission_schedule,
    is_paid,
    paymethod_id,
  } = db_admission_table;

  const hasMiddleName = middle_name !== "" && middle_name !== null;
  const hasFirstName = first_name !== "" && first_name !== null;
  const hasLastName = last_name !== "" && last_name !== null;

  const fullName = `${hasFirstName ? first_name : "No name"} ${
    hasMiddleName ? `${middle_name},` : ""
  } ${hasLastName ? last_name : ""}`;

  const statusText = useMemo(() => {
    console.log("GET STATUS TEXT RUNNING");

    if (
      is_application_created &&
      !is_complete_view &&
      admission_status === "in review"
    ) {
      return { text: "Application - In Review", color: "blue" };
    }

    if (
      !is_all_required_file_uploaded &&
      admission_status === "in review" &&
      db_required_documents_table?.length !== 0
    ) {
      return { text: "Requirements - In Review", color: "blue" };
    }

    if (is_for_assessment && !is_final_result) {
      return { text: "Results - Waiting", color: "blue" };
    }

    if (is_final_result) {
      return { text: "Results - Available", color: "green" };
    }

    if (db_exam_admission_schedule?.length > 0) {
      return { text: "Exam - Scheduled", color: "blue" };
    }

    if (
      is_application_created &&
      is_complete_view &&
      is_all_required_file_uploaded &&
      is_paid
    ) {
      return { text: "Schedule - Pending", color: "yellow" };
    }

    if (
      is_application_created &&
      is_complete_view &&
      is_all_required_file_uploaded &&
      paymethod_id !== null
    ) {
      return { text: "Payment - Pending", color: "blue" };
    }

    if (
      is_application_created &&
      is_complete_view &&
      is_all_required_file_uploaded
    ) {
      return { text: "Requirements - Complete", color: "green" };
    }

    if (!is_application_created || !is_all_required_file_uploaded) {
      return { text: "Application - In Progress", color: "yellow" };
    }

    if (is_application_created && is_complete_view) {
      return { text: "Application - Complete", color: "green" };
    }

    if (!is_paid && is_complete_view) {
      return { text: "Payment - In Progress", color: "yellow" };
    }

    if (db_required_documents_table?.length === 0) {
      return { text: "Requirements - In Progress", color: "yellow" };
    }

    return { text: "Application - In Progress", color: "yellow" };
  }, [
    admission_status,
    is_application_created,
    is_complete_view,
    is_all_required_file_uploaded,
    db_required_documents_table?.length,
    is_for_assessment,
    is_final_result,
    db_exam_admission_schedule?.length,
    is_paid,
    paymethod_id,
  ]);

  return (
    <div className="admission-card-container" onClick={onClick}>
      {/* Card Wrapper */}
      <div className={cn("admission-card-wrapper", {"bg-slate-300": active,})}>
        {/* Img Wrapper */}
        <div className="self-start">
          <img
            src={UserImage}
            alt=""
            className="object-cover max-w-full w-[10rem] h-[10rem]"
          />
        </div>
        {/* Card Detail Wrapper */}
        <div>
          <h3 className="admission-h3">{fullName}</h3>
          <h3 className="admission-h3">Application ID: {application_id} </h3>
          <h3 className="admission-h3 mt-4">
            Status:{" "}
            <span className={cn("admission-h3 mt-4", {
              "text-blue-500": statusText.color === "blue",
              "text-green-500": statusText.color === "green",
              "text-yellow-500": statusText.color === "yellow",
            })}>{statusText.text}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCard;
