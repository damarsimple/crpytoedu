import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";
import ParentagesTree from "../components/ParentagesTree";
import usePlaces from "../hooks/usePlaces";
import { useUserStore } from "../store/user";
import { User } from "../types/type";

export default function Childrens() {
  const { data: { me } = {}, refetch } = useQuery<{ me: User }>(gql`
    query GetMe {
      me {
        parentages
      }
    }
  `);

  const parentages: User[] = me?.parentages ? JSON.parse(me.parentages) : [];

  const { user } = useUserStore();

  const [tabs, setTabs] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
  };

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

  const [handleCreate] = useMutation(gql`
    mutation Mutation($input: CreateUser!) {
      createUser(input: $input) {
        id
        name
      }
    }
  `);

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={handleChange}>
            <Tab label="Daftarkan Member" />
            <Tab label="Pohon" />
            <Tab label="Tabel" />
          </Tabs>
        </Box>
        {tabs == 0 && (
          <Tabs>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                width: "100%",
                display: "flex",
                gap: 1,
                flexDirection: "column",
                p: 2,
              }}
              onSubmit={(e: any) => {
                e.preventDefault();
                const fields = Array.prototype.slice
                  .call(e.target)
                  .filter((el) => el.name)
                  .reduce(
                    (form, el) => ({
                      ...form,
                      [el.name]: el.value,
                    }),
                    {}
                  );

                for (const x in fields) {
                  if (!Boolean(fields[x])) {
                    toast.error("Anda belum melengkapi formulir !");
                    return;
                  }
                }

                if (!province || !city || !district) {
                  toast.error("Anda belum melengkapi formulir !");
                  return;
                }

                fields["province_id"] = province.id;
                fields["city_id"] = city.id;
                fields["district_id"] = district.id;

                handleCreate({
                  variables: {
                    input: fields,
                  },
                }).then((e) => {
                  toast.success("Berhasil mendaftarkan user");
                  refetch();
                });

                e.target.reset();
              }}
            >
              <TextField
                name="name"
                fullWidth
                label="Nama"
                variant="outlined"
                required
              />
              <TextField
                name="username"
                fullWidth
                label="Username"
                variant="outlined"
                required
              />
              <TextField
                name="email"
                fullWidth
                label="Email"
                variant="outlined"
                required
                type="email"
              />
              <TextField
                name="password"
                fullWidth
                label="Password"
                variant="outlined"
                required
                type="password"
              />
              <FormControl fullWidth>
                <InputLabel>Tipe Pendaftaran</InputLabel>
                <Select
                  fullWidth
                  label="Tipe Pendaftaran"
                  variant="outlined"
                  name="subscription_type"
                  required
                >
                  <MenuItem value={"ONLINE"}>ONLINE</MenuItem>
                  <MenuItem value={"OFFLINE"}>OFFLINE</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                options={provinces?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                fullWidth
                onChange={(_, x) => {
                  x?.id && setProvince(x.rest);
                }}
                renderInput={(params) => (
                  <TextField
                    name="province_id"
                    {...params}
                    label="Provinsi"
                    required
                  />
                )}
              />
              <Autocomplete
                options={cities?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                onChange={(_, x) => {
                  x?.id && setCity(x.rest);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    name="city_id"
                    {...params}
                    label="Kota / Kabupaten"
                    required
                  />
                )}
              />
              <Autocomplete
                options={districts?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                onChange={(_, x) => {
                  x?.id && setDistrict(x.rest);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    name="district_id"
                    {...params}
                    label="Kelurahan / Kecamatan"
                    required
                  />
                )}
              />
              <Button type="submit" variant="contained" fullWidth>
                DAFTARKAN
              </Button>
            </Box>
          </Tabs>
        )}
        {tabs == 1 && (
          <Box
            sx={{
              width: { xs: "100vw", md: "80vw" },
              height: { xs: "100vh", md: "80vh" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              m: "auto",
            }}
          >
            {user && <ParentagesTree user={user} parentages={parentages} />}
          </Box>
        )}
        {tabs == 2 && (
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell align="right">Username</TableCell>
                    <TableCell align="right">Roles</TableCell>
                    <TableCell align="right">Daftar Pada</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parentages?.flat().map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.username}</TableCell>
                      <TableCell align="right">{row.roles}</TableCell>
                      <TableCell align="right">
                        {moment(row.created_at).format()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
