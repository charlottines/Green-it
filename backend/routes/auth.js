const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// Route d'inscription
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Nom d’utilisateur ou email déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ success: true, message: 'Inscription réussie.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur lors de l’inscription.' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
        }

        res.status(200).json({ success: true, message: 'Connexion réussie.', user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur lors de la connexion.' });
    }
});

module.exports = router;