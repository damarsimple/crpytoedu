import { Box, Icon, Typography } from "@mui/material";
import React from "react";
import { useStore } from "../../state-management/useStore";

export type ImageEditorComponentProps = {
  id: string,
  className?: string,
  children?: React.ReactNode
}

export const ImageEditorComponent = (props : ImageEditorComponentProps) => {
  const { getImageByKey, type, onEdit, editId, setEditId, setType } = useStore();
  const { style, width, height, type: imageType, src: rawSrc } = getImageByKey(props.id) || {};

  const src = rawSrc?.replace("https://crpyto.damaral.my.id/", "https://gql.joinchampingtrading.com/")
  
  if ((!src)) {
    console.log(`${imageType} ${props.id} is not found`);
    return <></>;
  }

  const Component = () => {
    if (imageType == "icon") {
      return <Icon style={style}>{src}</Icon>;
    } else {
      return (
        <img
          src={src ?? "/dogememe.jpg"}
          alt={src}
          width={width}
          height={height}
        />
      );
    }
  };

  if (onEdit && editId == props.id) {
    return (
      <Box
        sx={{
          backgroundColor: "#6610f2",
          cursor: "pointer",
        }}
      >
        <Component />
      </Box>
    );
  }

  if (onEdit) {
    return (
      <Box
        sx={{
          "&:hover": {
            border: 2,
            borderColor: "#6610f2",
          },
        }}
        onClick={() => {
          setEditId(props.id);
          setType("image");
        }}
      >
        <Component />
      </Box>
    );
  }

  return <Component />;
};