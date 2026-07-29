import { create } from "zustand";
import { api } from "../lib/axios.js";

export const useMonitorStore = create((set) => ({
  monitors: [],
  snapShots: [],
  loading: false,
  error: null,

  getAllMonitors: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await api.get(
        "/api/monitor/getAll"
      );

      set({
        monitors: response.data.monitors,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  getAllSnapShots: async (id) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await api.get(
        `/api/monitor/${id}/snapShots`
      );

      set({
        snapShots: response.data,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));