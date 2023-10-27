import { createSlice } from "@reduxjs/toolkit";

const TaskSlice = createSlice({
    name: "task",
    initialState:{
        tasks: [],
        loading: false,
        error: false,
        success: false
    },
    reducers:{
        taskRequest(state){
            state.loading = true;
        },
        taskFail(state, action){
            state.error = action.payload;
            state.loading = false;
        },
        taskSuccess(state, action){
            state.tasks = action.payload;
            state.loading = false;
            state.success = true;
        }, taskReset(state){
            state.error = false;
            state.loading = false;
            state.success = false;
        }
    }
})