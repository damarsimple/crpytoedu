import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardActions,
  Button,
} from "@mui/material";
import { title } from "process";
import React from "react";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Roles, User } from "../types/type";
import { useRouter } from "next/dist/client/router";

export default function UserCard({
  name,
  title,
  cover,
  username,
  url_facebook,
  url_twitter,
  url_instagram,
  url_linkedin,
}: User) {
  const { push } = useRouter();
  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={cover?.path ?? "/person-placeholder.jpg"}
        alt={name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ height: 30 }}>
          {title}
        </Typography>
      </CardContent>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open(url_facebook ?? "", "_blank").focus();
          }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open(url_twitter ?? "", "_blank").focus();
          }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open(url_instagram ?? "", "_blank").focus();
          }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            if (window.open)
              //@ts-ignore
              window.open(url_linkedin ?? "", "_blank").focus();
          }}
        >
          <LinkedInIcon />
        </IconButton>
      </Box>

      <CardActions>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push("/users/" + username)}
        >
          profile
        </Button>
      </CardActions>
    </Card>
  );
}
