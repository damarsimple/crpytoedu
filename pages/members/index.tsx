import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StarIcon from "@mui/icons-material/Star";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import { Carousel } from "react-responsive-carousel";
import { useUserStore } from "../../store/user";
import usePlaces from "../../hooks/usePlaces";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  Classroom,
  ClassroomEdge,
  File as FileType,
  Roles,
  User,
} from "../../types/type";
import { AccountBox } from "@mui/icons-material";
import { useRouter } from "next/dist/client/router";
import { client } from "../_app";
import { toast } from "react-toastify";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
export default function Index() {
  const { user, setUser } = useUserStore();

  const {
    city,
    cities,
    province,
    provinces,
    districts,
    setCity,
    setProvince,
    setDistrict,
    district,
  } = usePlaces({});

  const [setPlace, setSetPlace] = useState(false);

  const [seeAll, setSeeAll] = useState(false);

  const close = () => setSetPlace(false);

  const province_id = seeAll ? undefined : province?.id ?? user?.province?.id;
  const city_id = seeAll ? undefined : city?.id ?? user?.city?.id;
  const district_id = seeAll ? undefined : district?.id ?? user?.district?.id;

  const { data } = useQuery<{ availableEvents: { edges: ClassroomEdge[] } }>(
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
        province_id,
        city_id,
        district_id,
      },
    }
  );

  const {
    data: { me } = {},
    refetch,
    loading,
  } = useQuery<{ me: User }>(
    gql`
      query GetMe {
        me {
          subscription_verified
          subscription_expired_at
          subscription_reason
          payment_proves {
            id
            user_id
            name
            path
          }
        }
      }
    `,
    {
      variables: {
        first: 10,
        province_id,
        city_id,
        district_id,
      },
    }
  );

  const notPayed = !user?.subscription_verified && user?.roles == Roles.Member;

  const [tabs, setTabs] = useState(0);

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

  const [proves, setProves] = useState<FileType | undefined>(undefined);

  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    handleUpload({
      variables: {
        input: {
          name: file.name,
          mime: file.type,
          roles: "PAYMENT_PROVE",
          file,
        },
      },
    }).then((e) => {
      if (e.data?.uploadFile?.status && e.data.uploadFile.file) {
        const f = e.data.uploadFile.file;
        setProves(f);
        refetch();
      } else {
        toast({
          description: e.data?.uploadFile.message,
        });
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <DashboardLayout>
      {notPayed ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" component="h1">
            Pembayaran anda belum diverifikasi ...
          </Typography>
          {me?.subscription_reason && (
            <Typography variant="body1" component="p">
              {me.subscription_reason}
            </Typography>
          )}
          <Button
            fullWidth
            onClick={() =>
              refetch().then((e) => {
                toast.info("Berhasil check ulang");
                setUser({ ...user, ...e.data.me });
              })
            }
            disabled={loading}
          >
            CHECK ULANG
          </Button>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabs} onChange={(_, e) => setTabs(e)}>
              <Tab label="Bukti Pembayaran" />
              <Tab label="Upload Bukti Pembayaran" />
            </Tabs>
          </Box>
          {tabs == 0 && (
            <Box>
              {me?.payment_proves?.map((e) => (
                <Image
                  src={e.path}
                  alt={e.name}
                  key={e.id}
                  height={600}
                  width={900}
                />
              ))}
            </Box>
          )}
          {tabs == 1 && (
            <Box>
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
                  <Image src={proves.path} alt={proves.name} layout="fill" />
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
        </Box>
      ) : (
        <>
          <Typography variant="h3" component="h1">
            Acara yang tersedia untuk anda
          </Typography>
          <Modal open={setPlace} onClose={close}>
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                height: 600,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                zIndex: 50,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Box>
                  <Typography sx={{ my: 1 }} align="center">
                    Provinsi
                  </Typography>
                  <List sx={{ width: 200, height: 500, overflowY: "auto" }}>
                    {provinces?.map((e) => (
                      <ListItem disablePadding key={e.id}>
                        <ListItemButton onClick={() => setProvince(e)}>
                          {(province?.id ?? user?.province_id) == e.id && (
                            <ListItemIcon>
                              <StarIcon />
                            </ListItemIcon>
                          )}
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography sx={{ my: 1 }} align="center">
                    Kota / Kabupaten
                  </Typography>
                  <List sx={{ width: 200, height: 500, overflowY: "auto" }}>
                    {cities.map((e, i) => (
                      <ListItem disablePadding key={e.id}>
                        <ListItemButton onClick={() => setCity(e)}>
                          {(city?.id ?? user?.city_id) == e.id && (
                            <ListItemIcon>
                              <StarIcon />
                            </ListItemIcon>
                          )}
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography sx={{ my: 1 }} align="center">
                    Kecamatan / Kelurahan
                  </Typography>
                  <List sx={{ width: 200, height: 500, overflowY: "auto" }}>
                    {districts.map((e, i) => (
                      <ListItem disablePadding key={e.id}>
                        <ListItemButton onClick={() => setDistrict(e)}>
                          {(district?.id ?? user?.district_id) == e.id && (
                            <ListItemIcon>
                              <StarIcon />
                            </ListItemIcon>
                          )}
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
              <Button fullWidth sx={{ mt: 1 }} onClick={close}>
                Tutup
              </Button>
            </Box>
          </Modal>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            <Button startIcon={<PlaceIcon />} onClick={() => setSetPlace(true)}>
              Acara di {city?.name ?? user?.city?.name},{" "}
              {province?.name ?? user?.province?.name}
            </Button>
            <Carousel showThumbs={false} showArrows autoPlay>
              {data?.availableEvents?.edges?.map(
                ({ node: { name, thumbnail } }, i) => (
                  <Box sx={{ height: 300 }} key={i}>
                    <img
                      src={thumbnail?.path ?? "/tothemoon.jpg"}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <p className="legend">{name}</p>
                  </Box>
                )
              )}
            </Carousel>

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
              <Grid container spacing={2}>
                {data?.availableEvents?.edges?.map(({ node }, i) => (
                  <Grid item xs={12} md={3} lg={2} key={i}>
                    <ClassroomCard {...node} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}
    </DashboardLayout>
  );
}

const ClassroomCard = ({
  id,
  cover,
  name,
  province,
  city,
  trainersCount,
  participantsCount,
  max_join,
  user,
}: Classroom) => {
  const { push } = useRouter();
  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={cover?.name ?? "/tothemoon.jpg"}
        alt={name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ height: 50 }}
        >
          {name}
        </Typography>
      </CardContent>
      <Grid spacing={1} container sx={{ p: 1 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountBox />
            {user?.name}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceIcon />
            {city?.name}, {province?.name}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon />
            {trainersCount} Trainer
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon />
            {participantsCount}/{max_join} Peserta
          </Box>
        </Grid>
      </Grid>

      <CardActions>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push("/events/" + id)}
        >
          lihat acara
        </Button>
      </CardActions>
    </Card>
  );
};
