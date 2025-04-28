const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); // Dossier temporaire pour images

/*
    Fonctions
*/

// Générer un code de groupe aléatoire à 6 chiffres
function generateJoinCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Supprimer les actions expirées (plus de 7 jours)
async function cleanupOldActions() {
    try {
        const [oldActions] = await pool.query(
            `SELECT id, image_path FROM actions 
             WHERE status = 'pending' AND created_at < NOW() - INTERVAL 7 DAY`
        );

        for (const action of oldActions) {
            if (action.image_path) {
                const filePath = `.${action.image_path}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Supprimer l'action elle-même
            await pool.query('DELETE FROM actions WHERE id = ?', [action.id]);
        }

        console.log(`✅ Nettoyage terminé : ${oldActions.length} actions supprimées.`);
    } catch (error) {
        console.error('Erreur lors du nettoyage des actions expirées:', error);
    }
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

// Choisir une plante dans un groupe
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
                'INSERT INTO plants (user_id, group_id, growth, points, plant_id) VALUES (?, ?, ?, ?, ?)',
                [userId, groupId, 0, 0, plantId]
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

router.get('/groups/:groupId/points/:userId', async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        const [[plant]] = await pool.query(
            'SELECT points FROM plants WHERE user_id = ? AND group_id = ?',
            [userId, groupId]
        );

        if (!plant) {
            return res.status(404).json({ message: "Plante non trouvée." });
        }

        res.status(200).json({ points: plant.points });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des points.' });
    }
});

router.post('/groups/:groupId/use-points/:userId', async (req, res) => {
    const { groupId, userId } = req.params;
    const { usedPoints } = req.body;

    try {
        const [[plant]] = await pool.query(
            'SELECT points, growth FROM plants WHERE user_id = ? AND group_id = ?',
            [userId, groupId]
        );

        if (!plant || plant.points < usedPoints) {
            return res.status(400).json({ message: "Pas assez de points." });
        }

        const newPoints = plant.points - usedPoints;
        const newGrowth = Math.min(plant.growth + usedPoints, 100); // limite 100%

        await pool.query(
            'UPDATE plants SET points = ?, growth = ? WHERE user_id = ? AND group_id = ?',
            [newPoints, newGrowth, userId, groupId]
        );

        res.status(200).json({ success: true, newPoints, newGrowth });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'utilisation des points.' });
    }
});

// Enregistrer une nouvelle action (titre, description, image)
router.post('/groups/:groupId/actions/:userId', upload.single('image'), async (req, res) => {
    const { groupId, userId } = req.params;
    const { title, description } = req.body;

    let imagePath = null;

    try {
        if (req.file) {
            const filename = `action-${Date.now()}.webp`;
            await sharp(req.file.path)
                .resize(500, 500, { fit: 'inside' }) // max 500x500px
                .webp({ quality: 80 })               // compression qualité 80%
                .toFile(`uploads/${filename}`);

            // Supprimer l'image originale
            fs.unlinkSync(req.file.path);

            imagePath = `/uploads/${filename}`; // chemin pour accéder à l'image
        }

        await pool.query(
            'INSERT INTO actions (user_id, group_id, description, image_path, impact, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [userId, groupId, description, imagePath, 0, 'pending']
        );

        res.status(201).json({ success: true, message: "Action enregistrée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement de l'action." });
    }
});

router.get('/groups/:groupId/actions', async (req, res) => {
    const { groupId } = req.params;

    try {
        const [actions] = await pool.query(
            `SELECT actions.id, users.username, actions.description, actions.image_path, actions.status
            FROM actions
            JOIN users ON users.id = actions.user_id
            WHERE actions.group_id = ? AND actions.status = 'pending'`,
            [groupId]
        );

        res.status(200).json(actions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des actions." });
    }
});

router.post('/groups/:groupId/assign-points/:actionId', async (req, res) => {
    const { groupId, actionId } = req.params;
    const { points } = req.body;

    try {
        const [[action]] = await pool.query('SELECT user_id, image_path FROM actions WHERE id = ?', [actionId]);

        if (!action) {
            return res.status(404).json({ message: "Action non trouvée." });
        }

        const userId = action.user_id;

        // Mettre à jour les points de la plante de l'utilisateur
        await pool.query(
            'UPDATE plants SET points = points + ? WHERE user_id = ? AND group_id = ?',
            [points, userId, groupId]
        );

        // Marquer l'action comme approuvée
        await pool.query(
            'UPDATE actions SET impact = ?, status = ? WHERE id = ?',
            [points, 'approved', actionId]
        );

        // Supprimer l'image associée si elle existe
        if (action.image_path) {
            const imagePath = `.${action.image_path}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ success: true, message: "Points attribués avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'attribution des points." });
    }
});


module.exports = router;
