const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Planty');
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
