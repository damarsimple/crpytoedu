import { gql, useMutation, useQuery } from "@apollo/client";
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
  Typography,
} from "@mui/material";
import { style } from "d3";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/DashboardLayout";
import TableLoader from "../../../components/TableLoader";
import {
  wildCardFormatter,
  selectObjectExtractor,
  selectExtractor,
} from "../../../helpers/formatters";
import usePlaces from "../../../hooks/usePlaces";
import { UserEdge, User, Roles, PageInfo } from "../../../types/type";

function Index({ router: { push, query } }: WithRouterProps) {
  useEffect(() => {
    if (query.tabs) {
      setTabs(parseInt(query.tabs as string));
    }
  }, [query]);

  const [tabs, setTabs] = useState(0);
  const [name, setName] = useState("");
  const { data: { usersNotPayment } = {}, fetchMore } = useQuery<{
    usersNotPayment: { edges: UserEdge[]; pageInfo: PageInfo };
  }>(
    gql`
      query Query($first: Int!, $name: String, $after: String) {
        usersNotPayment(first: $first, name: $name, after: $after) {
          edges {
            node {
              id
              name
              subscription_type
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
            total
            count
            currentPage
            lastPage
          }
        }
      }
    `,
    {
      variables: {
        first: 10,
        name: wildCardFormatter(name),
      },
      fetchPolicy: "network-only",
    }
  );

  const { data: { users } = {}, fetchMore: fetchMoreNotification } = useQuery<{
    users: { edges: UserEdge[]; pageInfo: PageInfo };
  }>(
    gql`
      query Query($first: Int!, $name: String, $after: String) {
        users(first: $first, name: $name, after: $after) {
          edges {
            node {
              id
              name
              roles
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
            total
            count
            currentPage
            lastPage
          }
        }
      }
    `,
    {
      variables: {
        first: 10,
        name: wildCardFormatter(name),
      },
      fetchPolicy: "network-only",
    }
  );

  const [sendNotificationId, setSendNotificationId] = useState("");

  const [handleSend] = useMutation(gql`
    mutation CreateBasicNotificationMutation($input: CreateBasicNotification!) {
      createBasicNotification(input: $input) {
        id
        name
      }
    }
  `);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {
    provinces,
    cities,
    districts,
    setCity,
    setDistrict,
    setProvince,
    city,
    province,
    district,
  } = usePlaces({});

  return (
    <DashboardLayout>
      <Box>
        <Modal
          open={Boolean(sendNotificationId)}
          onClose={() => setSendNotificationId("")}
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Pesan
            </Typography>

            <TextField
              label="Name"
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Konten"
              variant="outlined"
              onChange={(e) => setContent(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (Boolean(title) && Boolean(content)) {
                  handleSend({
                    variables: {
                      input: {
                        name: title,
                        text: content,
                        user_id: sendNotificationId,
                      },
                    },
                  }).then((e) => {
                    toast.success("Berhasil mengirim notifikasi");
                    setSendNotificationId("");
                  });
                } else {
                  toast.error("Anda belum mengisi formulir dengan lengkap");
                }
              }}
            >
              KIRIM
            </Button>
          </Box>
        </Modal>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabs}
            onChange={(_, e) => {
              setTabs(e);
              setName("");
            }}
          >
            <Tab label="Data" />
            <Tab label="Pembayaran User" />
            <Tab label="Notifikasi" />
          </Tabs>
        </Box>

        {tabs == 1 && (
          <TableContainer component={Paper}>
            <Box sx={{ p: 1 }}>
              <TextField
                fullWidth
                label="Cari User"
                variant="standard"
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Table sx={{ width: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Tipe Subscription</TableCell>
                  <TableCell>Lihat Pendaftaran</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersNotPayment?.edges?.map(
                  ({ node: { id, name, username, subscription_type } }) => (
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
                        {subscription_type}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Button
                          onClick={() =>
                            push(`/admins/members/profiles/${username}?tabs=2`)
                          }
                        >
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            {usersNotPayment?.pageInfo?.hasNextPage && (
              <Button
                fullWidth
                onClick={() =>
                  fetchMore({
                    variables: {
                      first: 10,
                      after: usersNotPayment?.pageInfo?.endCursor,
                    },
                  })
                }
              >
                AMBIL LAGI
              </Button>
            )}
          </TableContainer>
        )}

        {tabs == 2 && (
          <TableContainer component={Paper}>
            <Box sx={{ p: 1 }}>
              <TextField
                fullWidth
                label="Cari User"
                variant="standard"
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Table sx={{ width: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Kirim Notifikasi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.edges?.map(({ node: { id, name, roles } }) => (
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
                      {roles}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button onClick={() => setSendNotificationId(id)}>
                        Kirim
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {usersNotPayment?.pageInfo?.hasNextPage && (
              <Button
                fullWidth
                onClick={() =>
                  fetchMoreNotification({
                    variables: {
                      first: 10,
                      after: usersNotPayment?.pageInfo?.endCursor,
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
            <TableLoader<User>
              fields="users"
              getQuery={gql`
                query Query($first: Int!) {
                  users(first: $first) {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      total
                      endCursor
                      count
                      currentPage
                      lastPage
                    }
                    edges {
                      node {
                        id
                        name
                        username
                        email
                        roles
                        title
                        subscription_type
                        subscription_expired_at
                        subscription_verified
                        is_admin
                      }
                    }
                  }
                }
              `}
              columns={[
                { field: "id", headerName: "ID", flex: 1 },
                { field: "name", headerName: "Nama", flex: 1, editable: true },
                {
                  field: "email",
                  headerName: "Email",
                  flex: 1,
                  editable: true,
                  createable: true,
                },
                {
                  field: "username",
                  headerName: "Username",
                  flex: 1,
                  editable: true,
                },
                {
                  //@ts-ignore
                  field: "password",
                  headerName: "Password",
                  flex: 1,
                  hide: true,
                  editable: true,
                  createable: true,
                },

                {
                  field: "roles",
                  headerName: "Roles",
                  type: "select",
                  selects: selectObjectExtractor(Roles),
                  flex: 1,
                  editable: true,
                },
                {
                  field: "is_admin",
                  headerName: "Admin?",
                  type: "boolean",
                  flex: 1,
                  editable: true,
                  createable: false,
                },

                {
                  field: "title",
                  headerName: "Title",
                  flex: 1,
                  editable: true,
                },
                {
                  field: "subscription_type",
                  headerName: "Langganan",
                  flex: 1,
                  editable: true,
                  type: "select",
                  selects: [
                    { label: "ONLINE", value: "ONLINE" },
                    { label: "OFFLINE", value: "OFFLINE" },
                  ],
                },
                {
                  field: "subscription_expired_at",
                  headerName: "Langganan Habis",
                  flex: 1,
                  editable: true,
                  type: "dateTime",
                },

                {
                  field: "province_id",
                  headerName: "Provinsi",
                  flex: 1,
                  hide: false,
                  editable: true,
                  createable: true,
                  selects: provinces?.map(selectExtractor),
                  type: "select",
                  onChange: (e) =>
                    setProvince(provinces.filter((x) => x.id == e)[0]),
                },
                {
                  field: "city_id",
                  headerName: "Kota / Kabupaten",
                  flex: 1,
                  hide: false,
                  editable: true,
                  createable: true,
                  selects: cities?.map(selectExtractor),
                  type: "select",
                  onChange: (e) => setCity(cities.filter((x) => x.id == e)[0]),
                },
                {
                  field: "district_id",
                  headerName: "Kecamatan / Kelurahan",
                  flex: 1,
                  hide: false,
                  editable: true,
                  createable: true,
                  selects: districts?.map(selectExtractor),
                  type: "select",
                  onChange: (e) =>
                    setDistrict(districts.filter((x) => x.id == e)[0]),
                },
              ]}
              label="Member"
              actions={["edit", "create", "custom"]}
              customColumns={[
                {
                  field: "trainer",
                  headerName: "Profile",
                  renderCell: (e) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() =>
                          push(
                            "/admins/members/profiles/" +
                            e.api.getCellValue(e.id, "username")
                          )
                        }
                      >
                        Setting
                      </Button>
                    </>
                  ),
                },
                {
                  field: "parentage",
                  headerName: "Pohon",
                  renderCell: (e) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() =>
                          push(
                            "/users/" +
                            e.api.getCellValue(e.id, "username") +
                            "/?tab=trees"
                          )
                        }
                      >
                        Pohon
                      </Button>
                    </>
                  ),
                },
              ]}
              createQuery={gql`
                mutation Mutation($input: CreateUser!) {
                  createUser(input: $input) {
                    id
                    name
                  }
                }
              `}
              updateQuery={gql`
                mutation Mutation($id: ID!, $input: UpdateUser!) {
                  updateUser(id: $id, input: $input) {
                    id
                    name
                  }
                }
              `}
            />
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default withRouter(Index);
