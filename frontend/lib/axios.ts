import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // .env.local değişmedi
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 JWT INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // 👈 LOGIN'DEKİ KEY

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------- TASK STATS HELPERS -----------------

export interface TaskStats {
  category: string;
  completed: number;
  incomplete: number; // backend'de tamamlanmayan görevler
}

/**
 * Kullanıcının kendi görev istatistiklerini getirir
 */
export const getUserTaskStats = async (): Promise<TaskStats[]> => {
  const response = await api.get<TaskStats[]>("/api/tasks/stats"); // /api ekledik
  return response.data;
};

/**
 * Admin için tüm görevlerin istatistiklerini getirir
 */
export const getGlobalTaskStats = async (): Promise<TaskStats[]> => {
  const response = await api.get<TaskStats[]>("/api/tasks/stats/global"); // /api ekledik
  return response.data;
};

export default api;
