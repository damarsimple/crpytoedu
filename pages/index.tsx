import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Icon,
  TextField,
  Divider,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import React, { useEffect } from "react";
import Image from "next/image";
import { Phone, Smartphone } from "@mui/icons-material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";

import create from "zustand";
import { get } from "lodash";
import { UploadZone } from "../components/EventMediaEditor";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Page, Roles } from "../types/type";
import { toast } from "react-toastify";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import { useUserStore } from "../store/user";

function Index({ router: { query } }: WithRouterProps) {
  const { user } = useUserStore();

  const {
    text,
    image,
    getSelected,
    editId,
    type,
    setTextByKey,
    setImageByKey,
    setText,
    setImage,
    onEdit,
    setOnEdit,
  } = useStore();

  useEffect(() => {
    if (query.editor) {
      setOnEdit(query.editor == "true" && user?.roles == Roles.Admin);
    }
  }, [query, setOnEdit, user?.roles]);

  const selected = getSelected();

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

  const {
    data: { page } = {},
    refetch,
    loading,
  } = useQuery<{ page: Page }>(
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
        if (page?.data) {
          const data: {
            text: Record<string, TextProps>;
            image: Record<string, ImageProps>;
          } = JSON.parse(page.data);

          setText(data.text);
          setImage(data.image);
        }
      },
    }
  );

  if (loading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Grid container>
      {onEdit && (
        <Grid item xs={2}>
          {editId && type && selected && (
            <Box
              display="flex"
              flexDirection={"column"}
              justifyContent="center"
              gap={3}
              p={2}
            >
              <Typography
                component={"h1"}
                variant="h6"
              >{`[${type}] ${editId}`}</Typography>
              {type == "text" ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      border: (theme) => `1px solid ${theme.palette.divider}`,
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
                          (selected as TextProps).style?.textAlign == "center"
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
                          (selected as TextProps).style?.textAlign == "right"
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
                          (selected as TextProps).style?.fontWeight == "bold"
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
                          (selected as TextProps).style?.fontStyle == "italic"
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
                  <Box display="flex" justifyContent="space-between">
                    <span>Color</span>
                    <input
                      type="color"
                      value={(selected as TextProps)?.style?.color ?? "#000"}
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
                  <TextField
                    label="Konten"
                    fullWidth
                    value={(selected as TextProps)?.children}
                    onChange={(e) =>
                      setTextByKey(editId, {
                        ...(selected as TextProps),
                        children: e.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
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
                    }),
                  },
                },
              }).then((e) => toast.success("Berhasil menyimpan perubahan"))
            }
          >
            simpan perubahan
          </Button>
        </Grid>
      )}
      <Grid item xs={onEdit ? 10 : 12}>
        <Box sx={{ height: "100vh", overflowY: "auto" }}>
          <Box display="flex" flexDirection="column" sx={{ overflowY: "auto" }}>
            <LandingSection />
            <Box component="section" id="features-advertising">
              <Grid container>
                {[
                  {
                    id: "advertise-1",
                    style: { backgroundColor: "#451288" },
                  },
                  {
                    id: "advertise-2",
                    style: { backgroundColor: "#3d1078" },
                  },
                  {
                    id: "advertise-3",
                    style: { backgroundColor: "#350e69" },
                  },
                  {
                    id: "advertise-4",
                    style: { backgroundColor: "#300d5f" },
                  },
                ].map((e) => (
                  <Grid key={e.id} item xs={12} md={6} lg={3}>
                    <Box
                      style={e.style}
                      sx={{
                        minHeight: 220,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                      }}
                    >
                      <ImageComponent id={`${e.id}-image`} />
                      <TextComponent id={`${e.id}-title`} />
                      <TextComponent id={`${e.id}-description`} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

interface ImageProps {
  type: string;
  src: string;
  width?: number;
  height?: number;
  style?: Record<string, string | undefined | number>;
}

const ImageComponent = ({ id }: { id: string }) => {
  const { getImageByKey, type, onEdit, editId, setEditId, setType } =
    useStore();
  const {
    style,
    width,
    height,
    type: imageType,
    src,
  } = getImageByKey(id) || {};

  const Component = () => {
    if (imageType == "icon") {
      return <Icon style={style}>{src}</Icon>;
    } else {
      return <Image src={src} alt={src} width={width} height={height} />;
    }
  };

  if (onEdit && type == "text" && editId == id) {
    return (
      <Box
        sx={{
          backgroundColor: "blue",
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
            borderColor: "blue",
          },
        }}
        onClick={() => {
          setEditId(id);
          setType("image");
        }}
      >
        <Component />
      </Box>
    );
  }

  return <Component />;
};

const TextComponent = ({ id }: { id: string }) => {
  const { onEdit, getTextByKey, type, editId, setEditId, setType } = useStore();
  const { variant, style, component, children } = getTextByKey(id) || {};

  if (onEdit && type == "text" && editId == id) {
    return (
      <Box
        sx={{
          backgroundColor: "blue",
          cursor: "pointer",
        }}
      >
        <Typography
          variant={variant}
          style={{ ...(style || {}), wordWrap: "break-word" }}
          component={component}
        >
          {children}
        </Typography>
      </Box>
    );
  }

  if (onEdit) {
    return (
      <Box
        sx={{
          "&:hover": {
            border: 2,
            borderColor: "blue",
          },
        }}
        onClick={() => {
          setEditId(id);
          setType("text");
        }}
      >
        <Typography variant={variant} style={style} component={component}>
          {children}
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant={variant} style={style} component={component}>
      {children}
    </Typography>
  );
};
interface ContainerProps {
  sx?: object;
  data?: object;
}

const ContainerComponent = ({}: ContainerProps) => {};

const LandingSection = () => {
  return (
    <Box
      component="section"
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('./images/swiper-bg.jpg')",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        position: "relative",
        padding: 100,
      }}
    >
      <Box
        display="flex"
        justifyContent={"center"}
        flexDirection="column"
        gap={2}
        sx={{
          width: "50%",
          position: { xs: "absolute", md: "static" },
          zIndex: 50,
        }}
      >
        <TextComponent id="main-title" />

        <Button
          variant="contained"
          sx={{
            borderRadius: "40px",
            background:
              "linear-gradient(90deg, rgba(207,0,175,1) 0%, rgba(255,234,0,1) 100%)",
            fontWeight: "600",
            p: 2,
          }}
        >
          PELAJARI
        </Button>
      </Box>

      <Box
        sx={{
          width: "50%",
          position: { xs: "absolute", md: "static" },
          filter: { xs: "brightness(50%)", md: "none" },
        }}
      >
        <ImageComponent id="main-image" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 1,
        }}
      >
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
            },
          }}
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open("url_facebook" ?? "", "_blank").focus();
          }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
            },
          }}
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open("url_twitter" ?? "", "_blank").focus();
          }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
            },
          }}
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open("url_instagram" ?? "", "_blank").focus();
          }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
            },
          }}
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open("url_linkedin" ?? "", "_blank").focus();
          }}
        >
          <LinkedInIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 1,
        }}
      >
        <Smartphone />
        <TextComponent id="phone-number" />
        <TextComponent id="call-us-context" />
      </Box>
    </Box>
  );
};

