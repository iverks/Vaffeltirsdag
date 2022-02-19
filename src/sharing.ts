import type { Writable } from "svelte/store";
import { forsteko, nteko, counter } from "./stores";

function getFromStore(store: Writable<any>) {
  let val: any;
  store.subscribe(($) => {
    val = $;
  });
  return val;
}

export function createJSONObject(): string {
  const forste = getFromStore(forsteko);
  const nte = getFromStore(nteko);
  const count = getFromStore(counter);
  return JSON.stringify([forste, nte, count]);
}

export function importFromJSONObject(obj: string) {
  const [forste, nte, count] = JSON.parse(obj);
  forsteko.set(forste);
  nteko.set(nte);
  counter.set(count);
}
