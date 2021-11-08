import { gql, useMutation, useQuery } from "@apollo/client";
import { DateTimePicker } from "@mui/lab";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useState } from "react";
import DashboardLayout from "../../../../components/DashboardLayout";
import { User } from "../../../../types/type";
import Image from "next/image";
import { toast } from "react-toastify";
export default function Id() {
  const {
    push,
    query: { id },
  } = useRouter();
  const [tabs, setTabs] = useState(0);

  const [subscriptionExpiredAt, setSubscriptionExpiredAt] =
    useState<Date | null>(new Date());

  const [accept, setAccept] = useState<"true" | "false">("false");

  const { data: { user } = {} } = useQuery<{ user: User }>(
    gql`
      query Query($id: ID) {
        user(id: $id) {
          id
          name
          username
          title
          subscription_type
          roles
          is_admin
          description
          is_banned
          myparent {
            id
            name
          }
          city {
            id
            name
          }
          district {
            id
            name
          }
          province {
            id
            name
          }
          payment_proves {
            id
            name
            path
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

  const [handleUpdate] = useMutation(gql`
    mutation Mutation($id: ID!, $input: UpdateUser!) {
      updateUser(id: $id, input: $input) {
        id
        name
      }
    }
  `);
  const [reason, setReason] = useState("");
  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button fullWidth onClick={() => push("/admins/members")}>
          KEMBALI
        </Button>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={(_, e) => setTabs(e)}>
            <Tab label="Data Diri" />
            <Tab label="Bukti Pembayaran" />
            <Tab label="Aksi" />
          </Tabs>
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
                      Nama
                    </TableCell>
                    <TableCell align="right">{user?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Username
                    </TableCell>
                    <TableCell align="right">{user?.username}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Subscription Type
                    </TableCell>
                    <TableCell align="right">
                      {user?.subscription_type}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Orang Tua
                    </TableCell>
                    <TableCell align="right">{user?.myparent?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Kecamatan / Kelurahan
                    </TableCell>
                    <TableCell align="right">{user?.district?.name}</TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Kota / Kabupaten
                    </TableCell>
                    <TableCell align="right">{user?.city?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Provinsi
                    </TableCell>
                    <TableCell align="right">{user?.province?.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Daftar Pada
                    </TableCell>
                    <TableCell align="right">
                      {moment(user?.created_at).format()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tabs == 1 && (
          <Box>
            {user?.payment_proves?.map((e) => (
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
        {tabs == 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Status Langganan
              </InputLabel>
              <Select
                value={accept}
                label="Status Langganan"
                onChange={(e) => setAccept(e.target.value as any)}
              >
                <MenuItem value={"true"}>Aktif</MenuItem>
                <MenuItem value={"false"}>Tidak Aktif</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Alasan Langganan"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <DateTimePicker
              label="Langganan Kadaluarsa"
              value={subscriptionExpiredAt}
              onChange={(e) => setSubscriptionExpiredAt(e)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  setSubscriptionExpiredAt(
                    moment(subscriptionExpiredAt).add(1, "month").toDate()
                  )
                }
              >
                Tambah 1 Bulan
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  setSubscriptionExpiredAt(
                    moment(subscriptionExpiredAt).add(3, "month").toDate()
                  )
                }
              >
                Tambah 3 Bulan
              </Button>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                handleUpdate({
                  variables: {
                    id,
                    input: {
                      subscription_verified: accept == "true",
                      subscription_reason: reason,
                      subscription_expired_at: moment(
                        subscriptionExpiredAt
                      ).format(),
                    },
                  },
                }).then((e) => {
                  toast.success("berhasil mengubah user");
                })
              }
            >
              simpan
            </Button>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
