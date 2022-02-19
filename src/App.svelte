<script>
  import Main from "./Main.svelte";
  import Modal from "./Modal.svelte";
  import { modal } from "./stores.js";
</script>

<Modal show={$modal}>
  <Main />
</Modal>
