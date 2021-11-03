import { Paper, Box, Typography } from "@mui/material";
import React from "react";
import { Video } from "../types/type";
import Image from "next/image";
import Link from "next/link";

export default function VideoCard({
  id,
  name,
  metadata,
  user,
  statistics,
  created_at,
}: Video) {
  return (
    <Paper sx={{ cursor: "pointer" }}>
      <Link href={"/videos/" + id}>
        <Box sx={{ height: 250 }}>
          <Box sx={{ height: 150, position: "relative" }}>
            <Image
              src={metadata?.thumbnail?.mqDefault ?? ""}
              alt={name}
              layout="fill"
            />
          </Box>
          <Box sx={{ p: 1 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {name}
            </Typography>
            <Typography>{user?.name}</Typography>
            <Typography>{statistics?.viewCount}x Ditonton</Typography>
            <Typography>{created_at}</Typography>
          </Box>
        </Box>
      </Link>
    </Paper>
  );
}
