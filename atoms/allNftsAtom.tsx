import { atom } from "recoil";

export const allNftsState = atom({
  key: "allNftsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
