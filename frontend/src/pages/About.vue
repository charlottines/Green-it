<template>
    <div class="about">
        <h1>À propos du projet</h1>

        <section>
            <h2>Contexte</h2>
            <p>
                Ce projet a été réalisé dans le cadre du cours <strong>TI616 - Green IT</strong> à l'EFREI.
                L’objectif principal du module est de concevoir une solution numérique qui intègre les principes
                de l’éco-conception et de la sobriété numérique, tout en sensibilisant les utilisateurs à l’impact environnemental du numérique.
            </p>
        </section>

        <section>
            <h2>Objectif du projet</h2>
            <p>
                Notre projet consiste à développer un site web ludique qui encourage les utilisateurs à adopter
                des comportements écoresponsables. Ce site a été pensé pour minimiser son empreinte carbone
                tout en étant fonctionnel et attractif. Il respecte les bonnes pratiques de développement durable web,
                notamment en termes d’optimisation des ressources, de simplicité et d'accessibilité.
            </p>
        </section>

        <section>
            <h2>Équipe du projet</h2>
            <ul class="team-list">
                <li><strong>Inès MEHADHEBI</strong> – Design</li>
                <li><strong>Bastien FRANJA</strong> – Développement backend et authentification</li>
                <li><strong>Kiroshan SIVAKUMAR</strong> – Développement frontend</li>
                <li><strong>Maël LE BRIS</strong> – Base de données</li>
                <li><strong>Paul SAADE</strong> – Développement backend et appel API</li>
            </ul>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'About'
    }
</script>

<style scoped>
    /* Fond et structure principale */
    .about {
        min-height: calc(100vh - 100px); /* pour éviter que le footer remonte */
        background-color: rgb(30, 30, 30);
        color: white;
        padding: 20px;
        font-family: Arial, sans-serif;
    }

    /* Titre principal */
    h1 {
        font-size: 3rem;
        color: rgb(129, 199, 132);
        text-align: center;
        margin-bottom: 40px;
    }

    /* Partie principale (sections) */
    .about main {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    /* Sections = les bulles */
    section {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
    }

    /* Effet léger au survol */
    section:hover {
        transform: translateY(-5px);
    }

    /* Titre des sections */
    h2 {
        font-size: 2rem;
        color: rgb(129, 199, 132);
        margin-bottom: 10px;
    }

    /* Texte normal */
    p, li {
        font-size: 1.2rem;
        line-height: 1.6;
    }

    /* Liste des membres */
    .team-list {
        padding-left: 20px;
        list-style: disc inside;
    }

    .team-list li {
        margin-bottom: 10px;
    }
</style>