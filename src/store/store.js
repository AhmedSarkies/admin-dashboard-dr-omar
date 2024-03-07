import { configureStore } from "@reduxjs/toolkit";

import sidebarSlice from "./slices/sidebarSlice.js";
import scholarReducer from "./slices/scholarSlice.js";
import bookSlice from "./slices/bookSlice.js";
import pictureSlice from "./slices/pictureSlice.js";
import audioSlice from "./slices/audioSlice.js";
import articleSlice from "./slices/articleSlice.js";
import subAdminSlice from "./slices/subAdminSlice.js";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    scholar: scholarReducer,
    book: bookSlice,
    picture: pictureSlice,
    audio: audioSlice,
    article: articleSlice,
    subAdmin: subAdminSlice,
  },
});

export default store;
