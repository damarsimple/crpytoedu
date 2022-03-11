import { get } from "lodash";
import create from "zustand";
import ButtonDefaultProp from "../constant/ButtonDefaultProp";
import ImageDefaultProp from "../constant/ImageDefaultProp";
import TextDefaultProp from "../constant/TextDefaultProp";
import PageStoreInterface from "../interface/PageStoreInterface";

export const useStore = create<PageStoreInterface>((set, getData) => ({
  onEdit: false,
  setOnEdit: (onEdit) => set({ onEdit }),

  type: null,
  editId: null,

  setType: (by) => {
    set((state) => ({ ...state, type: by }));
  },

  setEditId: (editId) => set({ editId }),
  button: ButtonDefaultProp,
  image: ImageDefaultProp,
  text: TextDefaultProp,
  setImage: (image) => set({ image }),

  setText: (data) => set((state) => ({ ...state, text: data })),
  setButton: (data) => set((state) => ({ ...state, button: data })),

  setTextByKey: (by, value) =>
    set({
      text: {
        ...getData().text,
        [by]: value,
      },
    }),

  setImageByKey: (by, value) =>
    set({
      image: {
        ...getData().image,
        [by]: value,
      },
    }),
  setButtonByKey: (by, value) =>
    set({
      button: {
        ...getData().button,
        [by]: value,
      },
    }),
  getTextByKey: (by) => {
    return get(getData().text, by) || {};
  },
  getImageByKey: (by) => {
    return get(getData().image, by);
  },
  getButtonByKey: (by) => {
    return get(getData().button, by);
  },

  getSelected: () => {
    const { type, editId } = getData();
    if (editId && type) {
      return get(get(getData(), type), editId as string);
    } else {
      return undefined;
    }
  },
}));
  