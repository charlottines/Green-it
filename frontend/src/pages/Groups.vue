<template>
    <div class="groups-page">
        <h2>Mes Groupes</h2>

        <div v-if="groups.length > 0" class="groups-list">
            <div v-for="group in groups" :key="group.id" class="group-card">
                <router-link :to="`/group/${group.id}`">
                    <h3>{{ group.name }}</h3>
                    <p>{{ group.description }}</p>
                    <p class="role">Votre rôle : {{ group.role }}</p>
                </router-link>
            </div>
        </div>

        <div v-else>
            <p class="no-group">Aucun groupe trouvé pour l'instant.</p>
        </div>

        <div class="group-actions">
            <section class="join-group">
                <h3>Rejoindre un Groupe</h3>
                <input type="text" v-model="joinCode" placeholder="Entrez le code à 6 chiffres" maxlength="6" />
                <button @click="requestJoinGroup">Demander à rejoindre</button>

                <div v-if="joinMessage" :class="{ success: joinSuccess, error: !joinSuccess }">
                    {{ joinMessage }}
                </div>
            </section>

            <section class="create-group">
                <h3>Créer un Groupe</h3>
                <input type="text" v-model="newGroupName" placeholder="Nom du groupe" required />
                <input type="text" v-model="newGroupDescription" placeholder="Description (optionnel)" />
                <button @click="createGroup">Créer le Groupe</button>

                <div v-if="createMessage" :class="{ success: createSuccess, error: !createSuccess }">
                    {{ createMessage }}
                </div>
            </section>
        </div>
    </div>
</template>  
  
<script>
    export default {
        data() {
            return {
                groups: [],
                joinCode: '',
                joinMessage: '',
                joinSuccess: false,
                newGroupName: '',
                newGroupDescription: '',
                createMessage: '',
                createSuccess: false
            }
        },

        async mounted() {
            this.loadGroups();
        },

        methods: {
            async loadGroups() {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user) {
                    this.$router.push('/');
                    return;
                }

                try {
                    const response = await fetch(`https://green-it-production.up.railway.app/api/user/${user.id}/groups`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        this.groups = data;
                    } else {
                        console.error('Réponse inattendue du serveur:', data);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement des groupes:', error);
                }
            },

            async requestJoinGroup() {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!this.joinCode || this.joinCode.length !== 6) {
                    this.joinMessage = "Veuillez entrer un code valide à 6 chiffres.";
                    this.joinSuccess = false;
                    return;
                }

                try {
                    const response = await fetch('https://green-it-production.up.railway.app/api/groups/request', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            joinCode: this.joinCode
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.joinMessage = data.message;
                        this.joinSuccess = true;
                        this.joinCode = '';
                        this.loadGroups();
                    } else {
                        this.joinMessage = data.message;
                        this.joinSuccess = false;
                    }
                } catch (error) {
                    console.error('Erreur lors de la demande de rejoindre un groupe:', error);
                    this.joinMessage = 'Erreur serveur.';
                    this.joinSuccess = false;
                }
            },

            async createGroup() {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!this.newGroupName) {
                    this.createMessage = "Veuillez entrer un nom pour le groupe.";
                    this.createSuccess = false;
                    return;
                }

                try {
                    const response = await fetch('https://green-it-production.up.railway.app/api/groups/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            name: this.newGroupName,
                            description: this.newGroupDescription
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.createMessage = `✅ Groupe créé avec succès ! Code d'invitation : ${data.joinCode}`;
                        this.createSuccess = true;
                        this.newGroupName = '';
                        this.newGroupDescription = '';
                        this.loadGroups();
                    } else {
                        this.createMessage = data.message;
                        this.createSuccess = false;
                    }
                } catch (error) {
                    console.error('Erreur lors de la création du groupe:', error);
                    this.createMessage = 'Erreur serveur.';
                    this.createSuccess = false;
                }
            }
        }
    }
</script>

<style scoped>
.groups-page {
    min-height: calc(100vh - 100px);
    background-color: rgb(30, 30, 30);
    padding: 20px;
    color: white;
    font-family: Arial, sans-serif;
}

h2 {
    font-size: 2.5rem;
    text-align: center;
    color: rgb(129, 199, 132);
    margin-bottom: 30px;
}

/* Liste des groupes */
.groups-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-bottom: 40px;
}

/* Carte de chaque groupe */
.group-card {
    background: rgba(129, 199, 132, 0.15);
    border: 1px solid rgba(129, 199, 132, 0.4);
    border-radius: 15px;
    width: 250px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    color: white; /* Texte blanc */
    text-decoration: none; /* Pas de soulignement */
    display: flex;
    flex-direction: column;
}

.group-card:hover {
    transform: translateY(-5px);
    background: rgba(129, 199, 132, 0.25);
}

.group-card h3 {
    color: rgb(129, 199, 132);
    margin-bottom: 10px;
}

.group-card p {
    font-size: 1rem;
    margin-bottom: 5px;
}

.group-card .role {
    font-style: italic;
    font-size: 0.9rem;
    color: #ccc;
}

/* Message si aucun groupe */
.no-group {
    text-align: center;
    font-style: italic;
    margin-bottom: 40px;
}

/* Actions rejoindre / créer */
.group-actions {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 600px;
    margin: 0 auto;
}

/* Rejoindre / Créer un groupe */
.join-group, .create-group {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center; /* Centre les éléments */
}

.join-group h3, .create-group h3 {
    color: rgb(129, 199, 132);
    margin-bottom: 15px;
}

/* Champs centrés */
.join-group input[type="text"],
.create-group input[type="text"],
.join-group button,
.create-group button {
    width: 80%;
    max-width: 300px;
}

/* Inputs */
input[type="text"] {
    padding: 10px;
    margin-bottom: 15px;
    background-color: #1e1e1e;
    border: 1px solid #555;
    border-radius: 8px;
    color: white;
}

/* Boutons */
button {
    padding: 10px;
    background-color: rgb(129, 199, 132);
    color: black;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: rgb(102, 187, 106);
}

/* Messages de succès et erreur */
.success {
    color: #4CAF50;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
}

.error {
    color: #f44336;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
}
</style>

