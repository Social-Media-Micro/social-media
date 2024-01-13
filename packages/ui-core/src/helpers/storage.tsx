import { Dispatch, SetStateAction } from "react";

export interface UseStorageProps {
  useStorage: (
    key: string,
    intialValue: string
  ) => [string, Dispatch<SetStateAction<string | undefined>>];
}
