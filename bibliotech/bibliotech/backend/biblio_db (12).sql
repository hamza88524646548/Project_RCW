-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 25 avr. 2025 à 08:23
-- Version du serveur : 11.6.2-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `biblio_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `agenda`
--

CREATE TABLE `agenda` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_document` bigint(20) UNSIGNED NOT NULL,
  `date_reservation` date NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_fin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agenda`
--

INSERT INTO `agenda` (`id`, `id_user`, `id_document`, `date_reservation`, `heure_debut`, `heure_fin`, `note`, `created_at`, `date_fin`) VALUES
(1, 1, 106, '2025-03-30', '23:45:00', '00:47:00', 'emprunt', '2025-03-30 03:46:10', '2025-03-31'),
(2, 1, 115, '2025-03-30', '02:00:00', '03:00:00', NULL, '2025-03-30 03:57:19', '2025-04-01'),
(3, 1, 106, '2025-04-15', '10:00:00', '10:15:00', 'emprunt', '2025-03-30 04:16:09', '2025-03-18'),
(4, 14, 122, '2025-04-01', '18:40:00', '20:45:00', 'rien de dire', '2025-04-01 20:41:18', '2025-04-25');

-- --------------------------------------------------------

--
-- Structure de la table `amendes`
--

CREATE TABLE `amendes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL,
  `id_emprunt` bigint(20) UNSIGNED NOT NULL,
  `montant` decimal(10,2) NOT NULL DEFAULT 0.00,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('impayée','payée') DEFAULT 'impayée'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `amendes`
--

