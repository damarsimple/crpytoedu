import { gql } from "@apollo/client";
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { Video } from "../../types/type";
import getYouTubeID from "get-youtube-id";
import { Button, Modal, Box, Chip } from "@mui/material";
import VideoTagEditor from "../../components/VideoTagEditor";
import { Tag } from "@mui/icons-material";
import VideoImageEditor from "../../components/VideoImageEditor";

export default function Index() {
  const [openEditTagId, setEditTagId] = useState("");
  const [openMediaId, setOpenMediaId] = useState("");
  const handleCloseTag = () => setEditTagId("");
  const handleCloseMedia = () => setOpenMediaId("");

  return (
    <DashboardLayout>
      <Modal open={Boolean(openEditTagId)} onClose={handleCloseTag}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <VideoTagEditor id={openEditTagId} />
        </Box>
      </Modal>
      <Modal open={Boolean(openMediaId)} onClose={handleCloseMedia}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <VideoImageEditor id={openMediaId} />
        </Box>
      </Modal>
      <TableLoader<Video>
        getQuery={gql`
          query Query(
            $first: Int!
            $orderBy: [QueryVideosOrderByOrderByClause!]
            $name: String
            $user_id: ID
            $type: VideoType
            $after: String
          ) {
            videos(
              first: $first
              orderBy: $orderBy
              name: $name
              user_id: $user_id
              type: $type
              after: $after
            ) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
                total
                count
                currentPage
                lastPage
              }
              edges {
                node {
                  id
                  name
                  created_at
                  updated_at
                  youtube_id
                  categories {
                    id
                    name
                  }
                  user {
                    id
                    name
                  }
                  user_id
                }
              }
            }
          }
        `}
        fields={"videos"}
        columns={[
          { field: "id", headerName: "ID", filterable: true },
          {
            field: "name",
            headerName: "Nama",
            editable: true,
            filterable: true,
          },
          {
            field: "youtube_id",
            headerName: "ID Youtube",
            flex: 1,
            editable: true,
          },
          {
            field: "user.name",
            headerName: "Uploader",
            flex: 1,
            //@ts-ignore
            valueGetter: (e) => e.getValue(e.id, "user")?.name,
            castValue: (e) => getYouTubeID(e) ?? "",
          },
        ]}
        label="Video"
        actions={["delete", "edit", "create", "custom"]}
        customColumns={[
          {
            field: "tag",
            headerName: "Tag",
            renderCell: (e) => (
              <>
                <Button
                  variant="contained"
                  onClick={() => setEditTagId(e.api.getCellValue(e.id, "id"))}
                >
                  EDIT TAG
                </Button>
              </>
            ),
          },
          {
            field: "media",
            headerName: "Media",
            renderCell: (e) => (
              <>
                <Button
                  variant="contained"
                  onClick={() => setOpenMediaId(e.api.getCellValue(e.id, "id"))}
                >
                  EDIT MEDIA
                </Button>
              </>
            ),
          },
        ]}
        createQuery={gql`
          mutation CreateVideoMutation($input: CreateVideo!) {
            createVideo(input: $input) {
              id
              name
            }
          }
        `}
        updateQuery={gql`
          mutation UpdateVideoMutation($id: ID!, $input: UpdateVideo!) {
            updateVideo(id: $id, input: $input) {
              id
              name
            }
          }
        `}
        deleteQuery={gql`
          mutation DeleteVideoMutation($id: ID!) {
            deleteVideo(id: $id) {
              id
              name
            }
          }
        `}
      />
    </DashboardLayout>
  );
}
