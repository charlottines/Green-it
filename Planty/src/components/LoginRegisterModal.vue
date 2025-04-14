<template>
    <div class="modal-backdrop" @click.self="close">
        <div class="modal-content">
            <button class="close" @click="close">✕</button>
        
            <div class="tabs">
                <button @click="tab = 'login'" :class="{ active: tab === 'login' }">Se Connecter</button>
                <button @click="tab = 'register'" :class="{ active: tab === 'register' }">Créer un Compte</button>
            </div>
        
            <LoginForm v-if="tab === 'login'" @close="close" />
            <RegisterForm v-else @close="close" />
        </div>
    </div>
</template>
  
<script>
    import LoginForm from '/src/components/LoginForm.vue'
    import RegisterForm from '/src/components/RegisterForm.vue'
  
    export default {
        components: { LoginForm, RegisterForm },
        
        data() {
            return {
                tab: 'login'
            }
        },
        
        methods: {
            close() {
                this.$emit('close')
            }
        }
    }
</script>
