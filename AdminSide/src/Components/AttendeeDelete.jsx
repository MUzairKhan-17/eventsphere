import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AttendeeDeleteCSS from "./AttendeeDelete.module.css";

export const AttendeeDelete = () => {
  const [attendees, setAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/attendees/fetch");
        setAttendees(response.data);
      } catch (err) {
        setError("Failed to load attendees.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  const deleteAttendee = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the attendee.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      confirmButtonColor: "#00e6b8",
      cancelButtonColor: "#ff4d4d",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/attendees/attendee-delete/${id}`);
        setAttendees(prev => prev.filter(user => user._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The attendee has been deleted.",
          icon: "success",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00e6b8",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to delete attendee.",
          icon: "error",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00e6b8",
        });
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "Deactive Account";
      case 1: return "Active Account";
      case 2: return "Account Pending";
      default: return "Unknown Status";
    }
  };

  const filteredAttendees = attendees.filter(user =>
    user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredAttendees.length / usersPerPage));
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredAttendees.slice(startIndex, startIndex + usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p className={AttendeeDeleteCSS.loadingText}>Loading attendees...</p>;
  if (error) return <p className={AttendeeDeleteCSS.error}>{error}</p>;

  return (
    <div className={AttendeeDeleteCSS.attendeeContainer}>
      <h2>🗑️ Delete Attendee Accounts</h2>

      <input
        type="text"
        placeholder="Search by Id, name, email or phone..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className={AttendeeDeleteCSS.searchInput}
      />

      <div className={AttendeeDeleteCSS.attendeeTableWrapper}>
        <table className={AttendeeDeleteCSS.attendeeTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No attendees found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{getStatusText(user.attendeestatus)}</td>
                  <td>
                    <button
                      onClick={() => deleteAttendee(user._id)}
                      className={AttendeeDeleteCSS.deleteButton}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={AttendeeDeleteCSS.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};