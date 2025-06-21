import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteMessageCSS from "./DeleteMessage.module.css";
import Swal from "sweetalert2";

export const DeleteMessage = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contact/fetch");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This message will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00ffcc",
    cancelButtonColor: "#ff4d4d",
    background: "#001f1f",
    color: "#ffffff",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "swal2-dark-glass",
    },
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:5000/api/contact/delete/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The message has been deleted.",
        icon: "success",
        confirmButtonColor: "#00ffcc",
        background: "#001f1f",
        color: "#ffffff",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the message.",
        icon: "error",
        confirmButtonColor: "#ff4d4d",
        background: "#001f1f",
        color: "#ffffff",
      });
    }
  }
};

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const lowerSearch = searchQuery.toLowerCase();
  const filteredMessages = messages.filter((msg) =>
    (msg._id || "").toLowerCase().includes(lowerSearch) ||
    (msg.name || "").toLowerCase().includes(lowerSearch) ||
    (msg.email || "").toLowerCase().includes(lowerSearch) ||
    (msg.message || "").toLowerCase().includes(lowerSearch)
  );

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / messagesPerPage));
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={DeleteMessageCSS.container}>
      <h2>🗑️ Delete Messages</h2>

      <input
        type="text"
        placeholder="Search by Id, Name, Email, or Message..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={DeleteMessageCSS.searchInput}
      />

      <div className={DeleteMessageCSS.tableWrapper}>
        <table className={DeleteMessageCSS.messageTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.length > 0 ? (
              paginatedMessages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg._id}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>
                    <button
                      className={DeleteMessageCSS.deleteBtn}
                      onClick={() => handleDelete(msg._id)}>
                      <span className={DeleteMessageCSS.deleteBtnIcon}>🗑️</span> Delete
                    </button>   
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={DeleteMessageCSS.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
