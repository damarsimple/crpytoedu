import { gql } from "@apollo/client";
import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { CorePageInfoField } from "../../fragments/fragments";
import {
  selectExtractor,
  selectObjectExtractor,
} from "../../helpers/formatters";
import usePlaces from "../../hooks/usePlaces";
import { Classroom, ClassroomStatus } from "../../types/type";
import { find } from "lodash";
import { Box, Button, Modal } from "@mui/material";
import EventMapEditor from "../../components/EventMediaEditor";
import EventTrainerEditor from "../../components/EventTrainerEditor";

export default function Index() {
  const { provinces, cities, districts, setCity, setProvince } = usePlaces({});

  const [editMap, setEditMap] = useState("");
  const [editTrainer, setEditTrainer] = useState("");

  return (
    <DashboardLayout>
      <Modal open={Boolean(editMap)} onClose={() => setEditMap("")}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <EventMapEditor id={editMap} />
        </Box>
      </Modal>
      <Modal open={Boolean(editTrainer)} onClose={() => setEditTrainer("")}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            boxShadow: 24,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <EventTrainerEditor id={editTrainer} />
        </Box>
      </Modal>
      <TableLoader<Classroom>
        columns={[
          { field: "id", headerName: "ID" },
          { field: "name", headerName: "Judul Acara", editable: true },
          { field: "address", headerName: "Alamat", editable: true },
          {
            field: "begin_at",
            headerName: "Mulai Pada",
            editable: true,
            type: "dateTime",
          },
          {
            field: "finish_at",
            headerName: "Selesai Pada",
            editable: true,
            type: "dateTime",
          },
          {
            field: "max_join",
            headerName: "Max Peserta",
            type: "number",
            editable: true,
          },

          {
            field: "province_id",
            headerName: "Provinsi",
            type: "select",
            hide: true,
            editable: true,
            selects: provinces.map(selectExtractor),
            valueGetter: (e) => find(provinces, { id: e.value })?.name ?? "",
            //@ts-ignore
            onChange: (e) => setProvince({ id: e }),
          },
          {
            field: "city_id",
            headerName: "Kota / Kabupaten",
            type: "select",
            editable: true,
            selects: cities.map(selectExtractor),
            valueGetter: (e) => find(cities, { id: e.value })?.name ?? "",
            //@ts-ignore
            onChange: (e) => setCity({ id: e }),
          },
          {
            field: "district_id",
            headerName: "Kecamatan / Kelurahan",
            type: "select",
            editable: true,
            selects: districts.map(selectExtractor),
            valueGetter: (e) => find(districts, { id: e.value })?.name ?? "",
          },
          {
            field: "status",
            headerName: "Status",
            type: "select",
            editable: true,
            selects: selectObjectExtractor(ClassroomStatus),
            createable: false,
          },
          {
            headerName: "Alasan Penolakan",
            field: "rejected_reason",
            editable: true,
            createable: false,
          },
          {
            field: "description",
            editable: true,
            headerName: "Deskripsi",
          },
        ]}
        label="Ruang Kelas"
        actions={["edit", "delete", "create", "custom"]}
        formatSubmit={(e) => {
          for (const key in e) {
            //@ts-ignore
            if (!e[key]) delete e[key];
          }
          return e;
        }}
        getQuery={gql`
          ${CorePageInfoField}
          query GetClassrooms($name: String, $first: Int!, $after: String) {
            classrooms(name: $name, first: $first, after: $after) {
              edges {
                node {
                  id
                  name
                  status
                  rejected_reason
                  description
                  address
                  begin_at
                  finish_at
                  max_join
                  province_id
                  city_id
                  district_id
                  cover {
                    id
                    path
                  }
                  map {
                    id
                    path
                  }
                  thumbnail {
                    id
                    path
                  }
                  user {
                    id
                    name
                  }
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        fields={"classrooms"}
        updateQuery={gql`
          mutation UpdateClassroomMutation($id: ID!, $input: UpdateClassroom!) {
            updateClassroom(id: $id, input: $input) {
              id
            }
          }
        `}
        createQuery={gql`
          mutation CreateClassroomMutation($input: CreateClassroom!) {
            createClassroom(input: $input) {
              id
            }
          }
        `}
        deleteQuery={gql`
          mutation DeleteClassroomMutation($id: ID!) {
            deleteClassroom(id: $id) {
              id
            }
          }
        `}
        customColumns={[
          {
            field: "trainer",
            headerName: "Trainer",
            renderCell: (e) => (
              <>
                <Button
                  variant="contained"
                  onClick={() => setEditTrainer(e.api.getCellValue(e.id, "id"))}
                >
                  Trainer
                </Button>
              </>
            ),
          },
          {
            field: "cover",
            headerName: "Cover dan Map",
            renderCell: (e) => (
              <>
                <Button
                  variant="contained"
                  onClick={() => setEditMap(e.api.getCellValue(e.id, "id"))}
                >
                  Cover
                </Button>
              </>
            ),
          },
        ]}
      />
    </DashboardLayout>
  );
}
