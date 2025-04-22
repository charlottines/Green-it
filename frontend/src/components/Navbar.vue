<template>
    <nav class="navbar">
        <h1>Planty</h1>
        <button @click="showModal = true">Connexion</button>
        <LoginRegisterModal v-if="showModal" @close="showModal = false" />
    </nav>
</template>

<script>
    import LoginRegisterModal from '/src/components/LoginRegisterModal.vue'

    export default {
        components: {
            LoginRegisterModal
        },

        data() {
            return {
                showModal: false
            }
        }
    }
</script>
