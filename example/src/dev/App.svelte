<script>
  import SvelteErrorScreen from "../lib/index.svelte";
</script>

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

<main>
  <SvelteErrorScreen
    error={500}
    description="Ocorreu um problema no servidor" />
</main>
