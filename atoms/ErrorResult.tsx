import { atom } from "recoil";

export const errorResultState = atom({
  key: "errorResultState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
