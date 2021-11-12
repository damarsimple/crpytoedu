/* eslint-disable react-hooks/exhaustive-deps */
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import { useMemo, useEffect } from "react";
import { Group } from "@visx/group";
import { Tree, hierarchy } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkHorizontal } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import { User } from "../types/type";
import { gql, useQuery } from "@apollo/client";
import create from "zustand";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";

const useStore = create((set) => ({
  selectedId: "",
  setSelectedId: (id: string) => set({ selectedId: id }),
}));

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

  const { setSelectedId } = useStore();

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
          setSelectedId(node.data.id);
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

  const { setSelectedId } = useStore();

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
          setSelectedId(node.data.id);
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

export default function ParentagesTree({
  user,
  parentages,
}: {
  user: User;
  parentages: User[];
}) {
  const { selectedId, setSelectedId } = useStore();

  useEffect(() => {
    if (user?.id) {
      setSelectedId(user.id);
    }
  }, [user]);

  const {
    data: { user: userClicked } = {},
    loading,
    error,
  } = useQuery<{ user: User }>(
    gql`
      query Query($id: ID!) {
        user(id: $id) {
          id
          name
          parentages
        }
      }
    `,
    {
      variables: { id: selectedId ?? user?.id },
    }
  );

  if (loading || !userClicked) return <div>Loading...</div>;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ParentSize>
        {({ width, height }) => (
          <Example
            width={width}
            height={height}
            rawTree={{
              ...userClicked,
              children: JSON.parse(userClicked.parentages ?? "") ?? [],
            }}
          />
        )}
      </ParentSize>
    </Box>
  );
}
