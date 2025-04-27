<template>
    <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit">Se Connecter</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
                errorMessage: ''
            }
        },

        methods: {
            async handleLogin() {
                this.errorMessage = '';

                try {
                    const response = await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: this.username,
                            password: this.password
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('✅ Connexion réussie', data);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        window.location.reload();
                        this.$emit('close');
                    } else {
                        this.errorMessage = data.message || 'Identifiants incorrects.';
                    }
                } catch (error) {
                    console.error('❌ Erreur lors de la connexion :', error);
                    this.errorMessage = 'Erreur de connexion au serveur.';
                }
            }
        }
    }
</script>
