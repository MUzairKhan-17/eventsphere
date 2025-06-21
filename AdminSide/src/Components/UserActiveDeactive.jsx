import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import UserActiveDeactivecss from "./UserActiveDeactive.module.css";

export const UserActiveDeactive = ({ isSidebarOpen }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you really want to ${newStatus === 1 ? "activate" : "deactivate"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00e6b8",
      cancelButtonColor: "#d33",
      confirmButtonText: newStatus === 1 ? "Activate" : "Deactivate",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
    });
    
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`http://localhost:5000/api/admin/user-status/${userId}`);

        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: "#00e6b8",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
        });

        setUsers(users.map(user =>
          user._id === userId ? { ...user, userstatus: newStatus } : user
        ));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to update status.",
          icon: "error",
          confirmButtonColor: "#00e6b8",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
        });
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user._id.includes(searchQuery) ||
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={`${UserActiveDeactivecss.userContainer} ${isSidebarOpen ? UserActiveDeactivecss.sidebarOpen : UserActiveDeactivecss.sidebarClosed}`}>
      <h2 className={`${UserActiveDeactivecss.h2}`}>✅ Active User List & ⛔ Deactive User List</h2>

      <input
        type="text"
        placeholder="Search by ID, name, email, or phone..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={UserActiveDeactivecss.searchInput}
      />

      <div className={UserActiveDeactivecss.tableContainer}>
        <table className={UserActiveDeactivecss.userTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.userstatus === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(user._id, user.userstatus)}
                      className={user.userstatus === 1 ? UserActiveDeactivecss.deactivateButton : UserActiveDeactivecss.activateButton}
                    >
                      {user.userstatus === 1 ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={UserActiveDeactivecss.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
