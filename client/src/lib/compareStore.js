import { create } from "zustand";
import { toast } from "react-toastify";

const MAX_COMPARE = 4;

export const useCompareStore = create((set, get) => ({
  compareIds: [],

  addToCompare: (id) => {
    const { compareIds } = get();
    if (compareIds.includes(id)) return; // already selected
    if (compareIds.length >= MAX_COMPARE) {
      toast.warn(`You can compare at most ${MAX_COMPARE} listings at a time.`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    set({ compareIds: [...compareIds, id] });
  },

  removeFromCompare: (id) => {
    set((state) => ({ compareIds: state.compareIds.filter((cid) => cid !== id) }));
  },

  clearCompare: () => {
    set({ compareIds: [] });
  },

  isSelected: (id) => {
    return get().compareIds.includes(id);
  },
}));
