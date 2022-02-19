<script>
  export let object = "[[], [], []]";

  const copyObject = () => {
    navigator.clipboard.writeText(object);
  };
</script>

<button on:click={copyObject}> copy</button> <br />
<code>{object}</code>

<style>
</style>
