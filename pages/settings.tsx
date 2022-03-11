import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  InputAdornment,
} from "@mui/material";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";
import { useUserStore } from "../store/user";
import { BasicOutput, File as FileType, User } from "../types/type";
import Image from "next/image";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Setting() {
  const [tabs, setTabs] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
  };

  const { user, setUser } = useUserStore();

  const [handleChangePassword] = useMutation<{
    updatePassword: BasicOutput;
  }>(gql`
    mutation UpdatePasswordMutation($input: UpdatePassword!) {
      updatePassword(input: $input) {
        status
        message
      }
    }
  `);

  const [handleChangeData] = useMutation<{
    updateUser: User;
  }>(gql`
    mutation Mutation($id: ID!, $input: UpdateUser!) {
      updateUser(id: $id, input: $input) {
        id
      }
    }
  `);

  const { refetch } = useQuery<{ me: User }>(
    gql`
      query Query {
        me {
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
          parent_id
          metadata
          email
          created_at
          updated_at
          subscription_expired_at
          subscription_reason
          subscription_verified
          province_id
          city_id
          district_id
          thumbnail {
            id
            name
            path
            mime
            user_id
            created_at
            updated_at
          }
          cover {
            id
            name
            path
            mime
            user_id
            created_at
            updated_at
          }
          url_facebook
          url_twitter
          url_instagram
          url_linkedin
          got_children
          basicnotificationsCount
        }
      }
    `,
    {
      onCompleted: ({ me }) => {
        setUser(me);
      },
    }
  );

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={handleChange}>
            <Tab label="Detail" />
            <Tab label="Password" />
            <Tab label="Photo" />
            <Tab label="Social URL" />
          </Tabs>
        </Box>
        {tabs == 0 && (
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
                  id: user?.id,
                  input: {
                    ...fields,
                  },
                },
              }).then((x) => {
                toast.success("Berhasil mengubah data anda");
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
              defaultValue={user?.name}
            />
            <TextField
              name="username"
              fullWidth
              label="Username"
              variant="outlined"
              required
              defaultValue={user?.username}
            />
            {/* <TextField
              name="email"
              fullWidth
              label="Email"
              variant="outlined"
              required
              type="email"
              defaultValue={user?.email}
            /> */}

            {/* <FormControl fullWidth>
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
          </FormControl> */}

            {/* <Autocomplete
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
          /> */}
            {/* <Autocomplete
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
          /> */}
            <Button type="submit" variant="contained" fullWidth>
              UBAH
            </Button>
          </Box>
        )}

        {tabs == 1 && (
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

              if (fields["new_password"] != fields["confirm_password"]) {
                return toast.error("Password Tidak Sama");
              }

              handleChangePassword({
                variables: {
                  input: {
                    new_password: fields.new_password,
                    old_password: fields.old_password,
                  },
                },
              }).then((x) => {
                if (x?.data?.updatePassword?.status) {
                  toast.success("Berhasil mengubah password");
                  e.target.reset();
                } else {
                  toast.error(x?.data?.updatePassword?.message);
                }
              });
            }}
          >
            <TextField
              name="old_password"
              fullWidth
              label="Password Lama"
              variant="outlined"
              required
              type="password"
            />
            <TextField
              name="new_password"
              fullWidth
              label="Password Baru"
              variant="outlined"
              required
              type="password"
            />
            <TextField
              name="confirm_password"
              fullWidth
              label="Konfirmasi Password Baru"
              variant="outlined"
              required
              type="password"
            />
            <Button type="submit" variant="contained" fullWidth>
              UBAH
            </Button>
          </Box>
        )}
        {tabs == 2 && (
          <Grid container spacing={1}>
            <Grid item xs={6} sx={{ height: 600, position: "relative" }}>
              {user?.cover?.path && (
                <Image
                  src={user.cover.path}
                  alt={`cover of ${user?.name}`}
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <ImageDropZone label="Cover" roles="COVER" onFinish={refetch} />
            </Grid>
            <Grid item xs={6} sx={{ height: 600, position: "relative" }}>
              {user?.thumbnail?.path && (
                <Image
                  src={user.thumbnail.path}
                  alt={`thumbnail of ${user?.name}`}
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <ImageDropZone
                label="Thumbnail"
                roles="THUMBNAIL"
                onFinish={refetch}
              />
            </Grid>
          </Grid>
        )}
        {tabs == 3 && (
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
                  id: user?.id,
                  input: {
                    ...fields,
                  },
                },
              }).then((x) => {
                toast.success("Berhasil mengubah data anda");
              });
            }}
          >
            <TextField
              name="url_facebook"
              defaultValue={user?.url_facebook}
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
              defaultValue={user?.url_twitter}
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
              defaultValue={user?.url_instagram}
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
              defaultValue={user?.url_linkedin}
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

            <Button type="submit" variant="contained" fullWidth>
              UBAH
            </Button>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

function ImageDropZone({
  label,
  roles,
  onFinish,
}: {
  label: string;
  roles: string;
  onFinish?: () => void;
}) {
  const { user } = useUserStore();
  const [handleUpload, { loading: lUpload }] = useMutation<{
    uploadFile: {
      status: boolean;
      message?: string;
      file?: FileType;
    };
  }>(gql`
    mutation Mutation($input: UploadFile!) {
      uploadFile(input: $input) {
        status
        message
        file {
          id
          name
          mime
          path
        }
      }
    }
  `);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      handleUpload({
        variables: {
          input: {
            name: file.name,
            mime: file.type,
            roles,
            file,
            fileable_type: "App\\Models\\User",
            fileable_id: user?.id,
          },
        },
      }).then((e) => {
        if (e.data?.uploadFile?.status && e.data.uploadFile.file) {
          const f = e.data.uploadFile.file;
        } else {
          toast({
            description: e.data?.uploadFile.message,
          });
        }
        onFinish && onFinish();
      });
    },
    [handleUpload, roles, user]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      sx={{
        backgroundColor: "lightgray",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed gray",
        borderStyle: "dashed",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Taruh file disini</p>
      ) : (
        <p>Taruh atau klik untuk mengupload {label}</p>
      )}
    </Box>
  );
}
