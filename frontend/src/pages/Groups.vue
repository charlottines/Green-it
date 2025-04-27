<template>
    <div>
        <h1>Mes Groupes</h1>

        <div v-if="groups.length > 0">
            <div v-for="group in groups" :key="group.id">
                <h3>{{ group.name }}</h3>
                <p>{{ group.description }}</p>
                <span v-if="group.role === 'admin'">👑 Admin</span>
                <span v-else-if="group.role === 'member'">👥 Membre</span>
            </div>
        </div>
        <p v-else>Tu ne fais partie d'aucun groupe.</p>
    </div>
</template>

<script>
    export default {
        name: 'Groups',

        data() {
            return {
                groups: []
            }
        },
    }
</script>
