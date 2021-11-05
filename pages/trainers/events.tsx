import { useQuery, gql, useMutation } from "@apollo/client";
import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  Autocomplete,
  Stepper,
  Step,
  StepButton,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";
import { wildCardFormatter } from "../../helpers/formatters";
import { Classroom, File, User, UserEdge } from "../../types/type";
import { DateTimePicker } from "@mui/lab";
import usePlaces from "../../hooks/usePlaces";
import moment from "moment";
import { UploadZone } from "../../components/EventMediaEditor";
import { useUserStore } from "../../store/user";
import { useRouter } from "next/dist/client/router";
import EventPages from "../../components/EventPages";

export default function Events() {
  const [value, setValue] = useState(0);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const { data: { availableTrainers } = {}, loading: lusers } = useQuery<{
    availableTrainers: { edges: UserEdge[] };
  }>(
    gql`
      query Query(
        $first: Int!
        $name: String
        $province_id: ID
        $city_id: ID
        $district_id: ID
        $idsNotIn: [String]
      ) {
        availableTrainers(
          first: $first
          name: $name
          province_id: $district_id
          city_id: $city_id
          district_id: $province_id
          idsNotIn: $idsNotIn
        ) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
      variables: {
        first: 10,
        name: wildCardFormatter(name),
        idsNotIn: trainers?.map((e) => e.id),
      },
    }
  );

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

  const [data, setData] = useState<Record<string, string>>({});
  const [dateData, setdateData] = useState<Record<string, Date | null>>({});
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const prev = () => {
    setCurrentStep(currentStep != 0 ? currentStep - 1 : 0);
  };

  const [handleMutation] = useMutation<{ createClassroom: Classroom }>(gql`
    mutation CreateClassroomMutation($input: CreateClassroom!) {
      createClassroom(input: $input) {
        id
      }
    }
  `);

  const { push } = useRouter();

  const { user } = useUserStore();

  const [handleUpdateCover] = useMutation(gql`
    mutation UpdateFileMutation($updateFileId: ID!, $input: UpdateFile!) {
      updateFile(id: $updateFileId, input: $input) {
        id
      }
    }
  `);

  const next = () => {
    if (currentStep == 0) {
      for (const x of ["name", "address", "max_join", "max_trainer"]) {
        console.log(x);
        if (!data[x]) {
          toast.error("Anda belum mengisi " + x);

          return;
        }
      }
      for (const x of ["begin_at", "finish_at"]) {
        if (!dateData[x]) {
          toast.error("Anda belum mengisi " + x);
          return;
        }
      }

      if (!province || !district || !city) {
        toast.error("Anda belum mengisi data wilayah");
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      user &&
        handleMutation({
          variables: {
            input: {
              province_id: province?.id,
              city_id: city?.id,
              district_id: district?.id,
              ...data,
              ...dateData,
              trainers: { sync: [user.id, ...trainers?.map((e) => e.id)] },
            },
          },
        }).then((e) => {
          push("/events/" + e.data?.createClassroom.id);
          for (const x of Object.keys(fileMap)) {
            const f = fileMap[x];
            handleUpdateCover({
              variables: {
                id: f?.id,
                input: {
                  roles: x,
                  fileable_id: e.data?.createClassroom.id,
                  fileable_type: "App\\Models\\Classroom",
                },
              },
            });
          }
        });
    }
  };

  const {
    data: { me } = {},
    refetch,
    loading,
  } = useQuery<{ me: User }>(
    gql`
      query GetMe {
        me {
          my_staging_event {
            id
          }
        }
      }
    `
  );

  return (
    <DashboardLayout>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={(_, e) => setValue(e)}>
          <Tab label="Pengajuan Acara" />
          <Tab label="Histori Acara" />
        </Tabs>
      </Box>

      <Box>
        {me?.my_staging_event ? (
          <EventPages id={me.my_staging_event.id} />
        ) : (
          <>
            {value == 0 && (
              <Box display="flex" flexDirection="column" gap={1} p={3}>
                <Stepper nonLinear activeStep={currentStep}>
                  {["Data Acara", "Trainer", "Media", "Finish"].map(
                    (label, index) => (
                      <Step key={label}>
                        <StepButton color="inherit">{label}</StepButton>
                      </Step>
                    )
                  )}
                </Stepper>
                {currentStep == 0 && (
                  <>
                    <TextField
                      label="Nama"
                      variant="outlined"
                      value={data.name}
                      onChange={(e) => {
                        setData({ ...data, name: e.target.value });
                      }}
                    />
                    <TextField
                      variant="outlined"
                      label="Deskripsi"
                      value={data.description}
                      onChange={(e) => {
                        setData({ ...data, description: e.target.value });
                      }}
                    />
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
                    <TextField
                      label="Alamat"
                      variant="outlined"
                      value={data.address}
                      onChange={(e) => {
                        setData({ ...data, address: e.target.value });
                      }}
                    />
                    <TextField
                      label="Max Peserta"
                      type="number"
                      variant="outlined"
                      value={data.max_join}
                      onChange={(e) => {
                        setData({ ...data, max_join: e.target.value });
                      }}
                    />
                    <TextField
                      label="Max Trainer"
                      type="number"
                      variant="outlined"
                      value={data.max_trainer}
                      onChange={(e) => {
                        setData({ ...data, max_trainer: e.target.value });
                      }}
                    />
                    <DateTimePicker
                      label="Mulai Pada"
                      value={dateData.begin_at}
                      onChange={(e) =>
                        setdateData({ ...dateData, begin_at: e })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: "100%" }}
                          label={"Mulai Pada"}
                          variant="outlined"
                        />
                      )}
                    />
                    <DateTimePicker
                      label="Selesai Pada"
                      value={dateData.finish_at}
                      onChange={(e) =>
                        setdateData({ ...dateData, finish_at: e })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: "100%" }}
                          label={"Selesai Pada"}
                          variant="outlined"
                        />
                      )}
                    />
                  </>
                )}
                {currentStep == 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6">Trainer</Typography>
                    <TextField
                      label="Cari Trainer"
                      variant="outlined"
                      onChange={(e) => setName(e.target.value)}
                    />
                    {lusers && <CircularProgress />}
                    <Box
                    // sx={{
                    //   display: "flex",
                    //   width: 900,
                    //   gap: 1,
                    // }}
                    >
                      {availableTrainers?.edges.map(({ node }) => (
                        <Chip
                          key={node.id}
                          sx={{ m: 1 }}
                          label={node.name}
                          // disabled={halt}
                          onDelete={() => {
                            if (trainers.length < parseInt(data.max_trainer))
                              setTrainers([...trainers, node]);
                            else
                              toast.error("Max Trainer : " + data.max_trainer);
                          }}
                          deleteIcon={<Add />}
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Box>
                      {trainers.map((x) => (
                        <Chip
                          key={x.id}
                          sx={{ m: 1 }}
                          label={x.name}
                          // disabled={halt}
                          onDelete={() => {
                            setTrainers(trainers.filter((e) => e.id != x.id));
                          }}
                          deleteIcon={<Delete />}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {currentStep == 2 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography>Thumbnail Acara</Typography>
                      <Box>
                        {fileMap?.THUMBNAIL ? (
                          <img
                            src={fileMap?.THUMBNAIL?.path ?? ""}
                            alt={fileMap?.THUMBNAIL?.name}
                          />
                        ) : (
                          <UploadZone
                            onUploaded={(e) => {
                              setFileMap({ ...fileMap, THUMBNAIL: e });
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography>Cover Acara</Typography>
                      <Box>
                        {fileMap?.COVER ? (
                          <img
                            src={fileMap?.COVER?.path ?? ""}
                            alt={fileMap?.COVER?.name}
                          />
                        ) : (
                          <UploadZone
                            onUploaded={(e) => {
                              setFileMap({ ...fileMap, COVER: e });
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography>Map Acara</Typography>
                      <Box>
                        {fileMap?.MAP ? (
                          <img
                            src={fileMap?.MAP?.path ?? ""}
                            alt={fileMap?.MAP?.name}
                          />
                        ) : (
                          <UploadZone
                            onUploaded={(e) => {
                              setFileMap({ ...fileMap, MAP: e });
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
                {currentStep == 3 && (
                  <TableContainer component={Paper}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                      <TableBody>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Nama Kelas
                          </TableCell>
                          <TableCell align="right">{data?.name}</TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Trainer Acara
                          </TableCell>
                          <TableCell align="right">
                            {trainers?.map((e) => e.name).join(",")}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Wilayah
                          </TableCell>
                          <TableCell align="right">
                            {district?.name}, {city?.name}, {province?.name}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Alamat
                          </TableCell>
                          <TableCell align="right">{data?.address}</TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Slot Member
                          </TableCell>
                          <TableCell align="right">{data?.max_join}</TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Slot Trainer
                          </TableCell>
                          <TableCell align="right">
                            {data?.max_trainer}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Mulai Pada
                          </TableCell>
                          <TableCell align="right">
                            {moment(dateData?.begin_at).format()}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            Selesai Pada
                          </TableCell>
                          <TableCell align="right">
                            {moment(dateData?.finish_at).format()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Box display="flex" justifyContent="space-between">
                  <Button onClick={prev}>Sebelumnya</Button>
                  <Button onClick={next}>
                    {currentStep > 3 ? "Selesai" : "Selanjutnya"}
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
