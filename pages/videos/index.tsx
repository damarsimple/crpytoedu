import { gql, useQuery } from "@apollo/client";
import { Box, Chip, Grid, Stack, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import VideoCard from "../../components/VideoCard";
import { Category, VideoEdge } from "../../types/type";

export default function Index() {
  const [category, setCategory] = useState<undefined | Category>(undefined);

  const { data } = useQuery<{ videos: { edges: VideoEdge[] } }>(
    gql`
      query Query(
        $first: Int!
        $orderBy: [QueryVideosOrderByOrderByClause!]
        $name: String
        $user_id: ID
        $type: VideoType
        $after: String
        $category_id: ID
      ) {
        videos(
          first: $first
          orderBy: $orderBy
          name: $name
          user_id: $user_id
          type: $type
          after: $after
          category_id: $category_id
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
      variables: { first: 10, category_id: category?.id },
      fetchPolicy: "network-only",
    }
  );

  const { data: { categories } = {} } = useQuery<{
    categories: Category[];
  }>(gql`
    query {
      categories {
        id
        name
      }
    }
  `);

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack direction="row" spacing={1}>
          {categories?.map((e) => (
            <Chip
              key={e.id}
              label={e.name}
              variant="outlined"
              color={category?.id == e.id ? "success" : "info"}
              onClick={() => setCategory(e == category ? undefined : e)}
            />
          ))}
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
