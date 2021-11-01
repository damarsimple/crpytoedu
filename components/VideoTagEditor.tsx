import React from "react";
import { Add, Delete } from "@mui/icons-material";
import { Box, Chip, Divider, Typography } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Video, Category } from "../types/type";
import CircularProgress from "@mui/material/CircularProgress";

export default function VideoTagEditor({ id }: { id: string }) {
  const {
    data: { video, categories } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ video: Video; categories: Category[] }>(
    gql`
      query Query($id: ID!) {
        video(id: $id) {
          categories {
            id
            name
            created_at
            updated_at
          }
        }
        categories {
          id
          name
        }
      }
    `,
    {
      variables: {
        id,
      },
    }
  );

  const [handleAdd, { loading: ladd }] = useMutation(
    gql`
      mutation ($video_id: ID!, $tag_id: ID!) {
        handleAddTag(video_id: $video_id, tag_id: $tag_id) {
          status
          message
        }
      }
    `,
    {
      onCompleted: refetch,
    }
  );
  const [handleDelete, { loading: ldel }] = useMutation(
    gql`
      mutation handleDeleteTag($tag_id: ID!, $video_id: ID!) {
        handleDeleteTag(video_id: $video_id, tag_id: $tag_id) {
          status
          message
        }
      }
    `,
    {
      onCompleted: refetch,
    }
  );

  const halt = ldel || ladd;

  const ids = video?.categories?.map((e) => e.id) ?? [];

  const addable = categories?.filter((e) => !ids.includes(e.id));

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography>Tag Video</Typography>
      <Box>
        {video?.categories?.map((e) => (
          <Chip
            sx={{ mx: 1 }}
            key={e.id}
            label={e.name}
            disabled={halt}
            onClick={() => {}}
            onDelete={() =>
              handleDelete({ variables: { video_id: id, tag_id: e.id } })
            }
            deleteIcon={<Delete />}
            variant="outlined"
          />
        ))}
      </Box>
      <Divider />
      <Typography>Tambah Tag Video</Typography>
      <Box>
        {addable?.map((e) => (
          <Chip
            sx={{ mx: 1 }}
            key={e.id}
            label={e.name}
            disabled={halt}
            onClick={() => {}}
            onDelete={() =>
              handleAdd({ variables: { video_id: id, tag_id: e.id } })
            }
            deleteIcon={<Add />}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
