<template>
<div v-if="show" class="modal">
<div class="modal-content">
<span class="close" @click="closeModal">&times;</span>
<div v-if="isLogin">
<LoginForm @login="handleLogin" />
</div>
<div v-else>
<RegisterForm @register="handleRegister" />
</div>
<div class="toggle">
<button @click="toggleForm">
{{ isLogin ? "Créer un compte" : "Se connecter" }}
</button>
</div>
</div>
</div>
</template>

<script>
    import LoginForm from './LoginForm.vue';
    import RegisterForm from './RegisterForm.vue';

    export default {
        components: { LoginForm, RegisterForm },
        props: {
            show: {
                type: Boolean,
                required: true
            }
        },

        data() {
            return {
                isLogin: true
            };
        },

        methods: {
            closeModal() {
                this.$emit('close');
            },

            toggleForm() {
                this.isLogin = !this.isLogin;
            },

            handleLogin(user) {
                this.$emit('login', user);
            },

            handleRegister(user) {
                this.$emit('register', user);
            }
        }
    };
</script>