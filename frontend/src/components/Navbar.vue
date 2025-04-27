<template>
    <nav class="navbar">
        <h1>Planty</h1>

        <div v-if="isLoggedIn">
            <router-link to="/" class="nav-link">Accueil</router-link>
            <router-link to="/groups" class="nav-link">Groupes</router-link>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <span class="welcome">{{ currentUser.username }}</span>
            <button @click="logout" class="logout-button">Se Déconnecter</button>
        </div>

        <div v-else>
            <button @click="showModal = true">Connexion</button>
        </div>

        <LoginRegisterModal v-if="showModal" @close="showModal = false" />
    </nav>
</template>
  


<script>
    import { RouterLink } from 'vue-router';
    import LoginRegisterModal from './LoginRegisterModal.vue';

    export default {
        components: {
            RouterLink,
            LoginRegisterModal
        },

        data() {
            return {
                showModal: false
            }
        },

        computed: {
            isLoggedIn() {
                return localStorage.getItem('user') !== null;
            },

            currentUser() {
                const user = localStorage.getItem('user');
                return user ? JSON.parse(user) : null;
            }
        },

        methods: {
            logout() {
                localStorage.removeItem('user');
                console.log('✅ Déconnecté avec succès !');
                window.location.reload();
                this.$router.push('/');
            }
        }
    }
</script>