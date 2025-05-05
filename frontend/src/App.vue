<template>
    <div id="app">
        <Navbar />
        <router-view />
        <Footer />
    </div>
</template>

<script>
    import Navbar from './components/Navbar.vue'
    import Footer from './components/Footer.vue'

    export default {
        components: {
            Navbar,
            Footer
        },

        mounted() {
            const user = localStorage.getItem('user');
            if (!user) {
                // Si pas connecté, rediriger vers page d'accueil
                this.$router.push('/');
            }
        }
    }
</script>
