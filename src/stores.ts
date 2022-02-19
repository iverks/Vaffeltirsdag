import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type {
  TiministForsteko,
  TiministNteko,
  TiministCounter,
} from "./TiministInterface";

const storedForsteko: TiministForsteko[] =
  JSON.parse(localStorage.getItem("forsteko")) || [];
export const forsteko: Writable<TiministForsteko[]> = writable(storedForsteko);
forsteko.subscribe((value) => {
  localStorage.setItem("forsteko", JSON.stringify(value));
});

const storedNteko: TiministNteko[] =
  JSON.parse(localStorage.getItem("nteko")) || [];
export const nteko: Writable<TiministNteko[]> = writable(storedNteko);
nteko.subscribe((value) => {
  localStorage.setItem("nteko", JSON.stringify(value));
});

const storedCounter: TiministCounter[] =
  JSON.parse(localStorage.getItem("counter")) || [];
export const counter: Writable<TiministCounter[]> = writable(storedCounter);
counter.subscribe((value) => {
  localStorage.setItem("counter", JSON.stringify(value));
});
