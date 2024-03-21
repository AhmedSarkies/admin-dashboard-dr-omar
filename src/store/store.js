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
  termsConditionsSlice,
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
    termsAndConditions: termsConditionsSlice,
  },
});

export default store;
