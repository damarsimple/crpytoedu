import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import TableLoader from "../../../components/TableLoader";
import {
  wildCardFormatter,
  selectObjectExtractor,
} from "../../../helpers/formatters";
import { UserEdge, User, Roles, PageInfo } from "../../../types/type";

function Index({ router: { push } }: WithRouterProps) {
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
    }
  );

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={(_, e) => setTabs(e)}>
            <Tab label="Data" />
            <Tab label="Pembayaran User" />
            <Tab label="Notifikasi" />
          </Tabs>
        </Box>

        {tabs == 1 && (
          <TableContainer component={Paper}>
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
                  ({ node: { id, name, subscription_type } }) => (
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
                          onClick={() => push("/admins/members/payments/" + id)}
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
                  editable: false,
                },
                {
                  field: "username",
                  headerName: "Username",
                  flex: 1,
                  editable: true,
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
                },
                // {
                //   field: "subscription_expired_at",
                //   headerName: "Langganan Habis",
                //   flex: 1,
                //   editable: true,
                //   type: "dateTime",
                // },
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
                            "/users/" +
                              e.api.getCellValue(e.id, "username") +
                              "?tab=profiles"
                          )
                        }
                      >
                        Profile
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
