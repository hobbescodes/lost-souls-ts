import { atom } from "recoil";

export const limitState = atom({
  key: "limitState", // unique ID (with respect to other atoms/selectors)
  default: 10, // default value (aka initial value)
});
