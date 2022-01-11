/* eslint-disable @next/next/link-passhref */
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
  Rating,
  Toolbar,
  Badge,
  Menu,
  createTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { CSSProperties, useEffect } from "react";
import Image from "next/image";
import { Smartphone } from "@mui/icons-material";
import Link from "next/link";
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
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AccountCircle, VideoCall } from "@mui/icons-material";
import { useAuthStore } from "../store/auth";
import useScrollsPosition from "../hooks/useScrollsPosition";
import useMediaQuery from "@mui/material/useMediaQuery";
import ImageDefaultProp from "../constant/ImageDefaultProp";
import TextDefaultProp from "../constant/TextDefaultProp";
import { ButtonProps, ImageProps, TextProps } from "../types/pageEditor";
import ButtonDefaultProp from "../constant/ButtonDefaultProp";
interface AppBarProps extends MuiAppBarProps {
  transparent?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "transparent",
})<AppBarProps>(({ theme, transparent }) => ({
  backgroundColor: "purple",
  transition: theme.transitions.create(
    ["background-color", "margin", "width"],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }
  ),
  ...(transparent && {
    backgroundColor: "transparent",
    transition: theme.transitions.create(["background-color"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
  }),
}));

const theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "Sans-Serif",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
});

function Index({ router: { query, push } }: WithRouterProps) {
  const { user, setUser } = useUserStore();

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
    setButtonByKey,
    setButton,
    button,
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

  const matches = useMediaQuery(theme.breakpoints.up("md"));

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
        try {
          if (page?.data) {
            const data: {
              text: Record<string, TextProps>;
              image: Record<string, ImageProps>;
              button: Record<string, ButtonProps>;
            } = JSON.parse(page.data);
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const isMenuOpen = Boolean(anchorEl);

  const { setToken } = useAuthStore();

  const logout = () => {
    setToken("");
    setUser(null);
    window.location.replace("/login");
  };
  const { scrollPosition } = useScrollsPosition();
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
    <>
      <ThemeProvider theme={theme}>
        {anchorEl && (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => push(user?.roles?.toLocaleLowerCase() + "s")}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        )}
        <AppBar elevation={0} position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              CrptoEdu
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "flex" } }}>
              {user ? (
                <>
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => {
                      push("/notifications");
                    }}
                  >
                    <Badge
                      badgeContent={user?.basicnotificationsCount ?? 0}
                      color="error"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    sx={{ color: "white" }}
                    onClick={() => push("/login")}
                  >
                    LOGIN
                  </Button>
                  <Button
                    sx={{ color: "white" }}
                    onClick={() => push("/register")}
                  >
                    REGISTER
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Grid container>
          {onEdit && (
            <Grid item xs={2}>
              {editId && type && selected && (
                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent="center"
                  gap={3}
                  p={1}
                  paddingTop={10}
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
            </Grid>
          )}
          <Grid item xs={onEdit ? 10 : 12}>
            <Box sx={{ height: "100vh", overflowY: "auto" }}>
              <Box
                display="flex"
                flexDirection="column"
                sx={{ overflowY: "auto" }}
              >
                <LandingSection />
                <Advertise />

                <Box sx={{ p: 10 }}>
                  <TextComponent id={`advantages-title`} />
                  <TextComponent id={`advantages-description`} />
                  <Grid container spacing={1}>
                    {[
                      "advantages-1",
                      "advantages-2",
                      "advantages-3",
                      "advantages-4",
                      "advantages-5",
                      "advantages-6",
                    ].map((e) => (
                      <Grid item xs={12} sm={4} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={2}
                          justifyContent="center"
                          alignItems="center"
                          sx={{ textAlign: "center" }}
                        >
                          <ImageComponent id={`${e}-image`} />
                          <TextComponent id={`${e}-title`} />
                          <TextComponent id={`${e}-description`} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 10 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <TextComponent id={`about-title`} />
                    <TextComponent id={`about-description`} />
                  </Box>
                  <Grid container spacing={1} sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <ImageComponent id={`about-image`} />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{ display: "flex", gap: 2, flexDirection: "column" }}
                    >
                      <TextComponent id={`about-content`} />
                      <BaseButtonComponent id="about-button" />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 10, backgroundColor: "#451288" }}>
                  <Box sx={{ textAlign: "center" }}>
                    <TextComponent id={`stats-title`} />
                  </Box>
                  <Grid container spacing={1} sx={{ mt: 4 }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{ display: "flex", gap: 2, flexDirection: "column" }}
                    >
                      <ImageComponent id={`stats-quote`} />
                      <TextComponent id={`stats-content`} />
                      <TextComponent id={`stats-founder`} />
                      <TextComponent id={`stats-founder-position`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ImageComponent id={`stats-image`} />
                      <TextComponent id={`stats-image-description`} />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 10 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <TextComponent id={`team-title`} />
                  </Box>
                  <Grid container spacing={3} sx={{ mt: 4 }}>
                    {matches && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2}
                        display="flex"
                        justifyContent="center"
                      />
                    )}

                    {["team-1", "team-2", "team-3", "team-4"].map((e) => (
                      <Grid
                        key={e}
                        item
                        xs={12}
                        sm={6}
                        md={2}
                        display="flex"
                        justifyContent="center"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: "column",
                            width: 270,
                            mx: 2,
                          }}
                        >
                          <ImageComponent id={`${e}-image`} />
                          <TextComponent id={`${e}-name`} />
                          <TextComponent id={`${e}-position`} />
                          <TextComponent id={`${e}-description`} />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              p: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                if (window.open)
                                  //@ts-ignore
                                  window
                                    .open("url_facebook" ?? "", "_blank")
                                    .focus();
                              }}
                            >
                              <FacebookIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                if (window.open)
                                  //@ts-ignore
                                  window
                                    .open("url_twitter" ?? "", "_blank")
                                    .focus();
                              }}
                            >
                              <TwitterIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                if (window.open)
                                  //@ts-ignore
                                  window
                                    .open("url_instagram" ?? "", "_blank")
                                    .focus();
                              }}
                            >
                              <InstagramIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                if (window.open)
                                  //@ts-ignore
                                  window
                                    .open("url_linkedin" ?? "", "_blank")
                                    .focus();
                              }}
                            >
                              <LinkedInIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 10, backgroundColor: "#f5f5f7" }}>
                  <TextComponent id={`testimonials-name`} />

                  <Grid container spacing={3}>
                    {[
                      "testimonials-1",
                      "testimonials-2",
                      "testimonials-3",
                      "testimonials-4",
                      "testimonials-5",
                      "testimonials-6",
                    ].map((e) => (
                      <Grid item xs={12} sm={6} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          sx={{ backgroundColor: "white", p: 2 }}
                        >
                          <Box display="flex" justifyContent={"space-between"}>
                            <Rating readOnly value={5} />
                            <TextComponent id={`${e}-date`} />
                          </Box>

                          <TextComponent id={`${e}-content`} />
                          <Box
                            display="flex"
                            alignItems={"center"}
                            gap={3}
                            mt={4}
                          >
                            <ImageComponent id={`${e}-image`} />
                            <Box display="flex" gap="2" flexDirection="column">
                              <TextComponent id={`${e}-client-name`} />
                              <TextComponent id={`${e}-client-position`} />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 10 }}>
                  <TextComponent id={`our-values-title`} />
                  <TextComponent id={`our-values-description`} />
                  <Grid container spacing={3}>
                    {[
                      "our-values-1",
                      "our-values-2",
                      "our-values-3",
                      "our-values-4",
                    ].map((e) => (
                      <Grid item xs={12} sm={6} md={3} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={3}
                          justifyContent="center"
                          alignItems="center"
                          sx={{ textAlign: "center" }}
                        >
                          <ImageComponent id={`${e}-image`} />
                          <TextComponent id={`${e}-title`} />
                          <TextComponent id={`${e}-description`} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 10 }}>
                  <TextComponent id={`gallery-title`} />
                  <Grid container spacing={3}>
                    {[
                      "gallery-1",
                      "gallery-2",
                      "gallery-3",
                      "gallery-4",
                      "gallery-5",
                      "gallery-6",
                      "gallery-7",
                      "gallery-8",
                      "gallery-9",
                    ].map((e) => (
                      <Grid item xs={12} sm={6} md={4} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ textAlign: "center" }}
                        >
                          <ImageComponent id={`${e}-image`} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 10 }}>
                  <TextComponent id={`faq-title`} />
                  <Grid container spacing={3}>
                    {["faq-1", "faq-2", "faq-3"].map((e) => (
                      <Grid item sm={12} md={4} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          sx={{
                            textAlign: "left",
                            borderLeft: "2px solid #ccc",
                            p: 2,
                            gap: 2,
                          }}
                        >
                          <TextComponent id={`${e}-title`} />
                          <TextComponent id={`${e}-description`} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box display="flex" mt={5}>
                    <BaseButtonComponent id="faq-button" />
                  </Box>
                </Box>

                <Box sx={{ p: 10 }}>
                  <TextComponent id={`blog-title`} />
                  <Grid container spacing={3}>
                    {["blog-1", "blog-2", "blog-3", "blog-4"].map((e) => (
                      <Grid item xs={12} sm={6} md={3} key={e}>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <ImageComponent id={`${e}-image`} />
                          <TextComponent id={`${e}-author`} />
                          <TextComponent id={`${e}-title`} />
                          <TextComponent id={`${e}-description`} />
                          <TextComponent id={`${e}-date`} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box display="flex" mt={5}>
                    <BaseButtonComponent id="blog-button" />
                  </Box>
                </Box>
                <Box sx={{ p: 8 }}>
                  <TextComponent id={`pricing-title`} />
                  <Grid container spacing={3}>
                    {["pricing-1", "pricing-2", "pricing-3"].map((e, i) => (
                      <Grid item xs={12} sm={4} key={e}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          sx={{
                            textAlign: "center",
                            gap: i == 1 ? 3 : 2,
                            backgroundColor: i == 1 ? "#7d3ad3" : "white",
                            color: i == 1 ? "white" : "dark",
                            p: 2,
                            borderRadius: "24px",
                          }}
                        >
                          <TextComponent id={`${e}-title`} />
                          <TextComponent id={`${e}-description`} />
                          <TextComponent id={`${e}-price`} />
                          <BaseButtonComponent id="pricing-button" />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ p: 2, backgroundColor: "#451288", color: "white" }}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextComponent id="footer-title" />
                      <TextComponent id="footer-description" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextComponent id="footer-title" />
                      <TextComponent id="footer-description" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Grid container spacing={3}>
                        {[
                          "gallery-1",
                          "gallery-2",
                          "gallery-3",
                          "gallery-4",
                          "gallery-5",
                          "gallery-6",
                        ].map((e) => (
                          <Grid item xs={12} sm={4} key={e}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              sx={{ textAlign: "center" }}
                            >
                              <ImageComponent id={`${e}-image`} />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextComponent id="footer-title" />
                      <TextComponent id="footer-description" />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
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
  // const {
  //   data: { url_twitter, url_facebook, url_linkedin, url_instagram } = {},
  // } = useQuery(gql`
  //   query {
  //     getLandingSocial {
  //       url_twitter
  //       url_facebook
  //       url_linkedin
  //       url_instagram
  //     }
  //   }
  // `);

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

        {/* <BaseButtonComponent id="main-button" /> */}
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

const Advertise = () => (
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
        <Grid key={e.id} item xs={12} sm={6} lg={3}>
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
);

const BaseButtonComponent = ({ id }: { id: string }) => {
  const { getButtonByKey, type, onEdit, editId, setEditId, setType } =
    useStore();

  const { style, text, path } = getButtonByKey(id) || {};

  const condition = onEdit && type == "button" && editId == id;

  const Component = () => {
    if (path && !onEdit) {
      return (
        <Link href={path}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "40px",
              background:
                "linear-gradient(90deg, rgba(207,0,175,1) 0%, rgba(255,234,0,1) 100%)",
              fontWeight: "600",
              p: 2,
            }}
            style={style}
          >
            {text}
          </Button>
        </Link>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            borderRadius: "40px",
            background:
              "linear-gradient(90deg, rgba(207,0,175,1) 0%, rgba(255,234,0,1) 100%)",
            fontWeight: "600",
            p: 2,
          }}
          style={style}
          onClick={() => {
            setEditId(id);
            setType("button");
          }}
        >
          {text}
        </Button>
      );
    }
  };

  if (condition) {
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
          setType("button");
        }}
      >
        <Component />
      </Box>
    );
  }

  return <Component />;
};

interface PageStore {
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

const useStore = create<PageStore>((set, getData) => ({
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

export default withRouter(Index);
