import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import Userdeletecss from "./UserDelete.module.css";

export const UserDelete = ({ isSidebarOpen }) => {
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

  const handleDelete = async (userId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#00e6b8",
    confirmButtonText: "Yes, delete it!",
    background: "linear-gradient(135deg, #001f1f, #004d4d)",
    color: "white",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/admin/user-delete/${userId}`);
      Swal.fire({
        title: "Deleted!",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#00e6b8",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete user.",
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
    <div className={Userdeletecss.userContainer}>
      <h2>🗑 User List</h2>

      <input
        type="text"
        placeholder="Search by ID, name, email, or phone..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={Userdeletecss.searchInput}
      />

      <div className={Userdeletecss.tableContainer}>
        <table className={Userdeletecss.userTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Delete</th>
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
                      onClick={() => handleDelete(user._id)}
                      className={Userdeletecss.deleteButton}
                    >
                      🗑 Delete
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

      <div className={Userdeletecss.pagination}>
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
