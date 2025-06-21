import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import './app.css';

// Lazy-loaded named exports
const Home = lazy(() => import("./Components/Home").then(m => ({ default: m.Home })));
const ExpoList = lazy(() => import("./Components/Expolist").then(m => ({ default: m.ExpoList })));
const ExhibitorDashboard = lazy(() => import("./Components/ExhibitorDashboard").then(m => ({ default: m.ExhibitorDashboard })));
const Attendee = lazy(() => import("./Components/Attendee").then(m => ({ default: m.Attendee })));
const AttendeeDashboard = lazy(() => import("./Components/AttendeeDashboard").then(m => ({ default: m.AttendeeDashboard })));
const Contact = lazy(() => import("./Components/Contact").then(m => ({ default: m.Contact })));
const SignUp = lazy(() => import("./Components/SignUp").then(m => ({ default: m.SignUp })));
const Login = lazy(() => import("./Components/Login").then(m => ({ default: m.Login })));
const Profile = lazy(() => import("./Components/Profile").then(m => ({ default: m.Profile })));
const UpdateProfile = lazy(() => import("./Components/UpdateProfile").then(m => ({ default: m.UpdateProfile })));
const ForgotPassword = lazy(() => import("./Components/ForgetPassword").then(m => ({ default: m.ForgetPassword })));
const AttendeeRegister = lazy(() => import("./Components/AttendeeRegister").then(m => ({ default: m.AttendeeRegister })));
const AttendeeLogin = lazy(() => import("./Components/AttendeeLogin").then(m => ({ default: m.AttendeeLogin })));
const AttendeeUpdate = lazy(() => import("./Components/AttendeeUpdate").then(m => ({ default: m.AttendeeUpdate })));
const AttendeeEvent = lazy(() => import("./Components/AttendeeEvent").then(m => ({ default: m.AttendeeEvent })));

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

const App = () => (
  <>
    <Navbar />
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expos" element={<ExpoList />} />
        <Route path="/exhibitor-dashboard" element={<ExhibitorDashboard />} />
        <Route path="/attendee" element={<Attendee />} />
        <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register-attendee" element={<AttendeeRegister />} />
        <Route path="/login-attendee" element={<AttendeeLogin />} />
        <Route path="/attendee-update" element={<AttendeeUpdate />} />
        <Route path="/register-event" element={<AttendeeEvent />} />
      </Routes>
    </Suspense>
    <Footer />
  </>
);

export default App;