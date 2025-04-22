<template>
    <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <button type="submit">Se Connecter</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },

        methods: {
            handleLogin() {
                //TODO : Appel API vers le backend
                console.log("Login:", this.username, this.password)
                this.$emit('close')  // ferme le modal après login
            }
        }
    }
</script>
