// src/api/qrApi.js
import { api } from "./api";

export const getQRCodes = () => api.get("/qr-codes");

export const createQRCode = (data) =>
  api.post("/qr-codes", data);

export const deleteQRCode = (id) =>
  api.delete(`/qr-codes/${id}`);