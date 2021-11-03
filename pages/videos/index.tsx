import { gql, useQuery } from "@apollo/client";
import { Box, Chip, Grid, Stack, Typography, Paper } from "@mui/material";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import VideoCard from "../../components/VideoCard";
import { VideoEdge } from "../../types/type";

export default function Index() {
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
  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack direction="row" spacing={1}>
          <Chip label="Clickable" />
          <Chip label="Clickable" variant="outlined" />
        </Stack>
        <Grid container spacing={1}>
          {data?.videos?.edges?.map(({ node }) => (
            <Grid item xs={12} md={4} lg={3} key={node?.id}>
              <VideoCard {...node} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
