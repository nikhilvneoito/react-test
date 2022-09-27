import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewHttpResponse } from "../interfaces/newResponse.interface";
import { User } from "../interfaces/user.interface";
import userService from "../services/user.service";

export interface AppState {
  data: NewHttpResponse;
  isLoading: boolean;
  message: string;
  hasError?: boolean;
  error?: string;
}

const initialState: AppState = {
  data: {
    firstPage: "",
    lastPage: "",
    nextPage: "",
    prevPage: "",
    pageSize: 0,
    totalLengthPage: 0,
    users: [],
  },
  isLoading: true,
  message: "",
  hasError: false,
  error: "",
};

export const getUsers = createAsyncThunk(
  "users/getAll",
  async ({ key, criteria, page }: any) => {
    const response = await userService.getUsers(key, criteria, page);
    console.log(response.data);
    let first: string = "";
    let next: string = "";
    let prev: string = "";
    let last: string = "";
    let linkresponse = response.headers["link"];
    let totalCount = parseInt(response.headers["x-total-count"]!);
    let commaSplitted: string[] = linkresponse.split(", ");
    for (let item of commaSplitted) {
      let semicolonsplit = item.split("; rel=");
      switch (semicolonsplit[1].substring(1, semicolonsplit[1].length - 1)) {
        case "first":
          first = semicolonsplit[0].substring(1, semicolonsplit[0].length - 1);
          break;
        case "prev":
          prev = semicolonsplit[0].substring(1, semicolonsplit[0].length - 1);
          break;
        case "next":
          next = semicolonsplit[0].substring(1, semicolonsplit[0].length - 1);
          break;
        case "last":
          last = semicolonsplit[0].substring(1, semicolonsplit[0].length - 1);
          break;
      }
    }
    const currentLimit = parseInt(last.substring(last.length - 2, last.length));
    const finalResponse = {
      users: response.data,
      firstPage: first,
      lastPage: last,
      nextPage: next,
      prevPage: prev,
      pageSize: currentLimit,
      totalLengthPage: totalCount,
    };
    return finalResponse;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    appInit: (state) => {
      state.data = {
        firstPage: "",
        lastPage: "",
        nextPage: "",
        pageSize: 10,
        prevPage: "",
        totalLengthPage: 0,
        users: [],
      };
      state.message = "App Initialized";
      state.isLoading = false;
    },
    setUsers: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.message = "Users details updated/fetched successfully";
      state.hasError = false;
      state.error = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsers.pending, (state: AppState, action: any) => {
      console.log("getUsers in pending state");
      state.data.users = [];
    });
    builder.addCase(getUsers.fulfilled, (state: AppState, action: any) => {
      console.log(action.payload.users);
      console.log("getUsers succeeded");
      state.data = action.payload;
      state.message = "User details fetched successfully";
    });
  },
});

export const { appInit, setUsers } = userSlice.actions;
export default userSlice.reducer;
