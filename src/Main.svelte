<script lang="ts">
  import { flip } from "svelte/animate";
  import { send, receive } from "./animations";
  import { tweened } from "svelte/motion";
  import { forsteko, nteko, counter } from "./stores";
  import {
    generateUniqueIdFromString,
    removeSpecialChars,
  } from "./helperFunctions";
  import { createJSONObject, importFromJSONObject } from "./sharing";
  import { cubicOut } from "svelte/easing";
  import type { TiministForsteko, TiministNteko } from "./TiministInterface";
  import Dialog from "./Dialog.svelte";
  import ExportPopup from "./ExportPopup.svelte";
  import { getContext } from "svelte";

  const { open } = getContext("simple-modal");

  const transformed = tweened(0, {
    duration: 100,
    easing: cubicOut,
  });

  function shake() {
    transformed
      .set(-1)
      .then(() => transformed.set(2))
      .then(() => transformed.set(-4))
      .then(() => transformed.set(4))
      .then(() => transformed.set(0));
  }
  function handleInput(input: HTMLInputElement): void {
    let navn: string = input.value;
    navn = navn.toLocaleLowerCase();
    navn = removeSpecialChars(navn);
    if (["n", "next"].includes(navn)) {
      next(input);
    } else if (["s", "skip"].includes(navn)) {
      if (skip()) {
        input.value = "";
      }
    } else if (["reset"].includes(navn)) {
      reset(input);
    } else if (["export"].includes(navn)) {
      eksporter(input);
    } else if (["import"].includes(navn)) {
      importer(input);
    } else if (["penis"].includes(navn)) {
      penis(input);
    } else {
      add(input);
    }
  }

  function add(input: HTMLInputElement): void {
    let navn: string = input.value;
    navn = navn.toLowerCase();
    navn = removeSpecialChars(navn);
    const id = generateUniqueIdFromString(navn);
    if ($forsteko.filter((timinist) => timinist.navn === navn).length == 0) {
      $counter = [...$counter, { navn: navn, vaffelcount: 0, id }];
      $forsteko = [...$forsteko, { navn: navn, erIKo: true, id }];
      input.value = "";
    } else if (
      $nteko.filter((timinist) => timinist.navn == navn).length == 0 &&
      $forsteko.filter((timinist) => timinist.navn === navn)[0].erIKo === false
    ) {
      $nteko = [...$nteko, { navn: navn, id }];
      input.value = "";
    } else {
      shake();
    }
  }

  function next(input: HTMLInputElement) {
    let popped: TiministForsteko | TiministNteko;
    if ($forsteko.filter((timinist) => timinist.erIKo).length > 0) {
      const idx = $forsteko.findIndex((timinist) => timinist.erIKo);
      $forsteko[idx].erIKo = false;
      popped = $forsteko[idx];
      $forsteko = $forsteko;
    } else if ($nteko.length > 0) {
      popped = $nteko.splice(0, 1)[0];
      $nteko = $nteko;
    } else {
      shake();
      return;
    }
    $counter.at(
      $counter.findIndex((timinist) => timinist.navn == popped.navn)
    ).vaffelcount += 1;
    $counter = $counter;
    input.value = "";
  }

  function skip(): boolean {
    if ($forsteko.filter((timinist) => timinist.erIKo).length > 0) {
      const idx = $forsteko.findIndex((timinist) => timinist.erIKo);
      const name = $forsteko[idx].navn;
      $forsteko.splice(idx, 1);
      const countidx = $counter.findIndex((timinist) => timinist.navn == name);
      $counter.splice(countidx, 1);
      $forsteko = $forsteko;
      $counter = $counter;
    } else if ($nteko.length > 0) {
      $nteko.splice(0, 1);
      $nteko = $nteko;
    } else {
      shake();
      return false;
    }
    return true;
  }

  function skipById(id: number, ko: string) {
    if (ko === "forste") {
      const idx = $forsteko.findIndex((timinist) => timinist.id == id);
      $forsteko.splice(idx, 1);
      const countidx = $counter.findIndex((timinist) => timinist.id == id);
      $counter.splice(countidx, 1);
      $forsteko = $forsteko;
      $counter = $counter;
    } else if (ko === "nte") {
      const idx = $nteko.findIndex((timinist) => timinist.id == id);
      $nteko.splice(idx, 1);
      $nteko = $nteko;
    }
  }

  function reset(input: HTMLInputElement): void {
    $forsteko = [];
    $nteko = [];
    $counter = [];
    input.value = "";
  }

  function increment(tiministid: number): void {
    const idx = $counter.findIndex((timinist) => timinist.id == tiministid);
    if (idx != -1 && $counter[idx]) {
      $counter[idx].vaffelcount += 1;
      $counter = $counter;
    }
  }

  function decrement(tiministid: number): void {
    const idx = $counter.findIndex((timinist) => timinist.id == tiministid);
    if (idx != -1 && $counter[idx].vaffelcount > 0) {
      $counter[idx].vaffelcount -= 1;
      $counter = $counter;
    }
  }

  function eksporter(input: HTMLInputElement) {
    const obj = createJSONObject();
    navigator.clipboard.writeText(obj);
    input.value = "";
  }

  function importer(input: HTMLInputElement) {
    navigator.clipboard.readText().then((obj) => importFromJSONObject(obj));
    input.value = "";
  }

  function penis(input: HTMLInputElement) {
    document.getElementById("penis").style.display =
      document.getElementById("penis").style.display === "none"
        ? "block"
        : "none";
    input.value = "";
  }

  const onCancel = () => {};

  const onOkayImport = (text: string) => {
    importFromJSONObject(text);
  };

  const showImport = () => {
    open(
      Dialog,
      {
        message: "Lim inn JSON-objekt",
        hasForm: true,
        onCancel,
        onOkay: onOkayImport,
      },
      {
        closeButton: true,
        closeOnEsc: true,
        closeOnOuterClick: true,
      }
    );
  };

  const showExport = () => {
    open(ExportPopup, {
      object: createJSONObject(),
    });
  };
