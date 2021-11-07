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
} from "@mui/material";
import EventMapEditor from "../../components/EventMediaEditor";
import EventTrainerEditor from "../../components/EventTrainerEditor";
import { toast } from "react-toastify";
import { useModalStore } from "../../store/modal";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";

function Index({ router: { query } }: WithRouterProps) {
  const { provinces, cities, districts, setCity, setProvince } = usePlaces({});

  const [editMap, setEditMap] = useState("");
  const [editTrainer, setEditTrainer] = useState("");

  useEffect(() => {
    if (query.tabs) {
      setTabs(parseInt(query.tabs as string));
    }
  }, [query]);
  const [tabs, setTabs] = useState(0);

  const [name, setName] = useState("");

  const [status, setStatus] = useState<ClassroomStatus>(
    ClassroomStatus.Pending
  );

  const {
    data: { classrooms } = {},
    fetchMore,
    refetch,
  } = useQuery<{
    classrooms: { edges: ClassroomEdge[]; pageInfo: PageInfo };
  }>(
    gql`
      ${CorePageInfoField}
      query GetClassrooms(
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
          </Tabs>
        </Box>
        {tabs == 1 && (
          <TableContainer component={Paper}>
            <Box
              sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
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
                {classrooms?.edges?.map(
                  ({ node: { id, name, status, user } }) => (
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
                        <Button onClick={() => setEditMap(id)}>
                          Lihat Media
                        </Button>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            sx={{ width: "50&" }}
                            color="success"
                            onClick={() => {
                              popModal(
                                "Anda yakin mengubah status " + name,
                                () => updateStatus(id, ClassroomStatus.Approved)
                              );
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ width: "50&" }}
                            onClick={() => {
                              popModal(
                                "Anda yakin mengubah status " + name,
                                () => updateStatus(id, ClassroomStatus.Rejected)
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                )}
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
        )}
        {tabs == 0 && (
          <Box>
            <TableLoader<Classroom>
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
                query GetClassrooms(
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
      </Box>
    </DashboardLayout>
  );
}

export default withRouter(Index);
