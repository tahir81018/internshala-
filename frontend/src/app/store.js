import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Feature/Userslice"
import userCredentialReducer from "../Feature/userCredentialSlice"
export const store=configureStore({
    reducer:{
        user:userReducer,
        userCredential:userCredentialReducer
    }
})