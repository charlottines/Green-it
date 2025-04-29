<template>
    <div class="form-container">
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
            <input type="password" v-model="password" placeholder="Mot de passe" required />
            <button type="submit">Se connecter</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
    </div>
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
                    const response = await fetch('https://green-it-production.up.railway.app/api/login', {
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

<style scoped>
    .form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
    }

    form input {
        padding: 10px;
        border: 1px solid #555;
        border-radius: 5px;
        background-color: #1e1e1e;
        color: white;
    }

    form input:focus {
        outline: none;
        border-color: #81c784;
    }

    form button {
        padding: 10px;
        background-color: #81c784;
        color: #1e1e1e;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    form button:hover {
        background-color: #66bb6a;
    }
    
    .error-message {
        color: #ff6b6b;
        margin-top: 10px;
        font-size: 0.9rem;
    }
</style>

