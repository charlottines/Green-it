<template>
    <nav class="navbar">
        <div class="navbar-left">
            <img src="../assets/logo.png" alt="Logo" class="logo" />
            <h1 class="site-title">Planty</h1>

            <div class="nav-links">
                <router-link to="/" class="nav-link">Accueil</router-link>
                <router-link to="/about" class="nav-link">À propos</router-link>
            </div>
        </div>

        <div v-if="isLoggedIn" class="navbar-right">
            <div class="nav-links">
                <router-link to="/groups" class="nav-link">Groupes</router-link>
                <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            </div>
            <span class="welcome">{{ currentUser.username }}</span>
            <button @click="logout" class="logout-button">Se Déconnecter</button>
        </div>

        <div v-else class="navbar-right">
            <img src="../assets/user-icon.svg" alt="User Icon" class="user-icon" @click="showModal = true"/>
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
