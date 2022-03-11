import { atom } from "recoil";

export const nftsState = atom({
  key: "nftsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
