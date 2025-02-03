import React, { useEffect } from "react";
import ApplicationHeader from "../../../components/ui/ApplicationHeader";
import Button from "../../../components/ui/Button";
import useAdmissionStore from "../../../store/admission/useAdmissionStore";
import RequirementTest from "../components/RequirementTest";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import parentQuestionnaire from "../../../assets/documents/parent-questionnaire.pdf";
import recommendTeacher from "../../../assets/documents/recommendation-teacher.pdf";
import recommendSchoolHead from "../../../assets/documents/recommendation-counselor-school-head.pdf";
import useAdmissionRequirementStore from "../../../store/admission/useRequirementStore";
import Modal from "../../../components/ui/Modal";
import { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";

const Requirements = () => {
  const {
    getUserSelectedData,
    isLoading,
    selectedUserAdmission,
    currentAdmissionId,
  } = useAdmissionStore();
  const { handleUploadFiles, setRejectedIds, resetRequirements, requirements, isLoading: requirementLoading } =
    useAdmissionRequirementStore();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    console.log("SELECTED USER ADMISSION: ");
    console.log(selectedUserAdmission);
    getUserSelectedData();
    // handleRejectRequirements()
  }, []);

  const jsh = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
  const shs = ["Grade 11", "Grade 12"];

  const isKinder =
    selectedUserAdmission?.db_admission_table?.level_applying_for ===
      "Pre-Kinder" ||
    selectedUserAdmission?.db_admission_table?.level_applying_for === "Kinder";

  const levelApplying =
    selectedUserAdmission?.db_admission_table?.level_applying_for;

  const isCatholic =
    selectedUserAdmission?.db_admission_table?.religion === "Roman Catholic";
  const isFilipino =
    selectedUserAdmission?.db_admission_table?.citizenship === "Filipino";

  const isJhs = jsh.includes(levelApplying);
  const isShs = shs.includes(levelApplying);

  // console.log(currentAdmissionId)

  const isAllFilesUploaded = () => {
    // Define the requirements to exclude or conditionally skip
    const requiredFiles = requirements.filter((req) => {
      // Exclude based on specific conditions
      // if (req.type === "parentQuestionnaire" && !isKinder) return false;
      // if (req.type === "reportPreviousCard" && levelApplying === "Grade 1")
      //   return false;
      if (req.type === "nonCatholicWaiver" && isCatholic) return false;
      if ((req.type === "alienCert" || req.type === "passport") && isFilipino)
        return false;

      // Exclude unnecessary requirements
      const excludedArr = [
        "jhsCert",
        "shsVoucherCert",
        "marriageCert",
        "recoLetter",
        "baptismalCert",
        "communionCert",
      ];

      if (!isKinder) {
        excludedArr.push("parentQuestionnaire");
        if (excludedArr.includes(req.type)) return false;
      }
      if (isKinder) {
        excludedArr.push("reportPreviousCard");
        excludedArr.push("reportPresentCard");
        if (excludedArr.includes(req.type)) return false;
      }
      if (levelApplying === "Grade 1") {
        excludedArr.push("parentQuestionnaire");
        excludedArr.push("reportPreviousCard");
        if (excludedArr.includes(req.type)) return false;
      }

      return true;
    });

    // Check if all filtered requirements have at least one uploaded file
    const allFilesUploaded = requiredFiles.every((req) => req.file.length > 0);

    console.log(requiredFiles); // For debugging
    console.log(`All files uploaded: ${allFilesUploaded}`); // Debugging result

    return allFilesUploaded;
  };

  console.log("IS UPLOADED");
  console.log(isAllFilesUploaded());

  const handleUpload = async () => {
    console.log("CLICKED HANDLE UPLOAD")
    const response = await handleUploadFiles(currentAdmissionId);
    console.log("HANDLE UPLOAD RESPONSE: ", response)
    if(response === 200){
      resetRequirements()
      setModalOpen(true)
    } else {
      console.log("Response from handleUpload: ", response)
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false)
    navigate('/dashboard')
  }


  console.log("requirementLoading: ", requirementLoading)
  if (isLoading || requirementLoading) {
    return (
      <ReactLoading className="app-loader" type={"bubbles"} color="#012169" />
    );
  }

  const handleGoBack = () => {
    navigate('/dashboard')
    // setTimeout(() => {
    //   window.location.reload(); // Refresh the page
    // }, 0)
  }

  return (
    <section className="section-container md:h-screen flex flex-col ">
      <ApplicationHeader
        title="Upload Requirements"
        callBack={handleGoBack}
      />

      {modalOpen && (
        <Modal
          onClose={handleCloseModal}
          bodyContent={
            <div className="flex flex-col items-center gap-10">
            <div className="text-green-600">
              <CiCircleCheck size={124} />
            </div>
            <h2 className="text-[1.75rem] font-normal text-center">Requirements Uploaded!</h2>
            <p className="text-gray-600 text-center font-extralight text-[1rem]">
              Required documents have been successfully uploaded.
              Please wait and proceed to the next step.
            </p>
          </div>
          }
          footerContent={
            <button
              onClick={handleCloseModal}
              className="w-full bg-blueAccent text-white py-2 rounded-md hover:bg-blue-700"
            >
              Back to Admission Process
            </button>
          }
        ></Modal>
      )}

      {/* Content Body */}

      <div className="py-[3.3rem] px-[2rem] flex-grow flex flex-col">
        <div className="border-b border-b-black overflow-y-auto w-full flex-grow flex flex-col">
          <h3 className="text-[2.25rem] font-normal">
            List of Required Documents
          </h3>
          <RequirementTest type="birthCert">
            <h2 className="requirement-heading">
              Birth Certificate (PSA Copy)
            </h2>
            <h2 className="requirement-subheading">
              Ensure that your <strong>birth certificate</strong> is issued by
              the <strong>Philippine Statistics Authority (PSA).</strong>
            </h2>
            <h2 className="requirement-subheading">
              Submit original, ensuring all pages are included.
            </h2>
          </RequirementTest>

          <RequirementTest type="recentIdPhoto">
            <h2 className="requirement-heading">Recent ID Photo</h2>
            <h2 className="requirement-subheading">
              Please upload <strong>a clear 2x2 ID photo</strong> taken within
              the last 3 months.
            </h2>
            <h2 className="requirement-subheading">
              The photo should have a <strong>white background.</strong>
            </h2>
          </RequirementTest>

          {isKinder && (
            <RequirementTest type="parentQuestionnaire">
              <div className="flex items-center gap-2">
                <h2 className="requirement-heading">Parent Questionnaire</h2>
                <a
                  href={parentQuestionnaire}
                  download="parent-questionnaire"
                  className="inline"
                >
                  <span className="underline underline-offset-4 text-lg font-extralight cursor-pointer">
                    Download Questionnaire
                  </span>
                </a>
              </div>
              <h2 className="requirement-subheading">
                Please <strong>download the parent questionnaire format</strong>{" "}
                , fill it out completely, and
              </h2>
              <h2 className="requirement-subheading">
                <strong>upload the completed form</strong>
              </h2>
            </RequirementTest>
          )}

          {isJhs && (
            <RequirementTest type="jhsCert">
              <h2 className="requirement-heading">
                Junior High School ESC Certificate
              </h2>
              <h2 className="requirement-subheading">(Only if Applicable)</h2>
            </RequirementTest>
          )}
          {isShs && (
            <RequirementTest type="shsVoucherCert">
              <h2 className="requirement-heading">
                Senior High School Voucher
              </h2>
              <h2 className="requirement-subheading">(Only if Applicable)</h2>
            </RequirementTest>
          )}

          {levelApplying !== "Grade 1" && !isKinder && (
            <RequirementTest type="reportPreviousCard">
              <h2 className="requirement-heading">
                Previous Level Report Card
              </h2>
              <h2 className="requirement-subheading">
                Please ensure that you upload a{" "}
                <strong>clear copy of your child’s official report card</strong>{" "}
                , which should include the following details:
              </h2>
              <div className="ps-5">
                <h2 className="requirement-subheading">
                  <strong>
                    <ul className="list-disc flex flex-col gap-2">
                      <li>learner’s full name</li>
                      <li>grade level</li>
                      <li>Learner Reference Number (LRN)</li>
                      <li>
                        first to fourth quarter{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (with final ratings)
                        </span>
                      </li>
                      <li>attendance records</li>
                      <li>
                        conduct grade{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (if applicable).
                        </span>
                      </li>
                    </ul>
                  </strong>
                </h2>
              </div>
              <h2 className="requirement-subheading">
                The report card must be an official, up-to-date copy reflecting
                the information mentioned above, ensuring{" "}
                <strong>all pages</strong> are included.
              </h2>
            </RequirementTest>
          )}

          <RequirementTest type="marriageCert">
            <h2 className="requirement-heading">
              Parent’s Marriage Certificate
            </h2>
            <h2 className="requirement-subheading">(Only if Applicable)</h2>
          </RequirementTest>

          {!isCatholic ? (
            <RequirementTest type="nonCatholicWaiver">
              <h2 className="requirement-heading">Non-Catholic Waiver</h2>
              <h2 className="requirement-subheading">
                Please <strong>download the non-catholic waiver format</strong>{" "}
                , fill it out completely, and
              </h2>
              <h2 className="requirement-subheading">
                <strong>upload the completed form</strong> here.
              </h2>
            </RequirementTest>
          ) : (
            <>
              <RequirementTest type="communionCert">
                <h2 className="requirement-heading">
                  First Communion Certificate
                </h2>
                <h2 className="requirement-subheading">(Only if Applicable)</h2>
              </RequirementTest>
              <RequirementTest type="baptismalCert">
                <h2 className="requirement-heading">Baptismal Certificate</h2>
                <h2 className="requirement-subheading">(Only if Applicable)</h2>
              </RequirementTest>
            </>
          )}

          {!isKinder && (
            <>
              <RequirementTest type="reportPresentCard">
                <h2 className="requirement-heading">
                  Present Level Report Card
                </h2>
                <h2 className="requirement-subheading">
                  Please ensure that you upload a{" "}
                  <strong>
                    clear copy of your child’s official report card
                  </strong>{" "}
                  , which should include the following details:
                </h2>
                <div className="ps-5">
                  <h2 className="requirement-subheading">
                    <strong>
                      <ul className="list-disc flex flex-col gap-2">
                        <li>learner’s full name</li>
                        <li>grade level</li>
                        <li>Learner Reference Number (LRN)</li>
                        <li>
                          first to fourth quarter{" "}
                          <span style={{ fontWeight: "400 " }}>
                            (with final ratings)
                          </span>
                        </li>
                        <li>attendance records</li>
                        <li>
                          conduct grade{" "}
                          <span style={{ fontWeight: "400 " }}>
                            (if applicable).
                          </span>
                        </li>
                      </ul>
                    </strong>
                  </h2>
                </div>
                <h2 className="requirement-subheading">
                  The report card must be an official, up-to-date copy
                  reflecting the information mentioned above, ensuring{" "}
                  <strong>all pages</strong> are included.
                </h2>
              </RequirementTest>

              <RequirementTest type="recoLetter">
                <div className="flex items-center gap-2">
                  <h2 className="requirement-heading">
                    Recommendation Letter
                  </h2>
                  <a
                    href={recommendTeacher}
                    download="recommendation-teacher"
                    className="inline"
                  >
                    <span className="underline underline-offset-4 text-lg font-extralight cursor-pointer">
                      Download Class Adviser or Subject Teacher
                    </span>
                  </a>
                  <a
                    href={recommendSchoolHead}
                    download="recommendation-school-head-counselor"
                    className="inline"
                  >
                    <span className="underline underline-offset-4 text-lg font-extralight cursor-pointer">
                      Download School Head or Counselor
                    </span>
                  </a>
                </div>
                <h2 className="requirement-subheading">
                  Please download the recommendation letter format and provide
                  it to your school.
                </h2>
                <h2 className="requirement-subheading">
                  The school will then complete the letter and send it directly
                  to us via email at{" "}
                  <span style={{ textDecoration: "underline", color: "blue" }}>
                    cdbsadmissions@gmail.com.
                  </span>
                </h2>
                <h2 className="requirement-subheading">
                  Ensure that the letter is submitted by the school on your
                  behalf to complete the application process.
                </h2>
              </RequirementTest>
            </>
          )}

          {!isFilipino && (
            <>
              <RequirementTest type="alienCert">
                <h2 className="requirement-heading">
                  Alien Certificate of Registration
                </h2>
              </RequirementTest>

              <RequirementTest type="passport">
                <h2 className="requirement-heading">
                  Photocopy of Passport or Visa
                </h2>
              </RequirementTest>
            </>
          )}

          {/* Button Upload */}
          <div className="mt-auto">
            <Button
              disabled={!isAllFilesUploaded()}
              callBack={handleUpload}
              className={`${
                !isAllFilesUploaded() ? "btn-grey" : "btn-blue"
              } w-full py-[1em]`}
              body={<h2 className="tracking-[0.0625rem]">Upload</h2>}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Requirements;
