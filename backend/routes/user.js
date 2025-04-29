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

// Récupérer toutes les plantes d'un utilisateur
router.get('/user/:userId/plants', async (req, res) => {
    const { userId } = req.params;

    try {
        const [plants] = await pool.query(
            `SELECT plants.growth, plants.plant_id, groups.name AS groupName
             FROM plants
             JOIN groups ON plants.group_id = groups.id
             WHERE plants.user_id = ?`,
            [userId]
        );

        res.status(200).json(plants);
    } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des plantes." });
    }
});

// Modifier un compte utilisateur
router.put('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    try {
        if (!username && !email && !password) {
            return res.status(400).json({ success: false, message: 'Aucune donnée fournie.' });
        }

        const fields = [];
        const values = [];

        if (username) {
            fields.push('username = ?');
            values.push(username);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (password) {
            fields.push('password = ?');
            values.push(password);
        }

        values.push(userId);

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        await pool.query(query, values);

        res.status(200).json({ success: true, message: 'Utilisateur modifié avec succès.' });
    } catch (error) {
        console.error('Erreur modification utilisateur:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

// Supprimer un compte utilisateur
router.delete('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).json({ success: true, message: 'Utilisateur supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression." });
    }
});

module.exports = router;
