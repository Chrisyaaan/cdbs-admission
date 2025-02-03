import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../lib/axiosInstance";
import useAdmissionStore from "./useAdmissionStore";

const initialExamScheduleState = {
  selectedDate: null,
  isLoading: false,
  availableDates: [],
  examSchedules: [],
  scheduleDetails: {
    scheduleId: "",
    timeStart: "",
    timeEnd: "",
    location: "",
    date: "",
  },
  scheduleForSelectedDay: []
}


const levelMapping = {
  "Pre Kinder": "Pre Kinder & Kinder",
  Kinder: "Pre Kinder & Kinder",
  "Grade 1": "Grade 1",
  "Grade 2": "Grade 2",
  "Grade 3": "Grade 3",
  "Grade 4": "Grade 4 - 6",
  "Grade 5": "Grade 4 - 6",
  "Grade 6": "Grade 4 - 6",
  "Grade 7": "Grade 7 - 12",
  "Grade 8": "Grade 7 - 12",
  "Grade 9": "Grade 7 - 12",
  "Grade 10": "Grade 7 - 12",
  "Grade 11": "Grade 7 - 12",
  "Grade 12": "Grade 7 - 12",
};

const useExamScheduleStore = create(
  persist(
    (set, get) => ({
      ...initialExamScheduleState,

    resetState: () => set(initialExamScheduleState),
    getExamSchedule: async (levelApplyingFor) => {
      const {resetState} = get()
      resetState()
      set({isLoading: true})

      const revisedLevelString = levelMapping[levelApplyingFor] || levelApplyingFor;


      try{
        const response = await axiosInstance.post("admission/check_exam_schedule", {
          level_applying_for: revisedLevelString
        })

        const examSched = response.data.exam_schedules

        const formattedDates = examSched.map((el) =>
          new Date(el.exam_date).toISOString().split("T")[0]
        );

        set({
          examSchedules: examSched,
          availableDates: formattedDates,
          isLoading: false,
        });

      }catch(error){  
        console.log("ERROR OCCURRED WHILE GETTING EXAM SCHEDULES: ", error)
      }finally {
        set({isLoading:false})
      }
    },

    handleReserveDate: async (scheduleId, levelApplyingFor) => {
      const {currentAdmissionId} = useAdmissionStore.getState()
      set({isLoading: true})

      const revisedLevelString = levelMapping[levelApplyingFor] || levelApplyingFor;

            
      console.log(revisedLevelString)
      console.log(currentAdmissionId)
      console.log(scheduleId)
      try{
        const response = await axiosInstance.post("admission/reserve_slot_exam", {
          schedule_id: scheduleId,
          admission_id: currentAdmissionId,
          level_applying_for: revisedLevelString,
        })

        console.log(response)
      }catch(error){
        console.log("ERROR WHILE SUBMITING SCHEDULE: ", error)
        return 500
      }finally{
        set({isLoading: false})
      }
    },

    toggleUpdateScheduleForSelectedDay: (day) => set({scheduleForSelectedDay: day}),

    toggleUpdateScheduleDetail: (updates) =>
      set((state) => ({
        scheduleDetails: {
          ...state.scheduleDetails,
          ...updates,
        },
      })),
    toggleSelectedDate: (date) => set({selectedDate: date}) 

    }), {
      name: "exam-sched-store"
    }
  )
)

export default useExamScheduleStore;