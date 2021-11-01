import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Video } from "../types/type";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

export default function VideoImageEditor({ id }: { id: string }) {
  const {
    data: { video } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ video: Video }>(
    gql`
      query Query($id: ID!) {
        video(id: $id) {
          metadata {
            thumbnail {
              hqDefault
            }
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

  const [refresh] = useMutation(
    gql`
      mutation Mutation($id: ID!) {
        refreshVideoMetadata(video_id: $id) {
          status
          message
        }
      }
    `,
    {
      onCompleted: () => {
        refetch();
        toast.success("Berhasil memperbarui metadata");
      },
    }
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
        gap: 4,
      }}
    >
      <Typography>Thumbnail Youtube</Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {video && (
          <img
            src={video?.metadata?.thumbnail?.hqDefault ?? ""}
            alt={video?.name}
          />
        )}
        <Button
          variant="contained"
          onClick={() =>
            refresh({
              variables: {
                id,
              },
            })
          }
        >
          REFRESH METADATA
        </Button>
      </Box>
    </Box>
  );
}
