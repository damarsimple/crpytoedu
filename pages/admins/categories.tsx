import { gql } from "@apollo/client";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { Category } from "../../types/type";

export default function Index() {
  return (
    <DashboardLayout>
      <TableLoader<Category>
        fields="categoriesPaginate"
        getQuery={gql`
          query Query($first: Int!) {
            categoriesPaginate(first: $first) {
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
                }
              }
            }
          }
        `}
        columns={[
          { field: "id", headerName: "ID" },
          { field: "name", headerName: "Nama", editable: true },
        ]}
        label="Kategori"
        actions={["delete", "edit", "create"]}
        createQuery={gql`
          mutation Mutation($input: CreateCategory!) {
            createCategory(input: $input) {
              id
              name
            }
          }
        `}
        updateQuery={gql`
          mutation Mutation($id: ID!, $input: UpdateCategory!) {
            updateCategory(id: $id, input: $input) {
              id
              name
            }
          }
        `}
        deleteQuery={gql`
          mutation DeleteCategoryMutation($id: ID!) {
            deleteCategory(id: $id) {
              id
              name
            }
          }
        `}
      />
    </DashboardLayout>
  );
}
