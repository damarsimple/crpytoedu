import { gql } from "@apollo/client";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import GridLoader from "../components/GridLoader";
import { useUserStore } from "../store/user";
import { BasicNotification } from "../types/type";

export default function Notifications() {
  const { user } = useUserStore();

  return (
    <DashboardLayout>
      <GridLoader<BasicNotification>
        Component={(e) => {
          return (
            <Card sx={{ width: "100%", mt: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {e.name}
                </Typography>

                <Typography variant="body2">{e.text}</Typography>
              </CardContent>
              {/* <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
          );
        }}
        componentProp={{ xs: 12 }}
        variables={{ id: user?.id }}
        query={gql`
          query Query($id: ID!, $after: String, $first: Int!) {
            basicnotifications(user_id: $id, after: $after, first: $first) {
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
                  text
                  read_at
                  metadata {
                    content
                  }
                }
              }
            }
          }
        `}
        fields={"basicnotifications"}
      />
    </DashboardLayout>
  );
}
