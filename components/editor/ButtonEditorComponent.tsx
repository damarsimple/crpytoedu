import { Box, Button, Icon, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useStore } from "../../state-management/useStore";

export type ButtonEditorComponentProps = {
  id: string,
  className?: string,
  children?: React.ReactNode
}

export const ButtonEditorComponent = (props : ButtonEditorComponentProps) => {
  const { getButtonByKey, type, onEdit, editId, setEditId, setType } = useStore();

  const { style, text, path } = getButtonByKey(props.id) || {};

  const condition = onEdit && type == "button" && editId == props.id;

  const Component = () => {
    if (path && !onEdit) {
      return (
        <Link href={path}>
          <a className="button button-lg button-gradient">
            <span className="text-capitalize text-white">{text}</span>
          </a>
        </Link>
      );
    } else {
      return (
        <a className="button button-lg button-gradient"
            onClick={() => {
              setEditId(props.id);
              setType("button");
            }}
          >
          <span className="text-capitalize text-white">{text}</span>
        </a>
      );
    }
  };

  if (condition) {
    return (
      <div
        style={{
          backgroundColor: "#6610f2",
          cursor: "pointer",
          padding: "8px"
        }}
        className="mt-3"
      >
        <Component />
      </div>
    );
  }

  if (onEdit) {
    return (
      <Component />
    );
  }

  return <Component />;
};