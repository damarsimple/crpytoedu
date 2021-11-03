import React from "react";
import moment from "moment";
import DashboardLayout from "../../components/DashboardLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, gql } from "@apollo/client";
import { Classroom } from "../../types/type";

const localizer = momentLocalizer(moment);

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useRouter } from "next/dist/client/router";

export default function events() {
  const { data: { myEvents } = {} } = useQuery<{ myEvents: Classroom[] }>(
    gql`
      query Query {
        myEvents {
          id
          name
          begin_at
          finish_at
        }
      }
    `
  );

  const { push } = useRouter();

  return (
    <DashboardLayout>
      <Calendar
        localizer={localizer}
        onSelectEvent={console.log}
        events={myEvents?.map(({ name, begin_at, finish_at }) => ({
          title: name,
          start: moment(begin_at).toDate(),
          end: moment(finish_at).toDate(),
          // resource?: any,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Judul Acara</TableCell>
              <TableCell align="right">Mulai</TableCell>
              <TableCell align="right">Selesai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myEvents?.map(({ name, begin_at, finish_at }) => (
              <TableRow
                key={name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell align="right">{moment(begin_at).format()}</TableCell>
                <TableCell align="right">
                  {moment(finish_at).format()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {myEvents?.length == 0 && (
        <Button fullWidth onClick={() => push("/members")}>
          Anda belum bergabung dengan acara. Cari acara?
        </Button>
      )}
    </DashboardLayout>
  );
}
