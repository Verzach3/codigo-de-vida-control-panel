import {
  ActionIcon,
  Affix,
  createStyles,
  Modal,
  Pagination,
  SegmentedControl,
  Table,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPrinter,
  IconSearch,
} from "@tabler/icons";
import pocketbaseEs, { Record } from "pocketbase";
import React, { createRef, useEffect, useState } from "react";
import { SERVER_URL } from "../State";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },

  active: {
    backgroundImage: theme.fn.gradient({ from: "pink", to: "orange" }),
  },

  control: {
    border: "0 !important",
  },

  labelActive: {
    color: `${theme.white} !important`,
  },
}));
function Logs() {
  const [logs, setLogs] = React.useState<any>();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  async function getLogs() {
    const client = new pocketbaseEs(SERVER_URL);
    const logs = await client.records.getList("registros", page, 30, {
      sort: "-created"
    });
    setLogs(logs);
    setTotal(logs.totalPages);
    console.log(logs);
  }

  useEffect(() => {
    getLogs();
    return () => {};
  }, [page]);

  const rows = logs?.items?.map((element: any) => (
    <tr key={element.id}>
      <td>{element.email_usuario}</td>
      <td>{element.cedula_paciente}</td>
      <td>{element.cliente}</td>
      <td>{element.desde}</td>
      <td>{element.created}</td>
    </tr>
  ));

  return (
    <>
      <div style={{ justifyContent: "center" }}></div>
      <Table>
        <thead>
          <tr>
            <th>Email Usuario</th>
            <th>Cédula Paciente</th>
            <th>Cliente</th>
            <th>Desde</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Affix position={{ bottom: 80, right: 20 }}>
        <ActionIcon variant="filled" radius={"xl"} size="xl" onClick={() => {
          window.open(`${SERVER_URL}:4000/logs/1`, "_blank");
        }}>
          <IconPrinter size={30} />
        </ActionIcon>
      </Affix>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Pagination total={total} onChange={(val) => setPage(val)} />
      </Affix>
    </>
  );
}

export default Logs;
