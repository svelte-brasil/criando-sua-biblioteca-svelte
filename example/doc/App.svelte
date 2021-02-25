<script>
  import SvelteErrorScreen from "../src/ErrorScreen.svelte";
</script>

<main>
  <SvelteErrorScreen
    error={500}
    description="Ocorreu um problema no servidor"
  />
</main>

<style>
  main {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
