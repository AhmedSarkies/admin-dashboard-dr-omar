import { configureStore } from "@reduxjs/toolkit";

import {
  scholarSlice,
  bookSlice,
  pictureSlice,
  audioSlice,
  articleSlice,
  subAdminSlice,
  userSlice,
  messagesSlice,
  mostListeningSlice,
  introductionPageSlice,
  codeContentSlice,
  settingsSlice,
  termsConditionsSlice,
  dashboardSlice,
  profileSlice,
} from "./slices";

const store = configureStore({
  reducer: {
    scholar: scholarSlice,
    book: bookSlice,
    picture: pictureSlice,
    audio: audioSlice,
    article: articleSlice,
    subAdmin: subAdminSlice,
    user: userSlice,
    messages: messagesSlice,
    mostListening: mostListeningSlice,
    introductionPage: introductionPageSlice,
    codeContent: codeContentSlice,
    settings: settingsSlice,
    termsAndConditions: termsConditionsSlice,
    dashboard: dashboardSlice,
    profile: profileSlice,
  },
});

export default store;
