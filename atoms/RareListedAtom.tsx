import { atom } from "recoil";

export const rareListedState = atom({
  key: "rareListedState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
