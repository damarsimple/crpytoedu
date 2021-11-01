import { gql } from "@apollo/client";
import { Button } from "@mui/material";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { selectObjectExtractor } from "../../helpers/formatters";
import { Roles, User } from "../../types/type";

export default function Index() {
  return (
    <DashboardLayout>
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
                  email
                  roles
                  title
                  subscription_type
                  subscription_expired_at
                  is_admin
                }
              }
            }
          }
        `}
        columns={[
          { field: "id", headerName: "ID", flex: 1 },
          { field: "name", headerName: "Nama", flex: 1, editable: true },
          { field: "email", headerName: "Email", flex: 1, editable: false },
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

          { field: "title", headerName: "Title", flex: 1, editable: true },
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
                  // onClick={() => setEditTrainer(e.api.getCellValue(e.id, "id"))}
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
                  // onClick={() => setEditTrainer(e.api.getCellValue(e.id, "id"))}
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
    </DashboardLayout>
  );
}
