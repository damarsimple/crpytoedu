import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { CorePageInfoField } from "../../fragments/fragments";
import {
  selectExtractor,
  selectObjectExtractor,
  wildCardFormatter,
} from "../../helpers/formatters";
import usePlaces from "../../hooks/usePlaces";
import {
  Classroom,
  ClassroomEdge,
  ClassroomStatus,
  PageInfo,
  User,
  UserEdge,
  File,
} from "../../types/type";
import { find } from "lodash";
import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Stack,
  Chip,
  CircularProgress,
  Autocomplete,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import EventMapEditor, { UploadZone } from "../../components/EventMediaEditor";
import EventTrainerEditor from "../../components/EventTrainerEditor";
import { toast } from "react-toastify";
import { useModalStore } from "../../store/modal";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import NonMuiTableLoader from "../../components/NonMuiTableLoader";
import { Add, Delete } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";
import moment from "moment";
import next from "next";
import trainers from "../trainers";
import { useRouter } from "next/dist/client/router";
import { useUserStore } from "../../store/user";

function Index({ router: { query } }: WithRouterProps) {
  const [editMap, setEditMap] = useState("");
  const [editTrainer, setEditTrainer] = useState("");

  useEffect(() => {
    if (query.tabs) {
      setTabs(parseInt(query.tabs as string));
    }
  }, [query]);
  const [tabs, setTabs] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});
  const prev = () => {
    setCurrentStep(currentStep != 0 ? currentStep - 1 : 0);
  };

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
  const [trainers, setTrainers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [dateData, setdateData] = useState<Record<string, Date | null>>({});
  const { push } = useRouter();
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
  const { user } = useUserStore();
  const [handleMutation] = useMutation<{ createClassroom: Classroom }>(gql`
    mutation CreateClassroomMutation($input: CreateClassroom!) {
      createClassroom(input: $input) {
        id
      }
    }
  `);

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
  return (
    <DashboardLayout>
      <Modal open={Boolean(editMap)} onClose={() => setEditMap("")}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <EventMapEditor id={editMap} />
        </Box>
      </Modal>
      <Modal open={Boolean(editTrainer)} onClose={() => setEditTrainer("")}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <EventTrainerEditor id={editTrainer} />
        </Box>
      </Modal>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={(_, e) => setTabs(e)}>
            <Tab label="Detail Acara" />
            <Tab label="Pengajuan Acara" />
            <Tab label="Pengajuan Acara Wizard" />
          </Tabs>
        </Box>
        {tabs == 1 && (
          <SecondTab setEditMap={setEditMap} setEditTrainer={setEditTrainer} />
        )}
        {tabs == 0 && (
          <Box>
            <NonMuiTableLoader<Classroom>
              columns={[
                { field: "id", headerName: "ID" },
                { field: "name", headerName: "Judul Acara", editable: true },
                { field: "address", headerName: "Alamat", editable: true },
                {
                  field: "begin_at",
                  headerName: "Mulai Pada",
                  editable: true,
                  type: "dateTime",
                },
                {
                  field: "finish_at",
                  headerName: "Selesai Pada",
                  editable: true,
                  type: "dateTime",
                },
                {
                  field: "max_join",
                  headerName: "Max Peserta",
                  type: "number",
                  editable: true,
                },

                {
                  field: "province_id",
                  headerName: "Provinsi",
                  type: "select",
                  hide: true,
                  editable: true,
                  selects: provinces.map(selectExtractor),
                  valueGetter: (e) =>
                    find(provinces, { id: e.value })?.name ?? "",
                  //@ts-ignore
                  onChange: (e) => setProvince({ id: e }),
                },
                {
                  field: "city_id",
                  headerName: "Kota / Kabupaten",
                  type: "select",
                  editable: true,
                  selects: cities.map(selectExtractor),
                  valueGetter: (e) => find(cities, { id: e.value })?.name ?? "",
                  //@ts-ignore
                  onChange: (e) => setCity({ id: e }),
                },
                {
                  field: "district_id",
                  headerName: "Kecamatan / Kelurahan",
                  type: "select",
                  editable: true,
                  selects: districts.map(selectExtractor),
                  valueGetter: (e) =>
                    find(districts, { id: e.value })?.name ?? "",
                },
                {
                  field: "status",
                  headerName: "Status",
                  type: "select",
                  editable: true,
                  selects: selectObjectExtractor(ClassroomStatus),
                  createable: false,
                },
                {
                  headerName: "Alasan Penolakan",
                  field: "rejected_reason",
                  editable: true,
                  createable: false,
                },
                {
                  field: "description",
                  editable: true,
                  headerName: "Deskripsi",
                },
              ]}
              label="Ruang Kelas"
              actions={["edit", "delete", "create", "custom"]}
              formatSubmit={(e) => {
                for (const key in e) {
                  //@ts-ignore
                  if (!e[key]) delete e[key];
                }
                return e;
              }}
              getQuery={gql`
                ${CorePageInfoField}
                query GetClassroomsAll(
                  $name: String
                  $first: Int!
                  $after: String
                ) {
                  classrooms(name: $name, first: $first, after: $after) {
                    edges {
                      node {
                        id
                        name
                        status
                        rejected_reason
                        description
                        address
                        begin_at
                        finish_at
                        max_join
                        province_id
                        city_id
                        district_id
                        cover {
                          id
                          path
                        }
                        map {
                          id
                          path
                        }
                        thumbnail {
                          id
                          path
                        }
                        user {
                          id
                          name
                        }
                      }
                    }
                    pageInfo {
                      ...CorePageInfoField
                    }
                  }
                }
              `}
              fields={"classrooms"}
              updateQuery={gql`
                mutation UpdateClassroomMutation(
                  $id: ID!
                  $input: UpdateClassroom!
                ) {
                  updateClassroom(id: $id, input: $input) {
                    id
                  }
                }
              `}
              createQuery={gql`
                mutation CreateClassroomMutation($input: CreateClassroom!) {
                  createClassroom(input: $input) {
                    id
                  }
                }
              `}
              deleteQuery={gql`
                mutation DeleteClassroomMutation($id: ID!) {
                  deleteClassroom(id: $id) {
                    id
                  }
                }
              `}
              customColumns={[
                {
                  field: "trainer",
                  headerName: "Trainer",
                  renderCell: (e) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() =>
                          setEditTrainer(e.api.getCellValue(e.id, "id"))
                        }
                      >
                        Trainer
                      </Button>
                    </>
                  ),
                },
                {
                  field: "cover",
                  headerName: "Cover dan Map",
                  renderCell: (e) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() =>
                          setEditMap(e.api.getCellValue(e.id, "id"))
                        }
                      >
                        Cover
                      </Button>
                    </>
                  ),
                },
              ]}
            />
          </Box>
        )}
        {tabs == 2 && (
          <>
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
                    onChange={(e) => setdateData({ ...dateData, begin_at: e })}
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
                    onChange={(e) => setdateData({ ...dateData, finish_at: e })}
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
                          else toast.error("Max Trainer : " + data.max_trainer);
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
                        <TableCell align="right">{data?.max_trainer}</TableCell>
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
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}

function SecondTab({
  setEditTrainer,
  setEditMap,
}: {
  setEditTrainer: (e: string) => void;
  setEditMap: (e: string) => void;
}) {
  const [name, setName] = useState("");

  const [status, setStatus] = useState<ClassroomStatus>(
    ClassroomStatus.Pending
  );

  const {
    loading,
    data: { classrooms } = {},
    fetchMore,
    refetch,
  } = useQuery<{
    classrooms: { edges: ClassroomEdge[]; pageInfo: PageInfo };
  }>(
    gql`
      ${CorePageInfoField}
      query GetClassroomsFromStatus(
        $name: String
        $status: ClassroomStatus
        $first: Int!
        $after: String
      ) {
        classrooms(name: $name, status: $status, first: $first, after: $after) {
          edges {
            node {
              id
              name
              status
              rejected_reason
              description
              address
              begin_at
              finish_at
              max_join
              province_id
              city_id
              district_id
              cover {
                id
                path
              }
              map {
                id
                path
              }
              thumbnail {
                id
                path
              }
              user {
                id
                name
              }
            }
          }
          pageInfo {
            ...CorePageInfoField
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
      variables: {
        name: wildCardFormatter(name),
        first: 10,
        status,
      },
    }
  );

  const [handleUpdate] = useMutation(gql`
    mutation UpdateClassroomMutation($id: ID!, $input: UpdateClassroom!) {
      updateClassroom(id: $id, input: $input) {
        id
      }
    }
  `);

  const { popModal, close } = useModalStore();

  const updateStatus = (id: string, status: ClassroomStatus) => {
    handleUpdate({
      variables: {
        id,
        input: { status },
      },
    }).then((e) => {
      refetch();
      toast.success("Berhasil mengupdate status acara");
      close();
    });
  };

  return (
    <TableContainer component={Paper}>
      <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          fullWidth
          label="Cari User"
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
        <Stack direction="row" spacing={1}>
          {Object.values(ClassroomStatus).map((e) => {
            return e == status ? (
              <Chip key={e} label={e} onClick={() => setStatus(e)} />
            ) : (
              <Chip
                key={e}
                label={e}
                variant="outlined"
                onClick={() => setStatus(e)}
              />
            );
          })}
        </Stack>
      </Box>
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Pengaju</TableCell>
            <TableCell>Lihat Trainer</TableCell>
            <TableCell>Lihat Media</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <Box
              display="flex"
              alignItems={"center"}
              justifyContent="center"
              width="100%"
            >
              <CircularProgress />
            </Box>
          )}
          {classrooms?.edges?.map(({ node: { id, name, status, user } }) => (
            <TableRow
              key={id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {id}
              </TableCell>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell component="th" scope="row">
                {user?.name}
              </TableCell>
              <TableCell component="th" scope="row">
                <Button onClick={() => setEditTrainer(id)}>
                  Lihat Trainer
                </Button>
              </TableCell>

              <TableCell component="th" scope="row">
                <Button onClick={() => setEditMap(id)}>Lihat Media</Button>
              </TableCell>
              <TableCell component="th" scope="row">
                <Box sx={{ display: "flex", gap: 1 }}>
                  {status != ClassroomStatus.Approved && (
                    <Button
                      variant="contained"
                      sx={{ width: "50&" }}
                      color="success"
                      onClick={() => {
                        popModal("Anda yakin mengubah status " + name, () =>
                          updateStatus(id, ClassroomStatus.Approved)
                        );
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {status != ClassroomStatus.Pending && (
                    <Button
                      variant="contained"
                      sx={{ width: "50&" }}
                      color="warning"
                      onClick={() => {
                        popModal("Anda yakin mengubah status " + name, () =>
                          updateStatus(id, ClassroomStatus.Pending)
                        );
                      }}
                    >
                      Pending
                    </Button>
                  )}
                  {status != ClassroomStatus.Rejected && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: "50&" }}
                      onClick={() => {
                        popModal("Anda yakin mengubah status " + name, () =>
                          updateStatus(id, ClassroomStatus.Rejected)
                        );
                      }}
                    >
                      Reject
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {classrooms?.pageInfo?.hasNextPage && (
        <Button
          fullWidth
          onClick={() =>
            fetchMore({
              variables: {
                first: 10,
                after: classrooms?.pageInfo?.endCursor,
              },
            })
          }
        >
          AMBIL LAGI
        </Button>
      )}
    </TableContainer>
  );
}

export default withRouter(Index);
