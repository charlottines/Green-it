USE Planty;

-- Utilisateurs
INSERT INTO users (username, email, password) VALUES
('Bastien', 'bastien@efrei.net', 'password'),
('Ines', 'ines@efrei.net', 'password'),
('Kiroshan', 'kiroshan@efrei.net', 'password'),
('Mael', 'mael@efrei.net', 'password'),
('Paul', 'paul@efrei.net', 'password'),
('Prof', 'prof@efrei.net', 'password');


-- Groupes
INSERT INTO `groups` (name, description) VALUES
('Eco Warriors', 'Un groupe pour sauver la planète'),
('Recycle Team', 'Groupe dédié au recyclage'),
('Class G/BN', 'Groupe de la classe G/BN');


-- Relations utilisateur-groupe (user_groups)
INSERT INTO user_groups (user_id, group_id, role) VALUES
(1, 1, 'admin'),    -- kiroshan admin de Eco Warriors
(3, 1, 'member'),   -- bastien membre de Eco Warriors
(2, 1, 'member'),   -- ines membre de Eco Warriors
(4, 1, 'member'),   -- mael membre de Eco Warriors
(5, 1, 'member'),   -- paul membre de Eco Warriors

(3, 2, 'admin'),    -- bastien admin de Recycle Team
(2, 2, 'member'),   -- ines membre de Recycle Team
(1, 2, 'member'),   -- kiroshan membre de Recycle Team
(4, 2, 'member'),   -- mael membre de Recycle Team
(5, 2, 'member'),   -- paul membre de Recycle Team

(6, 3, 'admin'),    -- prof admin de Class G/BN
(3, 3, 'member'),   -- bastien membre de Class G/BN
(2, 3, 'member'),   -- ines membre de Class G/BN
(1, 3, 'member'),   -- kiroshan membre de Class G/BN
(4, 3, 'member'),   -- mael membre de Class G/BN
(5, 3, 'member');   -- paul membre de Class G/BN


-- Plantes (par utilisateur et groupe)
INSERT INTO plants (user_id, group_id, growth) VALUES
(1, 1, 50),  -- Bastien dans Eco Warriors
(3, 1, 40),  -- Kiroshan dans Eco Warriors
(2, 1, 30),  -- Ines dans Eco Warriors
(4, 1, 20),  -- Mael dans Eco Warriors
(5, 1, 10),  -- Paul dans Eco Warriors

(3, 2, 60),  -- Kiroshan dans Recycle Team
(2, 2, 25),  -- Ines dans Recycle Team
(1, 2, 35),  -- Bastien dans Recycle Team
(4, 2, 15),  -- Mael dans Recycle Team
(5, 2, 5),   -- Paul dans Recycle Team

(6, 3, 80),  -- Prof dans Class G/BN
(3, 3, 45),  -- Kiroshan dans Class G/BN
(2, 3, 20),  -- Ines dans Class G/BN
(1, 3, 55),  -- Bastien dans Class G/BN
(4, 3, 10),  -- Mael dans Class G/BN
(5, 3, 5);   -- Paul dans Class G/BN


-- Actions (par utilisateur et groupe)
INSERT INTO actions (user_id, group_id, description, impact, status) VALUES
(1, 1, 'Tri des déchets à la maison', 10, 'approved'),          -- Bastien dans Eco Warriors
(3, 1, 'Participation à un nettoyage de parc', 20, 'pending'),  -- Kiroshan dans Eco Warriors
(2, 1, 'Utilisation de produits recyclés', 15, 'approved'),     -- Ines dans Eco Warriors
(4, 1, 'Plantation d\'arbres locaux', 25, 'approved'),          -- Mael dans Eco Warriors

(3, 2, 'Compostage des déchets organiques', 30, 'approved'),        -- Kiroshan dans Recycle Team
(2, 2, 'Réduction de la consommation plastique', 20, 'pending'),    -- Ines dans Recycle Team
(1, 2, 'Recyclage du papier au bureau', 15, 'approved'),            -- Bastien dans Recycle Team

(6, 3, 'Organisation d\'une conférence sur l\'écologie', 50, 'approved'),   -- Prof dans Class G/BN
(3, 3, 'Sensibilisation des élèves au tri sélectif', 20, 'pending'),        -- Kiroshan dans Class G/BN
(2, 3, 'Participation à une campagne de reboisement', 25, 'approved'),      -- Ines dans Class G/BN
(1, 3, 'Mise en place d\'une collecte de déchets', 20, 'approved');         -- Bastien dans Class G/BN
