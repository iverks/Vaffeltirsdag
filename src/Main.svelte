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
  import AutocompleteListItem from "./AutocompleteListItem.svelte";

  const { open } = getContext("simple-modal");

  let inputValue = "";

  // Typeahead is the suggested text that will be appended to the input value
  let typeahead = "";

  let filteredList = [];

  // To separate the commands from the names, we use additional lists
  let filteredCommands = [];
  let filteredNames = [];

  let selectedIndex = null;
  let inputElement: HTMLInputElement;

  const commands = ["next", "skip", "reset", "export", "import", "penis"];

  // Using reactiveness to remove typeahead after clearing input field and
  // when there are no matches
  $: if (!inputValue) {
    filteredList = [];
    typeahead = "";
  }

  $: if (filteredList.length < 1) {
    typeahead = "";
  }

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

  const selectActive = (item: string) => {
    if (!inputValue) {
      selectedIndex = filteredCommands.indexOf(item);
      inputElement.placeholder = "";
    } else {
      selectedIndex = filteredList.indexOf(item);
    }
    typeahead = item.replace(inputValue.toLowerCase(), "");
  };

  const handleInput = () => {
    let storageArray = [];
    let commandArray = commands;
    let lowerInputValue = inputValue.toLowerCase();

    if (lowerInputValue) {
      commandArray = [];
      commands.forEach((command) => {
        if (command.startsWith(lowerInputValue)) {
          storageArray.push(command);
          commandArray.push(command);
        }
      });
      $forsteko.forEach((person) => {
        if (person.navn.toLowerCase().startsWith(lowerInputValue)) {
          storageArray.push(person.navn);
        }
      });
      $nteko.forEach((person) => {
        if (person.navn.toLowerCase().startsWith(lowerInputValue)) {
          storageArray.push(person.navn);
        }
      });
    }

    filteredCommands = commandArray;
    filteredList = [...new Set(storageArray)];
    filteredNames = filteredList.filter(
      (element) => !commands.includes(element)
    );

    if (filteredList.length > 0) {
      selectedIndex = 0;
      typeahead = filteredList.at(0).replace(inputValue.toLowerCase(), "");
    }
  };

  const handleSubmit = () => {
    const command = inputValue.toLowerCase();

    if (!commands.includes(command)) {
      add();
      return;
    }

    if (command == "skip") {
      if (!skip()) {
        return;
      }
    }

    inputValue = "";

    switch (command) {
      case "next":
        next();
        break;
      case "reset":
        reset();
        break;
      case "export":
        eksporter();
        break;
      case "import":
        importer();
        break;
      case "penis":
        penis();
        break;
    }
  };

  const handleClick = (item: string) => {
    inputValue = item;
    handleInput();
    handleSubmit();
  };

  const handleKeydown = (e: any) => {
    if (e.key === "Enter") {
      if (filteredList.length > 0) {
        inputValue = filteredList.at(selectedIndex);
        handleInput();
      }
      handleSubmit();
      return;
    }

    let tabbed = false;
    if (e.keyCode == 9) {
      e.preventDefault();
      if (inputValue != filteredList.at(selectedIndex)) {
        inputValue = filteredList.at(selectedIndex);
        handleInput();
        return;
      }
      tabbed = true;
    }

    if (
      (e.key === "ArrowDown" || tabbed) &&
      selectedIndex <= filteredList.length - 1
    ) {
      selectedIndex === filteredList.length - 1
        ? (selectedIndex = 0)
        : (selectedIndex += 1);
      return;
    }

    if (e.key === "ArrowUp" && selectedIndex !== null) {
      selectedIndex === 0
        ? (selectedIndex = filteredList.length - 1)
        : (selectedIndex -= 1);
      return;
    }
  };

  function add(): void {
    let navn = inputValue;
    navn = navn.toLowerCase();
    navn = removeSpecialChars(navn);
    const id = generateUniqueIdFromString(navn);
    if ($forsteko.filter((timinist) => timinist.navn === navn).length == 0) {
      $counter = [...$counter, { navn: navn, vaffelcount: 0, id }];
      $forsteko = [...$forsteko, { navn: navn, erIKo: true, id }];
      inputValue = "";
    } else if (
      $nteko.filter((timinist) => timinist.navn == navn).length == 0 &&
      $forsteko.filter((timinist) => timinist.navn === navn)[0].erIKo === false
    ) {
      $nteko = [...$nteko, { navn: navn, id }];
      inputValue = "";
    } else {
      shake();
    }
  }

  function next() {
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
    inputValue = "";
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

  function reset(): void {
    $forsteko = [];
    $nteko = [];
    $counter = [];
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

  function eksporter() {
    const obj = createJSONObject();
    navigator.clipboard.writeText(obj);
  }

  function importer() {
    navigator.clipboard.readText().then((obj) => importFromJSONObject(obj));
  }

  function penis() {
    document.getElementById("penis").style.display =
      document.getElementById("penis").style.display === "none"
        ? "block"
        : "none";
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

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      filteredCommands = [];
      filteredNames = [];
      inputElement.blur();
    }
  }}
  on:click={(e) => {
    e.stopPropagation();
    if (e.target != inputElement) {
      filteredCommands = [];
      filteredNames = [];
      inputElement.blur();
    }
  }}
