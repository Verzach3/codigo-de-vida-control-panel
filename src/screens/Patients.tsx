import {
  Avatar,
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  ScrollArea,
  SegmentedControl,
  Affix,
} from "@mantine/core";
import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
  IconQrcode,
  IconPlus,
} from "@tabler/icons";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";
import QrCode, { toBuffer, toCanvas, toDataURL, toString } from "qrcode";
import { InputWithButton } from "../components/InputWithButton";
import { SERVER_URL } from "../State";
import { downloadBlob } from "../util/DownloadBlob";

export type PatientData = {
  id: string;
  nombres: string;
  apellidos: string;
  edad: string;
  cedula: string;
  telefono: string;
  direccion: string;
  sangre: string;
  historia: string;
  nombres_acudiente: string;
  apellidos_acudiente: string;
  telefono_acudiente: string;
  cedula_acudiente: string;
  direccion_acudiente: string;
};

export function Patients() {
  const client = new pocketbaseEs(SERVER_URL);
  const [data, setData] = useState<PatientData[]>([]);
  const [maxPerPage, setMaxPerPage] = useState(30);
  const [page, setPage] = useState(1);
  async function updatePatients() {
    try {
      setData(
        (await client.records.getList("pacientes", page, maxPerPage))
          .items as unknown as PatientData[]
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    updatePatients();
    return () => {};
  }, [page, maxPerPage]);

  const rows = data.map((item) => (
    <tr key={item.id}>
      <td>
        <Group spacing="sm">
          <div>
            <Text size="sm" weight={500}>
              {item.nombres} {item.apellidos}
            </Text>
            <Text color="dimmed" size="xs">
              {item.cedula}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text size="sm">{item.direccion}</Text>
        <Text size="xs" color="dimmed">
          Direccion
        </Text>
      </td>
      <td>
        <Text size="sm">{item.edad}</Text>
        <Text size="xs" color="dimmed">
          Edad
        </Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <Menu transition="pop" withArrow position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconMessages size={16} stroke={1.5} />}>
                Send message
              </Menu.Item>
              <Menu.Item icon={<IconNote size={16} stroke={1.5} />}>
                Add note
              </Menu.Item>
              <Menu.Item
                icon={<IconQrcode size={16} stroke={1.5} />}
                onClick={async () => {
                  const svg = toString(item.id);
                  const blob = new Blob([await svg], { type: "image/svg+xml" });
                  downloadBlob("qrcode.svg", blob);
                }}
              >
                Descargar Qr
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size={16} stroke={1.5} />}
                color="red"
                onClick={() => {
                  client.records.delete("pacientes", item.id);
                  updatePatients();
                }}
              >
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <div>
      <InputWithButton />

      <Text size="xl" weight={500} style={{ marginTop: 20 }}>
        Maximo por pagina
      </Text>
      <SegmentedControl
        data={[
          { label: "30", value: "30" },
          { label: "50", value: "50" },
          { label: "100", value: "100" },
          { label: "500", value: "500" },
        ]}
        onChange={(value) => setMaxPerPage(parseInt(value))}
        />
        <Text size="xl" weight={500} style={{ marginTop: 20 }}>
        Pagina
      </Text>

      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <Affix position={{ bottom: 20, right: 20 }}>
        <ActionIcon variant="filled" radius="xl" size={40}>
          <IconPlus/>
        </ActionIcon>
      </Affix>
    </div>
  );
}

export default Patients;
