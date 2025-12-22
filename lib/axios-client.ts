import axios from "axios";

const API_TOKEN =

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlub2Qga3VtYXIgRGFzaCIsInR5cGUiOjEsImVtYWlsIjoiZGFzaGIxMDM3QGdtYWlsLmNvbSIsIm1vYmlsZSI6IjkxOTMzNzgxNTEwNyIsInJvbGVJZCI6MSwidXNlcklkIjo3Miwicm9sZU5hbWUiOiJBZG1pbiIsInRlbmFudElkIjoxLCJjb250YWN0SWQiOm51bGwsImxvY2F0aW9uSWQiOjM0LCJ0ZW5hbnROYW1lIjoiS2FscGFuaVggVGVjaG5vbG9naWVzIiwidGVuYW50VHlwZSI6ImNvbXBhbnkiLCJsb2NhdGlvbklkcyI6WzMzLDM0XSwibG9jYXRpb25OYW1lIjoiQmh1YmFuZXN3YXIiLCJsb2NhdGlvbk5hbWVzIjpbIktvbGthdGEiLCJCaHViYW5lc3dhciJdLCJyZWZyZXNoIjp0cnVlLCJpYXQiOjE3NjYyMTAwMTMsImV4cCI6MTc2NjgxNDgxM30.FjaFwvGa5eBN8wHOt7HibdNX7HrGFxy05ewflJOffvY";
  
export const axiosClient = axios.create({
  baseURL: "https://app-crystal-visitor-api.qxcm8x.easypanel.host",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
});
