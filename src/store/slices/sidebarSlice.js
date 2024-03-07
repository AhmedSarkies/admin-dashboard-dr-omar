import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  routes: [
    { name: "لوحة التحكم", path: "/", icon: "IoHome" },
    { name: "العلماء", path: "/scholar", icon: "SiGooglescholar" },
    { name: "تصنيفات الكتب", path: "/categories-book", icon: "BiCategory" },
    { name: "الكتب", path: "/books", icon: "GiBookshelf" },
    { name: "تصنيفات الصوتيات", path: "/categories-audio", icon: "BiCategory" },
    { name: "الصوتيات", path: "/audios", icon: "GiSoundWaves" },
    { name: "تصنيفات الصور", path: "/categories-picture", icon: "BiCategory" },
    { name: "الصور", path: "/pictures", icon: "SlPicture" },
    {
      name: "تصنيفات المقالات",
      path: "/categories-article",
      icon: "BiCategory",
    },
    { name: "المقالات", path: "/articles", icon: "IoIosDocument" },
    {
      name: "الاكثر استماع",
      path: "/most-listening",
      icon: "FaAssistiveListeningSystems",
    },
    {
      name: "المسؤولين الفرعيين",
      path: "/sub-admins",
      icon: "IoPeople",
    },
    { name: "صفحات الحسابات" },
    { name: "الملف الشخصي", path: "/profile", icon: "IoPerson" },
    { name: "تسجيل الدخول", path: "/sign-in", icon: "FaSignInAlt" },
    { name: "تسجيل حساب جديد", path: "/register", icon: "GoRocket" },
  ],
  toggle: false,
  toggleSettingsState: false,
};

// Scholar Slice
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.toggle = !state.toggle;
    },
    toggleSettings: (state) => {
      state.toggleSettingsState = !state.toggleSettingsState;
    },
  },
});

export const { toggleSidebar, toggleSettings } = sidebarSlice.actions;
export default sidebarSlice.reducer;
