import { SelectValue } from "../types/type";

export const wildCardFormatter = (e: string) => "%" + e + "%";

export const formatCurrency = (e: number | undefined | null) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    e ?? 0
  );

export const selectExtractor = (e: {
  id: string;
  name: string;
}): SelectValue => {
  return { label: e.name, value: e.id };
};

export const stringArrtoSelect = (e: string[]): SelectValue[] => {
  return e.map((e) => {
    return {
      label: e,
      value: e,
    };
  });
};

export const selectObjectExtractor = (e: object) =>
  Object.keys(e).map((x) => {
    //@ts-ignore
    return { label: e[x] as string, value: e[x] as string };
  });

export const BOOLEAN_SELECT_VALUE: SelectValue[] = [
  {
    label: "Ya",
    value: "true",
  },
  {
    label: "Tidak",
    value: "False",
  },
];
