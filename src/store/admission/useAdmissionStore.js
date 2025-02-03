import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../lib/axiosInstance";
import { LEVELS, NATIONALITIES, RELIGIONS, SURVEY_VALUE } from "../../data";
import { calculateAge } from "../../utils";
import useAddressStore from "../api/addressStore";

const initialAdmissionState = {
  userId: localStorage.getItem("userId"),
  admissions: [],
  selectedUserAdmission: [],
  applicants: {
    gradeLevel: "",
    scheduleSlots: [
      { level: "Pre-Kinder", available: false },
      { level: "Kinder", available: false },
      { level: "Grade 1", available: false },
      { level: "Grade 2", available: false },
      { level: "Grade 3", available: false },
      { level: "Grade 4", available: false },
      { level: "Grade 5", available: false },
      { level: "Grade 6", available: false },
      { level: "Grade 7", available: false },
      { level: "Grade 8", available: false },
      { level: "Grade 9", available: false },
      { level: "Grade 10", available: false },
      { level: "Grade 11", available: false },
      { level: "Grade 12", available: false },
    ],
    firstName: "",
    lastName: "",
    middleName: "",
  },
  isLoading: false,

  currentAdmissionId: "",
  declarationPackage: false,
  declarationSupportingDoc: false,
  parentCheck: {
    father: false,
    mother: false,
    guardian: false,
  },
  familyBackgroundId: "",
  admissionFormSteps: "",

  admissionPersonalData: {
    levelApplyingFor: "",
    schoolYear: "",
    familyName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    sex: "",
    religion: "",
    otherCitizenship: "",
    otherReligion: "",
    citizenship: "",
    acrNumber: "",
    address: "",
    province: "",
    city: "",
    baranggay: "",
    postalCode: "",
    contactNo: "",
    languages: "",
    usualCompanion: "",
  },

  admissionAcademicData: {
    namePresentSchool: "",
    addressPresentSchool: "",
    presentSchoolContactNo: "",
    awardsHonor: "",
    escGrantee: "",
    currentGrade: "",
    currentSchoolYear: "",
  },

  admissionFamilyData: {
    noOfSiblings: 0,
    siblings: [],
  },

  admissionParentData: {
    currentParentData: {
      parentStatus: "",
      civilWedding: "",
      churchName: "",
      relationshipToChildGuardian: "",
      parentGuardian: [],
    },
    father: {
      parentId: "",
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    },
    mother: {
      parentId: "",
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    },
    guardian: {
      parentId: "",
      background_id: "",
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    },
  },

  admissionSpecialConcern: {
    admission_id: "",
    bucket_name: "support_documents",
    special_concern: "",
    medical_condition: "",
    medication: "",
    intervention: "",
    files: [],
  },

  admissionSurvey: {
    heardList: [],
    heardOthers: "",
    factorsInfluenceList: [],
    factorsOthers: "",
  },
};

