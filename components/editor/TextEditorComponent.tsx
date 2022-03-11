import { Box, Typography } from "@mui/material";
import React from "react";
import { useStore } from "../../state-management/useStore";

export type TextEditorComponentProps = {
  id: string,
  className?: string,
  children?: React.ReactNode
}

export const TextEditorComponent = (props : TextEditorComponentProps) => {
    const { onEdit, getTextByKey, type, editId, setEditId, setType } = useStore();
    const { children } = getTextByKey(props.id) || {};
  
    if (onEdit && type == "text" && editId == props.id) {
      return (
        <Box
          sx={{
            backgroundColor: "#6610f2",
            cursor: "pointer",
            padding: "8px"
          }}
        >
          <span className={props.className} style={{ color: "white" }}>
            {children}
          </span>
        </Box>
      );
    }
  
    if (onEdit) {
      return (
        <Box
          sx={{
            "&:hover": {
              border: 2,
              borderColor: "#6610f2"
            },
          }}
          onClick={() => {
            setEditId(props.id);
            setType("text");
          }}
        >
          <span className={props.className}>
            {children}
          </span>
        </Box>
      );
    }
  
    return (
      <span>
        {children}
      </span>
    );
  };