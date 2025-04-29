<template>
    <div class="dashboard-page">
        <h2>Mon Tableau de Bord</h2>

        <div v-if="plants.length > 0" class="plants-list">
            <div v-for="plant in plants" :key="plant.groupName" class="plant-card">
                <h3>{{ getPlantName(plant.plant_id) }}</h3>
                <img :src="getPlantImage(plant.plant_id, plant.growth)" alt="Plante" class="plant-image" loading="lazy" />
                <p><strong>Groupe :</strong> {{ plant.groupName }}</p>
                <p><strong>Croissance :</strong> {{ plant.growth }}%</p>
            </div>
        </div>
        <div v-else>
            <p>Vous n'avez pas encore de plante.</p>
        </div>

        <hr />

        <h3>Gérer mon compte</h3>

        <button @click="toggleModifyForm" class="account-button">Modifier mon compte</button>

        <div v-if="showModifyForm" class="modify-form">
            <h4>Modifier mon Compte</h4>
            <form @submit.prevent="submitAccountChanges">
                <label>Nouveau Nom d'utilisateur :</label>
                <input type="text" v-model="newUsername" placeholder="Nouveau pseudo" />

                <label>Nouvel Email :</label>
                <input type="email" v-model="newEmail" placeholder="Nouvel email" />

                <label>Nouveau Mot de Passe :</label>
                <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />

                <button type="submit" class="account-button">Enregistrer</button>
            </form>
        </div>

        <button @click="deleteAccount" class="account-button delete">Supprimer mon compte ❌</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            plants: [],
            showModifyForm: false,
            newUsername: '',
            newEmail: '',
            newPassword: '',
        }
    },

    async mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            this.$router.push('/');
            return;
        }

        try {
            const response = await fetch(`https://green-it-production.up.railway.app/api/user/${user.id}/plants`);
            this.plants = await response.json();
        } catch (error) {
            console.error('Erreur de chargement des plantes:', error);
        }
    },

    methods: {
        getPlantName(id) {
            switch (id) {
                case 1: return 'Plante Basique';
                case 2: return 'Cactus';
                case 3: return 'Tournesol';
                default: return 'Inconnu';
            }
        },

        modifyAccount() {
            alert('Fonction Modifier le compte bientôt disponible 🛠️'); 
        },

        async deleteAccount() {
            if (!confirm("Es-tu sûr de vouloir supprimer ton compte ? (Cette action est irréversible)")) {
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/user/${user.id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    alert('Ton compte a été supprimé.');
                    localStorage.removeItem('user');
                    this.$router.push('/');
                } else {
                    alert('Erreur lors de la suppression.');
                }
            } catch (error) {
                console.error('Erreur suppression compte:', error);
            }
        },

        toggleModifyForm() {
            this.showModifyForm = !this.showModifyForm;
        },

        async submitAccountChanges() {
            const user = JSON.parse(localStorage.getItem('user'));

            const updatedData = {};

            if (this.newUsername.trim() !== '') {
                updatedData.username = this.newUsername;
            }
            if (this.newEmail.trim() !== '') {
                updatedData.email = this.newEmail;
            }
            if (this.newPassword.trim() !== '') {
                updatedData.password = this.newPassword;
            }

            if (Object.keys(updatedData).length === 0) {
                alert('Merci de remplir au moins un champ.');
                return;
            }

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/user/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Modifications enregistrées ✅. Déconnecte-toi et reconnecte-toi pour voir les changements.');
                    this.newUsername = '';
                    this.newEmail = '';
                    this.newPassword = '';
                    this.showModifyForm = false;
                } else {
                    alert('Erreur lors de la modification.');
                }
            } catch (error) {
                console.error('Erreur modification compte:', error);
            }
        },

        getPlantImage(plantId, growth) {
            let stage = 1;
            if (growth >= 0 && growth < 30) {
                stage = 1;
            } else if (growth >= 30 && growth < 70) {
                stage = 2;
            } else if (growth >= 70) {
                stage = 3;
            }
            return `/plant${plantId}-${stage}.png`;
        }
    }
}
</script>

<style scoped>
    .dashboard-page {
        padding: 20px;
    }

    .plants-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .plant-card {
        background-color: #8fffa5;
        padding: 15px;
        border-radius: 10px;
        width: 200px;
    }

    .account-button {
        padding: 10px 20px;
        margin: 10px 5px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }

    .account-button.delete {
        background-color: #e57373;
        color: white;
    }

    .modify-form {
        margin-top: 20px;
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 10px;
        width: 300px;
    }

    .modify-form label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .modify-form input {
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .plant-image {
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        border-radius: 5px;
    }
</style>
