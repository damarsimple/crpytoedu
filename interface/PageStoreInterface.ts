import { ButtonProps, TextProps, ImageProps } from "../types/pageEditor";

export default interface PageStoreInterface {
    button: Record<string, ButtonProps>;
    text: Record<string, TextProps>;
    image: Record<string, ImageProps>;
  
    type: "image" | "text" | "button" | null;
    setType: (by: "image" | "text" | "button" | null) => void;
    editId: string | null;
    setEditId: (id: string | null) => void;
  
    onEdit: boolean;
    setOnEdit: (onEdit: boolean) => void;
  
    setText: (data: Record<string, TextProps>) => void;
    setImage: (data: Record<string, ImageProps>) => void;
    setButton: (data: Record<string, ButtonProps>) => void;
  
    getTextByKey: (by: string) => TextProps;
    getImageByKey: (by: string) => ImageProps;
    getButtonByKey: (by: string) => ButtonProps;
  
    setTextByKey: (id: string, value: TextProps) => void;
    setImageByKey: (id: string, value: ImageProps) => void;
    setButtonByKey: (id: string, value: ButtonProps) => void;
  
    getSelected: () => ImageProps | TextProps | ButtonProps | undefined;
}