INSERT INTO `amendes` (`id`, `id_user`, `id_emprunt`, `montant`, `date_creation`, `statut`) VALUES
(1, NULL, 1, 165.00, '2025-04-24 20:11:44', 'impayée'),
(2, NULL, 2, 150.00, '2025-04-24 20:11:44', 'impayée'),
(3, NULL, 3, 150.00, '2025-04-24 20:11:44', 'impayée'),
(4, NULL, 4, 150.00, '2025-04-24 20:11:44', 'impayée'),
(5, NULL, 5, 150.00, '2025-04-24 20:11:44', 'impayée'),
(6, NULL, 6, 150.00, '2025-04-24 20:11:44', 'impayée'),
(7, NULL, 7, 45.00, '2025-04-24 20:11:44', 'impayée'),
(8, NULL, 1, 165.00, '2025-04-24 20:15:47', 'impayée'),
(9, NULL, 2, 150.00, '2025-04-24 20:15:47', 'impayée'),
(10, NULL, 3, 150.00, '2025-04-24 20:15:47', 'impayée'),
(11, NULL, 4, 150.00, '2025-04-24 20:15:47', 'impayée'),
(12, NULL, 5, 150.00, '2025-04-24 20:15:47', 'impayée'),
(13, NULL, 6, 150.00, '2025-04-24 20:15:47', 'impayée'),
(14, NULL, 7, 45.00, '2025-04-24 20:15:47', 'impayée'),
(15, NULL, 1, 165.00, '2025-04-24 20:20:24', 'impayée'),
(16, NULL, 2, 150.00, '2025-04-24 20:20:24', 'impayée'),
(17, NULL, 3, 150.00, '2025-04-24 20:20:24', 'impayée'),
(18, NULL, 4, 150.00, '2025-04-24 20:20:24', 'impayée'),
(19, NULL, 5, 150.00, '2025-04-24 20:20:24', 'impayée'),
(20, NULL, 6, 150.00, '2025-04-24 20:20:24', 'impayée'),
(21, NULL, 7, 45.00, '2025-04-24 20:20:24', 'impayée'),
(22, NULL, 1, 170.00, '2025-04-25 05:10:47', 'impayée'),
(23, NULL, 2, 155.00, '2025-04-25 05:10:47', 'impayée'),
(24, NULL, 3, 155.00, '2025-04-25 05:10:47', 'impayée'),
(25, NULL, 4, 155.00, '2025-04-25 05:10:47', 'impayée'),
(26, NULL, 5, 155.00, '2025-04-25 05:10:47', 'impayée'),
(27, NULL, 6, 155.00, '2025-04-25 05:10:47', 'impayée'),
(28, NULL, 7, 50.00, '2025-04-25 05:10:47', 'impayée'),
(29, NULL, 1, 170.00, '2025-04-25 05:28:32', 'impayée'),
(30, NULL, 2, 155.00, '2025-04-25 05:28:32', 'impayée'),
(31, NULL, 3, 155.00, '2025-04-25 05:28:32', 'impayée'),
(32, NULL, 4, 155.00, '2025-04-25 05:28:32', 'impayée'),
(33, NULL, 5, 155.00, '2025-04-25 05:28:32', 'impayée'),
(34, NULL, 6, 155.00, '2025-04-25 05:28:32', 'impayée'),
(35, NULL, 7, 50.00, '2025-04-25 05:28:32', 'impayée'),
(36, NULL, 1, 170.00, '2025-04-25 05:28:35', 'impayée'),
(37, NULL, 2, 155.00, '2025-04-25 05:28:35', 'impayée'),
(38, NULL, 3, 155.00, '2025-04-25 05:28:35', 'impayée'),
(39, NULL, 4, 155.00, '2025-04-25 05:28:35', 'impayée'),
(40, NULL, 5, 155.00, '2025-04-25 05:28:35', 'impayée'),
(41, NULL, 6, 155.00, '2025-04-25 05:28:35', 'impayée'),
(42, NULL, 7, 50.00, '2025-04-25 05:28:35', 'impayée'),
(43, NULL, 1, 170.00, '2025-04-25 05:37:17', 'impayée'),
(44, NULL, 2, 155.00, '2025-04-25 05:37:17', 'impayée'),
(45, NULL, 3, 155.00, '2025-04-25 05:37:17', 'impayée'),
(46, NULL, 4, 155.00, '2025-04-25 05:37:17', 'impayée'),
(47, NULL, 5, 155.00, '2025-04-25 05:37:17', 'impayée'),
(48, NULL, 6, 155.00, '2025-04-25 05:37:17', 'impayée'),
(49, NULL, 7, 50.00, '2025-04-25 05:37:17', 'impayée'),
(50, NULL, 1, 170.00, '2025-04-25 05:42:55', 'impayée'),
(51, NULL, 2, 155.00, '2025-04-25 05:42:55', 'impayée'),
(52, NULL, 3, 155.00, '2025-04-25 05:42:55', 'impayée'),
(53, NULL, 4, 155.00, '2025-04-25 05:42:55', 'impayée'),
(54, NULL, 5, 155.00, '2025-04-25 05:42:55', 'impayée'),
(55, NULL, 6, 155.00, '2025-04-25 05:42:55', 'impayée'),
(56, NULL, 7, 50.00, '2025-04-25 05:42:55', 'impayée');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `nom`) VALUES
(2, 'Fantasy'),
(5, 'Histoire'),
(3, 'Horreur'),
(4, 'Philosophie'),
(1, 'Science-Fiction'),
(6, 'Technologie');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(200) NOT NULL,
  `auteur` varchar(150) NOT NULL,
  `id_categorie` bigint(20) UNSIGNED NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `documents`
--

