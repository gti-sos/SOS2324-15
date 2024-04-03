<script>
  import Header from "./Header.svelte";
</script>

<svelte:head>
  <title>API Rest Grupo 15</title>
</svelte:head>

<Header/>
<h1>API Rest Grupo 15</h1>
<hr>
<slot></slot>  
<hr>
<style>
  * {
    font-family: 'Cambria', sans-serif; /* Fuente */
    margin: 0; /* Eliminar margen predeterminado */
    padding: 5px; /* Espaciado interno */
  }

  h1 {
    text-align: center; /* Centrar el texto horizontalmente */
  }
</style>