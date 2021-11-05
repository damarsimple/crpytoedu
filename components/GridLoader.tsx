import { DocumentNode, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import React, { ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { wildCardFormatter } from "../helpers/formatters";
import { PageInfo } from "../types/type";
import { get } from "lodash";
import { CircularProgress, Grid, GridTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
interface Id {
  id: string;
}

interface BoxLoaderProp<T extends Id> {
  Component: (e: T) => JSX.Element;
  SkeletonComponent?: () => JSX.Element;
  emptyChildren?: ReactNode;
  query: DocumentNode;
  fields: string;

  perPage?: number;
  fetchPolicy?: WatchQueryFetchPolicy;
  variables?: object;

  dontFetchmore?: boolean;
  spacing?: number;
  componentProp?: object;
}

export default function GridLoader<T extends Id>({
  fetchPolicy,
  perPage: PerPage,
  variables,
  fields,
  query,
  Component,
  componentProp,
  emptyChildren,
  dontFetchmore,
  spacing,
}: BoxLoaderProp<T>) {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(PerPage ?? 10);

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    fetchPolicy: fetchPolicy ?? "network-only",
    variables: {
      first: perPage ?? 10,
      after: "",
      ...variables,
      name: wildCardFormatter(search),
    },
  });

  const mainData = get(data, fields);
  const pageInfo: PageInfo = mainData?.pageInfo;
  const datas: { node: T }[] = mainData?.edges ?? [];

  const { ref, inView } = useInView();

  useEffect(() => {
    if (dontFetchmore) return;
    if (inView && pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          first: perPage ?? 10,
          after: pageInfo.endCursor,
        },
      });
      console.log("fetching more");
    }
  }, [perPage, fetchMore, inView, pageInfo, dontFetchmore]);

  return (
    <>
      <Grid spacing={spacing}>
        {datas.map((e) => {
          return (
            <Grid item key={e.node.id} {...((componentProp ?? {}) as any)}>
              <Component {...e.node} />
            </Grid>
          );
        })}
      </Grid>
      {!dontFetchmore && (
        <div ref={ref}>
          {pageInfo?.hasNextPage && <CircularProgress />}
          {loading && <CircularProgress />}
          <p>{error?.message}</p>
        </div>
      )}
      {!loading && datas?.length == 0 && emptyChildren}
    </>
  );
}
