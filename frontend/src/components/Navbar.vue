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

<style scoped>
    .navbar {
        position: sticky;
        top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #4CAF50;
        padding: 10px 20px;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 30px;
    }

    .navbar-left {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .navbar-right {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .site-title {
        font-size: 1.5rem;
        margin: 0;
    }

    .nav-links {
        display: flex;
        gap: 20px;
    }

    .nav-link {
        text-decoration: none;
        color: white;
        font-weight: bold;
        transition: color 0.3s ease;
    }

    .user-icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .welcome {
        font-style: italic;
    }

    .logout-button {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .logout-button:hover {
        background-color: #d32f2f;
    }
</style>
