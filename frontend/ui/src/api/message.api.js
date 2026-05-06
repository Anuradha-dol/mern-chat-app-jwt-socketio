import http from "./http";

export const getUsersForSidebarRequest = () => http.get("/api/message/users");
export const getMessagesRequest = (userId) => http.get(`/api/message/${userId}`);
export const sendMessageRequest = (userId, payload) =>
  http.post(`/api/message/send/${userId}`, payload);
export const updateMessageRequest = (messageId, payload) =>
  http.put(`/api/message/update/${messageId}`, payload);
export const deleteMessageRequest = (messageId) =>
  http.delete(`/api/message/delete/${messageId}`);
