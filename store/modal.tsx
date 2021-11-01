import create from "zustand";

type CB = () => void;
interface ModalState {
  open: boolean;
  message: string;
  popModal: (message: string, next: CB) => void;
  next?: CB;
  close: CB;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  message: "",
  popModal: (message, next) => set({ message, next, open: true }),
  close: () => set({ message: "", open: false, next: undefined }),
}));
