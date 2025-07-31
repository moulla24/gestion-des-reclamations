-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 31, 2025 at 05:06 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reclamations_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE IF NOT EXISTS `categorie` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actif` bit(1) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `libelle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categorie`
--

INSERT INTO `categorie` (`id`, `actif`, `description`, `libelle`) VALUES
(1, b'1', 'Erreurs liées au système ou aux opérations', 'Problème technique'),
(2, NULL, 'Problèmes liés au retrait, au code PIN ou au blocage de carte', 'Problème de carte bancaire'),
(52, NULL, 'Retard ou non réception des virements', 'Problème de virement');

-- --------------------------------------------------------

--
-- Table structure for table `categorie_seq`
--

DROP TABLE IF EXISTS `categorie_seq`;
CREATE TABLE IF NOT EXISTS `categorie_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categorie_seq`
--

INSERT INTO `categorie_seq` (`next_val`) VALUES
(151);

-- --------------------------------------------------------

--
-- Table structure for table `destinataire`
--

DROP TABLE IF EXISTS `destinataire`;
CREATE TABLE IF NOT EXISTS `destinataire` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actif` bit(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `categorie_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfj1g86lt28cccx7yjjv3p1hoq` (`categorie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `destinataire`
--

INSERT INTO `destinataire` (`id`, `actif`, `email`, `nom`, `prenom`, `service`, `telephone`, `categorie_id`) VALUES
(6, NULL, NULL, NULL, NULL, 'Service Client', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `fichier_joint`
--

DROP TABLE IF EXISTS `fichier_joint`;
CREATE TABLE IF NOT EXISTS `fichier_joint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chemin_fichier` varchar(255) DEFAULT NULL,
  `date_upload` datetime(6) DEFAULT NULL,
  `nom_fichier` varchar(255) DEFAULT NULL,
  `taille_fichier` bigint DEFAULT NULL,
  `type_mime` varchar(255) DEFAULT NULL,
  `reclamation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7naq4fwdt9qkjmhjk7pw7pbfb` (`reclamation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fichier_joint`
--

INSERT INTO `fichier_joint` (`id`, `chemin_fichier`, `date_upload`, `nom_fichier`, `taille_fichier`, `type_mime`, `reclamation_id`) VALUES
(1, 'C:\\Users\\moull\\Documents\\reclamations\\uploads/89594f72-9c28-4fcd-bf5f-27694be7f1c6_info.txt', '2025-07-24 13:10:31.447200', 'info.txt', 649, 'text/plain', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reclamation`
--

DROP TABLE IF EXISTS `reclamation`;
CREATE TABLE IF NOT EXISTS `reclamation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_creation` datetime(6) DEFAULT NULL,
  `date_modification` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `priorite` int DEFAULT NULL,
  `statut` enum('EN_ATTENTE','EN_COURS','FERME','REJETE','RESOLU') DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `categorie_id` bigint DEFAULT NULL,
  `destinataire_id` bigint DEFAULT NULL,
  `utilisateur_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4lc43wxtv45rwp2la1l2wavgt` (`categorie_id`),
  KEY `FKbi2r9okaalw97vrtnqjjg387r` (`utilisateur_id`),
  KEY `FKrjfrhwklj8qx6po9xmojqmebc` (`destinataire_id`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reclamation`
--

INSERT INTO `reclamation` (`id`, `date_creation`, `date_modification`, `description`, `priorite`, `statut`, `titre`, `categorie_id`, `destinataire_id`, `utilisateur_id`) VALUES
(1, '2025-07-21 11:19:20.594719', '2025-07-24 11:30:57.829309', 'Le virement prévu n’a pas été traité à temps.', 1, 'EN_ATTENTE', 'Retard sur virement', 2, 6, 102),
(2, '2025-07-21 11:36:49.455579', '2025-07-21 11:36:49.455579', 'Je ne peux pas accéder à mon compte', 1, 'EN_ATTENTE', 'Problème de connexion', NULL, NULL, 102),
(52, '2025-07-22 15:14:13.453756', NULL, 'Ma carte est bloquée sans raison', NULL, 'EN_ATTENTE', 'Problème de carte bancaire', 1, NULL, 2),
(102, '2025-07-23 10:17:53.376248', NULL, 'Ma carte a été bloquée sans raison apparente.', NULL, 'EN_COURS', 'Problème de carte bancaire', 1, 6, 2),
(202, '2025-07-23 12:42:29.744795', '2025-07-23 12:42:29.744795', 'Je n\'arrive pas à me connecter depuis ce matin.', NULL, 'EN_ATTENTE', 'Connexion impossible à mon compte', 1, 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `reclamation_seq`
--

DROP TABLE IF EXISTS `reclamation_seq`;
CREATE TABLE IF NOT EXISTS `reclamation_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reclamation_seq`
--

INSERT INTO `reclamation_seq` (`next_val`) VALUES
(301);

-- --------------------------------------------------------

--
-- Table structure for table `suivi_reclamation`
--

DROP TABLE IF EXISTS `suivi_reclamation`;
CREATE TABLE IF NOT EXISTS `suivi_reclamation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ancien_statut` enum('EN_ATTENTE','EN_COURS','FERME','REJETE','RESOLU') DEFAULT NULL,
  `commentaire` varchar(2000) DEFAULT NULL,
  `date_modification` datetime(6) DEFAULT NULL,
  `nouveau_statut` enum('EN_ATTENTE','EN_COURS','FERME','REJETE','RESOLU') DEFAULT NULL,
  `reclamation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK614potstmu7dvsabcoyknjro9` (`reclamation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `suivi_reclamation`
--

INSERT INTO `suivi_reclamation` (`id`, `ancien_statut`, `commentaire`, `date_modification`, `nouveau_statut`, `reclamation_id`) VALUES
(1, 'EN_COURS', 'Relance effectuée auprès du service concerné.', '2025-07-24 11:30:57.764141', 'EN_ATTENTE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actif` bit(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','UTILISATEUR') DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `dtype` varchar(31) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `categorie_id` bigint DEFAULT NULL,
  `type_utilisateur` varchar(31) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfeyrot0n454hegd5e95xan34d` (`categorie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `actif`, `email`, `mot_de_passe`, `nom`, `prenom`, `role`, `telephone`, `dtype`, `service`, `categorie_id`, `type_utilisateur`) VALUES
(2, b'1', 'medmah14@example.com', '$2a$10$DuAqRAbRnZttcZKzK7SPt.VhJDuzFm/JRX1lPMIantKZJl/JyjbYi', NULL, NULL, 'ADMIN', NULL, NULL, NULL, NULL, 'Utilisateur'),
(6, b'1', 'youssouf@example.com', '123456', 'Ahmed', 'Youssouf', 'UTILISATEUR', '47474747', NULL, NULL, NULL, 'utulisateur'),
(102, b'1', 'oumll4@example.com', '$2a$10$sJ15tk86Xtu7.HYaUeQmLe.ekiR6BORBXVkw6fV4gbyFaC91HjBrS', NULL, NULL, 'UTILISATEUR', NULL, NULL, NULL, NULL, 'Utilisateur'),
(103, b'1', 'med14@example.com', '$2a$10$zjq7LouItxryOO/Ksyn65eoCBfh93muSEP8o6DpK/vEAXLHaUEGEu', NULL, NULL, 'UTILISATEUR', NULL, NULL, NULL, NULL, 'Utilisateur'),
(202, b'1', 'ali.utilisateur@bamis.mr', '$2a$10$fY/ObpUcSSFbCtwU7wBA4ek2bhxyoYBdY5cgCpufWaqE9wvrz57HC', NULL, NULL, 'UTILISATEUR', NULL, NULL, NULL, NULL, 'Utilisateur'),
(203, b'1', 'mariem.destinataire@bamis.mr', '$2a$10$zCtrjF/6SUKKslMJpg7KeuzRpWsDSC5pybEjVSvQD9duTcknL968e', NULL, NULL, 'UTILISATEUR', NULL, NULL, NULL, NULL, 'Utilisateur');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur_seq`
--

DROP TABLE IF EXISTS `utilisateur_seq`;
CREATE TABLE IF NOT EXISTS `utilisateur_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `utilisateur_seq`
--

INSERT INTO `utilisateur_seq` (`next_val`) VALUES
(301);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `destinataire`
--
ALTER TABLE `destinataire`
  ADD CONSTRAINT `FKfj1g86lt28cccx7yjjv3p1hoq` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`),
  ADD CONSTRAINT `FKl3rxnlc7siii7ygbcnhcxfpxg` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `fichier_joint`
--
ALTER TABLE `fichier_joint`
  ADD CONSTRAINT `FK7naq4fwdt9qkjmhjk7pw7pbfb` FOREIGN KEY (`reclamation_id`) REFERENCES `reclamation` (`id`);

--
-- Constraints for table `reclamation`
--
ALTER TABLE `reclamation`
  ADD CONSTRAINT `FK4lc43wxtv45rwp2la1l2wavgt` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`),
  ADD CONSTRAINT `FK71rqc7quijisi3p6mn7plbcyn` FOREIGN KEY (`destinataire_id`) REFERENCES `destinataire` (`id`),
  ADD CONSTRAINT `FKbi2r9okaalw97vrtnqjjg387r` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FKrjfrhwklj8qx6po9xmojqmebc` FOREIGN KEY (`destinataire_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `suivi_reclamation`
--
ALTER TABLE `suivi_reclamation`
  ADD CONSTRAINT `FK614potstmu7dvsabcoyknjro9` FOREIGN KEY (`reclamation_id`) REFERENCES `reclamation` (`id`);

--
-- Constraints for table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD CONSTRAINT `FKfeyrot0n454hegd5e95xan34d` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
