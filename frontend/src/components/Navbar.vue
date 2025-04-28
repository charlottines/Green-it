<template>
    <nav class="navbar">
        <div class="navbar-left">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <h1 class="site-title">Planty</h1>
        </div>

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

<style scoped>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #4CAF50;
        padding: 10px 20px;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
    }

    .navbar h1 {
        font-size: 1.5rem;
        margin: 0;
    }

    .nav-link {
        margin: 0 10px;
        text-decoration: none;
        color: white;
        font-weight: bold;
        transition: color 0.3s ease;
    }

    .nav-link:hover {
        color: #d4f1d4;
    }

    .welcome {
        margin-right: 15px;
        font-style: italic;
    }

    .logout-button {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .logout-button:hover {
        background-color: #d32f2f;
    }
</style>