import { atom } from "recoil";

export const superRareListedState = atom({
  key: "superRareListedState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
