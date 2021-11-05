import { useRouter } from "next/dist/client/router";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import EventPages from "../../components/EventPages";

export default function Id() {
  const { query } = useRouter();
  const { id } = query;

  return (
    <DashboardLayout>{id && <EventPages id={id as string} />}</DashboardLayout>
  );
}
