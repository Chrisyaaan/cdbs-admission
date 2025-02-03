import attachment from "../../../assets/images/attachment.png";
import parentQuestionnaire from "../../../assets/documents/parent-questionnaire.pdf";
import recommendTeacher from "../../../assets/documents/recommendation-teacher.pdf";
import recommendSchoolHead from "../../../assets/documents/recommendation-counselor-school-head.pdf";
import nonCatholicWaiver from "../../../assets/documents/non-catholics.pdf";
import { useState, useRef, useContext } from "react";
import AdmissionsContext from "../../../context/AdmissionsContext";
import showEye from "../../../assets/images/showEye.svg";
import Swal from "sweetalert2";

function Requirement({
  fetchAdmissions,
  handleDeleteUploadedFiles,
  mainTitle,
  subTitle,
  fileText,
  requirements,
  typeId,
  dataIndex,
  handleRequirements,
  isRejected,
}) {
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const { admissions } = useContext(AdmissionsContext);
  const documentStatus = admissions?.["admissionsArr"]?.[dataIndex]?.['db_admission_table']?.["db_required_documents_table"]?.[0]?.["document_status"] || '';
  const isPendingOrAccepted = documentStatus && (documentStatus === "pending" || documentStatus === "accepted");
  console.log(documentStatus);
  const hiddenFileInput = useRef(null);
  let uploadedFiles = [];
  let type;
  let docStatus;

  // TODO: use map to minimize condition statement
  if (mainTitle == "Birth Certificate (PSA Copy)") {
    type = "birthCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 1),
    ];
  } else if (mainTitle == "Recent ID Photo") {
    type = "recentIdPhoto";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 2),
    ];
  } else if (mainTitle == "Parent Questionnaire") {
    type = "parentQuestionnaire";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 4),
    ];
  } else if (mainTitle == "Baptismal Certificate") {
    type = "baptismalCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 8),
    ];
  } else if (mainTitle == "First Communion Certificate") {
    type = "communionCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 9),
    ];
  } else if (mainTitle == "Parent’s Marriage Certificates") {
    type = "marriageCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 10),
    ];
  } else if (mainTitle == "Recommendation Letter") {
    type = "recoLetter";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 5),
    ];
  } else if (mainTitle == "Present Level Report Card") {
    type = "reportPresentCard";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 14),
    ];
    console.log(uploadedFiles)
  } else if (mainTitle == "Alien Certificate of Registration") {
    type = "alienCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 11),
    ];
  } else if (mainTitle == "Non-Catholic Waiver") {
    type = "nonCatholicWaiver";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 13),
    ];
  } else if (mainTitle == "Photocopy of Passport or Visa") {
    type = "passport";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 12),
    ];
  } else if (mainTitle == "Previous Level Report Card") {
    type = "reportPreviousCard";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 3),
    ];
  }

  // TODO: can put it to util folder
  const handleFileChange = (type, file) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const validFiles = file.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== file.length) {
      console.log("no");
      Swal.fire({
        title: "Invalid file type",
        text: "Invalid file format. Please upload a PNG, JPEG, or PDF file.",
        icon: "error",
      });
      return false;
    }

    handleRequirements((prevRequirements) =>
      prevRequirements.map((requirement) =>
        requirement.type === type ? { ...requirement, file } : requirement
      )
    );
    return true;
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div
      className="requirement-container"
      style={{ backgroundColor: isRejected ? "#ff9999" : "" }}
    >
      <div className="rqment-text">
        <div className="requirement-text">
          <div>
            <h2 className="main-requirement-text">
              {mainTitle}
              <span style={{ color: "red", fontStyle: "italic" }}>
                {isRejected ? " -- Please reupload" : ""}
              </span>
            </h2>
            {type == "birthCert" ? (
              <>
                <h2 className="email-text">
                  Ensure that your <strong>birth certificate</strong> is issued
                  by the <strong>Philippine Statistics Authority (PSA).</strong>
                </h2>
                <h2 className="email-text">
                  Submit original, ensuring all pages are included.
                </h2>
              </>
            ) : null}
            {type == "recentIdPhoto" ? (
              <>
                <h2 className="email-text">
                  Please upload <strong>a clear 2x2 ID photo</strong> taken
                  within the last 3 months.
                </h2>
                <h2 className="email-text">
                  The photo should have a <strong>white background.</strong>
                </h2>
              </>
            ) : null}
            {type == "reportPreviousCard" ? (
              <>
                <h2 className="email-text">
                  Please ensure that you upload a{" "}
                  <strong>
                    clear copy of your child’s official report card
                  </strong>{" "}
                  , which should include the following details:
                </h2>
                <h2 className="email-text">
                  <strong>
                    <ul>
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
                <h2 className="email-text">
                  The report card must be an official, up-to-date copy
                  reflecting the information mentioned above, ensuring{" "}
                  <strong>all pages</strong> are included.
                </h2>
              </>
            ) : null}

          {type == "reportPresentCard"? (
              <>
                <h2 className="email-text">
                  Please ensure that you upload a{" "}
                  <strong>
                    clear copy of your child’s official report card
                  </strong>{" "}
                  , which should include the following details:
                </h2>
                <h2 className="email-text">
                  <strong>
                    <ul>
                      <li>learner’s full name</li>
                      <li>grade level</li>
                      <li>Learner Reference Number (LRN)</li>
                      <li>
                        first quarter grades{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (at a minimum)
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
                <h2 className="email-text">
                  The report card must be an official, up-to-date copy
                  reflecting the information mentioned above, ensuring{" "}
                  <strong>all pages</strong> are included.
                </h2>
              </>
            ) : null}
            {type == "recoLetter" ? (
              <>
                <h2 className="email-text">
                  Please download the recommendation letter format and provide
                  it to your school.
                </h2>

                <h2 className="email-text">
                  The school will then complete the letter and send it directly
                  to us via email at{" "}
                  <span style={{ textDecoration: "underline", color: "blue" }}>
                    cdbsadmissions@gmail.com.
                  </span>
                </h2>
                <h2 className="email-text">
                  Ensure that the letter is submitted by the school on your
                  behalf to complete the application process.
                </h2>
              </>
            ) : null}
            {type == "parentQuestionnaire" ? (
              <>
                <h2 className="email-text">
                  Please{" "}
                  <strong>download the parent questionnaire format</strong>,
                  fill it out completely, and{" "}
                  <strong>upload the completed form</strong> here.
                </h2>
              </>
            ) : null}

            {type == "nonCatholicWaiver" ? (
              <>
                <h2 className="email-text">
                  Please{" "}
                  <strong>download the non-catholic waiver format</strong>,
                  fill it out completely, and{" "}
                  <strong>upload the completed form</strong> here.
                </h2>
              </>
            ) : null}

            {/*fileNames.map((el, i) => (
              <div className="item-upload" key={i}>
                <h2 className="file-text">{el}</h2>
                <span
                  className="delete-upload-item"
                  onClick={() => {
                    setFiles((prevFiles) =>
                      prevFiles.filter((el) => el !== el.name[i])
                    );
                    setFileNames((prevFiles) =>
                      prevFiles.filter((elFile) => elFile !== el)
                    );
                    handleFileChange(type, files);
                  }}
                >
                  X
                </span>
              </div>
            ))*/}
            {fileNames.map((el, i) => (
              <div className="item-upload" key={i}>
                <h2 className="file-text">{el}</h2>
                <span
                  className="delete-upload-item"
                  onClick={() => {
                    // Remove the selected file from state
                    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== i));
                    setFileNames((prevFiles) => prevFiles.filter((_, index) => index !== i));
                    
                    // Reset the file input to allow reselection of the same file
                    const fileInput = document.getElementById('file-input-id');
                    if (fileInput) {
                      fileInput.value = '';
                    }

                    // Optionally handle file change after deletion
                    handleFileChange(type, files);
                  }}
                >
                  X
                </span>
              </div>
            ))}



            {/*mainTitle != "Recommendation Letter"
              ? uploadedFiles.map((el, i) => (
                  <div className="upload-view-btn-container" key={i}>
                    <a
                      id="view-upload"
                      href={
                        Array.isArray(el.document_url)
                          ? el.document_url[0]
                          : el.document_url.replace(/[\[\]"']/g, "")
                      }
                      key={i}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="btn-view">
                        <img src={showEye} /> Uploaded File
                      </span>
                    </a>
                    <button
                      className="close-btn"
                      onClick={async () => {
                        var result = await Swal.fire({
                          title: "Delete this uploaded file?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonColor: "No",
                        });
                        if (result.isConfirmed) {
                          await handleDeleteUploadedFiles(
                            el.requirements_type,
                            el.admission_id,
                            el.ReactLoading
                          );

                          fetchAdmissions();
                        } else {
                          return;
                        }
                      }} // Function to remove file
                    >
                      &times;
                    </button>
                  </div>
                ))
              : null*/}

              {mainTitle !== "Recommendation Letter"
                ? uploadedFiles.map((el, i) => (
                    <div className="upload-view-btn-container" key={i}>
                      <a
                        id="view-upload"
                        href={
                          Array.isArray(el.document_url)
                            ? el.document_url[0]
                            : el.document_url.replace(/[\[\]"']/g, "")
                        }
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="btn-view">
                          <img src={showEye} /> Uploaded File
                        </span>
                      </a>
                      {(el.document_status !== "accepted") && (  // Check if file is not approved or hasn't been uploaded yet
                        <button
                          className="close-btn"
                          onClick={async () => {
                            var result = await Swal.fire({
                              title: "Delete this uploaded file?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes",
                              cancelButtonColor: "No",
                            });
                            if (result.isConfirmed) {
                              await handleDeleteUploadedFiles(
                                el.requirements_type,
                                el.admission_id,
                                el.required_doc_id
                              );

                              fetchAdmissions();
                            } else {
                              return;
                            }
                          }} // Function to remove file
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))
                : null}

          </div>

          <div className="align-buttons-self">
            {mainTitle === "Parent Questionnaire" ? (
              <a href={parentQuestionnaire} download="parent-questionnaire">
                <button
                  className="btn-blue btn btn-add"
                  style={{ width: "230px" }}
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download Questionnaire
                </button>
              </a>
              
            ) : null}
            {mainTitle === "Recommendation Letter" ? (
              <a href={recommendTeacher} download="recommendation-teacher">
                <button
                  className={`btn-blue btn btn-add ${isPendingOrAccepted ? "disabled" : ""}`}
                  style={{ width: "295px" }}
                  onClick={async (e) => {
                    //e.preventDefault();
                    if(isPendingOrAccepted){
                      e.preventDefault();
                    }else{
                      try{
                        const formData = new FormData();
                        const admissionId = admissions["admissionsArr"][dataIndex]["admission_id"];
                        formData.append("admission_id",admissionId);
                        formData.append("requirements_type",5);
                        const fileUploadResponse = await fetch(
                          "https://donboscoapi.vercel.app/api/admission/upload_requirements",
                          {
                            method: "POST",
                            headers: {
                              "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
                              "supabase-key":
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
                            },
                            body: formData,
                          }
                        );
                
                        // Log the response for debugging purposes
                        console.log(await fileUploadResponse.json());
                        fetchAdmissions();
                      }catch (error) {
                        console.error("Error uploading file:", error);
                      }
                    }
                    
              
                  }
                }
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download Class Adviser or Subject Teacher
                </button>
              </a>
            ) : null}
            {mainTitle === "Recommendation Letter" ? (
              <a
                href={recommendSchoolHead}
                download="recommendation-school-head-counselor"
              >
                <button
                  className={`btn-blue btn btn-add reco-pad-left ${isPendingOrAccepted ? "disabled" : ""}`}
                  style={{ width: "290px" }}
                  onClick={async (e) => {
                    if(isPendingOrAccepted){
                      e.preventDefault();
                    }else{
                      try{
                        const formData = new FormData();
                        const admissionId = admissions["admissionsArr"][dataIndex]["admission_id"];
                        formData.append("admission_id",admissionId);
                        formData.append("requirements_type",5);
                        const fileUploadResponse = await fetch(
                          "https://donboscoapi.vercel.app/api/admission/upload_requirements",
                          {
                            method: "POST",
                            headers: {
                              "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
                              "supabase-key":
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
                            },
                            body: formData,
                          }
                        );
                
                        // Log the response for debugging purposes
                        console.log(await fileUploadResponse.json());
                        fetchAdmissions();
                      }catch (error) {
                        console.error("Error uploading file:", error);
                      }
                    }
              
                  }
                }
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download School Head or Counselor
                </button>
              </a>
            ) : null}
            {mainTitle === "Non-Catholic Waiver" ? (
              <a href={nonCatholicWaiver} download="non-catholic-waiver">
                <button
                  className="btn-blue btn btn-add reco-pad-left"
                  style={{ width: "230px" }}
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download Non-Catholic Waiver
                </button>
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/*mainTitle != "Recommendation Letter" && uploadedFiles.length ==0 ? (
        <div className="attachment-icon">
          <input
            ref={hiddenFileInput}
            className="attach" style={{ marginTop: "70px", marginBottom: "70px"  }}
            type="file"
            accept=".png, .jpeg, .jpg, .pdf"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (handleFileChange(type, files)) {
                setFileNames(files.map((file) => file.name) || null);
              }
            }}
          />

          <img
            className="attachment-icon-button"
            src={attachment}
            onClick={handleClick}
          />
        </div>
      ) : null*/
      }

      {mainTitle !== "Recommendation Letter" && (
        (uploadedFiles.length === 0 || uploadedFiles.some((file) => file.document_status === "rejected")) && (
          <div className="attachment-icon">
            <input
              ref={hiddenFileInput}
              className="attach"
              style={{ marginTop: "70px", marginBottom: "70px" }}
              type="file"
              id="file-input-id"
              accept=".png, .jpeg, .jpg, .pdf"
              multiple
              // onChange={(e) => {
              //   const files = Array.from(e.target.files || []);
              //   if (handleFileChange(type, files)) {
              //     setFileNames(files.map((file) => file.name) || null);
              //   }
              //   e.target.value = '';
              // }}
            />
            <img
              className="attachment-icon-button"
              src={attachment}
              onClick={handleClick}
            />
          </div>
        )
      )}


      
    </div>
  );
}

export default Requirement;
