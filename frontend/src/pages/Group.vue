<template>
    <div class="group-page">
        <h2>Groupe : {{ groupName }}</h2>

        <!-- ADMIN - Bouton voir code -->
        <div v-if="role === 'admin'" class="admin-code">
            <button @click="showCode = !showCode">
                {{ showCode ? 'Cacher Code' : '🔑 Voir Code du Groupe' }}
            </button>
            <p v-if="showCode"><strong>Code d'invitation :</strong> {{ joinCode }}</p>
        </div>

        <!-- MEMBRE - Plante + Points -->
        <div v-if="role !== 'admin'" class="my-plant">
            <h3><b>{{ plantName }}</b> </h3>

            <div v-if="plantId !== null">
                <img :src="plantImageUrl" alt="Plante" class="plant-image" loading="lazy" />
                <p>Croissance : {{ growth }}%</p>
                <p><strong>Points disponibles :</strong> {{ points }}</p>
                <button @click="usePoints" :disabled="points <= 0">Utiliser mes points pour grandir 🌱</button>
            </div>

            <div v-else>
                <p>Vous n'avez pas encore choisi de plante.</p>
                <div class="choose-plant">
                    <h4>Choisissez votre plante :</h4>
                    <button @click="choosePlant(1)">🌱 Plante Basique</button>
                    <button @click="choosePlant(2)">🌵 Cactus</button>
                    <button @click="choosePlant(3)">🌻 Tournesol</button>
                </div>
            </div>

            <!-- MEMBRE - Enregistrer une action -->
            <div class="register-action">
                <h3>Enregistrer une action écoresponsable</h3>
                <form @submit.prevent="submitAction">
                    <label>Intitulé :</label>
                    <input type="text" v-model="actionTitle" required />

                    <label>Description :</label>
                    <textarea v-model="actionDescription" required></textarea>

                    <label>Image (optionnel) :</label>
                    <input type="file" @change="handleImageUpload" />

                    <button type="submit">Soumettre Action</button>
                </form>
            </div>
        </div>

        <hr />

        <!-- Actions boutons -->
        <div class="actions">
            <button @click="showMembers = !showMembers">
                {{ showMembers ? 'Cacher Membres' : '👥 Voir Membres' }}
            </button>
            <button v-if="role === 'admin'" @click="showRequests = !showRequests">
                {{ showRequests ? 'Cacher Demandes' : '📨 Voir Demandes d\'adhésion' }}
            </button>
            <button v-if="role === 'admin'" @click="showActions = !showActions">
                {{ showActions ? 'Cacher Actions' : '🌟 Voir Actions à valider' }}
            </button>
        </div>

        <!-- Membres -->
        <div v-if="showMembers">
            <h3>Membres du Groupe</h3>
            <ul>
                <li v-for="member in members" :key="member.id">
                    {{ member.username }} - <em>{{ member.role }}</em>
                </li>
            </ul>
        </div>

        <!-- Demandes d'adhésion -->
        <div v-if="showRequests && role === 'admin'">
            <h3>Demandes d'adhésion</h3>
            <div v-if="requests.length > 0">
                <ul>
                    <li v-for="request in requests" :key="request.id">
                        {{ request.username }} - Statut : {{ request.status }}
                        <button @click="acceptRequest(request.userId)">Accepter</button>
                        <button @click="rejectRequest(request.userId)">Refuser</button>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>Aucune demande en attente.</p>
            </div>
        </div>

        <!-- Liste des actions à valider -->
        <div v-if="showActions && role === 'admin'">
            <h3>Actions enregistrées</h3>
            <div v-if="actions.length > 0">
                <div v-for="action in actions" :key="action.id" class="action-card">
                    <h4>{{ action.title }}</h4>
                    <p>{{ action.description }}</p>
                    <img v-if="action.image_path" :src="getImageUrl(action.image_path)" alt="Action Image" class="action-image" />

                    <label>Attribuer des points (0-5) :</label>
                    <input type="number" v-model.number="action.assignedPoints" min="0" max="5" />
                    <button @click="assignPoints(action.id, action.assignedPoints)">Attribuer</button>
                </div>
            </div>
            <div v-else>
                <p>Aucune action en attente.</p>
            </div>
        </div>

        <button @click="leaveGroup" class="leave-button">Quitter le Groupe</button>
        <button v-if="role === 'admin'" @click="deleteGroup" class="delete-group-button">Supprimer le Groupe</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            groupName: '',
            joinCode: '',
            role: '',
            growth: 0,
            points: 0,
            plantId: null,
            plantName: '',
            plantImageUrl: '',
            members: [],
            requests: [],
            actions: [],
            showMembers: false,
            showRequests: false,
            showActions: false,
            showCode: false,
            actionTitle: '',
            actionDescription: '',
            actionImage: null,
        };
    },

    async mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            this.$router.push('/');
            return;
        }

        const groupId = this.$route.params.id;

        try {
            const responseGroup = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/user/${user.id}`);
            const dataGroup = await responseGroup.json();
            this.groupName = dataGroup.groupName || '';
            this.joinCode = dataGroup.joinCode || '';
            this.role = dataGroup.role || '';

            if (this.role !== 'admin') {
                const responsePlant = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/plant/${user.id}`);
                const dataPlant = await responsePlant.json();
                this.growth = dataPlant.growth || 0;
                this.plantId = dataPlant.plant_id ?? null;

                if (this.plantId !== null) {
                    this.plantName = this.getPlantName(this.plantId);
                    this.updatePlantImage();
                }

                const responsePoints = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/points/${user.id}`);
                const dataPoints = await responsePoints.json();
                this.points = dataPoints.points || 0;
            }

            const responseMembers = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/members`);
            this.members = await responseMembers.json();

            if (this.role === 'admin') {
                const responseRequests = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/requests`);
                this.requests = await responseRequests.json();

                const responseActions = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/actions`);
                this.actions = await responseActions.json();
            }
        } catch (error) {
            console.error('Erreur lors du chargement du groupe:', error);
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

        updatePlantImage() {
            let stage = 1;
            if (this.growth >= 0 && this.growth < 30) {
                stage = 1;
            } else if (this.growth >= 30 && this.growth < 70) {
                stage = 2;
            } else if (this.growth >= 70) {
                stage = 3;
            }
            this.plantImageUrl = `/plant${this.plantId}-${stage}.png`;
        },

        handleImageUpload(event) {
            this.actionImage = event.target.files[0];
        },

        async submitAction() {
            const user = JSON.parse(localStorage.getItem('user'));
            const groupId = this.$route.params.id;

            const formData = new FormData();
            formData.append('title', this.actionTitle);
            formData.append('description', this.actionDescription);
            if (this.actionImage) {
                formData.append('image', this.actionImage);
            }

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/actions/${user.id}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    alert('Action enregistrée avec succès ✅');
                    this.actionTitle = '';
                    this.actionDescription = '';
                    this.actionImage = null;
                } else {
                    alert('Erreur lors de l\'enregistrement.');
                }
            } catch (error) {
                console.error('Erreur action:', error);
            }
        },

        async usePoints() {
            const user = JSON.parse(localStorage.getItem('user'));
            const groupId = this.$route.params.id;

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/use-points/${user.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usedPoints: this.points })
                });

                const data = await response.json();
                if (data.success) {
                    this.points = data.newPoints;
                    this.growth = data.newGrowth;
                    this.updatePlantImage();
                    alert('Votre plante a grandi ! 🌱');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Erreur lors de l\'utilisation des points:', error);
            }
        },

        async choosePlant(plantId) {
            const user = JSON.parse(localStorage.getItem('user'));
            const groupId = this.$route.params.id;

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/choose-plant/${user.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plantId })
                });

                const data = await response.json();
                if (data.success) {
                    this.plantId = plantId;
                    this.plantName = this.getPlantName(plantId);
                    this.updatePlantImage();
                    alert('Votre plante a été adoptée avec succès ! 🌱');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Erreur lors du choix de la plante:', error);
            }
        },

        async acceptRequest(userId) {
            const groupId = this.$route.params.id;
            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/accept/${userId}`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    alert('Utilisateur accepté.');
                    this.requests = this.requests.filter(r => r.userId !== userId);
                } else {
                    alert('Erreur lors de l\'acceptation.');
                }
            } catch (error) {
                console.error('Erreur lors de l\'acceptation:', error);
            }
        },

        async rejectRequest(userId) {
            const groupId = this.$route.params.id;
            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/reject/${userId}`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    alert('Demande refusée.');
                    this.requests = this.requests.filter(r => r.userId !== userId);
                } else {
                    alert('Erreur lors du rejet.');
                }
            } catch (error) {
                console.error('Erreur lors du rejet:', error);
            }
        },

        async assignPoints(actionId, points) {
            const groupId = this.$route.params.id;
            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/assign-points/${actionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Points attribués !');
                    this.actions = this.actions.filter(a => a.id !== actionId);
                } else {
                    alert('Erreur attribution points.');
                }
            } catch (error) {
                console.error('Erreur attribution points:', error);
            }
        },

        getImageUrl(imagePath) {
            return `https://green-it-production.up.railway.app${imagePath}`;
        },

        async leaveGroup() {
            if (!confirm("Es-tu sûr de vouloir quitter ce groupe ?")) {
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            const groupId = this.$route.params.id;

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/leave/${user.id}`, {
                    method: 'POST'
                });

                const data = await response.json();
                if (data.success) {
                    alert('Vous avez quitté le groupe avec succès !');
                    this.$router.push('/groups'); // Rediriger vers la page des groupes
                } else {
                    alert('Erreur en quittant le groupe.');
                }
            } catch (error) {
                console.error('Erreur lors du départ du groupe:', error);
            }
        },

        async deleteGroup() {
            if (!confirm("Es-tu sûr de vouloir supprimer ce groupe ? (Cette action est irréversible)")) {
                return;
            }

            const groupId = this.$route.params.id;

            try {
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    alert('Groupe supprimé avec succès.');
                    this.$router.push('/groups'); // Redirige vers la liste des groupes
                } else {
                    alert('Erreur lors de la suppression.');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du groupe:', error);
            }
        }
    }
}
</script>

<style scoped>
    .plant-image {
        width: 300px;
        height: 300px;
        object-fit: contain;
        margin-bottom: 10px;
    }

    .action-image {
        width: 150px;
        height: auto;
        margin-top: 10px;
    }

    .delete-group-button {
        margin-top: 20px;
        padding: 10px;
        background-color: #ef5350;
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
    }

    .delete-group-button:hover {
        background-color: #e53935;
    }

</style>