interface TextProps {
  children: string;
  style?: Record<string, string | undefined | number>;
  component: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption";
}

interface PageStore {
  text: Record<string, TextProps>;
  image: Record<string, ImageProps>;

  type: "image" | "text" | null;
  setType: (by: "image" | "text" | null) => void;
  editId: string | null;
  setEditId: (id: string | null) => void;

  onEdit: boolean;
  setOnEdit: (onEdit: boolean) => void;

  setText: (data: Record<string, TextProps>) => void;
  setImage: (data: Record<string, ImageProps>) => void;

  getTextByKey: (by: string) => TextProps;
  getImageByKey: (by: string) => ImageProps;

  setTextByKey: (id: string, value: TextProps) => void;
  setImageByKey: (id: string, value: ImageProps) => void;

  getSelected: () => ImageProps | TextProps | undefined;
}

const useStore = create<PageStore>((set, getData) => ({
  onEdit: false,
  setOnEdit: (onEdit) => set({ onEdit }),

  type: null,
  editId: null,

  setType: (by) => {
    set((state) => ({ ...state, type: by }));
  },

  setEditId: (editId) => set({ editId }),

  image: {
    "main-image": {
      src: "/images/swiper-img.png",
      type: "image",
      alt: "laptop",
      width: 600,
      height: 400,
    },

    "advertise-1-image": {
      src: "trending_up",
      type: "icon",
      style: { fontSize: "40px", color: "white" },
    },
    "advertise-2-image": {
      src: "groups",
      type: "icon",
      style: { fontSize: "40px", color: "white" },
    },
    "advertise-3-image": {
      src: "analytics",
      type: "icon",
      style: { fontSize: "40px", color: "white" },
    },
    "advertise-4-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "40px", color: "white" },
    },
  },
  text: {
    "phone-number": {
      children: " +628123456789",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },
    "call-us-context": {
      children: " Telfon Kami 🤙",
      variant: "caption",
      component: "p",
      style: { color: "yellow", fontSize: "20px" },
    },

    "main-title": {
      variant: "h4",
      component: "h1",
      children: "JOINCHAMPIONTRADING",
      style: {
        color: "white",
        maxWidth: "75ch",
      },
    },

    "advertise-1-title": {
      children: "Investasi Bersama Kami",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },
    "advertise-1-description": {
      children: "Kembangkan Portofolio anda dengan belajar dengan trainer kami",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "15px" },
    },

    "advertise-2-title": {
      children: "Trainer Yang Handal",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },
    "advertise-2-description": {
      children:
        "Trainer kami adalah satu dari top 100 yang berada di indonesia",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "15px" },
    },

    "advertise-3-title": {
      children: "Top Analisis",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },
    "advertise-3-description": {
      children: "Terima Top Analisis Dari Kami !",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "15px" },
    },

    "advertise-4-title": {
      children: "Simpanan Hari Tua",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },
    "advertise-4-description": {
      children: "Kembangankan simpanan anda",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "15px" },
    },
  },
  setImage: (image) => set({ image }),

  setText: (data) => set((state) => ({ ...state, text: data })),

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
  getTextByKey: (by) => {
    return get(getData().text, by) || {};
  },
  getImageByKey: (by) => {
    return get(getData().image, by);
  },

  getSelected: () => {
    if (getData().editId && getData().type) {
      return get(
        getData().type == "image" ? getData().image : getData().text,
        getData().editId as string
      );
    } else {
      return undefined;
    }
  },
}));

export default withRouter(Index);
