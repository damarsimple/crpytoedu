import React, { ChangeEvent, ChangeEventHandler } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
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

export interface ConnectionNode<T> {
  node: T;
  cursor: string;
}

export interface ConnectionData<T> {
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
}: {
  headerName: string;
  field: string;
  name?: string;
  selects?: SelectValue[];
  onChange?: (e: string) => void;
}) {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FormControl fullWidth>
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
}: {
  headerName: string;
  field: string;
  name?: string;
}) {
  const [value, setValue] = useState<Date | null>(null);

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

export default function TableLoader<T>({
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

  const { data, loading, error, refetch } = useQuery(getQuery, {
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

  const actionColumn: GridColDef[] = [
    {
      field: "edit",
      headerName: "Edit",
      type: "number",
      flex: 1,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [onEdit, setOnEdit] = useState(false);

        const setEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;

          editableFields.reverse().forEach((e) => {
            if (editableFields[0] == e) {
              api.setCellFocus(params.id, e);
            }
            api.setCellMode(params.id, e, "edit");
          });

          setOnEdit(!onEdit);
        };

        const setSaveMode = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;

          // api.setRowMode(params.id, "view");
          const data = {};

          editableFields.forEach((e) => {
            try {
              api.commitCellChange({
                field: e,
                id: params.id,
              });
            } catch (error) {}
          });
          editableFields.forEach((e) => {
            //@ts-ignore
            data[e] = api.getCellValue(params.id, e);
            api.setCellMode(params.id, e, "view");
          });

          setOnEdit(!onEdit);

          refetch();

          handleUpdate({
            variables: {
              id: params.id,
              input: formatSubmit ? formatSubmit(data) : data,
            },
          }).then(() => {
            toast.success(`Berhasil mengedit data ${label}`);
            refetch();
          });
        };

        return onEdit ? (
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={setSaveMode}
          >
            Save
          </Button>
        ) : (
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={setEditMode}
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
  const compiledColumns: GridColDef[] = [
    ...definedColumns,
    ...(actions?.includes("custom") && customColumns ? customColumns : []),
    ...actionColumn.filter((e) => actions?.includes(e.field as Action)),
  ];
  return (
    <>
      {error && error.message}
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
                      Object.keys(validation).forEach((e) => {
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
        <DataGrid
          className={classes.root}
          rowCount={pageInfo?.total ?? 0}
          rows={edges?.map((e) => e.node) ?? []}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          columns={compiledColumns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onPageChange={(newPage) => {
            const newVar = {
              first: pageSize,
              after:
                page > newPage
                  ? pageInfo.startCursor ?? ""
                  : pageInfo.endCursor ?? "",
            };
            refetch(newVar);
            setPage(page > newPage ? 1 : newPage);
          }}
          rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          components={{
            Toolbar: GridToolbar,
          }}
          filterMode="server"
          paginationMode="server"
          onFilterModelChange={(e, d) => {
            console.log(e.items);
            console.log(d);
          }}
          loading={loading}
        />
      </div>
    </>
  );
}
