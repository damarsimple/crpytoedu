import { Box, Button, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useStore } from "../../state-management/useStore";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { ButtonProps, ImageProps, TextProps } from "../../types/pageEditor";
import { UploadZone } from "../EventMediaEditor";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import TextDefaultProp from "../../constant/TextDefaultProp";
import ButtonDefaultProp from "../../constant/ButtonDefaultProp";
import ImageDefaultProp from "../../constant/ImageDefaultProp";
import { Page } from "../../types/type";

export type FormEditorComponentProps = {
  className?: string,
  children?: React.ReactNode
}

export const FormEditorComponent = (props : FormEditorComponentProps) => {
  const { text, image, getSelected, editId, setEditId, type, setType, setTextByKey, setImageByKey, setText, setImage, onEdit, setOnEdit, setButtonByKey, setButton, button } = useStore();
  const selected = getSelected();
  
  if (!onEdit) {
    return (
      <></>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [updatePageMutation] = useMutation(
    gql`
      mutation UpdatePageMutation($id: ID!, $input: UpdatePage!) {
        updatePage(id: $id, input: $input) {
          id
          name
        }
      }
    `,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: { page } = {}, refetch, loading,} = useQuery<{ page: Page }>(
    gql`
      query Query($id: ID!) {
        page(id: $id) {
          id
          name
          created_at
          updated_at
          route
          data
        }
      }
    `,
    {
      variables: { id: 1 },
      onCompleted({ page }) {
        try {
          if (page?.data) {
            const data: {
              text: Record<string, TextProps>;
              image: Record<string, ImageProps>;
              button: Record<string, ButtonProps>;
            } = JSON.parse(page.data);
            console.log(data?.text)
            setText(data?.text ?? TextDefaultProp);
            setImage(data?.image ?? ImageDefaultProp);
            setButton(data?.button ?? ButtonDefaultProp);
          }
        } catch (error) {
          setText(TextDefaultProp);
          setImage(ImageDefaultProp);
          setButton(ButtonDefaultProp);
        }
      },
    }
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    var sidebar = document.querySelector(".rd-navbar-nav-wrap");
    sidebar?.classList.add("active")
  }, [editId])
    
  return (
    <div className="p-1 bg-white">
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        gap={3}
        p={1}
        paddingTop={2}
      >
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditId('main-image');
            setType("image");
          }}
        > Ubah Gambar Utama </button>
      </Box>
      {editId && type && selected && (
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          gap={3}
          p={1}
          paddingTop={2}
        >
          <Typography
            component={"h1"}
            variant="h6"
          >{`[${type}] ${editId}`}</Typography>
          {type == "button" && (
            <>
              <TextField
                label="Path / URL"
                fullWidth
                value={(selected as ButtonProps)?.path}
                onChange={(e) =>
                  setButtonByKey(editId, {
                    ...(selected as ButtonProps),
                    path: e.target.value,
                  })
                }
              />
              <TextField
                label="Konten"
                fullWidth
                value={(selected as ButtonProps)?.text}
                onChange={(e) =>
                  setButtonByKey(editId, {
                    ...(selected as ButtonProps),
                    text: e.target.value,
                  })
                }
              />
            </>
          )}
          {type == "text" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  border: (theme) =>
                    `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  color: "text.secondary",
                  "& svg": {
                    m: 1.5,
                  },
                  "& hr": {
                    mx: 0.5,
                  },
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor:
                      (selected as TextProps).style?.textAlign == "left"
                        ? "lightgray"
                        : "white",
                    borderRadius: 0,
                  }}
                  onClick={() =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: { ...selected.style, textAlign: "left" },
                    })
                  }
                >
                  <FormatAlignLeftIcon />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      (selected as TextProps).style?.textAlign ==
                        "center"
                        ? "lightgray"
                        : "white",
                    borderRadius: 0,
                  }}
                  onClick={() =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: { ...selected.style, textAlign: "center" },
                    })
                  }
                >
                  <FormatAlignCenterIcon />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      (selected as TextProps).style?.textAlign ==
                        "right"
                        ? "lightgray"
                        : "white",
                    borderRadius: 0,
                  }}
                  onClick={() =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: { ...selected.style, textAlign: "right" },
                    })
                  }
                >
                  <FormatAlignRightIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton
                  sx={{
                    backgroundColor:
                      (selected as TextProps).style?.fontWeight ==
                        "bold"
                        ? "lightgray"
                        : "white",
                    borderRadius: 0,
                  }}
                  onClick={() =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: {
                        ...selected.style,
                        fontWeight:
                          (selected as TextProps).style?.fontWeight ==
                            "bold"
                            ? undefined
                            : "bold",
                      },
                    })
                  }
                >
                  <FormatBoldIcon />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      (selected as TextProps).style?.fontStyle ==
                        "italic"
                        ? "lightgray"
                        : "white",
                    borderRadius: 0,
                  }}
                  onClick={() =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: {
                        ...selected.style,
                        fontStyle:
                          (selected as TextProps).style?.fontStyle ==
                            "italic"
                            ? undefined
                            : "italic",
                      },
                    })
                  }
                >
                  <FormatItalicIcon />
                </IconButton>
              </Box>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Font
                </InputLabel>
                <Select
                  value={selected?.style?.fontFamily ?? "Undefined"}
                  label="Font"
                  onChange={(e) =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: {
                        ...selected.style,
                        fontFamily:
                          (selected as TextProps).style?.fontFamily ==
                            "Undefined"
                            ? undefined
                            : e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value={"Undefined"}>Normal</MenuItem>
                  <MenuItem value={"Kalam"}>Kalam</MenuItem>
                  <MenuItem value={"Roboto"}>Roboto</MenuItem>
                  <MenuItem value={"Montserrat"}>Montserrat</MenuItem>
                  <MenuItem value={"Open Sans"}>Open Sans</MenuItem>
                </Select>
              </FormControl>

              <Box display="flex" justifyContent="space-between">
                <span>Color</span>
                <input
                  type="color"
                  value={
                    (selected as TextProps)?.style?.color ?? "#000"
                  }
                  onChange={(e) =>
                    setTextByKey(editId, {
                      ...(selected as TextProps),
                      style: {
                        ...selected.style,
                        color:
                          (selected as TextProps).style?.color == "#000"
                            ? undefined
                            : e.target.value,
                      },
                    })
                  }
                />
              </Box>
              <TextField
                label="Ukuran Font (pixel)"
                fullWidth
                value={(selected as TextProps)?.style?.fontSize}
                onChange={(e) =>
                  setTextByKey(editId, {
                    ...(selected as TextProps),
                    style: {
                      ...selected.style,
                      fontSize: `${e.target.value}`,
                    },
                  })
                }
              />
              <TextareaAutosize
                minRows={5}
                value={(selected as TextProps)?.children}
                onChange={(e) =>
                  setTextByKey(editId, {
                    ...(selected as TextProps),
                    children: e.target.value,
                  })
                }
              />
            </>
          )}
          {type == "image" && (
            <>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Tipe Media
                </InputLabel>
                <Select
                  value={(selected as ImageProps)?.type}
                  label="Tipe"
                  onChange={(e) =>
                    setImageByKey(editId, {
                      ...(selected as ImageProps),
                      type: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"icon"}>Icon</MenuItem>
                  <MenuItem value={"image"}>Image</MenuItem>
                </Select>
              </FormControl>
              {(selected as ImageProps)?.type == "icon" ? (
                <>
                  <TextField
                    label="Icon Key"
                    fullWidth
                    helperText={`https://fonts.google.com/icons?selected=Material+Icons`}
                    value={(selected as ImageProps)?.src}
                    onChange={(e) =>
                      setImageByKey(editId, {
                        ...(selected as ImageProps),
                        src: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Icon Size (px)"
                    fullWidth
                    value={(selected as ImageProps)?.style?.fontSize}
                    onChange={(e) =>
                      setImageByKey(editId, {
                        ...(selected as ImageProps),
                        style: {
                          ...selected?.style,
                          fontSize: e.target.value,
                        },
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <UploadZone
                    accept="image/*"
                    roles={"IMAGE_CONTENT"}
                    fileable_id="1"
                    fileable_type="App\Models\Page"
                    onUploaded={(e) =>
                      setImageByKey(editId, {
                        ...(selected as ImageProps),
                        src: e.path,
                      })
                    }
                  />
                  <TextField
                    label="Width "
                    fullWidth
                    value={(selected as ImageProps)?.width}
                    onChange={(e) =>
                      setImageByKey(editId, {
                        ...(selected as ImageProps),
                        width: parseInt(e.target.value) ?? 0,
                      })
                    }
                  />
                  <TextField
                    label="Height "
                    fullWidth
                    value={(selected as ImageProps)?.height}
                    onChange={(e) =>
                      setImageByKey(editId, {
                        ...(selected as ImageProps),
                        height: parseInt(e.target.value) ?? 0,
                      })
                    }
                  />
                </>
              )}
            </>
          )}
        </Box>
      )}
      {editId && type && selected && (
        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            updatePageMutation({
              variables: {
                id: page?.id,
                input: {
                  name: page?.name,
                  route: page?.route,
                  data: JSON.stringify({
                    text,
                    image,
                    button,
                  }),
                },
              },
            }).then((e) => toast.success("Berhasil menyimpan perubahan"))
          }
        >
          simpan perubahan
        </Button>
      )}
    </div>
  );
};