import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React, { SyntheticEvent, useState } from "react";
import { styled, alpha } from "@mui/material/styles";

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

  console.log(parentages);

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
            <ParentSize>
              {({ width, height }) => (
                <Example
                  width={width}
                  height={height}
                  rawTree={{ ...userByUsername, children: parentages }}
                />
              )}
            </ParentSize>
          )}
        </Box>
      )}
    </AppLayout>
  );
}

export default withRouter(Username);

import ParentSize from "@visx/responsive/lib/components/ParentSize";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { Tree, hierarchy } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkHorizontal } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import { gql, useQuery } from "@apollo/client";
import { User } from "../../types/type";
import { DateRange, Place, VerifiedUser } from "@mui/icons-material";
import AppLayout from "../../components/AppLayout";

const peach = "#fd9b93";
const pink = "#fe6e9e";
const blue = "#03c0dc";
const green = "#26deb0";
const plum = "#71248e";
const lightpurple = "#374469";
const white = "#ffffff";
export const background = "#272b4d";

type HierarchyNode = HierarchyPointNode<User>;

/** Handles rendering Root, Parent, and other Nodes. */
function Node({ node }: { node: HierarchyNode }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;
  if (isParent) return <ParentNode node={node} />;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={green}
        strokeWidth={1}
        strokeDasharray="2,2"
        strokeOpacity={0.6}
        rx={10}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        fill={green}
        style={{ pointerEvents: "none" }}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }: { node: HierarchyNode }) {
  return (
    <Group top={node.x} left={node.y}>
      <circle r={12} fill="url('#lg')" />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={plum}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function ParentNode({ node }: { node: HierarchyNode }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={blue}
        strokeWidth={1}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={white}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 10, left: 80, right: 80, bottom: 10 };

export type TreeProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  rawTree: User;
};

function Example({
  width,
  height,
  margin = defaultMargin,
  rawTree,
}: TreeProps) {
  const data = useMemo(() => hierarchy(rawTree), []);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="lg" from={peach} to={pink} />
      <rect width={width} height={height} rx={14} fill={background} />
      <Tree<User> root={data} size={[yMax, xMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {tree.links().map((link, i) => (
              <LinkHorizontal
                key={`link-${i}`}
                data={link}
                stroke={lightpurple}
                strokeWidth="1"
                fill="none"
              />
            ))}
            {tree.descendants().map((node, i) => (
              <Node key={`node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
