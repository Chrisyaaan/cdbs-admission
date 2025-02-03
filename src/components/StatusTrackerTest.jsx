import React from "react";
import check from "../assets/images/check.png";
import close from "../assets/images/close-2.svg";
import { useNavigate } from "react-router-dom";
import useAdmissionStore from "../store/admission/useAdmissionStore";
import arrowNext from "../assets/images/no1arrow-left.png";

function StatusTrackerTest({ data, selectedAdmissionIndex }) {
  const { db_admission_table, admission_id } = data;
  const {
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
    is_passed: isPassed,
  } = db_admission_table;

  const { setCurrentAdmissionId } = useAdmissionStore();

  const navigate = useNavigate();

  const isApplicationComplete = is_complete_view;
  const isApplicationPending = is_application_created && !is_complete_view;
  const isUploadComplete = is_all_required_file_uploaded;
  const isUploadPending = db_required_documents_table?.some(
    (doc) => doc.document_status === "pending"
  );
  const isUploadRejected = db_required_documents_table?.some(
    (doc) => doc.document_status === "rejected"
  );
  const isPaymentComplete = is_paid === true;
  const isPaymentPending = paymethod_id !== null && !is_paid;
  const isPendingAssessment = is_for_assessment && !is_final_result;
  const isAssessmentSelected = db_exam_admission_schedule?.length > 0;
  const isResultSent = is_final_result;

  const handleOpenApplicationForm = () => {
    if (
      (is_application_created && admission_status === "in review") ||
      admission_status === "complete" ||
      is_complete_view
    ) {
      return;
    }

    navigate("application-form");
  };

  const handleOpenUploadRequirement = () => {
    if(!isApplicationPending && isUploadComplete){
      return
    }

    navigate("application-requirement")
  }

  const handleOpenPay = () => {
    // if(!isUploadComplete || isApplicationPending){
    //   return
    // }

    navigate("application-payment")
  }

  const handleOpenSchedule = () => {
    // if(!isPaymentComplete) return;
    // if(isResultSent) return;

    navigate("assessment-schedule")
  }

  const timeLineStep = [
    {
      label: "Registration",
      title: "Register in the Admission Portal",
      subtitle: "admissionportal-cdbs.vercel.app",
      statusClassName: "border-greenAccent bg-greenAccent",
      descClassName: "text-greyAccent",
      isCompleted: true,
    },
    {
      label: "Application",
      title: "Fill-out Online Application Form",
      statusClassName: isApplicationComplete
        ? "border-greenAccent bg-greenAccent"
        : !isApplicationPending
        ? "border-yellowAccent bg-yellowAccent"
        : isApplicationPending && !isApplicationComplete
        ? "border-blueAccent bg-blueAccent"
        : "",
      isPending: isApplicationPending && !isApplicationComplete,
      isCompleted: isApplicationComplete,
      isWaiting: !isApplicationPending,
      onClick: handleOpenApplicationForm,
      link: {
        text: "View Application Form",
        url: "#",
      },
      step: 2,
    },
    {
      label: "Upload",
      title: "Upload Requirements",
      statusClassName: isUploadComplete
        ? "border-greenAccent bg-greenAccent"
        : !isUploadComplete && isApplicationPending && !isUploadPending
        ? "border-yellowAccent bg-yellowAccent"
        : isApplicationComplete ||
          (isApplicationPending && !isUploadComplete && isUploadPending)
        ? "border-blueAccent bg-blueAccent"
        : "",
      isPending: !isUploadComplete && isApplicationPending && !isUploadPending,
      isCompleted: isUploadComplete,
      isWaiting:
        isApplicationComplete ||
        (isApplicationPending && !isUploadComplete && isUploadPending),
      isRejected: isUploadRejected,
      step: 3,
      onClick: handleOpenUploadRequirement
    },
    {
      label: "Payment",
      title: "Pay Admission Fee",
      statusClassName: isPaymentComplete
        ? "border-greenAccent bg-greenAccent"
        : !isPaymentPending && isUploadComplete && isApplicationComplete
        ? "border-yellowAccent bg-yellowAccent"
        : isPaymentPending && !isPaymentComplete
        ? "border-blueAccent bg-blueAccent"
        : "bg-white",
      isPending: !isPaymentPending && isUploadComplete && isApplicationComplete,
      isCompleted: isPaymentComplete,
      isWaiting: isPaymentPending && !isPaymentComplete,
      step: 4,
      onClick: handleOpenPay
    },
    {
      label: "Assessment",
      title: "Select Schedule and Assessment Exam",
      subtitle: "Take Assessment Exam",
      statusClassName:
        isPendingAssessment || isResultSent
          ? "border-greenAccent bg-greenAccent"
          : !isAssessmentSelected && isPaymentComplete
          ? "border-yellowAccent bg-yellowAccent"
          : isAssessmentSelected && !isPendingAssessment
          ? "border-blueAccent bg-blueAccent"
          : "bg-white",
      isPending: !isAssessmentSelected && isPaymentComplete,
      isCompleted: isPendingAssessment || isResultSent,
      isWaiting: isAssessmentSelected && !isPendingAssessment,
      step: 5,
      onClick: handleOpenSchedule
    },
    {
      label: "Results",
      title: "Wait for Results",
      link: {
        text: "View Results",
        url: "#",
      },
      statusClassName:
        isResultSent && isPassed
          ? "border-greenAccent bg-greenAccent"
          : isPendingAssessment
          ? "border-yellowAccent bg-yellowAccent"
          : isResultSent && !isPassed
          ? "border-blueAccent bg-blueAccent"
          : "bg-white",
      isPending: isPendingAssessment,
      isCompleted: isResultSent && isPassed,
      isWaiting: isResultSent && !isPassed,
      step: 6,
    },
  ];

  return (
    <div className="mx-auto max-w-[50rem] min-w-[50rem] md:max-w-[70rem] md:min-w-[70rem] p-8 2xl:min-w-full 2xl:max-w-full">
      <div className="relative space-y-[8rem]">
        {timeLineStep.map((step, index) => (
          <div
            key={step.label}
            className="flex items-start gap-[4rem] md:gap-[9rem]"
          >
            {/* Label */}
            <div className="w-24 pt-1 text-[2rem] font-medium text-gray-600 hidden md:block">
              {step.label}
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              {index !== timeLineStep.length - 1 && (
                <div className="absolute left-[25px] top-[30px] h-[calc(100%+72px)] w-[1px] border-l border-dashed border-gray-300" />
              )}

              {/* Circle */}
              {step.isRejected ? (
                <div>
                  <div
                    className={`relative z-10 flex h-[5.2rem] w-[5.2rem] items-center justify-center rounded-full border border-redAccent bg-redAccent`}
                  >
                    <img src={close} className="w-8 h-8" />
                  </div>
                </div>
              ) : (
                <div
                  className={`relative z-10 flex h-[5.2rem] w-[5.2rem] items-center justify-center rounded-full border ${step.statusClassName}`}
                >
                  {step.isCompleted ? (
                    <img src={check} className="w-8 h-8" />
                  ) : step.isPending || step.isWaiting ? (
                    <img src={check} className="w-8 h-8" />
                  ) : (
                    <span className="text-[2rem] text-gray-600">
                      {step.step}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className={`flex flex-1 justify-between border-b border-b-black ${
                step.isCompleted ? "" : "cursor-pointer"
              }`}
              onClick={step.onClick}
            >
              <div className="flex flex-col">
                <h3
                  className={`${
                    step.isCompleted ? step.descClassName : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-[1.5rem] text-gray-500">{step.subtitle}</p>
                )}
                {step.link && (
                  <a
                    href={step.link.url}
                    className="mt-1 text-[1.5rem] text-blue-600 hover:text-blue-800"
                  >
                    {step.link.text}
                  </a>
                )}
              </div>
              {/* Arrow */}
              <div className="pt-1">
                <img
                  src={arrowNext}
                  className="h-[36px] w-[36px] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusTrackerTest;
