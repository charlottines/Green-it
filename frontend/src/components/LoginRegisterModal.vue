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
  

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: #2c2c2c;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        color: white;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        position: relative;
        text-align: center;
    }

    .switch-mode {
        margin-top: 20px;
    }
    
    .switch-mode button {
        background: none;
        border: none;
        color: #81c784;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 5px;
    }
    
    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 20px;
        color: white;
        cursor: pointer;
    }
</style>
  