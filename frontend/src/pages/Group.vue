<template>
    <div class="group-page">
        <h2>Groupe :</h2>

        <div v-if="role === 'admin'" class="admin-actions">

            <div v-if="!isEditing">
                <p><strong>Nom :</strong> {{ groupName }}</p>
                <p><strong>Description :</strong> {{ groupDescription }}</p>
                <button @click="isEditing = true">Modifier le Groupe</button>
            </div>

            <div v-else>
                <label>Nom du groupe :</label>
                <input v-model="editedName" type="text" />

                <label>Description :</label>
                <textarea v-model="editedDescription"></textarea>

                <button @click="saveChanges">Enregistrer</button>
                <button @click="cancelEditing">Annuler</button>
            </div>

            <p><strong>Code d'invitation :</strong> {{ joinCode }}</p>
            <button @click="deleteGroup">Supprimer le Groupe</button>
        </div>

        <hr />

        <div v-if="members.length > 0">
            <h3>Membres du Groupe</h3>
            <ul>
                <li v-for="member in members" :key="member.id">
                    {{ member.username }} - <em>{{ member.role }}</em>
                </li>
            </ul>
        </div>

        <div v-else>
            <p>Chargement des membres...</p>
        </div>

        <hr />

        <div class="my-plant">
            <h3>Ma Plante</h3>
            <p>Croissance : {{ growth }}%</p>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            groupName: '',
            groupDescription: '',
            joinCode: '',
            role: '',
            members: [],
            growth: 0,
            editedName: '',
            editedDescription: '',
            isEditing: false
        }
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
            this.groupDescription = dataGroup.groupDescription || ''; // Si tu ajoutes la description dans ta DB
            this.joinCode = dataGroup.joinCode || '';
            this.role = dataGroup.role || '';

            this.editedName = this.groupName;
            this.editedDescription = this.groupDescription;

            const responseMembers = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/members`);
            const dataMembers = await responseMembers.json();
            this.members = dataMembers || [];

            const responsePlant = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}/plant/${user.id}`);
            const dataPlant = await responsePlant.json();
            this.growth = dataPlant.growth || 0;

        } catch (error) {
            console.error('Erreur lors du chargement du groupe:', error);
        }
    },

    methods: {
        async saveChanges() {
            try {
                const groupId = this.$route.params.id;
                const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.editedName,
                        description: this.editedDescription
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Modifications enregistrées avec succès.');
                    this.groupName = this.editedName;
                    this.groupDescription = this.editedDescription;
                    this.isEditing = false;
                } else {
                    alert('Erreur lors de l\'enregistrement des modifications.');
                }
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
            }
        },

        cancelEditing() {
            this.isEditing = false;
            this.editedName = this.groupName;
            this.editedDescription = this.groupDescription;
        },

        async deleteGroup() {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.')) {
                try {
                    const groupId = this.$route.params.id;
                    const response = await fetch(`https://green-it-production.up.railway.app/api/groups/${groupId}`, {
                        method: 'DELETE'
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Groupe supprimé avec succès.');
                        this.$router.push('/groups');
                    } else {
                        alert('Erreur lors de la suppression du groupe.');
                    }
                } catch (error) {
                    console.error('Erreur lors de la suppression du groupe:', error);
                }
            }
        }
    }
}
</script>
