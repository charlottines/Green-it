<template>
    <form @submit.prevent="handleRegister">
        <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <input type="password" v-model="password" placeholder="Confirmer votre mot de passe" required />
        <button type="submit">Créer un Compte</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                email: '',
                password: ''
            }
        },

        methods: {
            handleRegister() {
                // TODO : Appel API vers backend
                console.log("Register:", this.username, this.email, this.password)
                this.$emit('close')  // ferme le modal après inscription
            }
        }
    }
</script>
