import { jwtVerify, SignJWT } from "jose";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../lib/axiosInstance";

const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

const initialAuthState = {
  sessionToken: null,
  user: {
    userId: "",
    accountType: null,
    contactNo: null,
    admissions: [],
    emailAddress: null,
    firstName: null,
    middleName: null,
    lastName: null,
    isVerified: null,
    registryType: null,
  },
  isLoading: false,
  error: "",
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialAuthState,
      // admissions: {
      //   admissionsArr: [],
      // },

      setUser: (user) => set((state) => ({...state, user: user})),

      createToken:async(dataObj) => {
        const token = await new SignJWT(dataObj)
        .setProtectedHeader({
          alg: "HS256",
        })
        .sign(SECRET_KEY);
  
      localStorage.setItem("userId", dataObj["userId"]);
      localStorage.setItem("sessionToken", token);
      set({sessionToken: token});
      },

      verifyToken: async (token) => {
        // console.log("VERIFYING THIS TOKEN: ", token)
        try {
          const { payload } = await jwtVerify(token, SECRET_KEY);
          // console.log("Decoded Payload:", payload);
          return payload;
        } catch (error) {
          console.error("Invalid or expired token", error);
          return null;
        }
      },

      handleSessionToken: async (sessionToken) => {
        if(!sessionToken){
          // console.log("No session Token: ", sessionToken)
          return 
        }
        const decodedUser = await get().verifyToken(sessionToken);
        if (decodedUser) {
          set({ user: decodedUser });
        }
      },

      initializeSession: () => {
        // console.log("SECRET: ", import.meta.env.VITE_JWT_SECRET)
        const sessionToken = localStorage.getItem("sessionToken");
        // console.log("SESSION_TOKEN FROM INITIALIZESESSION: ", sessionToken)
        if (sessionToken) {
          // console.log("RUNNING HANDLE SESSION IN INITIALIZE SESSION")
          get().handleSessionToken(sessionToken);
        }
      },

      login: async ({ body }) => {
        // console.log("LOGIN BODY: ", body)
        // return
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("admission/login_account", {
            email: body.email,
            password: body.password,
          });

          // console.log("RESPONSE FROM LOGIN: ", response)

          if(response){
            const data = response.data
            const user = data.user;

            set({user: {
              userId: user.user_id,
              accountType: user.account_type,
              contactNo: user.contact_no,
              admissions: user.db_admission_table,
              emailAddress: user.email_address,
              firstName: user.first_name,
              middleName: user.middle_name,
              lastName: user.last_name,
              isVerified: user.is_verified,
              registryType: user.registry_type,
            }});
  
            // console.log("CREATING TOKEN: ")
            await get().createToken(get().user);
          }
        } catch (e) {
          console.error("Error during login:", e);
          return 401;
        } finally{
          set({isLoading: false})
        }
      },


      handleVerifyEmail: async (token) => {
        set({isLoading: true})
        try{
          const response = await axiosInstance.post(`admission/verify_email?token=${token}`)

          console.log(`RESPONSEBODY: ${response.body}`);
        }catch(e){
          console.log(`Error occurred while verifying email: ${e}`)
        }finally {
          set({isLoading: false})
        }
      }
    }),
    {
      name: "auth-store", // The key in localStorage
      partialize: (state) => ({ user: state.user }), // Optionally save only part of the state
    }
  )
);

export default useAuthStore;
