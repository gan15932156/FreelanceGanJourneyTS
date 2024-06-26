import { createSlice } from "@reduxjs/toolkit";
export const lastIDCursorSlice = createSlice({
  name: "lastCursor",
  initialState: "",
  reducers: {
    setLastId: (state, action) => {
      return action.payload;
    },
  },
});
export const { setLastId } = lastIDCursorSlice.actions;
export default lastIDCursorSlice.reducer;
