import { atom } from "recoil";

export const commonListedState = atom({
  key: "commonListedState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
