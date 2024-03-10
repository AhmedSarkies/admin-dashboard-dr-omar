import { configureStore } from "@reduxjs/toolkit";

import scholarReducer from "./slices/scholarSlice.js";
import bookSlice from "./slices/bookSlice.js";
import pictureSlice from "./slices/pictureSlice.js";
import audioSlice from "./slices/audioSlice.js";
import articleSlice from "./slices/articleSlice.js";
import subAdminSlice from "./slices/subAdminSlice.js";
import messagesSlice from "./slices/messagesSlice.js";

const store = configureStore({
  reducer: {
    scholar: scholarReducer,
    book: bookSlice,
    picture: pictureSlice,
    audio: audioSlice,
    article: articleSlice,
    subAdmin: subAdminSlice,
    messages: messagesSlice,
  },
});

export default store;
