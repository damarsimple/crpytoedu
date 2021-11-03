import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Grid,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Image from "next/image";
import { BasicOutput, Classroom, Roles } from "../../types/type";
import { useUserStore } from "../../store/user";
import { toast } from "react-toastify";
import moment from "moment";
import UserCard from "../../components/UserCard";

export default function Id() {
  const { query } = useRouter();
  const { id } = query;

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
          name
          created_at
          updated_at
          description
          address
          rejected_reason
          status
          begin_at
          finish_at
          max_trainer
          max_join
          trainer_full
          participant_full
          joined
          participantsCount
          trainersCount
          user {
            id
            name
          }
          province {
            id
            name
          }
          district {
            id
            name
          }
          city {
            id
            name
          }
          trainers {
            id
            name
            title
            username
            url_facebook
            url_twitter
            url_instagram
            url_linkedin
            cover {
              id
              path
            }
          }
          participants {
            id
            name
            title
            username
            url_facebook
            url_twitter
            url_instagram
            url_linkedin
            cover {
              id
              path
            }
          }
          thumbnail {
            id
            name
            path
          }
          cover {
            id
            name
            path
          }
          map {
            id
            name
            path
          }
        }
      }
    `,
    {
      variables: { id },
    }
  );

  const [handleJoin] = useMutation<{ handleJoinclassroom: BasicOutput }>(
    gql`
      mutation Mutation($id: ID!) {
        handleJoinclassroom(classroom_id: $id) {
          status
          message
        }
      }
    `,
    {
      variables: { id },
      onCompleted: ({ handleJoinclassroom: { status, message } }) => {
        if (status) {
          toast.success("Gagal bergabung kelas");
        } else {
          toast.error(message);
        }
        toast.success("Berhasil bergabung kelas");
        refetch();
      },
    }
  );

  const [handleCancel] = useMutation<{ HandleCancelclassroom: BasicOutput }>(
    gql`
      mutation Mutation($id: ID!) {
        HandleCancelclassroom(classroom_id: $id) {
          status
          message
        }
      }
    `,
    {
      variables: { id },
      onCompleted: ({ HandleCancelclassroom: { status, message } }) => {
        if (status) {
          toast.success("Gagal bergabung kelas");
        } else {
          toast.error(message);
        }
        refetch();
      },
    }
  );

  const [tabs, setTabs] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
  };

  const { user } = useUserStore();

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ width: "100%", height: 400, position: "relative" }}>
          <Image
            src={classroom?.thumbnail?.path ?? "/offline-meeting.jpg"}
            alt={classroom?.name}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            mt: 2,
          }}
        >
          <Box sx={{ width: "80%" }}>
            <Tabs value={tabs} onChange={handleChange}>
              <Tab label="Detail Acara" />
              <Tab label="Map" />
              <Tab label="Trainer" />
              <Tab label="Member" />
            </Tabs>
          </Box>
          <Box sx={{ width: "20%" }}>
            {user?.roles == Roles.Trainer && (
              <>
                {classroom?.trainer_full ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    disabled
                  >
                    KELAS PENUH
                  </Button>
                ) : classroom?.joined ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleCancel()}
                  >
                    BATAL GABUNG
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    onClick={() => handleJoin()}
                  >
                    GABUNG
                  </Button>
                )}
              </>
            )}
            {user?.roles == Roles.Member && (
              <>
                {classroom?.participant_full ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    disabled
                  >
                    KELAS PENUH
                  </Button>
                ) : classroom?.joined ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleCancel()}
                  >
                    BATAL GABUNG
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    onClick={() => handleJoin()}
                  >
                    GABUNG
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>

        {tabs == 0 && (
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Nama Kelas
                    </TableCell>
                    <TableCell align="right">{classroom?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Pengaju Acara
                    </TableCell>
                    <TableCell align="right">{user?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Wilayah
                    </TableCell>
                    <TableCell align="right">
                      {classroom?.city?.name}, {classroom?.province?.name}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Alamat
                    </TableCell>
                    <TableCell align="right">{classroom?.address}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Slot Member
                    </TableCell>
                    <TableCell align="right">
                      {classroom?.participantsCount}/{classroom?.max_join}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Slot Trainer
                    </TableCell>
                    <TableCell align="right">
                      {classroom?.trainersCount}/{classroom?.max_trainer}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Mulai Pada
                    </TableCell>
                    <TableCell align="right">
                      {moment(classroom?.begin_at).format()}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Selesai Pada
                    </TableCell>
                    <TableCell align="right">
                      {moment(classroom?.finish_at).format()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tabs == 1 && (
          <Box
            sx={{
              height: 600,
              width: "100%",
              position: "relative",
            }}
          >
            {classroom?.map ? (
              <Image src={classroom?.map.path} />
            ) : (
              <Typography>Acara ini tidak memiliki map</Typography>
            )}
          </Box>
        )}

        {tabs == 2 && (
          <Grid spacing={1} container>
            {classroom?.trainers?.map((e) => (
              <Grid item xs={3} key={e.id}>
                <UserCard {...e} />
              </Grid>
            ))}
          </Grid>
        )}
        {tabs == 3 && (
          <Grid spacing={1} container>
            {classroom?.participants?.map((e) => (
              <Grid item xs={3} key={e.id}>
                <UserCard {...e} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
}