INSERT INTO `documents` (`id`, `titre`, `auteur`, `id_categorie`, `description`, `image_url`, `prix`) VALUES
(96, 'Dune', 'Frank Herbert', 1, 'Dune est un roman de science-fiction emblématique...', 'Dune.jpg', 19.99),
(97, 'Neuromancien', 'William Gibson', 1, 'Neuromancien, de William Gibson, est un roman fondateur du cyberpunk...', 'Neuromancien.jpg', 14.99),
(98, 'Fondation', 'Isaac Asimov', 1, 'Fondation, d\'Isaac Asimov, est une œuvre majeure de la science-fiction...', 'Fondation.jpg', 16.50),
(99, 'Hyperion', 'Dan Simmons', 1, 'Hyperion, de Dan Simmons, est un space opera épique...', 'Hyperion.jpg', 18.75),
(100, 'Le Problème à Trois Corps', 'Liu Cixin', 1, 'Le Problème à Trois Corps, de Liu Cixin, est un roman de science-fiction révolutionnaire...', 'Le_Probleme_a_Trois_Corps.jpg', 22.99),
(101, 'La Stratégie Ender', 'Orson Scott Card', 1, 'La Stratégie Ender, d\'Orson Scott Card, est un classique de la science-fiction militaire...', 'La_Strategie_Ender.jpg', 15.99),
(102, 'Silo', 'Hugh Howey', 1, 'Silo, de Hugh Howey, est une dystopie captivante sous terre...', 'silo.jpg', 17.49),
(103, 'Le Meilleur des Mondes', 'Aldous Huxley', 1, 'Le Meilleur des Mondes, d\'Aldous Huxley, est une vision troublante du futur...', 'Le_Meilleur_des_Mondes.jpg', 13.99),
(104, '1984', 'George Orwell', 1, '1984, de George Orwell, est une dystopie emblématique...', '1984.jpg', 14.50),
(105, 'La Guerre Éternelle', 'Joe Haldeman', 1, 'Un regard unique sur la guerre interstellaire...', 'La_Guerre_Eternelle.jpg', 20.00),
(107, 'Le Nom du Vent', 'Patrick Rothfuss', 2, 'Le Nom du Vent, de Patrick Rothfuss, est un roman de fantasy incontournable...', 'Le_Nom_du_Vent.jpg', 23.75),
(109, 'Les Chroniques de Narnia', 'C.S. Lewis', 2, 'Une aventure féerique...', 'Les_Chroniques_de_Narnia.jpg', 18.99),
(113, 'Le Trône de Fer', 'George R.R. Martin', 2, 'Une intrigue politique captivante...', 'Le_trone_de_Fer.jpg', 27.50),
(114, 'Le Fléau', 'Stephen King', 3, 'Le Fléau, de Stephen King, est une fresque post-apocalyptique...', 'Le_Fleau.jpg', 21.00),
(115, 'La Roue du Temps', 'Robert Jordan', 2, 'Un classique de la fantasy...', 'La_Roue_du_Temps.jpg', 26.99),
(117, 'Ainsi parlait Zarathoustra', 'Friedrich Nietzsche', 4, 'Un ouvrage incontournable...', 'Ainsi_parlait_Zarathoustra.jpg', 10.99),
(121, 'Dracula', 'Bram Stoker', 3, 'Le roman de vampires le plus célèbre...', 'Dracula.jpg', 12.99),
(122, 'Frankenstein', 'Mary Shelley', 3, 'Un classique de l\'horreur gothique...', 'Frankenstein.jpg', 11.99),
(124, 'Les Rats', 'James Herbert', 3, 'Un livre de créatures effrayantes...', 'Les_Rats.jpg', 9.50),
(125, 'Simetierre', 'Stephen King', 3, 'Un des meilleurs romans de King...', 'simetierre.jpg', 14.25),
(126, 'Sapiens', 'Yuval Noah Harari', 5, 'Une histoire captivante de l\'humanité...', 'Sapiens.jpg', 24.00),
(127, 'Guerre et Paix', 'Léon Tolstoï', 6, 'Un regard historique et romancé...', 'Guerre_et_Paix.jpg', 28.99),
(128, 'Les Misérables', 'Victor Hugo', 5, 'Un roman historique bouleversant...', 'Les_Miserables.jpg', 20.99),
(130, 'Le Monde du Cloud', 'Marc Benioff', 6, 'Comprendre le cloud computing...', 'Le_Monde_du_Cloud.jpg', 19.50);

-- --------------------------------------------------------

--
-- Structure de la table `emprunts`
--

CREATE TABLE `emprunts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_exemplaire` bigint(20) UNSIGNED NOT NULL,
  `date_emprunt` date NOT NULL DEFAULT curdate(),
  `date_retour_prevu` date NOT NULL,
  `date_retour` date DEFAULT NULL,
  `statut` enum('en cours','retourné','en retard') DEFAULT 'en cours'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `emprunts`
--

