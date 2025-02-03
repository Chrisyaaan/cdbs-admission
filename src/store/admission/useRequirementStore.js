import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../lib/axiosInstance";
import fetchInstance from "../../lib/fetchInstance";
import useAdmissionStore from "./useAdmissionStore";

const initialRequirementState = {
  isLoading: false,
  fileNames: [],
  requirements: [
    { type: "birthCert", file: [] },
    { type: "recentIdPhoto", file: [] },
    { type: "reportPreviousCard", file: [] },
    { type: "parentQuestionnaire", file: [] },
    { type: "recoLetter", file: [] },
    { type: "jhsCert", file: [] },
    { type: "shsVoucherCert", file: [] },
    { type: "baptismalCert", file: [] },
    { type: "communionCert", file: [] },
    { type: "marriageCert", file: [] },
    { type: "alienCert", file: [] },
    { type: "passport", file: [] },
    { type: "nonCatholicWaiver", file: [] },
    { type: "reportPresentCard", file: [] },
  ],
  rejectedRequirementIds: [
    { type: "birthCert", ids: [] },
    { type: "recentIdPhoto", ids: [] },
    { type: "parentQuestionnaire", ids: [] },
    { type: "baptismalCert", ids: [] },
    { type: "communionCert", ids: [] },
    { type: "marriageCert", ids: [] },
    { type: "recoLetter", ids: [] },
    { type: "reportPreviousCard", ids: [] },
    { type: "reportPresentCard", ids: [] },
    { type: "nonCatholicWaiver", ids: [] },
    { type: "passport", ids: [] },
    { type: "alienCert", ids: [] },
  ],
};

const useAdmissionRequirementStore = create(
  persist(
    (set, get) => ({
      ...initialRequirementState,

      addFiles: (type, files) => {
        // const fileMetadata = files.map((file) => ({
        //   name: file.name,
        //   type: file.type,
        //   size: file.size,
        //   lastModified: file.lastModified,
        //   preview: URL.createObjectURL(file), // Optionally store a preview URL
        // }));

        set((state) => ({
          requirements: state.requirements.map((requirement) =>
            requirement.type === type
              ? { ...requirement, file: [...requirement.file, ...files] }
              : requirement
          ),
        }));
      },
      removeFile: (type, fileName) => {
        set((state) => ({
          requirements: state.requirements.map((requirement) =>
            requirement.type === type
              ? {
                  ...requirement,
                  file: requirement.file.filter(
                    (file) => file.name !== fileName
                  ),
                }
              : requirement
          ),
        }));
      },

      resetRequirements: () => {
        set({ requirements: initialRequirementState.requirements });
      },

      setFileNames: (updateFn) => {
        set((state) => ({
          fileNames: updateFn(state.fileNames),
        }));
      },

      setRejectedIds: (updateFn) => {
        set((state) => ({
          setRejectedIds: updateFn(state.rejectedRequirementIds),
        }));
      },

      // Handle Upload files
      handleUploadFiles: async (admissionSelected) => {
        const { requirements } = get();
        set({isLoading: true})
        const requirementTypeMap = {
          birthCert: 1,
          recentIdPhoto: 2,
          reportPreviousCard: 3,
          reportPresentCard: 14,
          parentQuestionnaire: 4,
          jhsCert: 6,
          shsVoucherCert: 7,
          baptismalCert: 8,
          communionCert: 9,
          marriageCert: 10,
          recoLetter: 5,
          nonCatholicWaiver: 13,
          alienCert: 11,
          passport: 12,
        };

        try {
          const uploadPromises = [];
          // for (const requirement of requirements) {
          //   if (requirement.file.length !== 0) {
          //     for (const file of requirement.file) {
          //       if (file instanceof File || Object.keys(file).length > 0) {
          //         const formData = new FormData();
          //         formData.append("bucket_name", "document_upload");
          //         formData.append("file", file);
          //         formData.append(
          //           "requirements_type",
          //           requirementTypeMap[requirement.type]
          //         );
          //         formData.append("admission_id", admissionSelected);

          //         fetchInstance(
          //           "https://donboscoapi.vercel.app/api/admission/upload_requirements",
          //           {
          //             method: "POST",
          //             body: formData,
          //           }
          //         )
          //           .then((data) => {
          //             console.log("Response data:", data);
          //           })
          //           .catch((error) => {
          //             console.error("Request failed:", error);
          //             return 500;
          //           });
          //       }
          //     }
          //   }
          // }

          // return 200
          for (const requirement of requirements) {
            if (requirement.file.length !== 0) {
              for (const file of requirement.file) {
                if (file instanceof File || Object.keys(file).length > 0) {
                  const formData = new FormData();
                  formData.append("bucket_name", "document_upload");
                  formData.append("file", file);
                  formData.append(
                    "requirements_type",
                    requirementTypeMap[requirement.type]
                  );
                  formData.append("admission_id", admissionSelected);
      
                  // Add fetch promise to array
                  const uploadPromise = fetchInstance(
                    "https://donboscoapi.vercel.app/api/admission/upload_requirements",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  uploadPromises.push(uploadPromise);
                }
              }
            }
          }
      
          // Wait for all upload promises to complete
          await Promise.all(uploadPromises);
      
          console.log("All uploads completed successfully.");
          return 200; // Return success status after all uploads finish
        } catch (error) {
          console.error("Error during upload process:", error);
          return 400
        } finally {
          set({ isLoading: false });
        }
      },

      handleDeleteUploadedFile: async (
        requirementType,
        admissionSelected,
        requiredDocId
      ) => {
        const {getUserSelectedData} = useAdmissionStore.getState()
        set({ isLoading: true });

        // console.log({
        //   "requirementType": requirementType,
        //   "admissionSelected": admissionSelected,
        //   "requiredDocId": requiredDocId,
        // })

        // return
        try {
          const response = await axiosInstance.post(
            "admission/remove_requirements",
            {
              requirements_type: requirementType,
              admission_id: admissionSelected,
              required_doc_id: requiredDocId,
            }
          );

          console.log(response);
          return 200;
        } catch (error) {
          console.log("ERROR WHILE DELETING THIS FILE: ", error);
          return 500;
        } finally {
          getUserSelectedData()
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "admission-requirement-store",
    }
  )
);

export default useAdmissionRequirementStore;
