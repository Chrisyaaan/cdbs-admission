import { useNavigate } from "react-router-dom";
import useAdmissionStore from "../../../../store/admission/useAdmissionStore";
import { useEffect, useState } from "react";
import MainFormLayout from "../../../../components/ui/MainForm";
import InputSelect from "../../../../components/ui/InputSelect";
import {
  EMPLOYMENT_STATUS,
  LEVELS,
  NATIONALITIES,
  PARENT_STATUS,
  RELATION_GUARDIAN,
  RELIGIONS,
  SALARY_SCALE,
  WEDDING_STATUS,
} from "../../../../data";
import TextInput from "../../../../components/ui/TextInput";
import { calculateAge, generateSchoolYears, handleDobChange, InputValidateNumber } from "../../../../utils";
import ApplicationHeader from "../../../../components/ui/ApplicationHeader";
import SiblingForm from "../../components/SiblingForm";
import ParentForm from "../../../../components/forms/ParentForm";
import CheckboxInput from "../../../../components/ui/CheckboxInput";
import useFetchProvince from "../../../../hooks/useFetchProvince";
import useFetchCities from "../../../../hooks/useFetchCities";
import useAddressStore from "../../../../store/api/addressStore";
import Swal from "sweetalert2";

const FormRender = () => {
  const {
    resetAdmissionDeclaration,
    getAllUserAdmissions,
    admissions,
    currentAdmissionId,
    declarationPackage,
    toggleDeclarationPackage,
    declarationSupportingDoc,
    toggleDeclarationSupportingDoc,
    handleSubmitDeclaration,
    setAdmissionFormSteps,
    admissionFormSteps,
    resetAdmissionFormState,
    admissionPersonalData,
    toggleUpdatePersonalData,
    admissionAcademicData,
    toggleUpdateAcademicData,
    admissionFamilyData,
    toggleUpdateFamilyData,
    setFamilyData,
    toggleUpdateParentData,
    admissionParentData,
    admissionSpecialConcern,
    toggleUpdateSpecialConcern,
    toggleUpdateParentChecked: setParentCheck,
    parentCheck,
    admissionSurvey,
    setSurveyData,
    toggleUpdateSurvey,
    submitPersonalData,
    submitAcademicData,
    submitFamilyData,
    submitParentData,
    submitConcernData,
    submitSurveyData
  } = useAdmissionStore();

  const { handleFetchCities, cities, handleFetchBaranggays, baranggays } =
    useAddressStore();

  const [provinces] = useFetchProvince();
  const schoolYears = generateSchoolYears(2010, 2024);

  const [selectedIdProvince, setSelectedIdProvince] = useState(admissionPersonalData.province || 33);

  //Destructured personal data form
  const {
    levelApplyingFor,
    schoolYear,
    familyName,
    firstName,
    middleName,
    dateOfBirth,
    placeOfBirth,
    age,
    sex,
    religion,
    otherCitizenship,
    otherReligion,
    citizenship,
    acrNumber,
    address,
    province,
    city,
    baranggay,
    postalCode,
    contactNo,
    languages,
    usualCompanion,
  } = admissionPersonalData;

  const {
    namePresentSchool,
    addressPresentSchool,
    presentSchoolContactNo,
    awardsHonor,
    escGrantee,
    currentGrade,
    currentSchoolYear,
  } = admissionAcademicData;

  const { noOfSiblings, siblings } = admissionFamilyData;

  const { currentParentData, father, mother, guardian } = admissionParentData;

  const {
    admission_id,
    bucket_name,
    special_concern,
    medical_condition,
    medication,
    intervention,
    files,
  } = admissionSpecialConcern;

  const { heardList, heardOthers, factorsInfluenceList, factorsOthers } =
    admissionSurvey;

  const navigate = useNavigate();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isKinder = levelApplyingFor === "Kinder" || levelApplyingFor === "Pre-Kinder"

  const hasSelectedParent = Object.values(parentCheck).some((value) => value);


  const family = ["father", "mother", "guardian"];

  const steps = ["form-1", "form-2", "form-3", "form-4", "form-5", "form-6"];

  // Content Loop
  const surveyMapRow1 = [
    {
      value: "Online Search",
      label: "Online Search (Google, School Website, etc)",
      className: "sm:row-start-2 col-span-5 col-start-1 place",
    },
    {
      value: "Social Media",
      label: "Social Media (Facebook, Instagram, Youtube, Tiktok)",
      className: "sm:row-start-3 col-span-6 col-start-1 place",
    },
    {
      value: "Word of Mouth",
      label: "Word of Mouth (Friends, Family, Colleagues)",
      className: "sm:row-start-4 col-span-5 col-start-1 place",
    },
    {
      value: "School events",
      label: "School Events or Open Houses",
      className: "sm:row-start-5 col-span-5 col-start-1 place",
    },
    {
      value: "Brochures",
      label: "Brochures/Flyers",
      className:
        "row-start-6 sm:row-auto sm:row-end-3 col-span-5 sm:col-start-7",
    },
    {
      value: "Education Fairs",
      label: "Education Fairs/Expos",
      className:
        " row-start-7 sm:row-auto sm:row-end-4 col-span-5 sm:col-start-7",
    },
    {
      value: "Ads",
      label: "Local Advertisements (Newspapers, Billboards, etc)",
      className:
        "row-start-8 sm:row-auto sm:row-end-5 col-span-5 sm:col-start-7",
    },
  ];
  const surveyMapRow2 = [
    {
      value: "Academic Reputation",
      label: "Academic Reputation",
      className: "sm:row-start-2 col-span-5 col-start-1 place",
    },
    {
      value: "Recommendation from friends and family",
      label: "Recommendation from friends and family",
      className: "sm:row-start-3 col-span-6 col-start-1 place",
    },
    {
      value: "Near location",
      label: "Proximity to Home",
      className: "sm:row-start-4 col-span-5 col-start-1 place",
    },
    {
      value: "Extracurricular Activities",
      label: "Extracurricular Activities Offered",
      className: "row-start-5 col-span-5 col-start-1 place",
    },
    {
      value: "Reviews Online",
      label: "Positive Reviews Online",
      className:
        "row-start-6 sm:row-auto sm:row-end-3 col-span-5 sm:col-start-7",
    },
    {
      value: "Tuition Fee",
      label: "Tuition Fee",
      className:
        "row-start-7 sm:row-auto sm:row-end-4 col-span-5 sm:col-start-7",
    },
  ];
  
  // const currentStepIndex = steps.indexOf(stepId);

  // Start of Handling all INPUT FUNCTION

  const handleOnChangeData = (field, data, setter) => {
    if (field === "files") {
      // Convert the FileList to an array (if needed)
      data = Array.from(data);
    }
  
    // Continue with the state update logic
    setter(field, data);
  };
  const handleOnChangeParentData = (field, data, parent) => {
    console.log(admissionPersonalData);
    toggleUpdateParentData(field, data, parent);
  };

  const handleOnChangeSurveyData = (e, subType) => {
    const { name, value, checked } = e.target;
    console.log("CLICKED");
    console.log(value);
    setSurveyData((prevData) => {
      if (subType === "addHeard" || subType === "addFactors") {
        const listKey =
          subType === "addHeard" ? "heardList" : "factorsInfluenceList";

        if (checked) {
          // Add the value if it's checked and not already in the array
          if (!prevData[listKey].includes(value)) {
            return {
              ...prevData,
              [listKey]: [...prevData[listKey], value],
            };
          }
        } else {
          // Remove the value if it's unchecked
          return {
            ...prevData,
            [listKey]: prevData[listKey].filter((item) => item !== value),
          };
        }
      } else {
        // For other fields
        return {
          ...prevData,
          [name]: value,
        };
      }
      return prevData;
    });
  };

  const validateSiblingInput = (e) => {
    if (e.target.value < 0) e.target.value = 0;
    if (e.target.value > 25) e.target.value = 25;
  };

  const preventSiblingInvalidKeys = (e) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp", // Added for incrementing
      "ArrowDown", // Added for decrementing
      "Delete",
      "Enter",
    ];
    if (allowedKeys.includes(e.key)) return;

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const updateSiblingsList = (e, index) => {
    const { name, value } = e.target;
  
    setFamilyData((prevData) => ({
      ...prevData,
      siblings: prevData.siblings.map((sibling, i) => {
        if (i === index) {
          // Update the sibling object
          const updatedSibling = { ...sibling, [name]: value };
          
          // If date of birth is updated, calculate the age

          if (name === "siblingDob") {
            updatedSibling.siblingAge = calculateAge(value);

          }

          return updatedSibling;
        }
        return sibling;
      }),
    }));
  };

  const handleSiblingChange = (e) => {
    const newSiblingData = {
      siblingId: "",
      siblingFamilyName: "",
      siblingFirstName: "",
      siblingMiddleName: "",
      siblingDob: "",
      siblingAge: "",
      siblingOccupation: "",
      siblingBusinessOffice: "",
      age: ""
    };

    const newNoOfSiblings = Number(e.target.value);

    setFamilyData((prevData) => {
      const currentNoOfSiblings = prevData.noOfSiblings;
      let updatedSiblings;

      if (newNoOfSiblings > currentNoOfSiblings) {
        const additionalSiblings = Array(
          newNoOfSiblings - currentNoOfSiblings
        ).fill(newSiblingData);
        updatedSiblings = [...prevData.siblings, ...additionalSiblings];
      } else {
        updatedSiblings = prevData.siblings.slice(0, newNoOfSiblings);
      }

      handleOnChangeData(
        "noOfSiblings",
        e.target.value,
        toggleUpdateFamilyData
      );

      return {
        ...prevData,
        noOfSiblings: newNoOfSiblings,
        siblings: updatedSiblings,
      };
    });
  };

  //End of handling INPUT FUNCTION

  // Start of Handling all BUTTON FUNCTION

  const handleSubmitPersonalData = (e) => {
    e.preventDefault();
    console.log("CLICKED");
    submitPersonalData().then((response) => {
      if(response === 200){
        setCurrentStepIndex((prev) => prev + 1);
      }
    })
  };

  const handleSubmitAcademicData =(e) => {
    e.preventDefault();
    console.log("CLICKED")
    console.log(admissionAcademicData)
    submitAcademicData().then((response) => {
      if(response === 200){
        setCurrentStepIndex((prev) => prev + 1);
      }
    })
  }

  const handleSubmitFamilyData = (e) => {
    e.preventDefault();
    console.log("CLICK");
    submitFamilyData().then((response) => {
      console.log("SUBMIT FAMILY DATA RESPONSE: ", response)
      if(response === 200){
        setCurrentStepIndex((prev) => prev + 1);
      }
    })
  };

  const handleSubmitParentData = (e) => {
    e.preventDefault();
    console.log("CLICK");
    submitParentData().then((response) => {
      console.log("SUBMIT PARENT RESPONSE: ", response)
      if(response === 200) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    })
  };

  const handleSubmitConcerns = (e) => {
    e.preventDefault();
    console.log("CLICK");
    console.log(admissionSpecialConcern);
    submitConcernData().then((response) => {
      console.log(response)
      if(response === 200){
        setCurrentStepIndex((prev) => prev + 1);
      }
    })
  };

  const handleSubmitSurvey = async (e) => {
    e.preventDefault();
    console.log("CLICK");
    console.log(admissionSurvey);
    const response = await submitSurveyData()
    console.log(response)
    if(response === 200) {
      await resetAdmissionFormState()
      await Swal.fire({
        title: "Good job!",
        text: "Application created and saved",
        icon: "success",
        confirmButtonText: "Ok",
      });

      navigate('/dashboard')
    }
  };

  const handleOnBack = () => {
    console.log(currentStepIndex);
    if (currentStepIndex <= 0) {
      navigate(-1);
      resetAdmissionDeclaration();
    }
    setCurrentStepIndex((prev) => prev - 1);
  };

  //End of handling BUTTON FUNCTION

  useEffect(() => {
    if (currentStepIndex === -1) {
      // If invalid stepId, navigate back to the first step
      navigate(-1);
    }
  }, [currentStepIndex, navigate]);

  useEffect(() => {
    handleFetchCities(selectedIdProvince);
  }, [selectedIdProvince]);

  // useEffect(() => {
  //   getAllUserAdmissions().then(() => {
  //     console.log("ADMISSION =========")
  //     console.log(admissions)
  //   })
  // }, [currentAdmissionId])

  const renderCheckboxes = (items, listKey, subType) =>
    items.map((item, idx) => {
      return (
        <CheckboxInput
          key={idx}
          label={item.label}
          className={`${item.className} place-self-start`}
          checked={admissionSurvey[listKey]?.includes(item.value)}
          isChecked={admissionSurvey[listKey]?.includes(item.value)}
          value={item.value}
          onChange={(e) => handleOnChangeSurveyData(e, subType)}
        />
      );
    });

  const renderContent = (step) => {
    switch (step) {
      case "form-1":
        return (
          <MainFormLayout
            title="Personal Data"
            detail="Learner Information"
            back={false}
            onSubmit={handleSubmitPersonalData}
          >
            {/* 1st ROW */}
            <div className="grid grid-cols-2 grid-rows-1 w-full gap-[3.5rem]">
              <InputSelect
                className="!block"
                label="Level Applying For:"
                name="levelApplyingFor"
                value={levelApplyingFor || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "levelApplyingFor",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
                options={LEVELS}
              />
              <TextInput
                name="schoolYear"
                label="School Year: "
                readOnly
                value={"2025-2026"}
                placeholder="2025-2026"
                onInput={InputValidateNumber}
                onChange={(e) =>
                  handleOnChangeData(
                    "schoolYear",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
            </div>
            {/* 2nd Row */}
            <div className="grid grid-cols-3 grid-rows-1 gap-[2.5rem]">
              <TextInput
                label="Full Name*"
                name="familyName"
                value={familyName || ""}
                placeholder="Family Name"
                onChange={(e) =>
                  handleOnChangeData(
                    "familyName",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
              <TextInput
                name=""
                value={firstName || ""}
                placeholder="First Name"
                onChange={(e) =>
                  handleOnChangeData(
                    "firstName",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
              <TextInput
                name=""
                value={middleName || ""}
                placeholder="Middle name"
                onChange={(e) =>
                  handleOnChangeData(
                    "middleName",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
              />
            </div>

            {/* 3rd Row */}
            {/* <div className="flex items-center justify-evenly gap-[2.5rem]"> */}
            <div className="grid grid-cols-3 grid-rows-1 gap-[2.5rem]">
              <TextInput
                label="Date of Birth*"
                type="date"
                name="dateOfBirth"
                value={dateOfBirth || ""}
                placeholder="Calendar"
                onChange={(e) => {
                  handleDobChange(
                    e,
                    dateOfBirth,
                    toggleUpdatePersonalData,
                    null
                  );
                  handleOnChangeData(
                    "dateOfBirth",
                    e.target.value,
                    toggleUpdatePersonalData
                  );
                }}
                required={true}
              />
              <TextInput
                label="Place of Birth*"
                value={placeOfBirth || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "placeOfBirth",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
              <TextInput
                label="Age*"
                name="age"
                onInput={InputValidateNumber}
                readOnly
                value={age || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "age",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
            </div>
            {/* 4th Row */}
            {/* <div className="flex items-center justify-evenly gap-[2.5rem] flex-col"> */}
            <div className="grid grid-cols-3 grid-rows-1 gap-[2.5rem]">
              <InputSelect
                label="Sex*"
                name="sex"
                value={sex || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "sex",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                options={["Male", "Female"]}
              />
              <InputSelect
                label="Religion*"
                name="religion"
                value={religion || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "religion",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
                options={RELIGIONS}
              />
              {religion === "Others" ? (
                <TextInput
                  label="Other religion, please specify"
                  onChange={(e) =>
                    handleOnChangeData(
                      "otherReligion",
                      e.target.value,
                      toggleUpdatePersonalData
                    )
                  }
                  value={otherReligion || ""}
                  name="otherReligion"
                />
              ) : null}
              <InputSelect
                label="Citizenship*"
                name="citizenship"
                value={citizenship || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "citizenship",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
                options={NATIONALITIES}
              />
              {citizenship === "Others" ? (
                <TextInput
                  label="Other citizenship, please specify"
                  onChange={(e) =>
                    handleOnChangeData(
                      "otherCitizenship",
                      e.target.value,
                      toggleUpdatePersonalData
                    )
                  }
                  value={otherCitizenship || ""}
                  name="otherCitizenship"
                />
              ) : null}
            </div>
            {/* 5th Row */}
            <TextInput
              label="ACR Number (For Foreign Learners Only)"
              name="acrNumber"
              value={acrNumber || ""}
              onChange={(e) =>
                handleOnChangeData(
                  "acrNumber",
                  e.target.value,
                  toggleUpdatePersonalData
                )
              }
            />
            {/* 6th Row */}
            <div className="grid grid-cols-12 grid-rows-1 place-content-center items-center gap-8">
              <TextInput
                className="col-span-3"
                label="Address"
                name="address"
                value={address || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "address",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
                required={true}
              />
              <InputSelect
                defaultText="Please select a province"
                required
                name="province"
                className="col-span-3 place-self-end"
                value={province || ""}
                onChange={(e) => {
                  const selectedId = e.target.value; // Get the selected province ID
                  setSelectedIdProvince(selectedId);
                  handleOnChangeData(
                    "province",
                    e.target.value,
                    toggleUpdatePersonalData
                  );
                }}
                isAddress={true}
                options={provinces.map((item) => ({
                  label: item.name, // Display the province name in the dropdown
                  value: item.id, // Use the province ID as the value
                }))}
              />
              <InputSelect
                defaultText="Please select a city"
                name="city"
                className="col-span-3 place-self-end"
                required
                value={city || ""}
                onChange={(e) => {
                  handleFetchBaranggays(e.target.value);
                  handleOnChangeData(
                    "city",
                    e.target.value,
                    toggleUpdatePersonalData
                  );
                }}
                isAddress={true}
                options={cities.map((item) => ({
                  label: item.name, // Display the province name in the dropdown
                  value: item.id, // Use the province ID as the value
                }))}
              />
              <InputSelect
                defaultText="Please select a baranggay"
                required
                name="baranggay"
                className="col-span-3 place-self-end"
                value={baranggay || ""}
                onChange={(e) => {
                  handleOnChangeData(
                    "baranggay",
                    e.target.value,
                    toggleUpdatePersonalData
                  );
                }}
                isAddress={true}
                options={baranggays.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </div>
            {/* 7th Row */}
            {/* <div className="flex items-center justify-between gap-[3.5rem]"> */}
              {/* <TextInput
                label="Zip/Postal Code"
                name="postalCode"
                required
                onInput={InputValidateNumber}
                value={postalCode}
                onChange={(e) =>
                  handleOnChangeData(
                    "postalCode",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
              /> */}
              <TextInput
                label="Contact No. "
                required
                name="contactNo"
                onInput={InputValidateNumber}
                value={contactNo || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "contactNo",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
              />

            {/* 8th Row */}
            {/* <div className="flex items-center justify-between gap-[3.5rem]"> */}
            <div className="grid grid-cols-2 grid-rows-1 gap-[3.5rem]">
              <TextInput
                label="Languages/Dialects Spoken"
                placeholder="Ex. English, Filipino"
                name="languages"
                value={languages || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "languages",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
              />
              <TextInput
                label="Usual Companion at Home"
                name="usualCompanion"
                value={usualCompanion || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "usualCompanion",
                    e.target.value,
                    toggleUpdatePersonalData
                  )
                }
              />
            </div>
          </MainFormLayout>
        );

      case "form-2":
        return (
          <MainFormLayout
            title="Academic Background"
            detail="Previous Academic Information"
            onSubmit={handleSubmitAcademicData}
          >
            {/* 1st Row */}
            <TextInput
              label="Name of Present School*"
              name="namePresentSchool"
              required={!isKinder}
              value={namePresentSchool || ""}
              onChange={(e) =>
                handleOnChangeData(
                  "namePresentSchool",
                  e.target.value,
                  toggleUpdateAcademicData
                )
              }
            />
            {/* 2nd Row */}
            <TextInput
              label="Address of Present School*"
              name="addressPresentSchool"
              required={!isKinder}
              value={addressPresentSchool || ""}
              onChange={(e) =>
                handleOnChangeData(
                  "addressPresentSchool",
                  e.target.value,
                  toggleUpdateAcademicData
                )
              }
            />
            {/* 3rd Row */}
            <div className="grid grid-cols-3 grid-rows-1 gap-[2.5rem]">
              <TextInput
                label="Contact No.*"
                required={!isKinder}
                name="presentSchoolContactNo"
                value={presentSchoolContactNo || ""}
                onInput={InputValidateNumber}
                onChange={(e) =>
                  handleOnChangeData(
                    "presentSchoolContactNo",
                    e.target.value,
                    toggleUpdateAcademicData
                  )
                }
              />
              <InputSelect
                className="!block"
                label="Current Grade Level*"
                name="currentGrade"
                value={currentGrade || ""}
                onChange={(e) =>
                  handleOnChangeData(
                    "currentGrade",
                    e.target.value,
                    toggleUpdateAcademicData
                  )
                }
                required={!isKinder}
                options={LEVELS}
              />
              <InputSelect
                options={schoolYears}
                name="currentSchoolYear"
                label="School Year*"
                value={currentSchoolYear || ""}
                placeholder="2025-2026"
                onInput={InputValidateNumber}
                onChange={(e) =>
                  handleOnChangeData(
                    "currentSchoolYear",
                    e.target.value,
                    toggleUpdateAcademicData
                  )
                }
                required={!isKinder}
              />
            </div>
            {/* 4th Row */}
            <TextInput
              name="awardsHonor"
              label="Awards/Honors Received"
              value={awardsHonor || ""}
              onChange={(e) =>
                handleOnChangeData(
                  "awardsHonor",
                  e.target.value,
                  toggleUpdateAcademicData
                )
              }
            />
            {/* 5th Row */}
            <TextInput
              name="escGrantee"
              label="Education System Contracting (ESC) Grantee"
              value={escGrantee || ""}
              onChange={(e) =>
                handleOnChangeData(
                  "escGrantee",
                  e.target.value,
                  toggleUpdateAcademicData
                )
              }
            />
          </MainFormLayout>
        );

      case "form-3":
        return (
          <MainFormLayout
            title="Family Background"
            detail="Brother & Sisters Information in Chronological Order"
            onSubmit={handleSubmitFamilyData}
          >
            <TextInput
              label="Number of Siblings*"
              type="number"
              max={25}
              onInput={validateSiblingInput}
              onKeyDown={preventSiblingInvalidKeys}
              value={noOfSiblings || ""}
              onChange={handleSiblingChange}
              className="w-50"
            />
            {siblings.map((sibling, index) => (
              <div className="sibling-form-container" key={index}>
                {/* Row 1 */}
                <div className="grid grid-cols-3 grid-rows-1 gap-8">
                  <TextInput
                    label="Full Name"
                    name="siblingFamilyName"
                    value={sibling.siblingFamilyName || ""}
                    placeholder="Family Name"
                    onChange={(e) => updateSiblingsList(e, index)}
                    required
                  />
                  <TextInput
                    name="siblingFirstName"
                    value={sibling.siblingFirstName || ""}
                    placeholder="First Name"
                    onChange={(e) => updateSiblingsList(e, index)}
                    required
                  />
                  <TextInput
                    name="siblingMiddleName"
                    value={sibling.siblingMiddleName || ""}
                    placeholder="Middle Name"
                    onChange={(e) => updateSiblingsList(e, index)}
                  />
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-12 gap-8 grid-rows-2 lg:grid-rows-none">
                  <TextInput
                    label="Date of Birth*"
                    type="date"
                    name="siblingDob"
                    value={sibling.siblingDob || ""}
                    onChange={(e) => {
                      updateSiblingsList(e, index)
                    }}
                    required
                    className="col-span-8 lg:col-span-4"
                  />
                  <TextInput
                    label="Age*"
                    type="number"
                    name="siblingAge"
                    onInput={InputValidateNumber}
                    value={sibling.siblingAge || sibling?.age || "" }
                    onChange={(e) => updateSiblingsList(e, index)}
                    readOnly
                    required
                    className="col-span-4 lg:col-span-1"
                  />
                  <TextInput
                    label="Grade Level/ Course/ Occupation*"
                    name="siblingOccupation"
                    value={sibling.siblingOccupation || ""}
                    onChange={(e) => updateSiblingsList(e, index)}
                    required
                    className="sm:row-start-2 col-span-6 lg:row-start-auto lg:col-span-3"
                  />
                  <TextInput
                    label="School/ Business Office*"
                    name="siblingBusinessOffice"
                    value={sibling.siblingBusinessOffice || ""}
                    onChange={(e) => updateSiblingsList(e, index)}
                    required
                    className="row-start-2 col-span-6 lg:col-span-4 lg:row-start-auto"
                  />
                </div>
              </div>
            ))}
          </MainFormLayout>
        );

      case "form-4":
        return (
          <MainFormLayout
            title="Family Background"
            detail="Parents Information"
            onSubmit={handleSubmitParentData}
            isDisabledSubmit={!hasSelectedParent}
          >
            {family.map((item, idx) => {
              return (
                <ParentForm
                  key={idx}
                  title={item}
                  prefix={item}
                  formData={admissionParentData}
                  setCheck={setParentCheck}
                  checked={parentCheck}
                  handleDobChange={handleDobChange}
                  handleOnChange={handleOnChangeParentData}
                />
              );
            })}
            {/* {parentCheck.guardian && (
              <>
                <InputSelect
                  label="Relationship to the Child (If Guardian)"
                  name="relationshipToChildGuardian"
                  value={currentParentData.relationshipToChildGuardian}
                  options={RELATION_GUARDIAN}
                  onChange={(e) =>
                    handleOnChangeParentData(
                      "relationshipToChildGuardian",
                      e.target.value,
                      "currentParentData"
                    )
                  }
                />
                {currentParentData.relationshipToChildGuardian === "Other" && (
                  <TextInput
                    label="if Other*"
                    name="relationshipToChildGuardian"
                    // value={currentParentData.relationshipToChildGuardian}
                    // onChange={(e) =>
                    //   handleOnChangeParentData(
                    //     "relationshipToChildGuardian",
                    //     e.target.value,
                    //     "currentParentData"
                    //   )
                    // }
                  />
                )}
              </>
            )} */}
            <InputSelect
              label="Parent Status*"
              name="parentStatus"
              required={hasSelectedParent}
              value={currentParentData.parentStatus}
              onChange={(e) =>
                handleOnChangeParentData(
                  "parentStatus",
                  e.target.value,
                  "currentParentData"
                )
              }
              options={PARENT_STATUS}
            />
            {(currentParentData.parentStatus === "Married" || currentParentData.parentStatus === "Remarried") && (
              <>
                <InputSelect 
                  label="Civil Wedding"
                  name="civilWedding"
                  value={currentParentData.civilWedding}
                  onChange={(e) => handleOnChangeParentData("civilWedding", e.target.value, "currentParentData")}
                  required={parentCheck.father || parentCheck.mother}
                  options={WEDDING_STATUS}
                />
                <TextInput 
                  label="Church Name*"
                  name="churchName"
                  value={currentParentData.churchName}
                  onChange={(e) => handleOnChangeParentData("churchName", e.target.value, "currentParentData")}
                  required={parentCheck.father || parentCheck.mother}
                  
                />
              </>
            )}
          </MainFormLayout>
        );

      case "form-5":
        return (
          <MainFormLayout
            title="Special Concerns"
            detail="Special Concern/s that might need Attention"
            onSubmit={handleSubmitConcerns}
          >
            <TextInput
              label="Special Concerns"
              name="special_concern"
              value={special_concern}
              onChange={(e) =>
                handleOnChangeData(
                  "special_concern",
                  e.target.value,
                  toggleUpdateSpecialConcern
                )
              }
            />
            <TextInput
              label="Medical/ Developmental/ Psychological Condition"
              name="medical_condition"
              value={medical_condition}
              onChange={(e) =>
                handleOnChangeData(
                  "medical_condition",
                  e.target.value,
                  toggleUpdateSpecialConcern
                )
              }
            />
            <div className="grid grid-cols-12 gap-8">
              <TextInput
                className="col-span-6"
                label="Medication"
                name="medication"
                value={medication}
                onChange={(e) =>
                  handleOnChangeData(
                    "medication",
                    e.target.value,
                    toggleUpdateSpecialConcern
                  )
                }
              />
              <TextInput
                className="col-span-6"
                label="Intervention"
                name="intervention"
                value={intervention}
                onChange={(e) =>
                  handleOnChangeData(
                    "intervention",
                    e.target.value,
                    toggleUpdateSpecialConcern
                  )
                }
              />
            </div>
            <TextInput
              label="Attach Supporting Document"
              name="files"
              type="file"
              onChange={(e) =>
                handleOnChangeData(
                  "files",
                  e.target.files,
                  toggleUpdateSpecialConcern
                )
              }
            />
          </MainFormLayout>
        );

      case "form-6":
        return (
          <MainFormLayout
            title="Survey"
            detail="Please help us answer a quick survey"
            onSubmit={handleSubmitSurvey}
            onBack={handleOnBack}
          >
            {/* Row 1 checkboxes */}
            <div className="grid grid-cols-1 grid-rows-9 sm:grid-cols-12 sm:grid-rows-5 place-content-center gap-y-8 mb-12">
              <h6 className="col-span-12 row-start-1 self-end text-[0.9rem] lg:text-[1.75rem]">
                How did you first hear about our school? (Select all that apply)
              </h6>
              {renderCheckboxes(surveyMapRow1, "heardList", "addHeard")}
              <div className="row-start-9 sm:row-end-6 col-span-5 sm:col-start-7 place-self-start flex items-center gap-8 sm:row-auto">
                <CheckboxInput
                  label="Others, please specify: "
                  type="checkbox"
                  value="Others"
                  isChecked={heardList.includes("Others")}
                  onChange={(e) => handleOnChangeSurveyData(e, "addHeard")}
                  checked={heardList.includes("Others")}
                />
                <div className="border-b-2 border-black">
                  <input
                    type="text"
                    className="outline-none"
                    value={heardOthers}
                    onChange={(e) =>
                      handleOnChangeData(
                        "heardOthers",
                        e.target.value,
                        toggleUpdateSurvey
                      )
                    }
                    readOnly={!heardList.includes("Others")}
                    required={heardList.includes("Others")}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 checkboxed */}
            <div className="grid grid-cols-1 grid-rows-8 sm:grid-cols-12 sm:grid-rows-5 place-content-center gap-x-4 gap-y-8">
              <h6 className="col-span-12 row-start-1 self-end text-[0.9rem] lg:text-[1.75rem]">
                What factors influenced your decision to apply to our school?
                (Select all that apply)
              </h6>
              {renderCheckboxes(
                surveyMapRow2,
                "factorsInfluenceList",
                "addFactors"
              )}
              <div className="row-start-8 sm:row-auto sm:row-end-5 col-span-5 sm:col-start-7 place-self-start flex items-center gap-8">
                <CheckboxInput
                  label="Others, please specify: "
                  type="checkbox"
                  value="Others"
                  isChecked={factorsInfluenceList.includes("Others")}
                  onChange={(e) => handleOnChangeSurveyData(e, "addFactors")}
                />
                <div className="border-b-2 border-black">
                  <input
                    type="text"
                    value={factorsOthers}
                    onChange={(e) =>
                      handleOnChangeData(
                        "factorsOthers",
                        e.target.value,
                        toggleUpdateSurvey
                      )
                    }
                    className="outline-none"
                    readOnly={!factorsInfluenceList.includes("Others")}
                    required={factorsInfluenceList.includes("Others")}
                  />
                </div>
              </div>
            </div>
          </MainFormLayout>
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <section className="section-container">
      {/* Agreement Header */}
      <ApplicationHeader
        callBack={handleOnBack}
        title="Online Application Form"
      />

      <div className="py-[3.3rem] px-[2rem] ">
        <div className="border-b border-b-black overflow-y-auto w-full h-auto lg:h-[80vh]">
          {renderContent(steps[currentStepIndex])}
        </div>
      </div>
    </section>
  );
};

export default FormRender;
