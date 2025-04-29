<template>
    <footer class="footer">
        <p>&copy; 2025 Planty. Projet TI616 - Green IT.</p>
        <div class="links">
            <a href="#">Contact</a>
            <router-link to="/about">À propos</router-link>
        </div>
    </footer>
</template>
  
<script>
    export default {
        name: 'Footer'
    }
</script>

<style scoped>
    .footer {
        width: 100%;
        background-color: rgb(70, 65, 65);
        text-align: center;
        padding: 20px 0;
        font-size: 14px;
        font-family: Arial, sans-serif;
        position: relative;
        bottom: 0;
    }

    /* Texte principal */
    .footer p {
        margin: 0;
        margin-bottom: 10px;
    }

    /* Section des liens */
    .links {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    /* Les liens eux-mêmes */
    .links a {
        color: rgb(129, 199, 132);
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
    }

    /* Hover sur les liens */
    .links a:hover {
        color: rgb(102, 187, 106);
    }
</style>
