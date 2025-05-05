<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>{{ isLoginMode ? 'Connexion' : 'Inscription' }}</h2>
    
            <LoginForm v-if="isLoginMode" @loginSuccess="close" />
            <RegisterForm v-else @registerSuccess="switchToLogin" />
    
            <div class="switch-mode">
                <p v-if="isLoginMode">
                    Pas encore de compte ?
                    <button @click="toggleMode">Créer un compte</button>
                </p>
                <p v-else>
                    Vous avez déjà un compte ?
                    <button @click="toggleMode">Se connecter</button>
                </p>
            </div>
    
            <button class="close-button" @click="close">X</button>
        </div>
    </div>
</template>
  

<script>
    import LoginForm from './LoginForm.vue';
    import RegisterForm from './RegisterForm.vue';

    export default {
        components: {
            LoginForm,
            RegisterForm
        },

        data() {
            return {
                isLoginMode: true
            }
        },

        methods: {
            toggleMode() {
                this.isLoginMode = !this.isLoginMode;
            },
            switchToLogin() {
                this.isLoginMode = true;
            },
            close() {
                this.$emit('close');
            }
        }
    }
</script>
  