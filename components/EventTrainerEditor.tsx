import { useQuery, gql, useMutation } from "@apollo/client";
import { Add, Delete } from "@mui/icons-material";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button,
  Chip,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { wildCardFormatter } from "../helpers/formatters";
import { BasicOutput, Classroom, User, UserEdge } from "../types/type";

export default function EventTrainerEditor({ id }: { id: string }) {
  const {
    data: { classroom } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ classroom: Classroom }>(
    gql`
      query Query($id: ID!) {
        classroom(id: $id) {
          id
          max_trainer
          user {
            id
            name
          }
          trainer_full
          trainers {
            id
            name
          }
        }
      }
    `,
    {
      variables: {
        id,
      },
    }
  );

  const trainersIds = classroom?.trainers?.map((e) => e.id) ?? [];
  const [name, setName] = useState("");
  const { data: { users } = {}, loading: lusers } = useQuery<{
    users: { edges: UserEdge[] };
  }>(
    gql`
      query Query(
        $first: Int!
        $name: String
        $provinceId: ID
        $cityId: ID
        $districtId: ID
        $idsNotIn: [String]
      ) {
        users(
          first: $first
          name: $name
          province_id: $provinceId
          city_id: $cityId
          district_id: $districtId
          is_banned: false
          roles: TRAINER
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
        idsNotIn: trainersIds,
      },
    }
  );

  const [handle] = useMutation<{ handleClassroomTrainer: BasicOutput }>(
    gql`
      mutation Mutation(
        $id: ID!
        $user_id: ID!
        $type: ClassroomTrainerActionType!
      ) {
        handleClassroomTrainer(
          classroom_id: $id
          user_id: $user_id
          type: $type
        ) {
          status
          message
        }
      }
    `
  );

  if (error) return <div>{error.message}</div>;
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h6">Tambah Trainer</Typography>
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
        {users?.edges
          ?.filter(({ node }) => !trainersIds.includes(node.id))
          .map(({ node }) => (
            <Chip
              key={node.id}
              sx={{ m: 1 }}
              label={node.name}
              // disabled={halt}
              onDelete={() => {
                handle({
                  variables: { type: "ADD", id, user_id: node.id },
                }).then((e) => {
                  if (e.data?.handleClassroomTrainer?.status) {
                    toast.success(`Berhasil menambah trainer ${node.name}`);
                    refetch();
                  } else {
                    toast.error(
                      "Gagal menambah trainer " +
                        e.data?.handleClassroomTrainer?.message
                    );
                  }
                });
              }}
              deleteIcon={<Add />}
              variant="outlined"
            />
          ))}
      </Box>
      <Typography variant="h6">Trainer</Typography>
      <Typography variant="h6">
        Trainer Utama : {classroom?.user?.name}
      </Typography>
      <Box
      // sx={{
      //   display: "flex",
      //   gap: 1,
      // }}
      >
        {classroom?.trainers.map((x) => (
          <Chip
            key={x.id}
            sx={{ m: 1 }}
            label={x.name}
            // disabled={halt}
            onDelete={() => {
              handle({
                variables: { type: "DELETE", id, user_id: x.id },
              }).then((e) => {
                if (e.data?.handleClassroomTrainer?.status) {
                  toast.success(`Berhasil menghapus trainer ${x.name}`);
                  refetch();
                } else {
                  toast.error(
                    "Gagal menghapus trainer " +
                      e.data?.handleClassroomTrainer?.message
                  );
                }
              });
            }}
            deleteIcon={<Delete />}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
