import React, { useEffect, useRef, useState } from "react";
import attachment from "../../../assets/images/attachment.png";
import cn from "classnames";
import useAdmissionRequirementStore from "../../../store/admission/useRequirementStore";
import useAdmissionStore from "../../../store/admission/useAdmissionStore";
import { transformText } from "../../../utils";

const RequirementTest = ({ type, children }) => {
  const hiddenFileInput = useRef(null);
  const {
    requirements,
    addFiles,
    removeFile,
    resetRequirements,
    handleDeleteUploadedFile,
  } = useAdmissionRequirementStore();
  const { selectedUserAdmission, currentAdmissionId } = useAdmissionStore();

  const requirementsMap = {
    birthCert: { requirements_type: 1 },
    recentIdPhoto: { requirements_type: 2 },
    parentQuestionnaire: { requirements_type: 4 },
    baptismalCert: { requirements_type: 8 },
    communionCert: { requirements_type: 9 },
    marriageCert: { requirements_type: 10 },
    recoLetter: { requirements_type: 5 },
    reportPresentCard: { requirements_type: 14 },
    alienCert: { requirements_type: 11 },
    nonCatholicWaiver: { requirements_type: 13 },
    passport: { requirements_type: 12 },
    reportPreviousCard: { requirements_type: 3 },
  };

  const { requirements_type } = requirementsMap[type] || {};

  const requirementDocArray =
    selectedUserAdmission?.db_admission_table?.db_required_documents_table;

  const uploadedFiles = [
    ...requirementDocArray.filter(
      (el) => el.requirements_type === requirements_type
    ),
  ];

  const fileNames =
    requirements
      .find((requirement) => requirement.type === type)
      ?.file.map((file) => file.name) || [];

  console.log(selectedUserAdmission);
  const lastName = selectedUserAdmission?.db_admission_table?.last_name;

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleDeleteExistingFile = async (type, docId) => {
    const response = await handleDeleteUploadedFile(
      type,
      currentAdmissionId,
      docId
    );
    console.log(response)
      // setTimeout(() => {
      //   window.location.reload(); // Refresh the page
      // }, 0);
  };

  const handleFileChange = (type, files) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length === 0) {
      console.warn(
        "No valid files uploaded. Please upload PNG, JPEG, or PDF files."
      );
      return false;
    }

    // Process files if needed (e.g., uploading)
    console.log("Valid files:", validFiles);

    // Return true if at least one valid file exists
    console.log("VALID FILES: ");
    console.log(validFiles);
    console.log("TYPE: ", type);
    addFiles(type, validFiles);
    return true;
  };

  const handleInputChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (handleFileChange(type, files)) {
      // setFileNames((prevFileNames) => [
      //   ...prevFileNames,
      //   ...files.map((file) => file.name),
      // ]);
    }

    // Reset the input to allow re-uploading the same file
    event.target.value = "";
  };

  const handleRemoveFile = (file) => {
    // setFileNames((prevFileNames) =>
    //   prevFileNames.filter((fileName) => fileName !== file)
    // );

    removeFile(type, file);
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center py-[2.5rem] px-[1.5rem]",
        { "border-b b border-b-gray-600": type !== "recoLetter" }
      )}
    >
      {/* Left side */}
      <div
        className={`flex gap-2 flex-col ${
          type === "recoLetter" ? "w-[100%]" : "w-[60%] md:w-[90%]"
        }`}
      >
        {children}
        {fileNames.map((file, i) => {
          if (file) {
            return (
              <div className="item-upload" key={i}>
                <h2 className="text-[1rem] md:text-[2rem] font-extralight text-gray-400">
                  {file}
                </h2>
                <span
                  className="delete-upload-item"
                  onClick={() => handleRemoveFile(file)}
                >
                  X
                </span>
              </div>
            );
          }
        })}

        {type !== "recoLetter" &&
          uploadedFiles.map((el, idx) => (
            <div className="item-upload" key={idx}>
              <a
                href={
                  Array.isArray(el.document_url)
                    ? el.document_url[0]
                    : el.document_url?.replace(/[\[\]"']/g, "")
                }
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className=" text-[1rem] md:text-[2rem] font-extralight text-gray-400">
                  {`${lastName}-${transformText(
                    el.db_requirement_type_table.doc_type
                  )}-${idx + 1}`}
                </span>
              </a>
              {el.document_status !== "accepted" && (
                <span
                  className="delete-upload-item"
                  onClick={() =>
                    handleDeleteExistingFile(
                      el.requirements_type,
                      el.required_doc_id
                    )
                  }
                >
                  X
                </span>
              )}
            </div>
          ))}
      </div>

      {/* Right side */}
      {type !== "recoLetter" && (
        <div>
          <div className="attachment-icon">
            <input
              ref={hiddenFileInput}
              className="attach"
              style={{ marginTop: "70px", marginBottom: "70px" }}
              type="file"
              id="file-input-id"
              accept=".png, .jpeg, .jpg, .pdf"
              multiple
              onChange={handleInputChange}
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
        </div>
      )}
    </div>
  );
};

export default RequirementTest;
