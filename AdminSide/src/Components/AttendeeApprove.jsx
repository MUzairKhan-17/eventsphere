import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AttendeeApproveCSS from "./AttendeeApprove.module.css";

export const AttendeeApprove = () => {
  const [pendingAttendees, setPendingAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/attendees/fetch");
        setPendingAttendees(response.data);
      } catch (err) {
        setError("Failed to load attendees.");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const approveAttendee = async (id) => {
    setError("");
    try {
      await axios.patch(`http://localhost:5000/api/attendees/attendee-approve/${id}`, { attendeestatus: 1 });

      setPendingAttendees(prev =>
        prev.map(user => user._id === id ? { ...user, attendeestatus: 1 } : user)
      );

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The attendee has been successfully approved.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00e6b8",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setError("Failed to approve attendee.");
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to approve attendee. Please try again.",
        icon: "error",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00e6b8",
      });
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Deactive Account";
      case 1:
        return "Active Account";
      case 2:
        return "Pending Approval";
      default:
        return "Unknown Status";
    }
  };

  const filteredAttendees = pendingAttendees.filter(user => {
    const search = searchQuery.toLowerCase();
    const isPending = user.attendeestatus === 2;

    return isPending && (
      user._id.toLowerCase().includes(search) ||
      user.fullname.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  const indexOfLastAttendee = currentPage * attendeesPerPage;
  const indexOfFirstAttendee = indexOfLastAttendee - attendeesPerPage;
  const currentAttendees = filteredAttendees.slice(indexOfFirstAttendee, indexOfLastAttendee);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (loading) return <p className={AttendeeApproveCSS.loadingText}>Loading attendees...</p>;
  if (error) return <p className={AttendeeApproveCSS.error}>{error}</p>;

  return (
    <div className={AttendeeApproveCSS.attendeeContainer}>
      <h2 className={AttendeeApproveCSS.h2}>🛠️ Approve Attendee Accounts</h2>

      <input
        type="text"
        placeholder="Search by ID, name, email or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={AttendeeApproveCSS.searchInput}
        aria-label="Search attendees"
      />

      <div className={AttendeeApproveCSS.attendeeTableWrapper}>
        <table className={AttendeeApproveCSS.attendeeTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {currentAttendees.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No pending attendees to approve.
                </td>
              </tr>
            ) : (
              currentAttendees.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{getStatusText(user.attendeestatus)}</td>
                  <td className={AttendeeApproveCSS.actionCell}>
                    {user.attendeestatus !== 1 ? (
                      <button
                        onClick={() => approveAttendee(user._id)}
                        className={AttendeeApproveCSS.approveButton}
                        title="Click to approve attendee"
                        aria-label={`Approve ${user.fullname}`}
                      >
                        ✅ Approve
                      </button>
                    ) : (
                      <span>Approved</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={AttendeeApproveCSS.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Previous
        </button>
        <span>
          Page {currentPage} of {totalPages+1}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};
