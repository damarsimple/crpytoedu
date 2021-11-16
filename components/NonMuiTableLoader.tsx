import React, { ChangeEvent, ChangeEventHandler } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  GridApi,
  GridColDef,
  GridSortModel,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grow,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Autocomplete,
  Grid,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

import { Theme } from "@mui/material/styles";
//@ts-ignore
import { createStyles, makeStyles } from "@mui/styles";

import { useState } from "react";
import { toast } from "react-toastify";
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import { PageInfo, SelectValue } from "../types/type";
import { get } from "lodash";
import { useModalStore } from "../store/modal";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateTimePicker } from "@mui/lab";
import moment from "moment";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type Action = "edit" | "delete" | "create" | "custom";

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

interface TableColumnDefinition<T> extends Omit<GridColDef, "field"> {
  field: Leaves<T, 3>; // 3 tree deepth
  castValue?: (by: string) => string;
  selects?: SelectValue[];
  onChange?: (by: string) => void;
  createable?: boolean;
}

interface Id {
  id: string;
}

export interface ConnectionNode<T extends Id> {
  node: T;
  cursor: string;
}

export interface ConnectionData<T extends Id> {
  pageInfo: PageInfo;
  edges: ConnectionNode<T>[];
}

interface SelectGrid extends GridRenderCellParams<string> {
  selects?: SelectValue[];
  onChange?: (by: string) => void;
}

