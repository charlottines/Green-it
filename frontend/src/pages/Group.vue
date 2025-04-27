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

  </script>
