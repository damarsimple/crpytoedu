import { useQuery, gql } from "@apollo/client";
import { Chip, Grid, Box, Button } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import VideoCard from "../../components/VideoCard";
import { VideoEdge } from "../../types/type";

export default function Id() {
  const { data } = useQuery<{ videos: { edges: VideoEdge[] } }>(
    gql`
      query Query(
        $first: Int!
        $orderBy: [QueryVideosOrderByOrderByClause!]
        $name: String
        $userId: ID
        $type: VideoType
        $after: String
        $categoryId: ID
      ) {
        videos(
          first: $first
          orderBy: $orderBy
          name: $name
          user_id: $userId
          type: $type
          after: $after
          category_id: $categoryId
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            total
            endCursor
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

              statistics {
                viewCount
                likeCount
                dislikeCount
                favoriteCount
                commentCount
              }
              metadata {
                duration
                dimension
                definition
                licensedContent
                contentRating
                projection
                duration_sec
                thumbnail {
                  default
                  mqDefault
                  hqDefault
                  sdDefault
                  maxresDefault
                }
                caption
              }
            }
          }
        }
      }
    `,
    {
      variables: { first: 10 },
    }
  );

  const { push } = useRouter();

  return (
    <DashboardLayout>
      <Button onClick={() => push("/videos")} fullWidth>
        KEMBALI
      </Button>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <iframe
          style={{
            width: "100%",
            height: "80vh",
          }}
          src="https://www.youtube.com/embed/g9NuYgcVpp0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
        <Chip label="Clickable" variant="outlined" />
        <Grid container spacing={1}>
          {data?.videos?.edges?.map(({ node }) => (
            <Grid item xs={12} md={6} lg={2} key={node?.id}>
              <VideoCard {...node} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
