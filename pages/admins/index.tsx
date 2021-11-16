import { gql, useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Divider,
  Box,
  Icon,
  Tab,
  Tabs,
  Autocomplete,
  TextField,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import ChartWrapper from "../../components/Charts/ChartWrapper";
import DashboardLayout from "../../components/DashboardLayout";
import TableLoader from "../../components/TableLoader";
import { getRange } from "../../helpers/date";
import { selectObjectExtractor } from "../../helpers/formatters";
import usePlaces from "../../hooks/usePlaces";
import {
  Category,
  Classroom,
  DashboardData,
  Roles,
  User,
} from "../../types/type";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

export default function Index() {
  const { push } = useRouter();

  const [tabs, setTabs] = useState(0);

  const {
    setCity,
    setDistrict,
    setProvince,
    province,
    city,
    district,
    districts,
    provinces,
    cities,
  } = usePlaces({});

  const [selectedRoles, setSelectedRoles] = useState<Roles | undefined>(
    undefined
  );

  const { data } = useQuery<{ usersAll: User[] }>(
    gql`
      query UsersAll(
        $province_id: ID
        $city_id: ID
        $district_id: ID
        $roles: Roles
      ) {
        usersAll(
          province_id: $province_id
          city_id: $city_id
          district_id: $district_id
          roles: $roles
        ) {
          id
          name
          created_at
        }
      }
    `,
    {
      variables: {
        city_id: city?.id,
        district_id: district?.id,
        province_id: province?.id,
        roles: selectedRoles,
      },
    }
  );

  const { data: cData } = useQuery<{ classroomsAll: Classroom[] }>(
    gql`
      query ClassroomsAll($province_id: ID, $city_id: ID, $district_id: ID) {
        classroomsAll(
          province_id: $province_id
          city_id: $city_id
          district_id: $district_id
        ) {
          id
          name
          created_at
        }
      }
    `,
    {
      variables: {
        city_id: city?.id,
        district_id: district?.id,
        province_id: province?.id,
      },
    }
  );

  const reduced = data?.usersAll?.reduce((acc, curr) => {
    const date = moment(curr.created_at).format("DD-M");

    if (acc[date]) {
      return { ...acc, [date]: acc[date] + 1 };
    } else {
      return { ...acc, [date]: 1 };
    }
  }, {} as { [key: string]: number });

  const reduced2 = cData?.classroomsAll?.reduce((acc, curr) => {
    const date = moment(curr.created_at).format("DD-M");

    if (acc[date]) {
      return { ...acc, [date]: acc[date] + 1 };
    } else {
      return { ...acc, [date]: 1 };
    }
  }, {} as { [key: string]: number });

  const { data: { getDashboardData } = {}, loading } = useQuery<{
    getDashboardData: DashboardData;
  }>(gql`
    query GetDashboardData {
      getDashboardData {
        unpaid_user
        event_submission
        event_ongoing
        member
        trainer
        video
      }
    }
  `);

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Grid container spacing={1}>
          {[
            {
              name: "Verifikasi Pembayaran User",
              content: getDashboardData?.unpaid_user,
              url: "/admins/members?tabs=1",
              icon: "payments",
            },
            {
              name: "Pengajuan Acara",
              content: getDashboardData?.event_submission,
              url: "/admins/events?tabs=1",
              icon: "event",
            },
            {
              name: "Acara Aktif",
              content: getDashboardData?.event_ongoing,
              url: "/admins/events",
              icon: "event_available",
            },
            {
              name: "Video",
              content: getDashboardData?.video,
              url: "/videos",
              icon: "videocam",
            },
            {
              name: "Member",
              content: getDashboardData?.member,
              url: "/admins/members",
              icon: "person",
            },
            {
              name: "Trainer",
              content: getDashboardData?.trainer,
              url: "/admins/members",
              icon: "supervisor_account",
            },
          ].map((e) => (
            <Grid item xs={6} md={4} lg={2} key={e.url}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ textAlign: "right" }}
                  >
                    <Box>
                      <Icon sx={{ fontSize: 50 }}>{e.icon}</Icon>
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {e.name}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {e.content}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" onClick={() => push(e.url)}>
                    Buka
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabs} onChange={(_, i) => setTabs(i)}>
            <Tab label="Perkembangan User" />
            <Tab label="Perkembangan Acara" />
          </Tabs>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Autocomplete
                options={provinces?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                fullWidth
                onChange={(_, v) => v?.rest && setProvince(v.rest)}
                renderInput={(params) => (
                  <TextField {...params} label="Provinsi" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                options={cities?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                fullWidth
                onChange={(_, v) => v?.rest && setCity(v.rest)}
                renderInput={(params) => (
                  <TextField {...params} label="Kota / Kabupaten" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                options={districts?.map((e) => ({
                  label: e.name,
                  id: e.id,
                  rest: e,
                }))}
                fullWidth
                onChange={(_, v) => v?.rest && setDistrict(v.rest)}
                renderInput={(params) => (
                  <TextField {...params} label="Kecamatan / Kelurahan" />
                )}
              />
            </Grid>
            {/* <Grid item xs={4}>
              <Autocomplete
                options={[
                  { label: "Perminggu" },
                  { label: "Perbulan" },
                  { label: "Per Tahun" },
                ]}
                fullWidth
                // onChange={(_, v) => v?.rest && setDistrict(v.rest)}
                renderInput={(params) => (
                  <TextField {...params} label="Periode" />
                )}
              />
            </Grid> */}

            {/* <Grid item xs={4}>
              <DesktopDatePicker
                label="Dari Tanggal"
                inputFormat="MM/dd/yyyy"
                // value={value}
                // onChange={handleChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={4}>
              <DesktopDatePicker
                label="Sampai Tanggal"
                inputFormat="MM/dd/yyyy"
                // value={value}
                // onChange={handleChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid> */}
            {tabs == 0 && (
              <Grid item xs={4}>
                <Autocomplete
                  options={selectObjectExtractor(Roles).map((e) => ({
                    ...e,
                  }))}
                  fullWidth
                  onChange={(_, v) => setSelectedRoles(v?.value as Roles)}
                  renderInput={(params) => (
                    <TextField {...params} label="Roles" />
                  )}
                />
              </Grid>
            )}
          </Grid>
          <ChartWrapper
            options={{
              chart: {
                height: 350,
                type: "line",
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: "straight",
              },
              title: {
                text: tabs == 0 ? "Perkembangan User" : "Perkembangan Acara",
                align: "left",
              },
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                  opacity: 0.5,
                },
              },
              xaxis: {
                categories: getRange(
                  moment().subtract(1, "month").toDate(),
                  moment().add(2, "days").toDate(),
                  "days"
                ).map((e) => e.format("DD-M")),
              },
            }}
            series={[
              {
                name: tabs == 0 ? "User" : "Acara",
                data: getRange(
                  moment().subtract(1, "month").toDate(),
                  moment().add(2, "days").toDate(),
                  "days"
                ).map((e) =>
                  tabs == 0
                    ? reduced
                      ? reduced[e.format("DD-M")] ?? 0
                      : 0
                    : reduced2
                    ? reduced2[e.format("DD-M")] ?? 0
                    : 0
                ),
              },
            ]}
            type="line"
            height={600}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
