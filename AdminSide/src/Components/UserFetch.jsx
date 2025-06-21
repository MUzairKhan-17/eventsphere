import React, { useEffect, useState } from "react";
import axios from "axios";
import Userfetchcss from "./UserFetch.module.css";

export const UserFetch = () => {
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(
    (user) =>
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
    <div className={Userfetchcss.userContainer}>
      <h2>📋 User List</h2>

      <input
        type="text"
        placeholder="Search by ID, name, email, or phone..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={Userfetchcss.searchInput}
      />

      <div className={Userfetchcss.tableWrapper}>
        <table className={Userfetchcss.userTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={Userfetchcss.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
