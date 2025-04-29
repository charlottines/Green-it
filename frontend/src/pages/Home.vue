<template>
    <div>
        <h1>Planty</h1>
        <p class="slogan">Fais grandir ta plante en sauvant la planète !</p>

        <main>
            <section>
                <h2>Qu'est-ce que Planty ?</h2>
                <p>
                    Planty est un site web ludique et éducatif qui encourage les comportements écoresponsables.
                    Réalise des actions écologiques dans la vraie vie, enregistre-les, et fais grandir ta plante virtuelle !
                </p>
            </section>

            <section>
                <h2>Comment ça marche ?</h2>
                <ol class="step-list">
                    <li>
                        <b>Crée ou rejoint un groupe</b>
                        <p>Intègre une communauté écoresponsable ou crée ton propre groupe pour partager tes efforts.</p>
                    </li>
                    <li>
                        <b>Agis</b>
                        <p>Réalise une action écologique dans la vie réelle ! (ex : tri des déchets).</p>
                    </li>
                    <li>
                        <b>Enregistre</b>
                        <p>Note ton action sur Planty pour la faire valider.</p>
                    </li>
                    <li>
                        <b>Fais pousser</b>
                        <p>Gagne des points et fais grandir ta plante virtuelle !</p>
                    </li>
                </ol>
            </section>

            <section>
                <h2>Nos Objectifs</h2>
                <ul>
                    <li>Sensibiliser à l'écologie</li>
                    <li>Favoriser l'apprentissage interactif et ludique</li>
                    <li>Créer un engagement autour du développement durable</li>
                    <li>Encourager les actions individuelles et collectives</li>
                </ul>
            </section>
        </main>
    </div>
</template>

<script>
    export default {
        name: 'Home'
    }
</script>

<style scoped>
    /* Fond et structure principale */
    div {
        min-height: calc(100vh - 100px);
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
        margin-bottom: 10px;
    }

    /* Slogan */
    .slogan {
        font-size: 1.5rem;
        font-style: italic;
        text-align: center;
        margin-bottom: 40px;
    }

    /* Partie principale */
    main {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 40px;
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

    section h2 {
        font-size: 2rem;
        color: rgb(129, 199, 132);
        margin-bottom: 10px;
    }

    section p {
        font-size: 1.2rem;
        line-height: 1.6;
    }

    /* Listes */
    .step-list {
        padding-left: 20px;
        list-style: decimal inside;
    }

    .step-list li {
        margin-bottom: 20px;
    }

    ul {
        padding-left: 20px;
        list-style: disc inside;
    }

    ul li {
        margin-bottom: 10px;
    }
</style>