</script>

<svelte:head>
  <title>Vaffeltirsdag</title>
</svelte:head>

<div id="penis" style="display: none; position: absolute; top: 0; left: 0;">
  <img src="penis.jpg" alt="penis" width="33%" />
</div>

<div class="board">
  <div class="input-wrapper">
    <input
      class="new-timinist"
      placeholder="<navn> eller en av next, skip, reset, import, export"
      style={"transform: translate3d(" + $transformed + "px, 0, 0)"}
      on:keydown={(event) =>
        event.key === "Enter" && handleInput(event.currentTarget)}
    />

    <button on:click={showImport} class="import"> Import </button>
    <button on:click={showExport} class="export"> Export </button>
  </div>

  <div class="column-wrapper">
    <div class="column">
      <h2>Første-kø</h2>
      {#each $forsteko.filter((t) => t.erIKo) as timinist (timinist.id)}
        <div class="label" animate:flip>
          {timinist.navn}
          <button
            class="delete"
            on:click={() => skipById(timinist.id, "forste")}>x</button
          >
        </div>
      {/each}
    </div>

    <div class="column">
      <h2>Nte-kø</h2>
      {#each $nteko as timinist (timinist.id)}
        <div
          class="label"
          in:receive={{ key: timinist.id }}
          out:send={{ key: timinist.id }}
          animate:flip
        >
          {timinist.navn}
          <button class="delete" on:click={() => skipById(timinist.id, "nte")}
            >x</button
          >
        </div>
      {/each}
    </div>

    <div class="column">
      <h2>Opptelling</h2>
      {#each $counter.sort((a, b) => b.vaffelcount - a.vaffelcount) as timinist (timinist.id)}
        <div
          class="label"
          in:receive={{ key: timinist.id }}
          out:send={{ key: timinist.id }}
          animate:flip
        >
          {timinist.navn}: {timinist.vaffelcount}
          <button class="increment" on:click={() => increment(timinist.id)}
            >+</button
          >
          <button class="decrement" on:click={() => decrement(timinist.id)}
            >-</button
          >
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: row;
    height: min-content;
    margin: 2em 0 1em 0;
  }

  .new-timinist {
    font-size: 1.4em;
    width: 1fr;
    flex-grow: 1;
    margin: auto 0.5em auto 0;
  }

  .import,
  .export {
    margin: auto 0;
    flex-grow: 0;
    height: fit-content;
    margin: auto 0.1em;
  }

  .board {
    max-width: 48em;
    margin: 0 auto;
  }

  .column-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .column {
    flex-shrink: 1;
    float: left;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
  }

  .label {
    top: 0;
    left: 0;
    display: block;
    font-size: 1em;
    line-height: 1;
    padding: 0.5em;
    margin: 0 auto 0.5em auto;
    border-radius: 2px;
    background-color: #eee;
    text-transform: capitalize;
  }

  input {
    margin: 0;
  }

  button.delete {
    float: right;
    height: 1em;
    box-sizing: border-box;
    padding: 0 0.5em;
    line-height: 1;
    background-color: transparent;
    border: none;
    color: rgb(170, 30, 30);
    opacity: 0;
    transition: opacity 0.2s;
  }

  button.increment,
  button.decrement {
    float: right;
    height: 1em;
    box-sizing: border-box;
    padding: 0 0.5em;
    line-height: 1;
    background-color: transparent;
    border: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .label:hover button {
    opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    .label {
      background-color: #333;
    }

    button.delete {
      color: rgb(200, 30, 30);
      font-weight: bold;
    }
  }
</style>