INSERT INTO `emprunts` (`id`, `id_user`, `id_exemplaire`, `date_emprunt`, `date_retour_prevu`, `date_retour`, `statut`) VALUES
(1, 7, 1, '2025-03-08', '2025-03-22', '2025-04-25', 'retourné'),
(2, 12, 2, '2025-03-11', '2025-03-25', '2025-04-25', 'retourné'),
(3, 12, 3, '2025-03-11', '2025-03-25', '2025-04-25', 'retourné'),
(4, 12, 4, '2025-03-11', '2025-03-25', '2025-04-25', 'retourné'),
(5, 12, 5, '2025-03-11', '2025-03-25', '2025-04-25', 'retourné'),
(6, 12, 6, '2025-03-11', '2025-03-25', '2025-04-25', 'retourné'),
(7, 14, 17, '2025-04-01', '2025-04-15', '2025-04-25', 'retourné'),
(15, 23, 30, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(16, 23, 15, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(17, 23, 22, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(18, 23, 24, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(19, 23, 31, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(20, 23, 30, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(21, 23, 27, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(22, 23, 32, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(23, 23, 24, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(24, 23, 15, '2025-04-25', '2025-04-25', '2025-04-25', 'retourné'),
(25, 23, 22, '2025-04-25', '2025-04-25', NULL, 'en retard');

--
-- Déclencheurs `emprunts`
--
DELIMITER $$
CREATE TRIGGER `generer_amende` AFTER UPDATE ON `emprunts` FOR EACH ROW BEGIN
    IF NEW.date_retour IS NOT NULL AND NEW.date_retour > NEW.date_retour_prevu THEN
        INSERT INTO amendes (id_emprunt, montant, statut, date_creation)
        VALUES (NEW.id, DATEDIFF(NEW.date_retour, NEW.date_retour_prevu) * 5.00, 'impayée', NOW());
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `exemplaires`
--

CREATE TABLE `exemplaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_document` bigint(20) UNSIGNED NOT NULL,
  `numero_exemplaire` varchar(50) NOT NULL,
  `disponible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `exemplaires`
--

INSERT INTO `exemplaires` (`id`, `id_document`, `numero_exemplaire`, `disponible`) VALUES
(1, 107, 'EX-107-1741475173812', 0),
(2, 104, 'EX-104-1741667594860', 1),
(3, 121, 'EX-121-1741667631727', 0),
(4, 130, 'EX-130-1741667640166', 0),
(5, 97, 'EX-97-1741668787602', 0),
(6, 114, 'EX-114-1741668887185', 0),
(7, 97, 'EX-97-1741669503466', 0),
(8, 107, 'EX-107-1741669628678', 0),
(9, 98, 'EX-98-1741670887722', 0),
(10, 104, 'EX-104-1741671076609', 0),
(11, 96, 'EX-96-1741671120261', 0),
(12, 99, 'EX-99-1741672190599', 0),
(13, 99, 'EX-99-1741673657107', 0),
(14, 98, 'EX-98-1741707271132', 0),
(15, 128, 'EX-128-1743530349009', 1),
(16, 113, 'EX-113-1743530392636', 1),
(17, 107, 'EX-107-1743530481373', 1),
(18, 126, 'EX-126-1743540403394', 0),
(19, 127, 'EX-127-1745523314957', 0),
(20, 130, 'EX-130-1745523533909', 0),
(21, 103, 'EX-103-1745523705897', 0),
(22, 122, 'EX-122-1745524555602', 0),
(23, 130, 'EX-130-1745524819653', 0),
(24, 130, 'EX-130-1745525636067', 0),
(25, 125, 'EX-125-1745526038183', 0),
(26, 114, 'EX-114-1745538368317', 0),
(27, 127, 'EX-127-1745538423856', 1),
(28, 125, 'EX-125-1745538499504', 1),
(29, 102, 'EX-102-1745557289459', 1),
(30, 105, 'EX-105-1745557714628', 0),
(31, 100, 'EX-100-1745559451113', 1),
(32, 127, 'EX-127-1745560401665', 1);

-- --------------------------------------------------------

--
-- Structure de la table `historique_bannissements`
--

CREATE TABLE `historique_bannissements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_admin` bigint(20) UNSIGNED NOT NULL,
  `action` enum('banni','réactivé') NOT NULL,
  `date_action` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `lu` tinyint(1) DEFAULT 0,
  `date_creation` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `lu`, `date_creation`) VALUES
(2, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Simetierre\".', 'retard', 0, '2025-04-24 20:21:39'),
(4, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"La Guerre Éternelle\".', 'retard', 0, '2025-04-25 05:10:18'),
(6, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Les Misérables\".', 'retard', 0, '2025-04-25 05:12:18'),
(8, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Frankenstein\".', 'retard', 0, '2025-04-25 05:27:39'),
(10, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Le Monde du Cloud\".', 'retard', 0, '2025-04-25 05:29:39'),
(12, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Le Problème à Trois Corps\".', 'retard', 0, '2025-04-25 05:37:58'),
(14, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Guerre et Paix\".', 'retard', 0, '2025-04-25 05:44:11'),
(16, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Guerre et Paix\".', 'retard', 0, '2025-04-25 05:53:38'),
(18, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Le Monde du Cloud\".', 'retard', 0, '2025-04-25 06:06:39'),
(20, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Les Misérables\".', 'retard', 0, '2025-04-25 06:15:28'),
(22, 2, '⚠️ L\'utilisateur hamza est en retard pour le livre \"Frankenstein\".', 'retard', 0, '2025-04-25 06:21:58');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_exemplaire` bigint(20) UNSIGNED NOT NULL,
  `date_reservation` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('active','expirée','annulée') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `id_user`, `id_exemplaire`, `date_reservation`, `statut`) VALUES
(19, 12, 7, '2025-03-11 05:05:03', 'active'),
(20, 12, 8, '2025-03-11 05:07:08', 'active'),
(21, 12, 9, '2025-03-11 05:28:07', 'active'),
(22, 12, 10, '2025-03-11 05:31:16', 'active'),
(23, 12, 11, '2025-03-11 05:32:00', 'active'),
(24, 12, 12, '2025-03-11 05:49:50', 'active'),
(25, 12, 13, '2025-03-11 06:14:17', 'active'),
(26, 12, 14, '2025-03-11 15:34:31', 'active'),
(33, 14, 18, '2025-04-01 20:46:43', 'active'),
(71, 23, 24, '2025-04-25 06:20:02', 'active');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('admin','membre') DEFAULT 'membre',
  `status` enum('actif','inactif') DEFAULT 'actif',
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `telephone` varchar(15) NOT NULL,
  `id_unique` varchar(6) NOT NULL DEFAULT '',
  `face_encoding` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `mot_de_passe`, `role`, `status`, `date_inscription`, `telephone`, `id_unique`, `face_encoding`) VALUES
(1, 'nadia jebbor', 'Jebbornadiaa3@gmail.com', '$2b$10$Uy/4S6..0GUc/ECuLApnCu0cEC99kaU5bnenI5Aaee5vVYtmDPtxC', 'membre', 'actif', '2025-03-02 22:25:16', '', '847776', NULL),
(2, 'Admin', 'admin@gmail.com', '$2b$10$PhZUuFGwgGeHUSlGqLYFT.X3fvZ7onVmiinxMRmlIY7.YhbknLhOO', 'admin', 'actif', '2025-03-04 11:33:46', '', '772871', NULL),
(3, 'test', '', '', 'membre', 'actif', '2025-03-08 04:11:01', '5145768881', '426097', NULL),
(6, 'testdialsebt', 'sebt@gmail.com', '$2b$10$b1ausVPnF0s759sKobRlouny1ismCJvzfUyAb84uU25u/vwuAG.iq', 'membre', 'actif', '2025-03-08 14:37:08', '5145768881', '723551', NULL),
(7, 'testdiallekhraaa', 'khra@gmail.com', '$2b$10$4ejJC3ZEvBbENaY0fCRNKuf489SuLDWoXnY31.z5n4j6HYTccPxNK', 'membre', 'actif', '2025-03-08 18:30:24', '5145768881', '370728', NULL),
(11, 'jalil', 'jalil@gmail.com', '$2b$10$K03UGkvulMEnq9S6iNshP.ud9WiNA/edRsh5pBu.KAMB1hwUQkWOi', 'membre', 'actif', '2025-03-09 18:14:12', '4384652675', '838551', NULL),
(12, 'houda', 'houda@gmail.com', '$2b$10$EpxcO7BoKjTAZTABIrPe9.iGu9mPcUPIoFterVFgB/WqJ0emKMY8G', 'membre', 'actif', '2025-03-09 18:36:26', '4384652675', '704513', NULL),
(14, 'Rayane Boufdil', 'boufdil.rayane@gmail.com', '$2b$10$TvvfgKBEA0erdiNjJC46Our9CUp7QJDeofNQFl1lxMSfPQ9bg6gO2', 'membre', 'actif', '2025-04-01 18:02:54', '5146620717', '904730', NULL),
(17, 'fatima', 'ezzehmad@gmail.com', '$2b$10$7JIW9b7imA1wfKTGXeVBwOxEZcWPN0B6KgutohjVSjdYaLOxGQat.', 'membre', 'actif', '2025-04-24 21:08:03', '4388603575', '800117', '[-0.17449335753917694,0.07358022034168243,0.08030351996421814,-0.0831734761595726,-0.1559550017118454,-0.015567644499242306,-0.11688032746315002,-0.07663243263959885,0.15162791311740875,-0.20069874823093414,0.12221233546733856,-0.08499864488840103,-0.16870643198490143,0.09865324199199677,-0.055193353444337845,0.23663583397865295,-0.15625569224357605,-0.11317875236272812,-0.10056349635124207,-0.05957444757223129,0.00663044024258852,0.05133792385458946,-0.0261192936450243,0.08507038652896881,-0.13385002315044403,-0.3666454553604126,-0.07238703221082687,-0.03480318933725357,-0.0474182665348053,0.014256332069635391,-0.10950994491577148,0.054298821836709976,-0.18190635740756989,-0.027271971106529236,0.04269637167453766,0.15954884886741638,0.02823047898709774,-0.02836894802749157,0.13091044127941132,0.0006280386005528271,-0.2573980391025543,0.043643608689308167,0.15646587312221527,0.21287037432193756,0.1102069765329361,0.044397659599781036,0.021552659571170807,-0.07986126840114594,0.09667258709669113,-0.22367015480995178,0.007924270816147327,0.1147632747888565,0.03385265916585922,0.06961705535650253,0.1243177279829979,-0.11730144917964935,0.04752907529473305,0.1423264890909195,-0.080914705991745,0.028753820806741714,0.06319835782051086,0.01241318229585886,-0.021861713379621506,-0.11299432814121246,0.2639845311641693,0.16194425523281097,-0.0731600895524025,-0.14886879920959473,0.15677964687347412,-0.11146073043346405,-0.0805644616484642,0.04825779050588608,-0.11711342632770538,-0.17265485227108002,-0.25128161907196045,-0.005208007991313934,0.4241800904273987,0.19610032439231873,-0.1889922320842743,0.06958439201116562,0.005276759620755911,-0.05775114521384239,0.14357924461364746,0.11302223801612854,-0.016383863985538483,0.06626101583242416,-0.0027240789495408535,0.06831005215644836,0.2666172385215759,0.02088860608637333,0.037805236876010895,0.19014866650104523,0.056630369275808334,0.020664194598793983,0.0023974718060344458,0.022810354828834534,-0.12324093282222748,-0.043126460164785385,-0.21087297797203064,-0.055276740342378616,0.049625784158706665,0.017080707475543022,-0.016807569190859795,0.11636817455291748,-0.21656791865825653,0.11840491741895676,-0.0317530632019043,-0.05531433969736099,-0.019409218803048134,0.1600324809551239,-0.055850155651569366,-0.02562713623046875,0.13189256191253662,-0.16716916859149933,0.13363388180732727,0.181158185005188,-0.03847934305667877,0.1079292893409729,0.08073267340660095,0.0660441666841507,0.022450357675552368,0.024210257455706596,-0.1627964824438095,-0.10670609772205353,0.1095571219921112,-0.09940049052238464,0.07583196461200714,0.04014599695801735]'),
(23, 'hamza', 'elyoussoufihamza24@gmail.com', '$2b$10$cgeCjWgi/5pMSuoA8yJu6.RfmsTgUSAisodGEN.4tWqnrUQ16dKGO', 'membre', 'actif', '2025-04-24 23:46:49', '4384652675', '859645', '[-0.08544645458459854,0.06463251262903214,0.09473387897014618,0.008555110543966293,-0.023278070613741875,-0.06291358172893524,-0.04253682494163513,-0.015430784784257412,0.0733688473701477,-0.08173902332782745,0.21318697929382324,-0.060333237051963806,-0.18738611042499542,0.04736444354057312,-0.08093632012605667,0.12935981154441833,-0.09819530695676804,-0.10387570410966873,-0.14710406959056854,-0.12091143429279327,0.027245167642831802,0.10403664410114288,-0.08908496797084808,0.05781068652868271,-0.10029155015945435,-0.32263123989105225,-0.07076259702444077,-0.12072504311800003,0.021697288379073143,-0.15940424799919128,-0.052431296557188034,0.008769970387220383,-0.09465846419334412,-0.01678251102566719,0.046988703310489655,0.032043714076280594,0.08192148059606552,-0.04077216610312462,0.14984993636608124,0.043118953704833984,-0.07723089307546616,0.05912742018699646,0.12643806636333466,0.3206682503223419,0.13021813333034515,0.10525394231081009,0.0057579390704631805,0.002292866352945566,0.07239584624767303,-0.21225403249263763,0.06087614968419075,0.08795534074306488,0.11828067898750305,0.1178247481584549,0.08372683078050613,-0.16551022231578827,-0.0020716539584100246,0.0543782003223896,-0.14133763313293457,0.15379299223423004,0.043697334825992584,-0.02396358922123909,-0.04489752650260925,0.009302868507802486,0.2279965579509735,0.06749031692743301,-0.11998788267374039,-0.08426963537931442,0.1317363828420639,-0.18425481021404266,-0.055310558527708054,-0.058443304151296616,-0.11308903992176056,-0.09688954055309296,-0.18959930539131165,0.1009758859872818,0.3988925516605377,0.12747523188591003,-0.208478644490242,0.06102873384952545,-0.04691740497946739,-0.036370500922203064,0.07924739271402359,-0.00010347447823733091,-0.08233533799648285,-0.043864134699106216,-0.07155375182628632,0.05083351954817772,0.22805441915988922,0.0635535791516304,0.012759090401232243,0.1728340983390808,-0.04906334728002548,-0.014238792471587658,0.028258420526981354,0.01539407018572092,-0.13194607198238373,-0.022518321871757507,-0.05276772007346153,0.011223371140658855,0.041320979595184326,-0.08665288239717484,-0.007413052953779697,0.10270186513662338,-0.1917864978313446,0.10668528079986572,-0.028839241713285446,-0.015977738425135612,0.034615542739629745,0.19270212948322296,-0.1449497789144516,-0.07257628440856934,0.1630457192659378,-0.16858108341693878,0.18787653744220734,0.19181442260742188,0.05565010756254196,0.08462294191122055,0.04938306659460068,0.07404597848653793,0.06304942071437836,0.05955395847558975,-0.15555502474308014,-0.11392296850681305,0.017131313681602478,-0.04875725880265236,-0.0004662805004045367,0.050514526665210724]');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `amendes`
--
ALTER TABLE `amendes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_emprunt` (`id_emprunt`),
  ADD KEY `fk_amendes_user` (`id_user`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categorie` (`id_categorie`);

--
-- Index pour la table `emprunts`
--
ALTER TABLE `emprunts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_exemplaire` (`id_exemplaire`);

--
-- Index pour la table `exemplaires`
--
ALTER TABLE `exemplaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_exemplaire` (`numero_exemplaire`),
  ADD KEY `id_document` (`id_document`);

--
-- Index pour la table `historique_bannissements`
--
ALTER TABLE `historique_bannissements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_exemplaire` (`id_exemplaire`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `id_unique` (`id_unique`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `agenda`
--
ALTER TABLE `agenda`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `amendes`
--
ALTER TABLE `amendes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT pour la table `emprunts`
--
ALTER TABLE `emprunts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `exemplaires`
--
ALTER TABLE `exemplaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `historique_bannissements`
--
ALTER TABLE `historique_bannissements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `amendes`
--
ALTER TABLE `amendes`
  ADD CONSTRAINT `amendes_ibfk_1` FOREIGN KEY (`id_emprunt`) REFERENCES `emprunts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_amendes_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emprunts`
--
ALTER TABLE `emprunts`
  ADD CONSTRAINT `emprunts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emprunts_ibfk_2` FOREIGN KEY (`id_exemplaire`) REFERENCES `exemplaires` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `exemplaires`
--
ALTER TABLE `exemplaires`
  ADD CONSTRAINT `exemplaires_ibfk_1` FOREIGN KEY (`id_document`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `historique_bannissements`
--
ALTER TABLE `historique_bannissements`
  ADD CONSTRAINT `historique_bannissements_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historique_bannissements_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`id_exemplaire`) REFERENCES `exemplaires` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
