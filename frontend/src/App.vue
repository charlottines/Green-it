<template>
    <div id="app">
        <Navbar />
        <router-view />
    </div>
</template>

<script>
    import Navbar from './components/Navbar.vue'

    export default {
        components: {
            Navbar
        }
    }
</script>
  

<style>
    /* Style global du site */
    body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f7f7f7;
    }
</style>
