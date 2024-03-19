import { configureStore } from "@reduxjs/toolkit";

import {
  scholarSlice,
  bookSlice,
  pictureSlice,
  audioSlice,
  articleSlice,
  subAdminSlice,
  messagesSlice,
  mostListeningSlice,
  sliderSlice,
  codeContentSlice,
  settingsSlice,
} from "./slices";

const store = configureStore({
  reducer: {
    scholar: scholarSlice,
    book: bookSlice,
    picture: pictureSlice,
    audio: audioSlice,
    article: articleSlice,
    subAdmin: subAdminSlice,
    messages: messagesSlice,
    mostListening: mostListeningSlice,
    slider: sliderSlice,
    codeContent: codeContentSlice,
    settings: settingsSlice,
  },
});

export default store;