/>

<div id="penis" style="display: none; position: absolute; top: 0; left: 0;">
  <img src="penis.jpg" alt="penis" width="33%" />
</div>

<div class="board">
  <div class="input-wrapper">
    <div
      class="relative-wrapper space-x-1"
      style={"transform: translate3d(" + $transformed + "px, 0, 0)"}
    >
      <div class="palette">
        <span id="input-mirror">{inputValue}</span><span
          id="typeahead"
          on:click={() => inputElement.focus()}>{typeahead}</span
        >
      </div>
      <input
        class="new-timinist"
        placeholder="<navn> eller en av next, skip, reset, import, export"
        bind:value={inputValue}
        bind:this={inputElement}
        on:input={handleInput}
        on:focus={handleInput}
        on:keydown={handleKeydown}
      />
      {#if filteredCommands.length > 0 || filteredNames.length > 0}
        <ul id="autocomplete-items-list">
          {#if filteredCommands.length > 0}
            <li class="divider">Commands</li>
          {/if}
          {#each filteredCommands as command}
            <AutocompleteListItem
              itemLabel={command}
              highlighted={filteredList.indexOf(command) === selectedIndex ||
                filteredCommands.indexOf(command) === selectedIndex}
              handleHover={selectActive}
              {handleClick}
            />
          {/each}
          {#if filteredNames.length > 0}
            <li class="divider">Names</li>
          {/if}
          {#each filteredNames as name}
            <AutocompleteListItem
              capitalized={true}
              itemLabel={name}
              highlighted={filteredList.indexOf(name) === selectedIndex}
              handleHover={selectActive}
              {handleClick}
            />
          {/each}
        </ul>
      {/if}
    </div>
    <button tabindex="-1" on:click={showImport} class="import space-x-1">
      Import
    </button>
    <button tabindex="-1" on:click={showExport} class="export space-x-1">
      Export
    </button>
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
  /*------- Start input style ----------*/
  .divider {
    border-top: 1px solid #bbb;
    list-style: none;
    font-weight: bold;
    color: #999;
    font-size: 0.8em;
    padding: 0.5em 0 0.5em 1em;
    background-color: #fff;
    margin-top: 0.5em;
  }

  .palette {
    position: absolute;
    top: 0;
    left: 0;
    height: 3em;
    padding: auto 0;
    pointer-events: none;
  }

  #input-mirror {
    position: relative;
    visibility: hidden;
    font-size: 1.4em;
    display: inline-block;
    height: 100%;
    vertical-align: top;
    z-index: 99;
    padding: 0.5em 0 0.5em 0.5em;
    margin: 0;
    border-left: 1px solid transparent;
    border-top: 1px solid transparent;
  }

  #typeahead {
    position: relative;
    font-size: 1.4em;
    z-index: 99;
    color: #555;
    display: inline-block;
    height: 100%;
    vertical-align: top;
    padding: 0.5em 0 0.5em 0;
    margin: 0;
    border-top: 1px solid transparent;
  }

  .relative-wrapper {
    position: relative;
    flex-grow: 8;
  }

  .space-x-1 + .space-x-1 {
    margin-left: 1em;
  }

  .input-wrapper {
    display: flex;
    flex-direction: row;
    height: min-content;
    margin: 2em 0 1em 0;
    width: 100%;
  }

  input {
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0.5em;
    vertical-align: top;
    border-radius: 0.5em;
    outline: none;
    font-size: 1.4em;
    border: 1px solid #bbb;
  }

  input:focus {
    border-radius: 0.5em 0.5em 0 0;
  }

  .import,
  .export {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 2.4em;
    padding: auto;
    margin: auto 0;
    flex-grow: 1;
    background-color: #eee;
    height: 3.3em;
    border-radius: 0.5em;
  }

  .import:hover,
  .export:hover {
    background-color: #ddd;
    cursor: pointer;
  }

  #autocomplete-items-list {
    position: absolute;
    z-index: 100000000000;
    margin: 3em 0 0 0;
    padding: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #bbb;
    border-top: none !important;
    background-color: #fff;
    padding-bottom: 0.5em;
    border-radius: 0 0 0.5em 0.5em;
  }

  /*------- End input style ----------*/

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
