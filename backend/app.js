const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());

// Vérifie que la base de donnée en ligne est accessible
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion réussie à Railway MySQL !');
        connection.release();
    } catch (error) {
        console.error('❌ Erreur de connexion à Railway :', error);
    }
}

// Création de la base de données
async function setupDatabase() {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS \`groups\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS user_groups (
            user_id INT NOT NULL,
            group_id INT NOT NULL,
            role ENUM('admin', 'member') DEFAULT 'member',
            PRIMARY KEY (user_id, group_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE)`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS plants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            group_id INT NOT NULL,
            growth INT DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE)`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS actions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            group_id INT NOT NULL,
            description TEXT NOT NULL,
            impact INT DEFAULT 0,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE)`
        );

        console.log('✅ Tables vérifiées / créées avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors du setup de la DB :', error);
    }
}

testDatabaseConnection();
setupDatabase();

// Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Planty 🌱');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
