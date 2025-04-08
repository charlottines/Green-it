<template>
    <div class="auth-container">
        <h1>Créer un Compte</h1>
        <p>Créer un compte pour prendre soin de votre plante virtuelle !</p>
  
        <form @submit.prevent="handleRegister">
            <input type="text" v-model="username" placeholder="Username" required />
            <input type="email" v-model="email" placeholder="Email" required />
            <input type="password" v-model="password" placeholder="Password" required />
            <button type="submit">Créer</button>
        </form>
  
        <p class="register-text">
            Vous avez déjà un compte ?
            <router-link to="/login">Se Connecter</router-link>
        </p>
    </div>
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
                // TODO: Connecter au backend API
                console.log("Registering", this.username, this.email, this.password);
            }
        }
    }
</script>
