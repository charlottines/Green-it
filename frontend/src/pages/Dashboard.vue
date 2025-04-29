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

        <!-- Onglet modal Modifier compte -->
        <div v-if="showModifyForm" class="modify-overlay">
            <div class="modify-form">
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
                <button @click="toggleModifyForm" class="account-button delete" style="margin-top: 10px;">Fermer</button>
            </div>
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
            const plantsData = await response.json();

            this.plants = await Promise.all(plantsData.map(async plant => {
                const groupRes = await fetch(`https://green-it-production.up.railway.app/api/groups/${plant.group_id}/user/${user.id}`);
                const groupData = await groupRes.json();
                return {
                    ...plant,
                    groupName: groupData.groupName || 'Groupe inconnu'
                };
            }));
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
            return `/plant${this.plantId}-${stage}.png`;
        }
    }
}
</script>

<style scoped>
.dashboard-page {
    min-height: calc(100vh - 100px);
    background-color: rgb(30, 30, 30);
    padding: 20px;
    color: white;
    font-family: Arial, sans-serif;
}

h2, h3 {
    text-align: center;
    color: rgb(129, 199, 132);
    margin-bottom: 30px;
}

/* Liste des plantes */
.plants-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-bottom: 40px;
}

/* Carte pour chaque plante */
.plant-card {
    background: rgba(129, 199, 132, 0.15);
    border: 1px solid rgba(129, 199, 132, 0.4);
    border-radius: 15px;
    width: 250px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.plant-card h3 {
    color: rgb(129, 199, 132);
    margin-bottom: 10px;
}

.plant-card p {
    font-size: 1rem;
    margin-bottom: 5px;
}

.plant-image {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 5px;
}

/* Boutons */
.account-button {
    padding: 10px 20px;
    margin: 10px 5px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    background-color: rgb(129, 199, 132);
    color: black;
    border: none;
    transition: background-color 0.3s ease;
}

.account-button:hover {
    background-color: rgb(102, 187, 106);
}

.account-button.delete {
    background-color: #e57373;
    color: white;
}

/* Modal pour modifier le compte */
.modify-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Formulaire dans le modal */
.modify-form {
    background: #1e1e1e;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 15px rgba(0,0,0,0.5);
    color: white;
    text-align: center;
}

.modify-form h4 {
    margin-bottom: 20px;
    color: rgb(129, 199, 132);
}

.modify-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    text-align: left;
}

.modify-form input {
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #555;
    background-color: #2c2c2c;
    color: white;
}
</style>

