import { Group, TextInput, Select, Button, ActionIcon } from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { AdvancedFilters } from "./advenced-filters";
import { useFilterStore } from "../store/filter-store"; // 👈 Импортируем стор

const BRANCHES = [
  "ОРЗУМЕД ЗАНГИОТА",
  "ОРЗУМЕД ЮНУСОБОД",
  "ОРЗУМЕД ФОТИМА СУЛТОН",
  "ОРЗУМЕД ПАРКЕНТ",
  "ОРЗУМЕД ЯНГИБОЗОР",
  "ОРЗУМЕД ОКККУРГОН",
  "ОРЗУМЕД ЧИНОЗ",
];

export const FilterBar = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { search, setSearch, selectedBranches, setBranches, getActiveCount } =
    useFilterStore();

  const activeFilters = getActiveCount();

  const currentBranch =
    selectedBranches.length === 1 ? selectedBranches[0] : null;

  const handleBranchChange = (val: string | null) => {
    if (val) {
      setBranches([val]);
    } else {
      setBranches([]);
    }
  };

  return (
    <>
      <Group justify="space-between" align="flex-end" wrap="nowrap">
        <Group grow style={{ flex: 1 }}>
          <TextInput
            placeholder="Bemor ismi yoki telefon raqami bo'yicha qidirish"
            leftSection={<IconSearch size={16} />}
            radius="md"
            value={search} // 👈 Связываем Value
            onChange={(e) => setSearch(e.currentTarget.value)} // 👈 Связываем Change
            rightSection={
              search ? (
                <ActionIcon variant="transparent" onClick={() => setSearch("")}>
                  <IconX size={14} />
                </ActionIcon>
              ) : null
            }
          />
          <Select
            placeholder="Barcha filiallar"
            data={BRANCHES}
            radius="md"
            value={currentBranch}
            onChange={handleBranchChange}
            clearable
            style={{ maxWidth: 250 }}
          />
        </Group>

        <Button
          leftSection={<IconFilter size={18} />}
          onClick={open}
          radius="md"
          variant={activeFilters > 0 ? "filled" : "light"}
          color="blue"
          px="xl"
        >
          Filterlash {activeFilters > 0 && `(${activeFilters})`}
        </Button>
      </Group>

      <AdvancedFilters opened={opened} onClose={close} />
    </>
  );
};