const useAdmissionStore = create(
  persist((set, get) => ({
    ...initialAdmissionState,

    resetAdmissionState: () =>
      set({
        ...initialAdmissionState,
        userId: localStorage.getItem("userId"), // Ensure userId is preserved on reset
      }),

      resetAdmissionFormState: () => 
        set({
          currentAdmissionId: "",
          declarationPackage: false,
          declarationSupportingDoc: false,
          parentCheck: {
            father: false,
            mother: false,
            guardian: false,
          },
          familyBackgroundId: "",
          admissionFormSteps: "",
          
          admissionPersonalData: {
            levelApplyingFor: "",
            schoolYear: "",
            familyName: "",
            firstName: "",
            middleName: "",
            dateOfBirth: "",
            placeOfBirth: "",
            age: "",
            sex: "",
            religion: "",
            otherCitizenship: "",
            otherReligion: "",
            citizenship: "",
            acrNumber: "",
            address: "",
            province: "",
            city: "",
            baranggay: "",
            postalCode: "",
            contactNo: "",
            languages: "",
            usualCompanion: "",
          },
  
          admissionAcademicData: {
            namePresentSchool: "",
            addressPresentSchool: "",
            presentSchoolContactNo: "",
            awardsHonor: "",
            escGrantee: "",
            currentGrade: "",
            currentSchoolYear: "",
          },
  
          admissionFamilyData: {
            noOfSiblings: 0,
            siblings: [],
          },
  
          admissionParentData: {
            currentParentData: {
              parentStatus: "",
              civilWedding: "",
              churchName: "",
              relationshipToChildGuardian: "",
              parentGuardian: [],
            },
            father: {
              parentId: "",
              lastName: "",
              firstName: "",
              middleName: "",
              dateOfBirth: "",
              age: "",
              educationAttainment: "",
              employmentStatus: "",
              employedAt: "",
              officeAddress: "",
              contactNo: "",
              position: "",
              salary: "",
            },
            mother: {
              parentId: "",
              lastName: "",
              firstName: "",
              middleName: "",
              dateOfBirth: "",
              age: "",
              educationAttainment: "",
              employmentStatus: "",
              employedAt: "",
              officeAddress: "",
              contactNo: "",
              position: "",
              salary: "",
            },
            guardian: {
              parentId: "",
              background_id: "",
              lastName: "",
              firstName: "",
              middleName: "",
              dateOfBirth: "",
              age: "",
              educationAttainment: "",
              employmentStatus: "",
              employedAt: "",
              officeAddress: "",
              contactNo: "",
              position: "",
              salary: "",
            },
          },
  
          admissionSpecialConcern: {
            admission_id: "",
            bucket_name: "support_documents",
            special_concern: "",
            medical_condition: "",
            medication: "",
            intervention: "",
            files: [],
          },
  
          admissionSurvey: {
            heardList: [],
            heardOthers: "",
            factorsInfluenceList: [],
            factorsOthers: "",
          },
  
          // Optional: Reset any other properties you want here
          isLoading: false,
        }),

    resetAdmissionDeclaration: () =>
      set({
        declarationPackage: false,
        declarationSupportingDoc: false,
        admissionFormSteps: "",
      }),

    setGradeLevel: (gradeLevel) =>
      set((state) => ({
        applicants: {
          ...state.applicants,
          gradeLevel,
        },
        admissionPersonalData: {
          ...state.admissionPersonalData,
          levelApplyingFor: gradeLevel,
        },
      })),

    setScheduleSlots: (slotAvailable) =>
      set((state) => ({
        applicants: {
          ...state.applicants,
          scheduleSlots: slotAvailable, // Only update scheduleSlots
        },
      })),

    setApplicantsFullName: (updatedFields) =>
      set((state) => ({
        applicants: {
          ...state.applicants,
          ...updatedFields, // Merge the updated fields with the existing applicants state
        },
      })),

    clearApplicantRegister: () => set(() => ({ ...initialAdmissionState })),

    setIsLoading: (isLoading) => set({ isLoading }),

    // Functions

    handleSlotCheck: async () => {
      set({ isLoading: true });
      try {
        const response = await axiosInstance.get("admission/check_slot");

        console.log("HANDLE SLOT CHECK RESPONSE: ", response);

        if (response) {
          const data = response.data.data;
          console.log("DATA RESPONSE: ", data);
          const slotAvailable = LEVELS.map((level) => ({
            level,
            available: data?.some(
              (el) =>
                el["level_applying"] === level && el["slot_full"] === false
            ),
          }));

          console.log("SLOT AVAILABLE: ", slotAvailable);

          set((state) => ({
            ...state.applicants,
            scheduleSlots: slotAvailable,
          }));
        }
      } catch (e) {
        console.log("Error occurred while checking slot: ", e);
      } finally {
        set({ isLoading: false });
      }
    },

    submitApplicantRegister: async ({ formBody }) => {
      set({ isLoading: true });
      try {
        const response = await axiosInstance.post(
          "admission/register_admission",
          {
            user_id: get().userId,
            level_applying: formBody.level_applying,
            fname: formBody.fname,
            mname: formBody.mname,
            lname: formBody.lname,
          }
        );

        console.log("APPLICATION SUBMITTED RESPONSE: ", response);

        if (response) {
          const userId = localStorage.getItem("userId");
          set((state) => ({
            admissionPersonalData: {
              ...state.admissionPersonalData,
              levelApplyingFor: formBody.level_applying,
            },
          }));
          await get().getAllUserAdmissions(userId);

          return { status: 200, message: "Admission data found" };
        }
      } catch (e) {
        console.log(e);
      } finally {
        set({ isLoading: false });
      }
    },

    getAllUserAdmissions: async (user_id) => {
      set({ isLoading: true });
      try {
        const response = await axiosInstance.post(
          "admission/get_user_admission",
          {
            user_id: user_id,
          }
        );

        console.log("ALL ADMISSIONS: ", response);

        if (response) {
          const userAdmissions = response.data.user;

          console.log(userAdmissions);
          set({ admissions: userAdmissions });
        }
      } catch (e) {
        console.log("ERROR GETTING ALL USER ADMIN: ", e);
      } finally {
        set({ isLoading: false });
      }
    },

    getAdmissionUser: async (user_id) => {
      set({ isLoading: true });
      const { handleFetchCities, handleFetchBaranggays } =
        useAddressStore.getState();

      const {handleChecked} = get()

      try {
        const response = await axiosInstance.post(
          "admission/get_user_admission",
          {
            admission_id: user_id,
          }
        );

        console.log("ADMISSION USER RESPONSE: ");
        console.log(response.data.user[0]);
        const result = response.data.user[0];
        const admissionResponseData = result.db_admission_table;

        let firstLine;
        let province;
        let city;
        let baranggay;

        if (admissionResponseData.address !== "") {
          const addressArr = admissionResponseData.address.split("|");
          firstLine = addressArr[0];
          province = addressArr[3];
          await handleFetchCities(province);
          city = addressArr[2];
          await handleFetchBaranggays(city);
          baranggay = addressArr[1];
        }

        console.log("ADRESS HERE =========");
        console.log(firstLine);
        console.log(province);

        set((state) => ({
          admissionPersonalData: {
            ...state.admissionPersonalData,
            levelApplyingFor: admissionResponseData.level_applying_for,
            schoolYear: admissionResponseData.school_year,
            familyName: admissionResponseData.last_name,
            firstName: admissionResponseData.first_name,
            middleName: admissionResponseData.middle_name,
            dateOfBirth: admissionResponseData.date_of_birth,
            placeOfBirth: admissionResponseData.place_of_birth,
            age: calculateAge(admissionResponseData.date_of_birth),
            sex: admissionResponseData.sex,
            religion: RELIGIONS.includes(admissionResponseData.religion)
              ? admissionResponseData.religion
              : admissionResponseData.religion === null
              ? ""
              : "Others",
            otherReligion: RELIGIONS.includes(
              admissionResponseData.religion
                ? ""
                : admissionResponseData.religion
            ),
            citizenship: NATIONALITIES.includes(
              admissionResponseData.citizenship
            )
              ? admissionResponseData.citizenship
              : admissionResponseData.citizenship === null
              ? ""
              : "Others",
            otherCitizenship: NATIONALITIES.includes(
              admissionResponseData.citizenship
                ? ""
                : admissionResponseData.citizenship
            ),
            acrNumber: admissionResponseData.acr_number,
            address: firstLine,
            province: province,
            city: city,
            baranggay: baranggay,
            postalCode: admissionResponseData.zip_postal_code,
            contactNo: admissionResponseData.contact_no,
            languages: admissionResponseData.language_dialect_spoken,
            usualCompanion: admissionResponseData.usual_companion_at_home,
          },
        }));

        //Setting Academic Background
        if (admissionResponseData.db_academic_background.length !== 0) {
          const existingData = admissionResponseData.db_academic_background[0];
          set((state) => ({
            admissionAcademicData: {
              ...state.admissionAcademicData,
              namePresentSchool: existingData.name_of_present_school ?? "",
              addressPresentSchool:
                existingData.address_of_present_school ?? "",
              presentSchoolContactNo: existingData.school_contact_no ?? "",
              awardsHonor: existingData.awards_honors_received ?? "",
              escGrantee: existingData.esc_grantee ?? "",
              currentGrade: existingData.current_grade_level ?? "",
              currentSchoolYear: existingData.school_year ?? "",
            },
          }));
        }

        if (admissionResponseData.db_family_background_table.length !== 0) {
          const existingBgTable =
            admissionResponseData.db_family_background_table[0];

          const siblingArr = existingBgTable.db_sibling_table.map((item) => ({
            siblingId: item.sibling_id,
            siblingFamilyName: item.sibling_last_name,
            siblingFirstName: item.sibling_first_name,
            siblingMiddleName: item.sibling_middle_name,
            siblingDob: item.sibling_bday,
            siblingAge: calculateAge(item.sibling_bday) ,
            siblingOccupation: item.sibling_grade_course_occupation,
            siblingBusinessOffice: item.sibling_school_business,
          }));

          console.log("EXISTING TABLE PARENT STATUS: ")
          console.log(existingBgTable.parent_status)

          set((state) => ({
            admissionFamilyData: {
              ...state.admissionFamilyData,
              noOfSiblings: existingBgTable.no_of_siblings,
              siblings: siblingArr,
            },
            admissionParentData: {
              ...state.admissionParentData,
              currentParentData: {
                parentStatus: existingBgTable.parent_status ?? "",
                civilWedding: existingBgTable.civil_wedding ?? "",
                churchName: existingBgTable.church_name ?? "",
                parentGuardian: existingBgTable.db_parent_table
              },
            },
          }));

          handleChecked("father", existingBgTable.db_parent_table);
          handleChecked("mother", existingBgTable.db_parent_table);
          handleChecked("guardian", existingBgTable.db_parent_table);
        }

        if(admissionResponseData.db_special_concerns_table.length !== 0) {
          const existingConcerns = admissionResponseData.db_special_concerns_table[0]
          set((state) => ({
            admissionSpecialConcern: {
              ...state.admissionSpecialConcern,
              bucket_name: existingConcerns.supporting_documents ?? "",
              special_concern: existingConcerns.special_concern ?? "",
              medical_condition: existingConcerns.medical_condition ?? "",
              medication: existingConcerns.medication ?? "",
              intervention: existingConcerns.intervention ?? "",
              admissionId: existingConcerns.admission_id,
            }
          }))
        }

        const existingSurveyData = admissionResponseData.db_survey_table[0]
        set((state) => {
          const heardList = existingSurveyData.heard_about_school
          ? existingSurveyData.heard_about_school.split(",").map((item) => item.trim())
          : [];
        const factorsInfluenceList = existingSurveyData.factors_influencing_decision
          ? existingSurveyData.factors_influencing_decision.split(",").map((item) => item.trim())
          : [];
      
        // Separate valid values and "Others" for heardList
        const validHeardList = heardList.filter((item) => SURVEY_VALUE.includes(item));
        const heardOthers = heardList.filter((item) => !SURVEY_VALUE.includes(item));
        if (heardOthers.length > 0) {
          validHeardList.push("Others"); // Add "Others" if there are any unknown values
        }
        // Separate valid values and "Others" for factorsInfluenceList
        const validFactorsList = factorsInfluenceList.filter((item) =>
          SURVEY_VALUE.includes(item)
        );
        const factorsOthers = factorsInfluenceList.filter(
          (item) => !SURVEY_VALUE.includes(item)
        );
        if (factorsOthers.length > 0) {
          validFactorsList.push("Others"); // Add "Others" if there are any unknown values
        }
      
      
        return {
          admissionSurvey: {
            ...state.admissionSurvey,
            heardList: validHeardList,
            heardOthers: heardOthers.join(", "), // Convert array back to a string
            factorsInfluenceList: validFactorsList,
            factorsOthers: factorsOthers.join(", ") // Convert array back to a string
          }
        };
        })
      } catch (err) {
        console.log("ERROR WHILE FETCHING ADMISSION USER: ", err);
      } finally {
        // set({ isLoading: false });
      }
    },

    getUserSelectedData: async () => {
      set({isLoading: true})

      const {currentAdmissionId} = get()

      console.log("CURRENT ADMISSION ID")
      console.log(currentAdmissionId)
      try{
        const response = await axiosInstance.post(
          "admission/get_user_admission",
          {
            admission_id: currentAdmissionId,
          }
        );

        set((state) => ({
          selectedUserAdmission: {
            ...state.selectedUserAdmission,
            ...response.data.user[0]
          }
        }))

      }catch(error){
        console.log("ERROR WHILE FETCHING SELECTED USER: ", error)
      }finally {
        set({isLoading: false})
      }
    },

    submitPersonalData: async () => {
      // Start loading state
      set({ isLoading: true });

      // Destructure necessary values for cleaner code
      const {
        levelApplyingFor,
        familyName,
        firstName,
        middleName,
        dateOfBirth,
        placeOfBirth,
        sex,
        religion,
        otherReligion,
        citizenship,
        otherCitizenship,
        acrNumber,
        address,
        baranggay,
        city,
        province,
        postalCode,
        contactNo,
        languages,
        usualCompanion,
      } = get().admissionPersonalData;

      // Fetch userId and admissionSelected from the state
      const { userId, currentAdmissionId: admissionSelected } = get();

      // Prepare the payload
      const payload = {
        admission_id: admissionSelected,
        user_id: userId,
        level_applying: levelApplyingFor,
        school_year: "2025-2026",
        fname: firstName,
        mname: middleName,
        lname: familyName,
        birthdate: dateOfBirth,
        birth_place: placeOfBirth,
        sex,
        religion: religion === "Others" ? otherReligion : religion,
        citizenship: citizenship === "Others" ? otherCitizenship : citizenship,
        acr_no: acrNumber,
        address: `${address}|${baranggay}|${city}|${province}`,
        zip_postal: postalCode,
        contact_no: contactNo,
        languages_dialect: languages,
        companion_at_home: usualCompanion,
        admission_date: new Date().toISOString().split("T")[0],
      };

      try {
        // Send the API request
        const response = await axiosInstance.post(
          "admission/create_admission",
          payload
        );

        console.log(response);
        if (
          response.data.message ===
          "Admission record created or updated successfully"
        ) {
          return 200;
        } else {
          return 400;
        }
      } catch (error) {
        // Handle errors gracefully
        console.error("Error submitting personal data:", error);
        return 500;
      } finally {
        // Reset loading state
        set({ isLoading: false });
      }
    },

    submitAcademicData: async () => {
      set({ isLoading: true });
      const {
        namePresentSchool,
        addressPresentSchool,
        presentSchoolContactNo,
        awardsHonor,
        escGrantee,
        currentGrade,
        currentSchoolYear,
      } = get().admissionAcademicData;

      const { userId, currentAdmissionId: admissionSelected } = get();

      const payload = {
        admission_id: admissionSelected,
        user_id: userId,
        name_present_school: namePresentSchool,
        address_present_school: addressPresentSchool,
        present_school_contact_no: presentSchoolContactNo,
        awards_honor: awardsHonor,
        esc: escGrantee,
        current_grade: currentGrade,
        current_school_year: currentSchoolYear,
      };

      try {
        // Send the API request
        const response = await axiosInstance.post(
          "admission/create_academic_background",
          payload
        );

        console.log(response);
        if (
          response.data.message ===
          "Academic record created or updated successfully"
        ) {
          return 200;
        } else {
          return 400;
        }
      } catch (error) {
        // Handle errors gracefully
        console.error("Error submitting personal data:", error);
        return 500;
      } finally {
        // Reset loading state
        set({ isLoading: false });
      }
    },

    submitFamilyData: async () => {
      const { admissionFamilyData, currentAdmissionId } = get();
      const { siblings, noOfSiblings } = admissionFamilyData;

      console.log("ADMISSION ID: ", currentAdmissionId);

      // Convert indexed object to an array
      const siblingArray = Object.values(siblings);

      // Transform siblings data
      const formattedSiblings = siblingArray.map(
        ({
          siblingId,
          siblingFirstName,
          siblingMiddleName,
          siblingFamilyName,
          siblingDob,
          siblingOccupation,
          siblingBusinessOffice,
        }) => ({
          sibling_id: siblingId,
          siblings_fname: siblingFirstName,
          siblings_mname: siblingMiddleName,
          siblings_lname: siblingFamilyName,
          siblings_bday: siblingDob,
          level_course_occupation: siblingOccupation,
          school_business: siblingBusinessOffice,
        })
      );

      set({ isLoading: true });

      try {
        const { data } = await axiosInstance.post(
          "admission/create_family_background_siblings",
          {
            admission_id: currentAdmissionId,
            no_siblings: noOfSiblings,
            siblings: formattedSiblings,
          }
        );

        console.log(data.family_background_id);

        set({ parentBackgroundId: data.family_background_id });
        // Return status based on server response
        return data.message ===
          "Family background record created or updated successfully"
          ? 200
          : 400;
      } catch (error) {
        console.error("ERROR WHILE SUBMITTING SIBLING DATA:", error);
        return 500;
      } finally {
        set({ isLoading: false });
      }
    },

    submitParentData: async () => {
      const { admissionParentData, parentBackgroundId, parentCheck } = get();
      const { parentStatus, civilWedding, churchName } = admissionParentData.currentParentData;
      const { father, mother, guardian } = parentCheck;

      console.log(parentBackgroundId);
      set({ isLoading: true });

      const createParentObject = (data, relationship) => ({
        parent_id: data.parentId || null,
        p_fname: data.firstName,
        p_mname: data.middleName,
        p_lname: data.lastName,
        p_birthday: data.dateOfBirth,
        educational_attainment: data.educationAttainment,
        employment_status: data.employmentStatus,
        employed_at: data.employedAt,
        office_address: data.officeAddress,
        office_contact_no: data.contactNo,
        position: data.position,
        salary_scale: data.salary,
        relationship,
      });

      let parentGuardianArr = [];

      if (father) {
        parentGuardianArr.push(
          createParentObject(admissionParentData.father, "father")
        );
      }

      if (mother) {
        parentGuardianArr.push(
          createParentObject(admissionParentData.mother, "mother")
        );
      }

      if (guardian) {
        parentGuardianArr.push(
          createParentObject(admissionParentData.guardian, "guardian")
        );
      }

      console.log({
        background_id: parseInt(parentBackgroundId),
        parent_status: parentStatus,
        civil_wedding: civilWedding,
        church_name: churchName,
        parent_guardian: parentGuardianArr,
      });

      try {
        const response = await axiosInstance.post(
          "admission/create_family_background_parent",
          {
            background_id: parseInt(parentBackgroundId),
            parent_status: parentStatus,
            civil_wedding: civilWedding,
            church_name: churchName,
            parent_guardian: parentGuardianArr,
          }
        );

        console.log(response)

        return response.status
      } catch (error) {
        //TODO: URGENT ON FIXING TO HANDLE ERROR
        console.log("ERROR WHILE SUBMITING PARENT DATA: ", error);
        if (
          error.response.data.error ===
          "Cannot read properties of undefined (reading 'admission_id')"
        )
          return 200;
        return 500;
      } finally {
        set({ isLoading: false });
      }
    },

    submitConcernData: async () => {
      const { admissionSpecialConcern, currentAdmissionId } = get();
      const {
        specialConcern,
        medicalCondition,
        medication,
        intervention,
        files,
      } = admissionSpecialConcern;

      set({ isLoading: true });

      const formData = new FormData();
      const fields = {
        admission_id: currentAdmissionId,
        bucket_name: "support_documents",
        special_concern: specialConcern,
        medical_condition: medicalCondition,
        medication: medication,
        intervention: intervention,
      };

      // Loop through fields and append them to FormData
      Object.entries(fields).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append files to FormData (if any)
      files?.forEach((file) => formData.append("files", file));

      console.log(formData);

      try {
        const response = await axiosInstance.post(
          "admission/create_special_concern",
          formData
        );

        return response.status;
      } catch (error) {
        console.error("ERROR WHILE SUBMITTING CONCERN DATA: ", error);
        return 500;
      } finally {
        set({ isLoading: false });
      }
    },

    submitSurveyData: async () => {
      set({ isLoading: true });
      const { admissionSurvey, currentAdmissionId } = get();

      const { heardList, heardOthers, factorsInfluenceList, factorsOthers } =
        admissionSurvey;

      // Replace "Others" in the heardList and factorsInfluenceList with the others values
      const updatedHeardList = heardList.map((item) =>
        item === "Others" && heardOthers ? heardOthers : item
      );
      const updatedFactorsInfluenceList = factorsInfluenceList.map((item) =>
        item === "Others" && factorsOthers ? factorsOthers : item
      );

      const payload = {
        admission_id: currentAdmissionId,
        heard_about_school: updatedHeardList.join(","),
        factors_influencing_decision: updatedFactorsInfluenceList.join(","),
        // ...(heardOthers && { heard_others: heardOthers }), // Add "heard_others" only if there is a value
        // ...(factorsOthers && { factors_others: factorsOthers }), // Add "factors_others" only if there is a value
      };

      console.log(payload);

      try {
        const response = await axiosInstance.post("admission/create_survey", {
          ...payload,
        });

        console.log(response);
        return response.status;
      } catch (error) {
        console.log("ERROR WHILE SUBMITTING SURVEY DATA: ", error);
        return 500;
      } finally {
        set({ isLoading: false });
      }
    },

    // Form management
    toggleDeclarationPackage: () =>
      set((state) => ({ declarationPackage: !state.declarationPackage })),
    toggleDeclarationSupportingDoc: () =>
      set((state) => ({
        declarationSupportingDoc: !state.declarationSupportingDoc,
      })),
    setCurrentAdmissionId: (admissionId) =>
      set({ currentAdmissionId: admissionId }),
    setAdmissionFormSteps: (step) => set({ admissionFormSteps: step }),

    handleSubmitDeclaration: async (admissionId) => {
      set({ isLoading: true });

      try {
        console.log(admissionId);
        const res = await axiosInstance.post("admission/accept_agreement", {
          admission_id: admissionId,
          agreement_accepted: true,
        });

        if (res) {
          console.log("AGREEMENT ACCEPTED: ", res);
          return 200;
        }
      } catch (e) {
        console.log(e);
        return 500;
      } finally {
        set({ isLoading: false });
      }
    },

    toggleUpdatePersonalData: (fieldName, value) =>
      set((state) => ({
        admissionPersonalData: {
          ...state.admissionPersonalData,
          [fieldName]: value,
        },
      })),
    toggleUpdateAcademicData: (fieldName, value) =>
      set((state) => ({
        admissionAcademicData: {
          ...state.admissionAcademicData,
          [fieldName]: value,
        },
      })),
    toggleUpdateFamilyData: (fieldName, value) =>
      set((state) => ({
        admissionFamilyData: {
          ...state.admissionFamilyData,
          [fieldName]: value,
        },
      })),
    toggleUpdateParentData: (fieldName, value, parent) =>
      set((state) => ({
        admissionParentData: {
          ...state.admissionParentData,
          [parent]: {
            ...state.admissionParentData[parent],
            [fieldName]: value,
          },
        },
      })),
    toggleUpdateParentChecked: (parent, value) => {
      set((state) => ({
        parentCheck: {
          ...state.parentChecked,
          [parent]: value,
        },
      }));
    },
    setFamilyData: (updateFn) =>
      set((state) => ({
        admissionFamilyData: updateFn(state.admissionFamilyData),
      })),
    setCurrentParentData: (updateFn) =>
      set((state) => ({
        admissionParentData: updateFn(state.admissionParentData),
      })),
    setSurveyData: (updateFn) =>
      set((state) => ({
        admissionSurvey: updateFn(state.admissionSurvey),
      })),

    toggleUpdateSpecialConcern: (field, value) =>
      set((state) => ({
        admissionSpecialConcern: {
          ...state.admissionSpecialConcern,
          [field]: value,
        },
      })),
    toggleUpdateSurvey: (field, value) =>
      set((state) => ({
        admissionSurvey: {
          ...state.admissionSurvey,
          [field]: value,
        },
      })),
    
    // Helper Function

    handleChecked: (type, data) => {
      const relationshipData = data.find(
        (el) => el["relationship_to_child"].toLowerCase() === type.toLowerCase()
      );

      console.log({"TYPE": type})
      console.log(data)
  
      if (relationshipData) {
        

        const newParentData = {
          parentId: relationshipData["parent_id"],
          lastName: relationshipData["last_name"],
          firstName: relationshipData["first_name"],
          middleName: relationshipData["middle_name"],
          dateOfBirth: relationshipData["date_of_birth"],
          age: calculateAge(relationshipData["date_of_birth"] || ""), // You can calculate the age if needed
          educationAttainment: relationshipData["educational_attainment"],
          employmentStatus: relationshipData["employment_status"],
          employedAt: relationshipData["employed_at"],
          officeAddress: relationshipData["office_address"],
          contactNo: relationshipData["contact_no"],
          position: relationshipData["job_position"],
          salary: relationshipData["salary_scale"],
        };
  
        set((state) => ({
          admissionParentData: {
            ...state.admissionParentData,
            [type]: newParentData,
          },
          parentCheck:{
            ...state.parentCheck,
            [type]: true
          }
        }));
      }
    },
  }))
);

export default useAdmissionStore;
