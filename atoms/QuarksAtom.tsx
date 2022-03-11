import { atom } from "recoil";

export const totalQuarksState = atom({
  key: "totalQuarksState", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});
