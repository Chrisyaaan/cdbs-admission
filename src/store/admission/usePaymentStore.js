import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAdmissionStore from "./useAdmissionStore";
import fetchInstance from "../../lib/fetchInstance";


const initialPaymentState = {
  file: null,
  fileName: "",
  pMethod: {
    cash: false,
    bank: false
  },
  isLoading: false,
  isPaying: false,
  paymentForm: {
    referenceNo: "",
    file: null,
  }
}

const usePaymentStore = create(
  persist(
    (set, get) => ({
      ...initialPaymentState,

      toggleIsPaying: () => set((state) => ({isPaying: !state.isPaying})),
      togglePaymentMethod: (method) => {
        const newMethodState = {
          cash: method === "cash",
          bank: method === "bank",
        };
        set({ pMethod: newMethodState });
      },
      resetIsPaying: () => set({isPaying: false}),
      closeModal: () =>
      set({
        pMethod: { cash: false, bank: false }, // Reset payment method on close
      }),
      resetPaymentForm: () => set({
        paymentForm: {
          referenceNo: "",
          file: null,
        }
      }),
      updatePaymentForm: (field, value) =>
        set((state) => ({
          paymentForm: {
            ...state.paymentForm,
            [field]: value,
          },
        })),
  

      handleSendPayment: async () => {
        const {currentAdmissionId} = useAdmissionStore.getState()
        const {paymentForm, pMethod, resetPaymentForm, closeModal} = get()
        // set({isLoading: true})
        const method_id = pMethod.cash ? 1 : pMethod.bank ? 2 : false;
        console.log("FORM TO BE PASSED")
        console.log(paymentForm)
        console.log(currentAdmissionId)
        console.log(method_id)

        const newForm = new FormData();
        newForm.append("file", paymentForm.file)
        newForm.append("reference_no", paymentForm.referenceNo)
        newForm.append("admission_id", currentAdmissionId)
        newForm.append("payment_method", method_id)

        try{
          const response = await fetchInstance("https://donboscoapi.vercel.app/api/admission/accept_agreement", {
            method: "POST",
            body:newForm
          })
          if(response){
            resetPaymentForm()
            closeModal()
          }
          console.log(response)
          return 200
        }catch(error){
          console.log(error)
          return 500
        }finally{
          set({isLoading: false})
        }

      }
    })
  )
);


export default usePaymentStore;