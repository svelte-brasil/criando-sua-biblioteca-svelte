<script>
  export let error;
  export let description;
</script>

<div>
  <h2>{error}</h2>
  <h4>{description}</h4>
</div>

<style>
  div {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30%;
    box-sizing: border-box;
    text-align: center;
    background-color: #eaeaea;
    font-family: arial;
  }
  h2 {
    font-size: 80pt;
    font-weight: 700;
    margin: 0;
  }
  h4 {
    font-size: 30pt;
    font-weight: 100;
    margin: 0;
  }
</style>
