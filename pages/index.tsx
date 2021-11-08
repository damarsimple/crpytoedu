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
import React, { useEffect } from "react";
import Image from "next/image";
import { Smartphone } from "@mui/icons-material";

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
  // components: {
  //   MuiButtonBase: {
  //     styleOverrides: {
  //       root: {
  //         color: "black",
  //       },
  //     },
  //   },
  //   MuiIconButton: {
  //     styleOverrides: {
  //       root: {
  //         color: "black",
  //       },
  //     },
  //   },
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         color: "black",
  //       },
  //     },
  //   },
  // },
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
        // if (page?.data) {
        //   const data: {
        //     text: Record<string, TextProps>;
        //     image: Record<string, ImageProps>;
        //   } = JSON.parse(page.data);
        //   setText(data.text);
        //   setImage(data.image);
        // }
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
                  {" "}
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
                  ) : (
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
                      <Learnmore />
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
                  <Grid container spacing={10} sx={{ mt: 4 }}>
                    {["team-1", "team-2", "team-3", "team-4"].map((e) => (
                      <Grid
                        key={e}
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        display="flex"
                        justifyContent="center"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: "column",
                            width: 270,
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
                            <ImageComponent id="testimonial-image" />
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
                    {["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6"].map(
                      (e) => (
                        <Grid item sm={12} md={2} key={e}>
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
                      )
                    )}
                  </Grid>
                  <Box display="flex" mt={5}>
                    <Learnmore />
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
                    <Learnmore />
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
                          <Learnmore />
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

const Learnmore = () => (
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
);

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

        <Learnmore />
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

    "advantages-1-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },
    "advantages-2-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },
    "advantages-3-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },
    "advantages-4-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },
    "advantages-5-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },
    "advantages-6-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "50px", color: "black" },
    },

    "about-image": {
      src: "/images/swiper-img.png",
      type: "image",
      alt: "laptop",
      width: 600,
      height: 400,
    },

    "stats-image": {
      src: "/images/stats.jpg",
      type: "image",
      alt: "laptop",
      width: 600,
      height: 400,
    },

    "stats-quote": {
      src: "format_quote",
      type: "icon",
      style: { fontSize: "50px", color: "white" },
    },
    "team-1-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },
    "team-2-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },
    "team-3-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },
    "team-4-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },
    "team-5-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },
    "team-6-image": {
      src: "/images/team-1-270x270.jpg",
      type: "image",
      alt: "laptop",
      width: 270,
      height: 270,
    },

    "testimonial-image": {
      src: "/images/user-1-64x64.jpg",
      type: "image",
      alt: "laptop",
      width: 80,
      height: 80,
      style: {
        borderRadius: "9999px",
      },
    },

    "our-values-1-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "100px", color: "black" },
    },
    "our-values-2-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "100px", color: "black" },
    },
    "our-values-3-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "100px", color: "black" },
    },
    "our-values-4-image": {
      src: "account_tree",
      type: "icon",
      style: { fontSize: "100px", color: "black" },
    },

    "gallery-1-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-2-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-3-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-4-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-5-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-6-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-7-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-8-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },
    "gallery-9-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },

    "blog-1-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },

    "blog-2-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },

    "blog-3-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
    },

    "blog-4-image": {
      src: "/images/grid-gallery-1-370x248.jpg",
      type: "image",
      alt: "laptop",
      width: 300,
      height: 250,
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
      variant: "h5",
      component: "h1",
      children: "JOINCHAMPIONTRADING",
      style: {
        color: "white",
        maxWidth: "60ch",
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

    "advantages-title": {
      children: "Kenapa Memilih Kami ?",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },
    "advantages-description": {
      children: "Pengguna kami suka akan hasil yang kami berikan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "25px", textAlign: "center" },
    },

    "advantages-1-title": {
      children: "Hasil Yang dicintai semua orang",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-1-description": {
      children: "Pengguna kami suka akan hasil yang kami berikan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "advantages-2-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-2-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "advantages-3-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-3-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "advantages-4-title": {
      children: "DeFi",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-4-description": {
      children: "Decentralized finance is futures 👊",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "advantages-5-title": {
      children: "DeFi",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-5-description": {
      children: "🍕 Bitcoin Pizza Day",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "advantages-6-title": {
      children: "NFT",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "advantages-6-description": {
      children: "Kami memiliki master NFT ... ",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "about-title": {
      children: "Tentang Kami",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px" },
    },
    "about-description": {
      children: "Kami memiliki master NFT ... ",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "25px" },
    },
    "about-content": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur amet error dolorum quidem saepe maxime earum
                    nesciunt non ex impedit itaque? Et id impedit temporibus
                    ipsa cumque facere asperiores molestias magni amet, ad
                    consectetur eveniet, minus ducimus consequatur placeat, ea
                    adipisci pariatur iste unde? Repellat, expedita laudantium
                    beatae eum quis magni vel sapiente exercitationem totam
                    culpa quidem nisi laborum! Sapiente modi deserunt omnis,
                    itaque aperiam alias magni excepturi eaque magnam veritatis
                    dolor blanditiis, qui voluptas numquam nesciunt incidunt
                    deleniti debitis perspiciatis dolorem cumque. Dolorem quasi
                    optio officia pariatur inventore!`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "stats-title": {
      children: "Statistik",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "40px" },
    },
    "stats-content": {
      children:
        "Platform kami mencari perkembangan dan pelayanan yang sangat nyaman, cepat , aman, tentram, bahagia dan luar biasa untuk pengguna - pengguna yang berada di indonesia",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px", fontStyle: "italic" },
    },

    "stats-founder": {
      children: "Samuel CZ. Ezle",
      variant: "caption",
      component: "p",
      style: { color: "yellow", fontSize: "15px" },
    },

    "stats-founder-position": {
      children: "CEO & Founder of Champion Trading",
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "stats-image-description": {
      children: "Perkembangan kami sangat pesat",
      variant: "caption",
      component: "p",
      style: { color: "white", fontSize: "20px" },
    },

    "team-title": {
      children: "Tim Kami",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "45px" },
    },

    "team-1-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-1-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-1-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur amet error dolorum quidem saepe maxime earum
                    nesciunt non ex impedit itaque? Et id impedit temporibus
                    ipsa cumque facere`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "team-2-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-2-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-2-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "team-3-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-3-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-3-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "team-4-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-4-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-4-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur`,
      variant: "caption",
      component: "p",
      style: {
        color: "black",
        fontSize: "15px",
      },
    },

    "team-5-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-5-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-5-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "team-6-name": {
      children: `Samuel Eclair`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "team-6-position": {
      children: `CEO & Founder`,
      variant: "caption",
      component: "p",
      style: { color: "lightgray", fontSize: "15px", fontStyle: "italic" },
    },
    "team-6-description": {
      children: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Optio esse totam animi magni hic, alias quo placeat ipsa
                    cumque tenetur`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-name": {
      children: `Testimoni`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "45px", textAlign: "center" },
    },
    "testimonials-1-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-1-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-1-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-1-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-2-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-2-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-2-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-2-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-3-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-3-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-3-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-3-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-4-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-4-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-4-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-4-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-5-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-5-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-5-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-5-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-6-date": {
      children: `2 hari yang lalu`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px", fontStyle: "italic" },
    },

    "testimonials-6-content": {
      children: `Champion Trading adalah tempat dimana saya bisa belajar berinvestasi crpyto currency 👍`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "testimonials-6-client-name": {
      children: `Hanson Kun`,
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },

    "testimonials-6-client-position": {
      children: `Regular Client`,
      variant: "caption",
      component: "p",
      style: { color: "gray", fontSize: "15px", fontStyle: "italic" },
    },

    "our-values-1-title": {
      children: "Hasil Yang dicintai semua orang",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "our-values-1-description": {
      children: "Pengguna kami suka akan hasil yang kami berikan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "our-values-2-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "our-values-2-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "our-values-3-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "our-values-3-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "our-values-4-title": {
      children: "DeFi",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "our-values-4-description": {
      children: "Decentralized finance is futures 👊",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "our-values-title": {
      children: "Nilai Kami",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },
    "our-values-description": {
      children: "Pengguna kami suka akan hasil yang kami berikan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "25px", textAlign: "center" },
    },

    "gallery-title": {
      children: "Galeri Kami",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },

    "faq-title": {
      children: "Pertanyaan yang sering ditanyakan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },

    "faq-1-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-1-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "faq-2-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-2-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "faq-3-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-3-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "faq-4-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-4-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "faq-5-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-5-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "faq-6-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "faq-6-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "blog-title": {
      children: "Posting Blog Terbaru",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },

    "blog-1-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "blog-1-author": {
      children: "by Metrokator Aesir",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-1-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-1-date": {
      children: "2 hari yang lalu",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "blog-2-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "blog-2-author": {
      children: "by Metrokator Aesir",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-2-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-2-date": {
      children: "2 hari yang lalu",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "blog-3-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "blog-3-author": {
      children: "by Metrokator Aesir",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-3-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-3-date": {
      children: "2 hari yang lalu",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "blog-4-title": {
      children: "To The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "blog-4-author": {
      children: "by Metrokator Aesir",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-4-description": {
      children: "Pengguna kami bisa memesan tiket ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "blog-4-date": {
      children: "2 hari yang lalu",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "pricing-title": {
      children: "Langganan",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "40px", textAlign: "center" },
    },

    "pricing-1-title": {
      children: "The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "pricing-1-description": {
      children: "Pengguna bisa mengakses acara ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "pricing-1-price": {
      children: "Rp. 300.000",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "pricing-2-title": {
      children: "The Moon",
      variant: "caption",
      component: "p",
      style: { fontSize: "20px" },
    },
    "pricing-2-description": {
      children: "Pengguna bisa mengakses acara ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { fontSize: "15px" },
    },
    "pricing-2-price": {
      children: "Rp. 300.000",
      variant: "caption",
      component: "p",
      style: { fontSize: "15px" },
    },

    "pricing-3-title": {
      children: "The Moon",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "20px" },
    },
    "pricing-3-description": {
      children: "Pengguna bisa mengakses acara ke luar angkasa",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },
    "pricing-3-price": {
      children: "Rp. 300.000",
      variant: "caption",
      component: "p",
      style: { color: "black", fontSize: "15px" },
    },

    "footer-title": {
      children: "CHAMPIONTRADING",
      variant: "caption",
      component: "p",
      style: { fontSize: "30px", fontStyle: "bold" },
    },

    "footer-description": {
      children: "CHAMPIONTRADING adalah platform blablabalbalbalbalbalb",
      variant: "caption",
      component: "p",
      style: { fontSize: "15px", maxWidth: "75ch" },
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
