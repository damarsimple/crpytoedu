import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, { SyntheticEvent, useState } from "react";

import {
  IconButton,
  Typography,
  InputBase,
  Tab,
  Tabs,
  Avatar,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import moment from "moment";
import { gql, useQuery } from "@apollo/client";
import { DateRange, Place, VerifiedUser } from "@mui/icons-material";
import ParentagesTree from "../../components/ParentagesTree";
import AppLayout from "../../components/AppLayout";
import { User } from "../../types/type";

function Username({ router }: WithRouterProps) {
  const { username } = router.query;
  const { push } = router;
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
        }
      }
    `,
    {
      variables: {
        username,
      },
    }
  );

  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const parentages: User[] = userByUsername?.parentages
    ? JSON.parse(userByUsername.parentages)
    : [];

  return (
    <AppLayout>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Profil" />
          <Tab label="Pohon Referal" />
        </Tabs>
      </Box>
      {value == 0 && (
        <Box>
          <Box
            sx={{
              height: 400,
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: 300,
                position: "relative",
              }}
            >
              <Image
                src={userByUsername?.thumbnail?.path ?? "/offline-meeting.jpg"}
                layout="fill"
                objectFit="cover"
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                p: 4,
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
              }}
            >
              <Avatar
                sx={{
                  height: 150,
                  width: 150,
                }}
                alt="Remy Sharp"
                src={userByUsername?.cover?.path}
              />
              <Box sx={{ position: "relative", width: 200 }}>
                <Button
                  variant="contained"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  EDIT PROFIL
                </Button>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h1">
              {userByUsername?.name}
            </Typography>
            <Typography variant="subtitle1" component="p">
              @{userByUsername?.username}
            </Typography>

            <Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Place /> Bekasi , Jakarta
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <DateRange /> bergabung pada{" "}
                {moment(userByUsername?.created_at).format("MMMM YYYY")}
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <VerifiedUser /> Diundang oleh {userByUsername?.myparent?.name}
              </Box>
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <IconButton
                  onClick={() => {
                    if (window.open)
                      //@ts-ignore
                      window
                        .open(userByUsername?.url_facebook ?? "", "_blank")
                        .focus();
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (window.open)
                      //@ts-ignore
                      window
                        .open(userByUsername?.url_twitter ?? "", "_blank")
                        .focus();
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (window.open)
                      //@ts-ignore
                      window
                        .open(userByUsername?.url_instagram ?? "", "_blank")
                        .focus();
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (window.open)
                      //@ts-ignore
                      window
                        .open(userByUsername?.url_linkedin ?? "", "_blank")
                        .focus();
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
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
    </AppLayout>
  );
}

export default withRouter(Username);
