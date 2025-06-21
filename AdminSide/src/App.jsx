import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { AdminLogin } from "./Components/AdminLogin";
import { Sidebar } from "./Components/Sidebar";
import { Footer } from "./Components/Footer";
import { UserFetch } from "./Components/UserFetch";
import { UserDelete } from "./Components/UserDelete";
import { UserActiveDeactive } from "./Components/UserActiveDeactive";
import { EventFetch } from "./Components/EventFetch";
import { EventCreate } from "./Components/EventCreate";
import { EventDelete } from "./Components/EventDelete";
import { EventUpdate } from "./Components/EventUpdate";
import { EventUpdateForm } from "./Components/EventUpdateForm";
import { AttendeeFetch } from "./Components/AttendeeFetch";
import { AttendeeApprove } from "./Components/AttendeeApprove";
import { AttendeeDelete } from "./Components/AttendeeDelete";
import { ViewMessage } from "./Components/ViewMessage";
import { DeleteMessage } from "./Components/DeleteMessage";
import { AdminDashboard } from "./Components/AdminDashboard";
import { AdminProfile } from "./Components/AdminProfile";
import { AdminUpdate } from "./Components/AdminUpdate";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hide Sidebar on AdminLogin and AdminUpdate pages
  const hideLayout = location.pathname === "/" || location.pathname === "/profile-update";

  return (
    <>
      {!hideLayout && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/user-fetch" element={<UserFetch />} />
        <Route path="/user-delete" element={<UserDelete />} />
        <Route path="/user-activedeactive" element={<UserActiveDeactive />} />
        <Route path="/event-fetch" element={<EventFetch />} />
        <Route path="/event-create" element={<EventCreate />} />
        <Route path="/event-delete" element={<EventDelete />} />
        <Route path="/event-update" element={<EventUpdate />} />
        <Route path="/update-event/:id" element={<EventUpdateForm />} />
        <Route path="/attendee-fetch" element={<AttendeeFetch />} />
        <Route path="/attendee-approve" element={<AttendeeApprove />} />
        <Route path="/attendee-delete" element={<AttendeeDelete />} />
        <Route path="/View-Message" element={<ViewMessage />} />
        <Route path="/Delete-Message" element={<DeleteMessage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/profile-update" element={<AdminUpdate />} />
      </Routes>

      {<Footer />}
    </>
  );
}

export default App;