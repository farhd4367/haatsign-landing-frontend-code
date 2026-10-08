// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './loaderSlice';
import sliderReducer from './sliderSlice';
import homeReducer from './homeSlice';
import landingSettingReducer from './landingSettingSlice';
import partnerReducer from './partnerSlice';
import pagesIntroductionReducer from './pagesIntroductionSlice';
import customerReducer from './customerSlice';
import blogsReducer from './blogsSlice';
import newsReducer from './newsSlice';
import companyFilesReducer from './companyFilesSlice';
import tutorialReducer from './tutorialSlice';
import careerReducer from './careerSlice'; // Import the careerSlice
import faqsReducer from './faqsSlice'; // Import the faqsSlice
import siteMapReducer from './siteMapSlice'; // Import the siteMapSlice
import membershipReducer from './membershipSlice'; // Import the membershipSlice
import certificateReducer from './certificateSlice'; // Import the certificateSlice
import teamMembersReducer from './teamMembersSlice'; // Import the teamMembersSlice
import customPageReducer from './CustomPageSlice'; // Import the customPageSlice
import planReducer from './planSlice'; // Import the planSlice
import newsletterReducer from './newletterSlice'; // Import the newsletterSlice

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    sliders: sliderReducer,
    home: homeReducer,
    landingSettings: landingSettingReducer,
    partners: partnerReducer,
    pageIntroduction: pagesIntroductionReducer,
    customers: customerReducer,
    blogs: blogsReducer,
    news: newsReducer,
    companyFiles: companyFilesReducer,
    tutorials: tutorialReducer,
    careers: careerReducer, // Add the careerReducer
    faqs: faqsReducer, // Add the faqsReducer
    siteMap: siteMapReducer, // Add the siteMapReducer
    memberships: membershipReducer, // Add the membershipReducer
    certificates: certificateReducer, // Add the certificateReducer
    teamMembers: teamMembersReducer, // Add the teamMembersReducer
    customPage: customPageReducer, // Add the customPageReducer
    plans: planReducer, // Add the planReducer
    newsletter: newsletterReducer, // Add the newsletterReducer
  },
});

export default store;
