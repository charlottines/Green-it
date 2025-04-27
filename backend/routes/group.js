const express = require('express');
const router = express.Router();
const pool = require('../db');

// Fonction utilitaire : Génère un code d'invitation à 6 chiffres
function generateJoinCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/*
    ROUTES DE GESTION DES GROUPES
*/

// Créer un nouveau groupe
router.post('/groups/create', async (req, res) => {
    const { userId, name, description } = req.body;

    try {
        const joinCode = generateJoinCode();

        const [result] = await pool.query(
            'INSERT INTO `groups` (name, description, join_code) VALUES (?, ?, ?)',
            [name, description, joinCode]
        );

        const groupId = result.insertId;

        await pool.query(
            'INSERT INTO user_groups (user_id, group_id, role) VALUES (?, ?, ?)',
            [userId, groupId, 'admin']
        );

        res.status(201).json({ success: true, message: 'Groupe créé avec succès.', groupId, joinCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la création du groupe.' });
    }
});

// Rejoindre un groupe par code
router.post('/groups/request', async (req, res) => {
    const { userId, joinCode } = req.body;

    try {
        const [groups] = await pool.query('SELECT * FROM `groups` WHERE join_code = ?', [joinCode]);

        if (groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Code invalide.' });
        }

        const group = groups[0];

        const [alreadyMember] = await pool.query(
            'SELECT * FROM user_groups WHERE user_id = ? AND group_id = ?',
            [userId, group.id]
        );

        if (alreadyMember.length > 0) {
            return res.status(400).json({ success: false, message: 'Vous êtes déjà membre de ce groupe.' });
        }

        const [alreadyRequested] = await pool.query(
            'SELECT * FROM group_requests WHERE user_id = ? AND group_id = ?',
            [userId, group.id]
        );

        if (alreadyRequested.length > 0) {
            return res.status(400).json({ success: false, message: 'Demande déjà envoyée.' });
        }

        await pool.query(
            'INSERT INTO group_requests (group_id, user_id, status) VALUES (?, ?, ?)',
            [group.id, userId, 'pending']
        );

        res.status(201).json({ success: true, message: 'Demande envoyée.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la demande.' });
    }
});

// Voir les demandes d'adhésion d'un groupe
router.get('/groups/:groupId/requests', async (req, res) => {
    const { groupId } = req.params;

    try {
        const [requests] = await pool.query(
            `SELECT group_requests.id, users.username, group_requests.status, users.id as userId
             FROM group_requests
             JOIN users ON users.id = group_requests.user_id
             WHERE group_requests.group_id = ?`,
            [groupId]
        );

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des demandes.' });
    }
});

// Accepter une demande d'adhésion
router.post('/groups/:groupId/accept/:userId', async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        await pool.query(
            'INSERT INTO user_groups (user_id, group_id, role) VALUES (?, ?, ?)',
            [userId, groupId, 'member']
        );

        await pool.query(
            'DELETE FROM group_requests WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        res.status(200).json({ success: true, message: 'Utilisateur accepté.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'acceptation.' });
    }
});

// Refuser une demande d'adhésion
router.post('/groups/:groupId/reject/:userId', async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        await pool.query(
            'DELETE FROM group_requests WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        res.status(200).json({ success: true, message: 'Demande refusée.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors du rejet.' });
    }
});

// Voir les infos du groupe + rôle de l'utilisateur
router.get('/groups/:groupId/user/:userId', async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        const [[group]] = await pool.query('SELECT * FROM `groups` WHERE id = ?', [groupId]);
        const [[membership]] = await pool.query('SELECT role FROM user_groups WHERE user_id = ? AND group_id = ?', [userId, groupId]);

        if (!group || !membership) {
            return res.status(404).json({ success: false, message: 'Groupe ou utilisateur non trouvé.' });
        }

        res.status(200).json({
            groupName: group.name,
            joinCode: group.join_code,
            role: membership.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

/*
    ROUTES COMPLÉMENTAIRES POUR GROUP.VUE
*/

// Récupérer tous les membres d'un groupe
router.get('/groups/:groupId/members', async (req, res) => {
    const { groupId } = req.params;

    try {
        const [members] = await pool.query(
            `SELECT users.id, users.username, user_groups.role
             FROM user_groups
             JOIN users ON user_groups.user_id = users.id
             WHERE user_groups.group_id = ?`,
            [groupId]
        );

        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des membres.' });
    }
});

// Récupérer la plante d'un utilisateur dans un groupe
router.get('/groups/:groupId/plant/:userId', async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        const [plants] = await pool.query(
            `SELECT growth, plant_id FROM plants WHERE user_id = ? AND group_id = ?`,
            [userId, groupId]
        );

        if (plants.length === 0) {
            return res.status(404).json({ message: "Plante non trouvée." });
        }

        res.status(200).json(plants[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la plante.' });
    }
});

// Supprimer un groupe
router.delete('/groups/:groupId', async (req, res) => {
    const { groupId } = req.params;

    try {
        await pool.query('DELETE FROM `groups` WHERE id = ?', [groupId]);
        res.status(200).json({ success: true, message: 'Groupe supprimé.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression du groupe.' });
    }
});

// Modifier le nom et la description d'un groupe
router.put('/groups/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { name, description } = req.body;

    try {
        await pool.query('UPDATE `groups` SET name = ?, description = ? WHERE id = ?', [name, description, groupId]);
        res.status(200).json({ success: true, message: 'Groupe modifié avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la modification du groupe.' });
    }
});

// 🌱 Choisir une plante dans un groupe
router.post('/groups/:groupId/choose-plant/:userId', async (req, res) => {
    const { groupId, userId } = req.params;
    const { plantId } = req.body;

    try {
        const [existingPlant] = await pool.query(
            'SELECT * FROM plants WHERE user_id = ? AND group_id = ?',
            [userId, groupId]
        );

        if (existingPlant.length > 0 && existingPlant[0].plant_id) {
            return res.status(400).json({ success: false, message: 'Vous avez déjà choisi une plante.' });
        }

        if (existingPlant.length === 0) {
            await pool.query(
                'INSERT INTO plants (user_id, group_id, growth, plant_id) VALUES (?, ?, ?, ?)',
                [userId, groupId, 0, plantId]
            );
        } else {
            await pool.query(
                'UPDATE plants SET plant_id = ? WHERE user_id = ? AND group_id = ?',
                [plantId, userId, groupId]
            );
        }

        res.status(200).json({ success: true, message: 'Plante choisie avec succès.' });
    } catch (error) {
        console.error('Erreur lors du choix de la plante :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors du choix de la plante.' });
    }
});

module.exports = router;
