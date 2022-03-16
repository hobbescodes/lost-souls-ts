import { atom } from "recoil";

export const showListedState = atom({
  key: "showListedState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
