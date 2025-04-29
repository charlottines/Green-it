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
    .about {
        padding: 40px 20px;
        max-width: 900px;
        margin: 0 auto;
        background-color: #1e1e1e;
        color: white;
        font-family: Arial, sans-serif;
    }

    h1 {
        font-size: 2.5rem;
        color: #81c784;
        text-align: center;
        margin-bottom: 30px;
    }

    /* Sections */
    section {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
    }

    h2 {
        font-size: 1.8rem;
        color: #81c784;
        margin-bottom: 15px;
    }

    p, li {
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .team-list {
        list-style: none;
        padding-left: 0;
    }

    .team-list li::before {
        margin-right: 8px;
    }
</style>
