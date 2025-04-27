router.get('/:id/groups', async (req, res) => {
    const userId = req.params.id;

    try {
        const [groups] = await pool.query(
            `SELECT g.id, g.name, g.description,
                    IF(g.admin_id = ?, 'admin', 'member') AS role
             FROM user_groups ug
             JOIN groups g ON g.id = ug.group_id
             WHERE ug.user_id = ?`,
            [userId, userId]
        );

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes' });
    }
});

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Récupérer les plantes d'un utilisateur
router.get('/:id/plants', async (req, res) => {
    const userId = req.params.id;

    try {
        const [plants] = await pool.query(
            `SELECT plants.id, plants.growth, plants.last_updated, plants.group_id
             FROM plants
             WHERE plants.user_id = ?`,
            [userId]
        );

        res.status(200).json(plants);
    } catch (error) {
        console.error('Erreur lors de la récupération des plantes :', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Récupérer tous les groupes où l'utilisateur est membre ou admin
router.get('/:id/groups', async (req, res) => {
    const userId = req.params.id;

    try {
        const [groups] = await pool.query(
            `SELECT g.id, g.name, g.description, ug.role
             FROM user_groups ug
             JOIN \`groups\` g ON g.id = ug.group_id
             WHERE ug.user_id = ?`,
            [userId]
        );

        res.status(200).json(groups);
    } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