function SelectEditCellInput(props: SelectGrid) {
  const { id, value, api, field, onChange } = props;
  const handleChange = (event: SelectChangeEvent) => {
    onChange && onChange(event.target.value);
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    api.commitCellChange({ id, field });
  };

  return (
    <FormControl fullWidth>
      <Select value={value} onChange={handleChange}>
        {props?.selects?.map((e) => (
          <MenuItem key={e.value} value={e.value}>
            {e.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function SelectBase({
  headerName,
  field,
  selects,
  onChange,
  defaultValue,
}: {
  headerName: string;
  field: string;
  name?: string;
  selects?: SelectValue[];
  onChange?: (e: string) => void;
  defaultValue?: string;
}) {
  const [value, setValue] = useState<string | null>(defaultValue ?? null);

  return (
    <FormControl fullWidth>
      <InputLabel>{headerName}</InputLabel>
      <Select
        value={value}
        name={field}
        label={headerName}
        placeholder={`Pilih ${headerName}`}
        onChange={(v) => {
          v.target.value && onChange && onChange(v.target.value);
          setValue(v.target.value);
        }}
      >
        {selects?.map((e) => (
          <MenuItem value={e.value} key={e.value}>
            {e.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
function textEditCellInput(props: GridRenderCellParams<string>) {
  const { id, value, api, field } = props;

  const handleChange = (event: any) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    api.commitCellChange({ id, field });
  };

  return (
    <FormControl fullWidth>
      <TextField value={value} onChange={handleChange} />
    </FormControl>
  );
}

function DateTimeInput({
  headerName,
  field,
  name,
  defaultValue,
}: {
  headerName: string;
  field: string;
  name?: string;
  defaultValue?: Date;
}) {
  const [value, setValue] = useState<Date | null>(defaultValue ?? null);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DateTimePicker
        label="Date&Time picker"
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: "100%" }}
            label={headerName}
            //@ts-ignore
            name={field as string}
            variant="outlined"
          />
        )}
      />
    </LocalizationProvider>
  );
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        border: 0,
        color:
          theme.palette.mode === "light"
            ? "rgba(0,0,0,.85)"
            : "rgba(255,255,255,0.85)",
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-columnsContainer": {
          backgroundColor:
            theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
        },
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
          borderRight: `1px solid ${
            theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
          }`,
        },
        "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
          }`,
        },
        "& .MuiDataGrid-cell": {
          color:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,.85)"
              : "rgba(255,255,255,0.65)",
        },
        "& .MuiPaginationItem-root": {
          borderRadius: 0,
        },
      },
    }),
  { defaultTheme }
);

interface SpecialColumn<T> extends Omit<GridColDef, "renderCell"> {
  renderCell: (t: T) => JSX.Element;
}

export default function NonMuiTableLoader<T extends Id>({
  columns,
  label,
  actions,
  getQuery,
  updateQuery,
  deleteQuery,
  createQuery,
  fields,
  customColumns,
  formatSubmit,
}: {
  columns: TableColumnDefinition<T>[];
  customColumns?: GridColDef[];
  label: string;
  fields: string;
  actions?: Array<Action>;
  getQuery: DocumentNode;
  createQuery?: DocumentNode;
  updateQuery?: DocumentNode;
  deleteQuery?: DocumentNode;
  formatSubmit?: (e: object) => object;
}) {
  const classes = useStyles();

  const { popModal } = useModalStore();

  const [pageSize, setPageSize] = React.useState<number>(10);

  const { data, loading, error, refetch, fetchMore } = useQuery(getQuery, {
    fetchPolicy: "network-only",
    variables: {
      first: pageSize,
      after: "",
    },
  });

  const [handleCreate] = useMutation(
    createQuery ??
      gql`
        mutation {
          placholder {
            id
            name
          }
        }
      `,
    { errorPolicy: "all" }
  );
  const [handleUpdate] = useMutation(
    updateQuery ??
      gql`
        mutation {
          placholder {
            id
            name
          }
        }
      `,
    { errorPolicy: "all" }
  );
  const [handleDelete] = useMutation(
    deleteQuery ??
      gql`
        mutation {
          placholder {
            id
            name
          }
        }
      `,
    { errorPolicy: "all" }
  );
  const [currentlyEdited, setCurrentlyEdited] = useState<undefined | T>(
    undefined
  );
  const dataFields: ConnectionData<T> = get(data, fields);
  const [page, setPage] = useState(1);
  const { edges, pageInfo } = dataFields || {};
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

  const [openModal, setOpenModal] = useState(false);

  const definedColumns = columns.map((e) => {
    let d = {
      ...e,
      flex: 1,
    };

    if (e.type == "select") {
      d = {
        ...d,
        renderEditCell: (x) =>
          //@ts-ignore
          SelectEditCellInput({
            ...x,
            selects: e.selects,
            onChange: e.onChange,
          }),
      };
    }

    return d;
  });
  //@ts-ignore
  const editable = definedColumns.filter(
    (e) => typeof e.editable == "boolean" && e.editable
  );
  //@ts-ignore
  const editableFields: string[] = editable.map((e) => e.field);

  const actionColumn: SpecialColumn<T>[] = [
    {
      field: "edit",
      headerName: "Edit",
      type: "number",
      flex: 1,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params: T) => {
        return (
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => setCurrentlyEdited(params)}
          >
            Edit
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      type: "number",
      flex: 1,
      filterable: false,
      sortable: false,
      disableExport: true,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          popModal(`Anda yakin ingin mengahapus ${label} ? `, () =>
            handleDelete({
              variables: {
                id: params.id,
              },
            }).then(() => {
              toast.info(`Berhasil menghapus ${label} id ${params.id}`);
              refetch();
            })
          );
          return;
        };

        return (
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            onClick={onClick}
            color="error"
          >
            Delete
          </Button>
        );
      },
    },
  ];
  //@ts-ignore
  const compiledColumns: SpecialColumn<T>[] = [
    ...definedColumns,
    ...(actions?.includes("custom") && customColumns ? customColumns : []),
    ...actionColumn.filter((e) => actions?.includes(e.field as Action)),
  ];

  const nextOrPrev = (direction: "prev" | "next") => {
    refetch({
      first: 10,
      after:
        (direction == "prev" ? pageInfo?.startCursor : pageInfo?.endCursor) ??
        "",
    });
  };

  return (
    <>
      {error && error.message}
      <Modal
        open={Boolean(currentlyEdited)}
        onClose={() => setCurrentlyEdited(undefined)}
      >
        <Box sx={style}>
          <Typography
            sx={{ textTransform: "uppercase", mt: 2 }}
            align="center"
            variant="h5"
            component="h1"
          >
            Edit {label}
          </Typography>
          <Grow in={Boolean(currentlyEdited)}>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                const data = {};
                editable
                  .filter((e) => e.createable != false)
                  .forEach((x) => {
                    try {
                      switch (x.type) {
                        case "number":
                          //@ts-ignore
                          data[x.field] = parseInt(data[x.field]);
                          break;
                        case "boolean":
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].checked;
                          break;

                        case "f":
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].value;
                          break;
                        default:
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].value;
                          break;
                      }
                    } catch (error) {
                      console.log(x.field);
                    }
                    if (x.castValue) {
                      //@ts-ignore
                      data[x.field] = x.castValue(data[x.field]);
                    }
                  });
                handleUpdate({
                  variables: {
                    id: currentlyEdited?.id,
                    input: formatSubmit ? formatSubmit(data) : data,
                  },
                }).then((x) => {
                  refetch();
                  console.log(x);
                  if (x.errors) {
                    for (const err of x.errors) {
                      const { validation } = err.extensions;
                      Object.keys(validation ?? {}).forEach((e) => {
                        validation[e].forEach(toast.error);
                      });
                    }
                  } else {
                    toast.success(`Berhasil mengubah ${label} `);
                    setCurrentlyEdited(undefined);
                  }
                });
              }}
            >
              <Grid container spacing={1}>
                {editable.map((e) => {
                  switch (e.type) {
                    case "boolean":
                      return (
                        <Grid item xs={6}>
                          <FormGroup key={e.field as string}>
                            <FormControlLabel
                              control={<Checkbox name={e.field as string} />}
                              label={e.headerName}
                              defaultChecked={Boolean(
                                get(currentlyEdited, e.field)
                              )}
                            />
                          </FormGroup>
                        </Grid>
                      );
                    case "select":
                      return (
                        <Grid item xs={6} key={e.field as string}>
                          <SelectBase
                            selects={e.selects ?? []}
                            //@ts-ignore
                            onChange={(x) => {
                              e.onChange && e.onChange(x);
                            }}
                            headerName={e.headerName as string}
                            field={e.field}
                            defaultValue={get(currentlyEdited, e.field)}
                          />
                        </Grid>
                      );
                    case "dateTime":
                      return (
                        <Grid item xs={6} key={e.field as string}>
                          <DateTimeInput
                            field={e.field}
                            name={e.field as string}
                            headerName={e.headerName as string}
                            defaultValue={moment(
                              get(currentlyEdited, e.field)
                            ).toDate()}
                          />
                        </Grid>
                      );
                    default:
                      return (
                        <Grid item xs={6} key={e.field as string}>
                          <TextField
                            sx={{ width: "100%" }}
                            label={e.headerName}
                            //@ts-ignore
                            name={e.field as string}
                            variant="outlined"
                            defaultValue={get(currentlyEdited, e.field)}
                            type={e.type}
                          />
                        </Grid>
                      );
                  }
                })}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    startIcon={<SaveIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grow>
        </Box>
      </Modal>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={style}>
          <Typography
            sx={{ textTransform: "uppercase", mt: 2 }}
            align="center"
            variant="h5"
            component="h1"
          >
            BUAT {label} BARU
          </Typography>
          <Grow in={openModal}>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                const data = {};
                editable
                  .filter((e) => e.createable != false)
                  .forEach((x) => {
                    try {
                      switch (x.type) {
                        case "boolean":
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].checked;
                          break;

                        case "f":
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].value;
                          break;
                        default:
                          //@ts-ignore
                          data[x.field] = e.target[x.field as string].value;
                          break;
                      }
                    } catch (error) {
                      console.log(x.field);
                    }
                    if (x.castValue) {
                      //@ts-ignore
                      data[x.field] = x.castValue(data[x.field]);
                    }
                  });
                handleCreate({
                  variables: {
                    input: formatSubmit ? formatSubmit(data) : data,
                  },
                }).then((x) => {
                  refetch();
                  console.log(x);
                  if (x.errors) {
                    for (const err of x.errors) {
                      const { validation } = err.extensions;
                      Object.keys(validation ?? {}).forEach((e) => {
                        validation[e].forEach(toast.error);
                      });
                    }
                  } else {
                    toast.success(`Berhasil membuat ${label} baru`);
                    setOpenModal(false);
                  }
                });
              }}
            >
              <Grid container spacing={1}>
                {editable
                  .filter((e) => e.createable != false)
                  .map((e) => {
                    switch (e.type) {
                      case "boolean":
                        return (
                          <Grid item xs={6}>
                            <FormGroup key={e.field as string}>
                              <FormControlLabel
                                control={<Checkbox name={e.field as string} />}
                                label={e.headerName}
                              />
                            </FormGroup>
                          </Grid>
                        );
                      case "select":
                        return (
                          <Grid item xs={6} key={e.field as string}>
                            <SelectBase
                              selects={e.selects ?? []}
                              //@ts-ignore
                              onChange={(x) => {
                                e.onChange && e.onChange(x);
                              }}
                              headerName={e.headerName as string}
                              field={e.field}
                            />
                          </Grid>
                        );
                      case "dateTime":
                        return (
                          <Grid item xs={6} key={e.field as string}>
                            <DateTimeInput
                              field={e.field}
                              name={e.field as string}
                              headerName={e.headerName as string}
                            />
                          </Grid>
                        );
                      default:
                        return (
                          <Grid item xs={6} key={e.field as string}>
                            <TextField
                              sx={{ width: "100%" }}
                              label={e.headerName}
                              //@ts-ignore
                              name={e.field as string}
                              variant="outlined"
                            />
                          </Grid>
                        );
                    }
                  })}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    startIcon={<SaveIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grow>
        </Box>
      </Modal>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: 2,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          {label}
        </Typography>

        {actions?.includes("create") && (
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Buat {label} Baru
          </Button>
        )}
      </Box>

      <div style={{ height: "80vh", width: "100%" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {compiledColumns.map((e) => (
                  <TableCell key={e.field}>{e.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <CircularProgress />}
              {edges?.map((row, i) => (
                <TableRow
                  key={`${row?.node?.id}-${i}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {compiledColumns.map((e) => (
                    <TableCell key={`${row?.node?.id}-${e.field}`}>
                      {e.renderCell
                        ? e.renderCell(row?.node)
                        : get(row.node, e.field)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            sx={{ width: "50%" }}
            variant="contained"
            onClick={() => nextOrPrev("prev")}
          >
            PREVIOUS
          </Button>
          <Button
            sx={{ width: "50%" }}
            variant="contained"
            onClick={() => nextOrPrev("next")}
          >
            NEXT
          </Button>
        </Box>
      </div>
    </>
  );
}
