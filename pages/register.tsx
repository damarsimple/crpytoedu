import React, { useCallback, useEffect, useState } from "react";

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
  CircularProgress,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import usePlaces from "../hooks/usePlaces";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  AuthOutput,
  Classroom,
  ClassroomEdge,
  File as FileType,
  User,
} from "../types/type";
import { CoreUserInfoMinimalField } from "../fragments/fragments";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { values } from "lodash";

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

interface CheckAvailable {
  username: "exist" | "notexist";
  email: "exist" | "notexist";
}

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
  const [data, setData] = useState<Record<string, string>>({});
  const [checkAvailable, setCheckAvailable] = useState<
    CheckAvailable | undefined
  >(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [registerType, setRegisterType] = useState<RegisterType | undefined>(
    undefined
  );

  const [stepType, setStepType] = useState<"FINISH" | StepType | undefined>(
    undefined
  );

  const [event, setEvent] = useState<Classroom | undefined>(undefined);

  const [showAll, setShowAll] = useState(false);

  const {
    setCity,
    setDistrict,
    setProvince,
    province,
    city,
    district,
    districts,
    provinces,
    cities,
  } = usePlaces({});

  const {
    refetch,
    data: { getParentCandidate } = {},
    loading,
    error,
  } = useQuery<{ getParentCandidate: User }>(
    gql`
      query Query($city_id: ID, $province_id: ID, $event_id: ID) {
        getParentCandidate(
          city_id: $city_id
          province_id: $province_id
          event_id: $event_id
        ) {
          id
          name
          username
          title
          cover {
            id
            path
            mime
            name
          }
          city {
            id
            name
          }
          province {
            id
            name
          }
          url_facebook
          url_twitter
          url_instagram
          url_linkedin
        }
      }
    `,
    {
      variables: {
        province_id: showAll ? undefined : province?.id,
        city_id: showAll ? undefined : city?.id,
        event_id: event?.id,
      },
      fetchPolicy: "network-only",
    }
  );

  const { data: { availableEvents } = {} } = useQuery<{
    availableEvents: { edges: ClassroomEdge[] };
  }>(
    gql`
      query Query(
        $first: Int!
        $district_id: ID
        $city_id: ID
        $province_id: ID
      ) {
        availableEvents(
          first: $first
          district_id: $district_id
          city_id: $city_id
          province_id: $province_id
        ) {
          edges {
            node {
              id
              user {
                id
                name
              }
              name
              max_join
              trainersCount
              participantsCount
              province {
                id
                name
              }
              city {
                id
                name
              }
              cover {
                id
                name
                path
              }
              thumbnail {
                id
                name
                path
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        first: 10,
        province_id: showAll ? undefined : province?.id,
        city_id: showAll ? undefined : city?.id,
      },
    }
  );

  const next = () => {
    if (!registerType) return;

    if (currentStep == steps[registerType].length - 1) {
      setStepType("FINISH");
    }

    if (currentStep == 0 || stepType == "Data Diri") {
      if (!city || !district || !province) {
        toast.error("Anda belum mengisi wilayah ");
        return;
      }

      for (const x of [
        "name",
        "username",
        "email",
        "password",
        "confirm_password",
      ]) {
        if (!data[x]) {
          toast.error("Anda belum mengisi " + x);
          return;
        }
      }

      if (data["confirm_password"] != data["password"]) {
        toast.error("Password tidak sama ");
        return;
      }

      if (data["password"].length < 8) {
        toast.error("Password harus memiliki 8 karakter");
        return;
      }

      if (
        checkAvailable?.email == "exist" ||
        checkAvailable?.username == "exist"
      ) {
        toast.error("Mohon gunakan email / username yang belum digunakan");
        return;
      }
    }

    if (stepType == "Pembayaran") {
      if (!proves) return toast.error("Anda belum mengupload bukti pembayaran !");

      handleRegister();
    }

    setStepType(steps[registerType][currentStep + 1]);
    setCurrentStep(currentStep + 1);
  };

  const [handleUpload, { loading: lUpload }] = useMutation<{
    uploadFile: {
      status: boolean;
      message?: string;
      file?: FileType;
    };
  }>(gql`
    mutation Mutation($input: UploadFile!) {
      uploadFile(input: $input) {
        status
        message
        file {
          id
          name
          mime
          path
        }
      }
    }
  `);

  const [handleRegisterMutation, { loading: lRegister }] = useMutation<{
    register: AuthOutput;
  }>(gql`
    ${CoreUserInfoMinimalField}
    mutation Mutation($input: Register!) {
      register(input: $input) {
        status
        message
        token
        user {
          ...CoreUserInfoMinimalField
          roles
          province {
            id
            name
          }
          city {
            id
            name
          }
        }
      }
    }
  `);

  const [handleCheckAvailability] = useMutation<{
    handleCheckAvailability: CheckAvailable;
  }>(gql`
    mutation HandleCheckAvailabilityMutation(
      $username: String!
      $email: String!
    ) {
      handleCheckAvailability(username: $username, email: $email) {
        email
        username
      }
    }
  `);

  useEffect(() => {
    data.username &&
      data.email &&
      handleCheckAvailability({
        variables: {
          username: data.username,
          email: data.email,
        },
      }).then((e) => {
        e.data?.handleCheckAvailability &&
          setCheckAvailable(e.data.handleCheckAvailability);
      });
  }, [data]);

  const { setToken } = useAuthStore();

  const { setUser } = useUserStore();

  const [proves, setProves] = useState<FileType | undefined>(undefined);

  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    handleUpload({
      variables: {
        input: {
          name: file.name,
          mime: file.type,
          file,
        },
      },
    }).then((e) => {
      if (e.data?.uploadFile?.status && e.data.uploadFile.file) {
        const f = e.data.uploadFile.file;
        setProves(f);
      } else {
        toast({
          description: e.data?.uploadFile.message,
        });
      }
    }).catch((e) => toast({
      description: `error ${e}`,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRegister = () => {
    if (!proves) return toast.error("Anda belum mengupload bukti pembayaran !");

    handleRegisterMutation({
      variables: {
        input: {
          prove_id: proves.id,
          parent_id: getParentCandidate?.id,
          province_id: province?.id,
          city_id: city?.id,
          district_id: district?.id,
          subscription_type: registerType,
          classroom_id: event?.id,
          ...data,

          confirm_password: undefined,
        },
      },
    }).then((e) => {
      if (
        e.data?.register.status &&
        e.data.register.token &&
        e.data.register.user
      ) {
        toast.success("Berhasil mendaftar akun anda");

        setToken(e.data.register.token);
        setUser(e.data.register.user);

        window.location.replace(
          `/${e.data.register.user?.roles?.toLowerCase() + "s"}`
        );
      } else {
        toast.error(e?.data?.register?.message);
      }
    });
  };

  const reset = () => {
    setRegisterType(undefined);
    setStepType(undefined);
    setCurrentStep(0);
  };

  const back = () => {
    if (!registerType || currentStep == 0) return;

    const step = currentStep - 1
    setCurrentStep(step);
    setStepType(steps[registerType][step]);
  };


  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
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
                    <TextField
                      fullWidth
                      label="Nama"
                      defaultValue={data.name}
                      variant="outlined"
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      defaultValue={data.username}

                      variant="outlined"
                      color={
                        checkAvailable?.username == "exist"
                          ? "warning"
                          : undefined
                      }
                      helperText={
                        checkAvailable?.username == "exist"
                          ? "Username sudah digunakan"
                          : undefined
                      }
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue={data.email}

                      variant="outlined"
                      type="email"
                      color={
                        checkAvailable?.email == "exist" ? "warning" : undefined
                      }
                      helperText={
                        checkAvailable?.email == "exist"
                          ? "Email sudah digunakan"
                          : undefined
                      }
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined">
                      <InputLabel>Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                        fullWidth
                        defaultValue={data.password}

                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined">
                      <InputLabel>Konfirmasi Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) =>
                          setData({ ...data, confirm_password: e.target.value })
                        }
                        fullWidth
                        defaultValue={data.confirm_password}

                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={provinces?.map((e) => ({
                        label: e.name,
                        id: e.id,
                        rest: e,
                      }))}
                      fullWidth
                      onChange={(_, v) => v?.rest && setProvince(v.rest)}
                      renderInput={(params) => (
                        <TextField {...params} label="Provinsi" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={cities?.map((e) => ({
                        label: e.name,
                        id: e.id,
                        rest: e,
                      }))}
                      fullWidth
                      onChange={(_, v) => v?.rest && setCity(v.rest)}
                      renderInput={(params) => (
                        <TextField {...params} label="Kota / Kabupaten" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={districts?.map((e) => ({
                        label: e.name,
                        id: e.id,
                        rest: e,
                      }))}
                      fullWidth
                      onChange={(_, v) => v?.rest && setDistrict(v.rest)}
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
                    Acara di {city?.name}, {province?.name}
                  </Box>
                  <Paper sx={{ p: 2 }}>
                    {availableEvents?.edges?.length == 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography>
                          Tidak menemukan acara di {city?.name},{" "}
                          {province?.name}
                        </Typography>
                        <Button onClick={() => setShowAll(true)}>
                          Lihat semua acara aktif?
                        </Button>
                      </Box>
                    ) : (
                      <Grid
                        container
                        spacing={2}
                        sx={{ overflowY: "auto", maxHeight: 650 }}
                      >
                        {availableEvents?.edges?.map(({ node }, i) => (
                          <Grid item xs={12} sm={4} key={node?.id}>
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
                                  {node?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {node?.address}
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
                                  {node?.city?.name}, {node?.province?.name}
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <GroupIcon />
                                  {node?.trainersCount} Trainer
                                </Box>
                              </Box>

                              <CardActions>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={() => {
                                    setEvent(node);
                                    console.log(node);
                                    next();
                                  }}
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
                      Trainer di {city?.name}, {province?.name}
                    </Box>
                    <Paper sx={{ p: 2 }}>
                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Grid
                          container
                          spacing={2}
                          sx={{ overflowY: "auto", maxHeight: 650 }}
                        >
                          {getParentCandidate ? (
                            <Card>
                              <Box sx={{ height: 300 }}>
                                <CardMedia
                                  component="img"
                                  image={
                                    getParentCandidate?.cover?.path ??
                                    "/person-placeholder.jpg"
                                  }
                                  sx={{
                                    height: 300,
                                    objectFit: "cover",
                                  }}
                                  alt={getParentCandidate.name}
                                />
                              </Box>
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {getParentCandidate.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {getParentCandidate.title}
                                </Typography>
                              </CardContent>
                              <Box
                                sx={{
                                  p: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    if (window.open)
                                      //@ts-ignore
                                      window
                                        .open(
                                          getParentCandidate?.url_facebook ??
                                          "",
                                          "_blank"
                                        )
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
                                        .open(
                                          getParentCandidate?.url_twitter ?? "",
                                          "_blank"
                                        )
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
                                        .open(
                                          getParentCandidate?.url_instagram ??
                                          "",
                                          "_blank"
                                        )
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
                                        .open(
                                          getParentCandidate?.url_linkedin ??
                                          "",
                                          "_blank"
                                        )
                                        .focus();
                                  }}
                                >
                                  <LinkedInIcon />
                                </IconButton>
                              </Box>
                              {showAll && (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <PlaceIcon /> {getParentCandidate?.city?.name}
                                  , {getParentCandidate?.province?.name}
                                </Box>
                              )}
                              <CardActions>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={() =>
                                    refetch().then((e) =>
                                      toast.success(
                                        "berhasil mengganti trainer"
                                      )
                                    )
                                  }
                                >
                                  GANTI TRAINER
                                </Button>
                              </CardActions>
                            </Card>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography>
                                Tidak menemukan trainer di {city?.name},{" "}
                                {province?.name}
                              </Typography>
                              <Button onClick={() => setShowAll(true)}>
                                Lihat semua trainer aktif?
                              </Button>
                            </Box>
                          )}
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
                  {proves ? (
                    <Box
                      sx={{
                        backgroundColor: "lightgray",
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed gray",
                        borderStyle: "dashed",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={proves.path}
                        alt={proves.name}
                        layout="fill"
                      />
                    </Box>
                  ) : (
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
                      {lUpload && <CircularProgress />}
                    </Box>
                  )}
                </Box>
              )}
              {currentStep !== 0 && <Button onClick={back}>Kembali</Button>}
              {!["FINISH", "Pilih Acara"].includes(stepType ?? "") && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button onClick={reset}>Ubah Tipe Pendaftaran</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      next();
                    }}
                  >
                    {stepType == "Pembayaran" ? "Selesai" : "Selanjutnya"}
                  </Button>
                </Box>
              )}
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
