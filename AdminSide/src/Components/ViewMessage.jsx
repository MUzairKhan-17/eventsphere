import React, { useEffect, useState } from "react";
import axios from "axios";
import ViewMessageCSS from "./ViewMessage.module.css";

export const ViewMessage = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesPerPage = 10;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contact/fetch");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

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
    <div className={ViewMessageCSS.container}>
      <h2 className={ViewMessageCSS.h2}>📨 User Messages</h2>

      <input
        type="text"
        placeholder="Search by Id, Name, Email, or Message..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={ViewMessageCSS.searchInput}
      />

      <div className={ViewMessageCSS.tableWrapper}>
        <table className={ViewMessageCSS.messageTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
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

      <div className={ViewMessageCSS.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
