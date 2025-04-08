<template>
    <div class="auth-container">
        <h1>Bienvenue sur Planty</h1>
        <p>Connectez vous à votre compte.</p>
      
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="username" placeholder="Username" required />
            <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Se Connecter</button>
      </form>
  
        <p class="register-text">
            Pas de compte ? <router-link to="/register">Créer un compte !</router-link>
        </p>
    </div>
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
            // TODO: Connecter au backend API
            console.log("Logging in with", this.username, this.password);
        }
    }
  }
</script>
