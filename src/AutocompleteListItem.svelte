<script>
  export let itemLabel;
  export let highlighted;
  export let capitalized = false;
  export let handleHover = null;
  export let handleClick = null;
</script>

<li
  class="autocomplete-items"
  class:capitalized
  class:autocomplete-active={highlighted}
  on:mouseenter={() => handleHover(itemLabel)}
  on:click={() => handleClick(itemLabel)}
>
  {@html itemLabel}
</li>

<style>
  li.autocomplete-items {
    list-style: none;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;
    padding: 0.5em;
    margin: 0 0.5em;
    cursor: pointer;
    background-color: #fff;
  }

  .capitalized {
    text-transform: capitalize;
  }

  .autocomplete-active {
    /* when navigating through the items using the arrow keys and hovering */
    background-color: #eee !important;
    color: #333;
    border-radius: 0.5em;
  }
</style>
