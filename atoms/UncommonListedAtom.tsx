import { atom } from "recoil";

export const uncommonListedState = atom({
  key: "uncommonListedState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
