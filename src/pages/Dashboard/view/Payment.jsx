import ApplicationHeader from "../../../components/ui/ApplicationHeader";
import UserImage from "../../../assets/images/logo.png";
import Wallet from "../../../assets/images/wallet.png";
import Bank from "../../../assets/images/unionbank.jpeg";
import useWatchBreakpoints from "../../../hooks/useWatchBreakPoints";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { IoCloseOutline } from "react-icons/io5";
import cn from "classnames";
import { useRef } from "react";
import usePaymentStore from "../../../store/admission/usePaymentStore";
import useAdmissionStore from "../../../store/admission/useAdmissionStore";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";

const Payment = () => {
  const isLg = useWatchBreakpoints("1024");
  const navigate = useNavigate();
  const {
    selectedUserAdmission,
    getUserSelectedData,
    isLoading: admissinLoading,
  } = useAdmissionStore();
  const {
    toggleIsPaying,
    isPaying,
    togglePaymentMethod,
    closeModal,
    pMethod,
    resetIsPaying,
    paymentForm,
    updatePaymentForm,
    handleSendPayment,
    resetPaymentForm,
    isLoading,
  } = usePaymentStore();
  const [successModal, setSuccessModal] = useState(false);

  const inputRef = useRef(null);
  const doc_file = selectedUserAdmission?.db_admission_table.payment_doc;
  const paymethod = selectedUserAdmission?.db_admission_table.paymethod_id;
  const reference_no = selectedUserAdmission?.db_admission_table.reference_no;
  const firstName = selectedUserAdmission?.db_admission_table.first_name;
  const lastName = selectedUserAdmission?.db_admission_table.last_name;
  const middleName = selectedUserAdmission?.db_admission_table?.middle_name
    ? selectedUserAdmission.db_admission_table.middle_name[0].toUpperCase()
    : "";
  const admissionId = selectedUserAdmission?.admission_id;
  const applicationId = selectedUserAdmission?.application_id;

  console.log(selectedUserAdmission);
  console.log(doc_file);

  console.log(paymethod);
  console.log(pMethod);

  const handleOnBack = () => {
    if (isPaying) return resetIsPaying();
    navigate(-1);
  };

  const handleRemoveFile = () => {
    updatePaymentForm("file", null);
  };

  const handleFileUploadClick = () => {
    inputRef.current.click(); // Open the file dialog
  };

  const handleMobilePayBtn = () => {
    toggleIsPaying();
  };

  const handleSubmitForm = async () => {
    console.log("Clicked");
    await handleSendPayment();
    closeModal();
    getUserSelectedData();
    setSuccessModal(true);
  };

  const handleOnCloseModal = () => {
    console.log("CLOSING");
    closeModal();
    resetPaymentForm();
    if (paymethod) {
      navigate("/dashboard");
    }
  };

  const handleSuccessCloseModal = () => {
    setSuccessModal(false);
    navigate("/dashboard");
  };

  const hasAllField =
    paymentForm.file instanceof File && // Ensures it's a valid file
    paymentForm.referenceNo.trim() !== "";

  const hasFile = paymentForm.file;

  const handleInputChange = (e) => {
    const value = e.target.value;
    updatePaymentForm("referenceNo", value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updatePaymentForm("file", file);
    }
  };

  useEffect(() => {
    getUserSelectedData();
  }, []);

  useEffect(() => {
    const paymentMethod =
      paymethod === 1 ? "cash" : paymethod === 2 ? "bank" : false;
    if (!successModal) togglePaymentMethod(paymentMethod);
  }, [paymethod]);

  // All rendering component
  const renderModal = () => {
    if (pMethod.cash) {
      return (
        <Modal
          onClose={handleOnCloseModal}
          className="!max-w-[40rem] !min-h-[40rem] !px-4"
          bodyContent={
            <div className="p-6 pb-2 space-y-4">
              <div className="flex justify-center flex-col items-center gap-2">
                <img
                  src={Wallet}
                  alt="Wallet Logo"
                  className="w-[10rem] h-[10rem]"
                />
                <h1 className="text-[2.25rem] font-bold text-center">
                  Payment Instructions for Admission Fee (Cash Payment)
                </h1>
              </div>
              <div className="px-6 space-y-6">
                <div className="li-payment text-center">
                  To complete the admission process, please follow these steps
                  for cash payment:
                </div>

                <ol className="list-decimal list-outside ml-4 space-y-2 text-sm">
                  <li className="li-payment">
                    Payment Location: Cashier, Caritas Don Bosco School Lobby
                  </li>
                  <li className="li-payment">
                    Payment Hours: Monday to Friday: 7:00 AM - 4:00; Saturday,
                    8:00AM - 12:00 PM.
                  </li>
                  <li className="li-payment">
                    A receipt will be issued as proof of payment. Please keep it
                    for reference.
                  </li>
                  <li className="li-payment">
                    Sales Invoice number must be accomplished after payment at
                    the cashier.
                  </li>
                </ol>
              </div>
            </div>
          }
          footerContent={
            <>
              <div className="space-y-2">
                <p className="text-[1.5rem] font-medium text-center">
                  Please enter Sales Invoice Number:
                </p>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={inputRef} // ADDED
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <input
                    value={paymentForm.referenceNo || reference_no || ""}
                    onChange={handleInputChange}
                    disabled={reference_no ? true : false}
                    className="w-[60%] py-[0.65rem] px-[1rem]  rounded-xl border text-[1rem] lg:text-[1.75rem]"
                  />
                  <button
                    className="bg-blueAccent rounded-xl w-[40%] text-white"
                    onClick={handleFileUploadClick}
                  >
                    Upload Proof of Payment
                  </button>
                </div>
                {hasFile && (
                  <div className="flex-center gap-2 mt-4">
                    <span className=" text-center text-greyAccent underline underline-offset-4">
                      {paymentForm.file.name}
                    </span>
                    <span className="cursor-pointer" onClick={handleRemoveFile}>
                      <IoCloseOutline />
                    </span>
                  </div>
                )}
              </div>

              {doc_file ? (
                <a
                  href={doc_file.replace(/[\[\]"]/g, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline"
                >
                  <span className="block mt-4 text-center text-greyAccent underline underline-offset-4">
                    View uploaded File
                  </span>
                </a>
              ) : (
                <button
                  className={cn(
                    "w-full mt-8 py-[1rem] rounded-xl text-white",
                    hasAllField ? "btn-blue" : "btn-grey"
                  )}
                  onClick={handleSubmitForm}
                >
                  Submit
                </button>
              )}
            </>
          }
        />
      );
    }

    if (pMethod.bank) {
      return (
        <Modal
          onClose={handleOnCloseModal}
          className="!max-w-[40rem] !min-h-[40rem] !px-4"
          bodyContent={
            <div className="p-6 pb-2 space-y-4">
              <div className="flex justify-center flex-col items-center gap-4">
                <img
                  src={Bank}
                  alt="UnionBank Logo"
                  className="w-[10rem] h-[10rem]"
                />
                <h1 className="text-[2.25rem] font-bold text-center">
                  Pay Through UnionBank Bills Payment
                </h1>
              </div>
              <div className="px-6 space-y-6">
                <ol className="list-decimal list-outside ml-4 space-y-7 text-sm">
                  <li className="li-payment">
                    Download the app through this link :{" "}
                    <a href="#" className="text-blue-600">
                      UnionBank
                    </a>
                  </li>
                  <li className="li-payment">
                    Once the UB account is created, go to "Pay Bills", "Select
                    Biller", and search "Caritas Don Bosco School".
                  </li>
                  <li className="li-payment">
                    The account will be ready to use for any CDBS transaction.
                  </li>
                  <li className="li-payment">
                    Once payment is made, kindly enter the reference number
                    below.
                  </li>
                  <li className="li-payment">
                    Sales Invoice number must be accomplished after payment.
                  </li>
                </ol>
              </div>
            </div>
          }
          footerContent={
            <>
              <div className="space-y-2">
                <p className="text-[1.5rem] font-medium text-center">
                  Please enter Reference Number:
                </p>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <input
                    value={paymentForm.referenceNo || reference_no || ""}
                    onChange={handleInputChange}
                    disabled={reference_no ? true : false}
                    className="w-[60%] py-[0.65rem] px-[1rem]  rounded-xl border text-[1rem] lg:text-[1.75rem]"
                  />
                  <button
                    onClick={handleFileUploadClick}
                    className="bg-blueAccent rounded-xl w-[40%] text-white"
                  >
                    Upload Proof of Payment
                  </button>
                </div>

                {hasFile && (
                  <div className="flex-center gap-2 mt-4">
                    <span className=" text-center text-greyAccent underline underline-offset-4">
                      {paymentForm.file.name}
                    </span>
                    <span className="cursor-pointer" onClick={handleRemoveFile}>
                      <IoCloseOutline />
                    </span>
                  </div>
                )}
              </div>

              {doc_file ? (
                <a
                  href={doc_file.replace(/[\[\]"]/g, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline"
                >
                  <span className="block mt-4 text-center text-greyAccent underline underline-offset-4">
                    View uploaded File
                  </span>
                </a>
              ) : (
                <button
                  className={cn(
                    "w-full mt-8 py-[1rem] rounded-xl text-white",
                    hasAllField ? "btn-blue" : "btn-grey"
                  )}
                  onClick={handleSubmitForm}
                >
                  Submit
                </button>
              )}
            </>
          }
        />
      );
    }
  };

  const studentInfo = (
    <div className="flex items-center justify-between mt-[2rem]">
      <div className="flex items-start gap-2 flex-col lg:flex-row">
        <img
          src={UserImage}
          alt=""
          className="object-cover max-w-full w-[5rem] h-[5rem]"
        />
        <div>
          {isLg && (
            <h3 className="capitalize">{`${firstName} ${
              middleName ? `${middleName}.` : ""
            } ${lastName}`}</h3>
          )}
          <h3>Application ID: {`${admissionId}-${applicationId}`}</h3>
        </div>
      </div>
      <button
        onClick={handleMobilePayBtn}
        className="btn-blue btn btn-add btn-applicant block xl:!hidden"
      >
        Pay
      </button>
    </div>
  );

  const summarySection = (
    <div className="pb-8 mx-[4rem] text-[2.25rem] font-bold border-b border-b-greyAccent mt-[4rem]">
      <p>Summary</p>
      <p className="flex justify-between text-[2.25rem] py-[1rem] px-[3rem]">
        <div>Admission Fee</div>
        <div>PhP 600.00</div>
      </p>
    </div>
  );

  const totalAmount = (
    <div className="total-amount-container">
      <p>Total Balance</p>
      <p id="total">PhP 600.00</p>
    </div>
  );

  const paymentMethods = (
    <div>
      <button
        className="flex items-center gap-8 border-b border-b-greyAccent p-4 w-full"
        onClick={() => togglePaymentMethod("cash")}
      >
        <img src={Wallet} alt="" className="object-cover w-[5rem] h-[5rem]" />
        <h1>Cash Payment</h1>
      </button>
      <button
        className="flex items-center gap-8 border-b border-b-greyAccent p-4 w-full"
        onClick={() => togglePaymentMethod("bank")}
      >
        <img src={Bank} alt="" className="object-cover w-[5rem] h-[5rem]" />
        <h1>UB Bills Payment</h1>
      </button>
    </div>
  );

  if (selectedUserAdmission === "") {
    navigate("/dashboard");
  }

  if (isLoading || admissinLoading) {
    return (
      <ReactLoading className="app-loader" type={"bubbles"} color="#012169" />
    );
  }

  return (
    <section className="h-screen section-container">
      <ApplicationHeader
        callBack={handleOnBack}
        title={isPaying && !isLg ? "Payment Method" : "Admission Fee Details"}
      />

      {successModal && (
        <Modal
          onClose={handleSuccessCloseModal}
          bodyContent={
            <div className="flex flex-col items-center gap-10">
              <div className="text-green-600">
                <CiCircleCheck size={124} />
              </div>
              <h2 className="text-[1.75rem] font-normal text-center">
                Payment Successful!
              </h2>
              <p className="text-gray-600 text-center font-extralight text-[1rem]">
                Funds transfer to Caritas Don Bosco School was successful.
              </p>
            </div>
          }
          footerContent={
            <div className="flex flex-col gap-4">
              <button className="w-full bg-blueAccent text-white py-2 rounded-md hover:bg-blue-700">
                <a
                  href={doc_file ? doc_file.replace(/[\[\]"]/g, "") : ""}
                  download="parent-questionnaire.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  Download Receipt
                </a>
              </button>
              <button
                onClick={handleSuccessCloseModal}
                className="w-full bg-greyAccent text-white py-2 rounded-md hover:bg-blue-700"
              >
                Back to Admission Process
              </button>
            </div>
          }
        ></Modal>
      )}

      {renderModal()}
      {/* Content Wrapper */}
      <div className={cn("relative", isLg && "flex h-screen")}>
        {isLg && (
          <div className="px-[2rem] w-50 border-r border-r-black border-b border-b-black mb-8">
            {studentInfo}
            {summarySection}
            {totalAmount}
          </div>
        )}

        {!isPaying && !isLg && (
          <div className="px-[2rem]">
            {studentInfo}
            {summarySection}
            {totalAmount}
          </div>
        )}

        {isLg && (
          <div className="w-50 px-4 py-2 border-b border-b-black mb-8">
            <h6 className="text-[1.75rem] font-extralight text-greyAccent my-4">
              Add payment method
            </h6>
            {paymentMethods}
          </div>
        )}

        {isPaying && !isLg && (
          <div className="absolute w-full h-full px-8">
            <h6 className="text-[1.75rem] font-extralight text-greyAccent my-4">
              Add payment method
            </h6>
            {paymentMethods}
          </div>
        )}
      </div>
    </section>
  );
};

export default Payment;
