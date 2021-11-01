import React, { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";
import {
  ButtonBase,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Paper,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
type RegisterType = "ONLINE" | "OFFLINE";

const images: {
  url: string;
  title: RegisterType;
}[] = [
  {
    url: "/online-meeting.jpg",
    title: "ONLINE",
  },
  {
    url: "/offline-meeting.jpg",
    title: "OFFLINE",
  },
];

export const formatCardNumber = (value: string) => {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = value.replace(/[^\d]/g, "");

  return onlyNumbers.replace(regex, (_regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter((group) => !!group).join("-")
  );
};

const banks: {
  url: string;
  title: string;
  numbers: string;
  names: string;
}[] = [
  {
    url: "/mandiri.png",
    title: "MANDIRI",
    numbers: "123456789",
    names: "a/n Seseorang",
  },
  {
    url: "/bca.png",
    title: "BCA",
    numbers: "123456789",
    names: "a/n Seseorang",
  },
  {
    url: "/bni.png",
    title: "BNI",
    numbers: "123456789",
    names: "a/n Seseorang",
  },
];

type StepType = "Data Diri" | "Pilih Trainer" | "Pembayaran" | "Pilih Acara";

const steps: Record<RegisterType, StepType[]> = {
  ONLINE: ["Data Diri", "Pilih Trainer", "Pembayaran"],
  OFFLINE: ["Data Diri", "Pilih Acara", "Pilih Trainer", "Pembayaran"],
};

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [registerType, setRegisterType] = useState<RegisterType | undefined>(
    undefined
  );

  const [stepType, setStepType] = useState<"FINISH" | StepType | undefined>(
    undefined
  );

  const next = () => {
    if (!registerType) return;

    if (currentStep == steps[registerType].length - 1) {
      setStepType("FINISH");
    }
    setStepType(steps[registerType][currentStep + 1]);
    setCurrentStep(currentStep + 1);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const reset = () => {
    setRegisterType(undefined);
    setStepType(undefined);
    setCurrentStep(0);
  };

  return (
    <Grid container sx={{ height: "100vh", width: "100vw" }}>
      <Grid item xs={false} sm={3} md={6} sx={{ position: "relative" }}>
        <Image layout="fill" src={"/dogememe.jpg"} alt="Doge picture" />
      </Grid>
      <Grid item xs={12} sm={9} md={6}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {registerType ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
                p: 1,
              }}
            >
              <Typography variant="h4" align="center" component="h1">
                FORMULIR PENDAFTARAN
              </Typography>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps[registerType].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {stepType == "Data Diri" && (
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nama" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Username" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Password" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Konfirmasi Password"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      options={[{ label: "The Godfather", id: 1 }]}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Provinsi" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      options={[{ label: "The Godfather", id: 1 }]}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Kota / Kabupaten" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      options={[{ label: "The Godfather", id: 1 }]}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Kecamatan / Kelurahan" />
                      )}
                    />
                  </Grid>
                </Grid>
              )}

              {stepType == "Pilih Acara" && (
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PlaceIcon />
                    Acara di Bekasi, DKI Jakarta
                  </Box>
                  <Paper sx={{ p: 2 }}>
                    {false ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography>
                          Tidak menemukan acara di Bekasi, DKI Jakarta
                        </Typography>
                        <Button>Lihat semua acara aktif?</Button>
                      </Box>
                    ) : (
                      <Grid
                        container
                        spacing={2}
                        sx={{ overflowY: "auto", maxHeight: 650 }}
                      >
                        {[...Array(10)].map((_, i) => (
                          <Grid item xs={12} sm={4} key={i}>
                            <Card>
                              <CardMedia
                                component="img"
                                height="300"
                                image="/tothemoon.jpg"
                                alt="swoole doge"
                              />
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  Acara NFT
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  JL. Kripto Mangun kusuma
                                </Typography>
                              </CardContent>
                              <Box
                                sx={{
                                  p: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <PlaceIcon />
                                  Bekasi, DKI Jakarta
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <GroupIcon />
                                  10 Trainer
                                </Box>
                              </Box>

                              <CardActions>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={next}
                                >
                                  pilih acara
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Paper>
                </Box>
              )}
              {stepType == "Pilih Trainer" && (
                <Grid>
                  <Box
                    sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PlaceIcon />
                      Trainer di Bekasi, DKI Jakarta
                    </Box>
                    <Paper sx={{ p: 2 }}>
                      {false ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography>
                            Tidak menemukan trainer di Bekasi, DKI Jakarta
                          </Typography>
                          <Button onClick={next}>
                            Lihat semua trainer aktif?
                          </Button>
                        </Box>
                      ) : (
                        <Grid
                          container
                          spacing={2}
                          sx={{ overflowY: "auto", maxHeight: 650 }}
                        >
                          {[...Array(10)].map((_, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                              <Card>
                                <CardMedia
                                  component="img"
                                  height="300"
                                  image="/person-placeholder.jpg"
                                  alt="swoole doge"
                                />
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                  >
                                    NATHANEL KUSUMA
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    GOD OF WAR
                                  </Typography>
                                </CardContent>
                                <Box
                                  sx={{
                                    p: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <IconButton>
                                    <FacebookIcon />
                                  </IconButton>
                                  <IconButton>
                                    <TwitterIcon />
                                  </IconButton>
                                  <IconButton>
                                    <InstagramIcon />
                                  </IconButton>
                                  <IconButton>
                                    <LinkedInIcon />
                                  </IconButton>
                                </Box>

                                <CardActions>
                                  <Button fullWidth variant="contained">
                                    pilih trainer
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Paper>
                  </Box>
                </Grid>
              )}
              {stepType == "Pembayaran" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Typography variant="body1" component="p">
                    Transfer pembayaran sebesar {registerType}_PRICE ke akun
                    bank berikut
                  </Typography>

                  <Grid container spacing={2}>
                    {banks.map((e) => (
                      <Grid
                        key={e.title}
                        item
                        xs={6}
                        sm={4}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "center",
                          p: 3,
                        }}
                      >
                        <Box sx={{ position: "relative", height: 100 }}>
                          <Image alt={e.title} src={e.url} layout="fill" />
                        </Box>

                        <Typography variant="body1" component="p">
                          {e.title}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {formatCardNumber(e.numbers)}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {e.names}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: "lightgray",
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed gray",
                      borderStyle: "dashed",
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Taruh file disini</p>
                    ) : (
                      <p>Taruh atau klik untuk mengupload bukti pembayaran</p>
                    )}
                  </Box>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={reset}>Ubah Tipe Pendaftaran</Button>
                <Button variant="contained" onClick={next}>
                  Selanjutnya
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" align="center" component="h1">
                PILIH TIPE REGISTRASI ANDA
              </Typography>
              <Grid container>
                {images.map((image) => (
                  <Grid item xs={6} key={image.title}>
                    <ImageButton
                      onClick={() => {
                        setRegisterType(image.title as any);
                        setStepType(steps[image.title][0]);
                      }}
                      style={{
                        width: "100%",
                      }}
                    >
                      <ImageSrc
                        style={{ backgroundImage: `url(${image.url})` }}
                      />
                      <ImageBackdrop className="MuiImageBackdrop-root" />
                      <ImageSpan>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="inherit"
                          sx={{
                            position: "relative",
                            p: 4,
                            pt: 2,
                            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                          }}
                        >
                          {image.title}
                          <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                      </ImageSpan>
                    </ImageButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const ImageSpan = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));
