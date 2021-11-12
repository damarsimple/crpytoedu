import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, { useEffect, SyntheticEvent, useState } from "react";

import {
  InputAdornment,
  IconButton,
  Typography,
  InputBase,
  Tab,
  Tabs,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import moment from "moment";
import { gql, useMutation, useQuery } from "@apollo/client";
import { DateRange, Place, VerifiedUser } from "@mui/icons-material";
import DashboardLayout from "../../../../components/DashboardLayout";
import ParentagesTree from "../../../../components/ParentagesTree";
import { BasicOutput, User } from "../../../../types/type";
import { toast } from "react-toastify";
import usePlaces from "../../../../hooks/usePlaces";
import { DateTimePicker } from "@mui/lab";

function Username({ router }: WithRouterProps): JSX.Element {
  const { username, tabs: tabsValue } = router.query;
  const { push } = router;
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (tabsValue) {
      setTabs(parseInt(tabsValue as string));
    }
  }, [tabsValue]);

  const {
    data: { userByUsername } = {},
    loading,
    error,
  } = useQuery<{ userByUsername: User }>(
    gql`
      query Query($username: String!) {
        userByUsername(username: $username) {
          id
          name
          username
          title
          subscription_type
          roles
          is_admin
          description
          is_banned
          banned_reason
          email
          parentages
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
          cover {
            id
            path
          }
          thumbnail {
            id
            name
          }
          url_facebook
          url_twitter
          url_instagram
          url_linkedin
          got_children
          created_at
          myparent {
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
        username,
      },
      fetchPolicy: "network-only",
    }
  );

  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const parentages: User[] = userByUsername?.parentages
    ? JSON.parse(userByUsername.parentages)
    : [];

  const [handleChangeData] = useMutation<{
    updateUser: User;
  }>(gql`
    mutation Mutation($id: ID!, $input: UpdateUser!) {
      updateUser(id: $id, input: $input) {
        id
      }
    }
  `);
  const [handleChangePassword] = useMutation<{
    adminChangePasswordUser: BasicOutput;
  }>(gql`
    mutation AdminChangePasswordUser($id: ID!, $password: String!) {
      adminChangePasswordUser(id: $id, password: $password) {
        status
        message
      }
    }
  `);
  const [tabs, setTabs] = useState(0);
  const [subscriptionExpiredAt, setSubscriptionExpiredAt] =
    useState<Date | null>(new Date());

  const [accept, setAccept] = useState<"true" | "false">("false");
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

  if (error)
    return (
      <Box display="flex" justifyContent="center">
        {error?.message}
      </Box>
    );

  if (loading)
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <DashboardLayout>
      <Button fullWidth onClick={() => push("/admins/members")}>
        KEMBALI
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Profil" />
          <Tab label="Pohon Referal" />
          <Tab label="Pembayaran" />
          <Tab label="Password" />
        </Tabs>
      </Box>
      {value == 3 && (
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

            handleChangePassword({
              variables: {
                id: userByUsername?.id,
                ...fields,
              },
            }).then((x) => {
              toast.success(x?.data?.adminChangePasswordUser?.message);
            });

            e.target.reset();
          }}
        >
          <TextField
            name="password"
            fullWidth
            label="Ubah Password"
            variant="outlined"
            required
            type="password"
          />
          <Button type="submit" variant="contained" fullWidth>
            UBAH PASSWORD
          </Button>
        </Box>
      )}
      {value == 0 && (
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

            handleChangeData({
              variables: {
                id: userByUsername?.id,
                input: {
                  ...fields,
                },
              },
            }).then((x) => {
              toast.success("Berhasil mengubah data user");
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
            defaultValue={userByUsername?.name}
          />
          <TextField
            name="username"
            fullWidth
            label="Username"
            variant="outlined"
            required
            defaultValue={userByUsername?.username}
          />
          <TextField
            name="email"
            fullWidth
            label="Email"
            variant="outlined"
            required
            type="email"
            defaultValue={userByUsername?.email}
          />
          <TextField
            name="url_facebook"
            defaultValue={userByUsername?.url_facebook}
            fullWidth
            label="URL Facebook"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FacebookIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="url_twitter"
            defaultValue={userByUsername?.url_twitter}
            fullWidth
            label="URL Twitter"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TwitterIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="url_instagram"
            defaultValue={userByUsername?.url_instagram}
            fullWidth
            label="URL Instagram"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InstagramIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="url_linkedin"
            defaultValue={userByUsername?.url_linkedin}
            fullWidth
            label="URL LinkedIn"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkedInIcon />
                </InputAdornment>
              ),
            }}
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
            UBAH
          </Button>
        </Box>
      )}
      {value == 1 && (
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
          {userByUsername && (
            <ParentagesTree user={userByUsername} parentages={parentages} />
          )}
        </Box>
      )}
      {value == 2 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Nama
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.name}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Username
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.username}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Subscription Type
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.subscription_type}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Orang Tua
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.myparent?.name}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Kecamatan / Kelurahan
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.district?.name}
                        </TableCell>
                      </TableRow>

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Kota / Kabupaten
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.city?.name}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Provinsi
                        </TableCell>
                        <TableCell align="right">
                          {userByUsername?.province?.name}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Daftar Pada
                        </TableCell>
                        <TableCell align="right">
                          {moment(userByUsername?.created_at).format()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {tabs == 1 && (
              <Box>
                {userByUsername?.payment_proves?.map((e) => (
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
                    handleChangeData({
                      variables: {
                        id: userByUsername?.id,
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
        </>
      )}
    </DashboardLayout>
  );
}

export default withRouter(Username);
