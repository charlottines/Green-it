<template>
    <div class="groups-page">
        <h2>Mes Groupes</h2>

        <div v-if="groups.length > 0">
            <ul>
                <li v-for="group in groups" :key="group.id">
                    <router-link :to="`/group/${group.id}`">
                        <strong>{{ group.name }}</strong> - <em>{{ group.role }}</em>
                    </router-link>
                </li>
            </ul>
        </div>

        <div v-else>
            <p>Aucun groupe trouvé pour l'instant.</p>
        </div>

        <hr />

        <div class="join-group">
            <h3>Rejoindre un Groupe avec un Code</h3>
            <input type="text" v-model="joinCode" placeholder="Entrez le code à 6 chiffres"  maxlength="6"/>
            <button @click="requestJoinGroup">Demander à rejoindre</button>

            <div v-if="joinMessage" :class="{ success: joinSuccess, error: !joinSuccess }">
                {{ joinMessage }}
            </div>
        </div>

        <hr />

        <div class="create-group">
            <h3>Créer un Nouveau Groupe</h3>
            <input type="text" v-model="newGroupName" placeholder="Nom du groupe" required />
            <input type="text" v-model="newGroupDescription" placeholder="Description (optionnel)" />
            <button @click="createGroup">Créer le Groupe</button>

            <div v-if="createMessage" :class="{ success: createSuccess, error: !createSuccess }">
                {{ createMessage }}
            </div>
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
                    const response = await fetch(`http://https://green-it-production.up.railway.app/api/user/${user.id}/groups`);
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
                    const response = await fetch('http://https://green-it-production.up.railway.app/api/groups/request', {
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
                    const response = await fetch('http://https://green-it-production.up.railway.app/api/groups/create', {
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