-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Jul 2025 um 23:12
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `schuetzenverein_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `abteilungen`
--
-- Liste der verschiedensten Abteilungen
CREATE TABLE `abteilungen` (
  `AbteilungsID` int(11) NOT NULL,
  `Abteilungsname` varchar(100) NOT NULL,
  `Beschreibung` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `abteilungen`
--

INSERT INTO `abteilungen` (`AbteilungsID`, `Abteilungsname`, `Beschreibung`) VALUES
(1, 'Jugend und Schüler', 'Unsere Abteilung für den Nachwuchs.'),
(2, 'Senioren', 'Die Abteilung für unsere erfahrenen Mitglieder.'),
(3, 'Bogen', 'Alles rund um den Bogensport.'),
(4, 'Pistolensport', 'Präzisionsschießen mit Kurz- und Langwaffen.');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `beitraege`
--
-- Liste aller erstellten Beiträge und welcher Kategorie sie angehören
CREATE TABLE `beitraege` (
  `BeitragsID` int(11) NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Inhalt` text DEFAULT NULL,
  `Bild` longtext CHARACTER SET utf8 COLLATE utf8_general_nopad_ci DEFAULT NULL,
  `KategorieID` int(11) NOT NULL,
  `Formart` int(11) DEFAULT NULL,
  `ErstelltVon` int(11) NOT NULL,
  `Erstellungsdatum` timestamp NOT NULL DEFAULT current_timestamp(),
  `Aenderungsdatum` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `beitraege`
--

INSERT INTO `beitraege` (`BeitragsID`, `Titel`, `Inhalt`, `Bild`, `KategorieID`, `Formart`, `ErstelltVon`, `Erstellungsdatum`, `Aenderungsdatum`) VALUES
(12, 'Schüler- und Jugendtraining', '\nDienstags von 18:00 - 19:30 Uhr\n\nWir bieten folgende Disziplinen für Schüler und Jugendliche an\n\nLuftgewehr 10m\nLuftpistole 10m\nArmbrust 10m\nKleinkaliber auf 50m\nWeiter Informationen können Sie beim Jugendsportleiter per Mail erfragen! \n\nRecurve Bogen Halle\nCompound Bogen Halle\nWeiter Informationen können Sie beim Bogensportleiter per Mail erfragen! \nWenn Ihr Interesse habt, dann kommt doch einfach vorbei und schaut euch alles an, Testet was Euch gefällt.\n\nWir freuen uns auf Euch!\n\nWICHTIG für Eltern\n\nBitte bringen sie die Einverständniserklärung für Ihr Kind beim ersten Mal ausgefüllt mit!\n\nEinverständniserklärung Eltern // PDF-Datei\n\nAuszug aus dem WaffG §27 Abs.3 (Verlinkung )\n\nhttps://www.gesetze-im-internet.de/waffg_2002/__27.html\n\n1.\n\nKindern, die das zwölfte Lebensjahr vollendet haben und noch nicht 14 Jahre alt sind, das Schießen in Schießstätten mit Druckluft-, Federdruckwaffen und Waffen, bei denen zum Antrieb der Geschosse kalte Treibgase verwendet werden (Anlage 2 Abschnitt 2 Unterabschnitt 2 Nr. 1.1 und 1.2),\n\n2.\n\nJugendlichen, die das 14. Lebensjahr vollendet haben und noch nicht 18 Jahre alt sind, auch das Schießen mit sonstigen Schusswaffen bis zu einem Kaliber von 5,6 mm lfB (.22 l.r.) für Munition mit Randfeuerzündung, wenn die Mündungsenergie höchstens 200 Joule (J) beträgt und Einzellader-Langwaffen mit glatten Läufen mit Kaliber 12 oder kleiner.\n\n ', '', 3, NULL, 5, '2025-07-07 00:33:23', '2025-07-07 00:34:42');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--
-- Liste aller registrierten Nutzer
CREATE TABLE `benutzer` (
  `BenutzerID` int(11) NOT NULL,
  `Vorname` varchar(45) NOT NULL,
  `Nachname` varchar(45) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Passwort` varchar(255) NOT NULL,
  `RollenID` int(11) NOT NULL,
  `ErstelltAm` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `benutzer`
--

INSERT INTO `benutzer` (`BenutzerID`, `Vorname`, `Nachname`, `Email`, `Passwort`, `RollenID`, `ErstelltAm`) VALUES
(1, 's', 's', 's@s.s', '$2b$10$wTdVSy2UEnW1G8CGVct.VO/r3sGepXFlQrYxLz4OaGvR8zNGKl6cW', 3, '2025-07-05 12:22:43'),
(5, 'Niclas', 'RR', 'N@R.R', '$2b$10$0gbEGkujIatDx4OKsjy71OHnBFGmTLgze1WiFz7.KhmJUuAFAlZ72', 3, '2025-07-05 12:59:27'),
(7, 'Bob', 'Bürger', 'bob@bob.bob', '$2b$10$YwenK0fGaU0AhhrnPQc/ruJq1mcEWPyC4wwXRhn3gNPy6pmRB1Bwu', 2, '2025-07-07 08:56:18'),
(8, 'Peter', 'Bob', 'PB@p.com', '$2b$10$bZxFmwEnbzuX2LVlKpMoBOzx6ebNpwF7W9lwUr4MLwrrizg62k4L6', 1, '2025-07-07 07:55:54');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `downloads`
--
-- Liste der Downloads auf der Download seite
CREATE TABLE `downloads` (
  `DownloadID` int(11) NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Beschreibung` text DEFAULT NULL,
  `ShowcaseImageURL` varchar(2048) DEFAULT NULL,
  `DownloadURL` varchar(2048) NOT NULL,
  `Reihenfolge` int(11) DEFAULT NULL,
  `ErstelltVon` int(11) NOT NULL,
  `Erstellungsdatum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `downloads`
--

INSERT INTO `downloads` (`DownloadID`, `Titel`, `Beschreibung`, `ShowcaseImageURL`, `DownloadURL`, `Reihenfolge`, `ErstelltVon`, `Erstellungsdatum`) VALUES
(3, 'Hund', 'Gefährlicher Kampfhunf', '/uploads/showcaseImage-1752440545237-386130442.jpg', '/uploads/downloadFile-1752440545239-22281390.jpg', 2, 1, '2025-07-13 21:02:25');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kategorien`
--

CREATE TABLE `kategorien` (
  `KategorieID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `kategorien`
--
-- Kategorien für Der Verein Seite, Abteilungen und Schützenfest seite 
INSERT INTO `kategorien` (`KategorieID`, `Name`) VALUES
(1, 'News'),
(2, 'Bogenschießen'),
(3, 'Jugend und Schueler'),
(4, 'Pistolensport'),
(5, 'Senioren'),
(6, 'Damen'),
(7, 'Tradition'),
(8, 'Verein Infos'),
(9, 'Geschichte'),
(10, 'Vorstand'),
(11, 'Beitraege'),
(12, 'Einrichtung'),
(13, 'Kontakt und Anfahrt'),
(14, 'Schuetzenfest');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rollen`
--
-- Admin, Leiter und Mitglieder Rolle für verschiedene Rechte
CREATE TABLE `rollen` (
  `RollenID` int(11) NOT NULL,
  `RollenName` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `rollen`
--

INSERT INTO `rollen` (`RollenID`, `RollenName`) VALUES
(1, 'Mitglied'),
(2, 'Abteilungsleiter'),
(3, 'Admin');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `seitenaufrufe`
--

CREATE TABLE `seitenaufrufe` (
  `AufrufID` int(11) NOT NULL,
  `Pfad` varchar(255) NOT NULL,
  `AufrufZeitstempel` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `seitenaufrufe`
--
-- Seitenaufrufe für für die Statistik im Admin Dashboard
INSERT INTO `seitenaufrufe` (`AufrufID`, `Pfad`, `AufrufZeitstempel`) VALUES
(1, '/', '2025-06-07 06:21:14'),
(2, '/news-component', '2025-06-07 07:34:22'),
(3, '/login-component', '2025-06-07 08:11:56'),
(4, '/dashboard/admin', '2025-06-07 09:45:01'),
(5, '/abteilung-component/bogen', '2025-06-07 10:23:43'),
(6, '/termine-component', '2025-06-07 12:01:30'),
(7, '/dashboard/admin/users', '2025-06-07 13:55:19'),
(8, '/news-component', '2025-06-07 15:28:11'),
(9, '/', '2025-06-07 16:04:57'),
(10, '/dashboard/leiter', '2025-06-07 18:19:23'),
(11, '/login-component', '2025-06-07 19:08:41'),
(12, '/news-component', '2025-06-07 20:43:05'),
(13, '/dashboard/admin/content', '2025-06-08 07:12:44'),
(14, '/', '2025-06-08 08:05:11'),
(15, '/termine-component', '2025-06-08 09:33:01'),
(16, '/abteilung-component/pistolensport', '2025-06-08 10:54:32'),
(17, '/dashboard/admin', '2025-06-08 11:48:50'),
(18, '/news-component', '2025-06-08 12:22:37'),
(19, '/login-component', '2025-06-08 14:17:09'),
(20, '/dashboard/admin/users', '2025-06-08 15:41:25'),
(21, '/dashboard/leiter', '2025-06-08 16:32:18'),
(22, '/', '2025-06-08 17:56:49'),
(23, '/termine-component', '2025-06-08 18:45:13'),
(24, '/news-component', '2025-06-08 19:23:55'),
(25, '/abteilung-component/bogen', '2025-06-08 20:11:04'),
(26, '/', '2025-07-01 06:15:23'),
(27, '/news-component', '2025-07-01 07:40:11'),
(28, '/dashboard/admin', '2025-07-01 08:30:55'),
(29, '/login-component', '2025-07-01 09:25:34'),
(30, '/termine-component', '2025-07-01 10:10:01'),
(31, '/dashboard/admin/users', '2025-07-01 12:33:47'),
(32, '/abteilung-component/pistolensport', '2025-07-01 13:12:19'),
(33, '/', '2025-07-01 14:45:00'),
(34, '/news-component', '2025-07-01 16:21:51'),
(35, '/dashboard/leiter', '2025-07-01 17:01:04'),
(36, '/dashboard/admin/content', '2025-07-01 18:54:12'),
(37, '/termine-component', '2025-07-02 07:05:07'),
(38, '/login-component', '2025-07-02 08:11:23'),
(39, '/', '2025-07-02 09:43:50'),
(40, '/news-component', '2025-07-02 10:30:14'),
(41, '/dashboard/admin', '2025-07-02 11:22:09'),
(42, '/abteilung-component/bogen', '2025-07-02 12:51:33'),
(43, '/dashboard/admin/users', '2025-07-02 14:19:42'),
(44, '/news-component', '2025-07-02 15:38:00'),
(45, '/', '2025-07-02 16:41:17'),
(46, '/dashboard/admin/content', '2025-07-02 18:05:32'),
(47, '/termine-component', '2025-07-02 19:28:49'),
(48, '/dashboard/leiter', '2025-07-02 20:01:58'),
(49, '/', '2025-07-03 06:55:10'),
(50, '/login-component', '2025-07-03 08:02:15'),
(51, '/news-component', '2025-07-03 09:18:43'),
(52, '/dashboard/admin', '2025-07-03 10:40:00'),
(53, '/abteilung-component/pistolensport', '2025-07-03 11:58:22'),
(54, '/termine-component', '2025-07-03 13:05:18'),
(55, '/dashboard/admin/users', '2025-07-03 14:34:07'),
(56, '/news-component', '2025-07-03 16:11:39'),
(57, '/dashboard/admin/content', '2025-07-03 17:44:50'),
(58, '/', '2025-07-03 19:09:21'),
(59, '/login-component', '2025-07-04 07:20:45'),
(60, '/news-component', '2025-07-04 08:30:10'),
(61, '/dashboard/admin', '2025-07-04 09:55:21'),
(62, '/termine-component', '2025-07-04 11:10:58'),
(63, '/abteilung-component/bogen', '2025-07-04 12:25:31'),
(64, '/dashboard/admin/users', '2025-07-04 14:00:05'),
(65, '/', '2025-07-04 15:40:19'),
(66, '/dashboard/leiter', '2025-07-04 17:15:28'),
(67, '/news-component', '2025-07-04 18:45:55'),
(68, '/termine-component', '2025-07-04 20:05:13'),
(69, '/dashboard/admin/content', '2025-07-05 08:00:00'),
(70, '/', '2025-07-05 09:15:30'),
(71, '/news-component', '2025-07-05 10:45:01'),
(72, '/login-component', '2025-07-05 11:30:45'),
(73, '/abteilung-component/pistolensport', '2025-07-05 12:50:20'),
(74, '/dashboard/admin', '2025-07-05 14:05:10'),
(75, '/termine-component', '2025-07-05 15:20:40'),
(76, '/dashboard/admin/users', '2025-07-05 16:40:55'),
(77, '/', '2025-07-05 18:00:15'),
(78, '/news-component', '2025-07-05 19:30:00'),
(79, '/dashboard/admin', '2025-07-06 07:01:32'),
(80, '/news-component', '2025-07-06 08:15:10'),
(81, '/dashboard/leiter', '2025-07-06 09:35:45'),
(82, '/login-component', '2025-07-06 10:20:00'),
(83, '/termine-component', '2025-07-06 11:40:25'),
(84, '/abteilung-component/bogen', '2025-07-06 12:55:05'),
(85, '/dashboard/admin/users', '2025-07-06 14:10:50'),
(86, '/', '2025-07-06 15:30:15'),
(87, '/dashboard/admin/content', '2025-07-06 16:50:40'),
(88, '/news-component', '2025-07-06 17:25:00'),
(89, '/', '2025-07-06 18:06:18'),
(90, '/dashboard/admin', '2025-07-06 18:06:20'),
(91, '/dashboard/admin/users', '2025-07-06 18:06:30'),
(92, '/dashboard/admin/content', '2025-07-06 18:06:31'),
(93, '/der-verein-component', '2025-07-06 18:06:53'),
(94, '/abteilung-component', '2025-07-06 18:06:54'),
(95, '/dashboard/admin', '2025-07-06 18:06:58'),
(96, '/dashboard/admin/content', '2025-07-06 18:06:59'),
(97, '/abteilung-component', '2025-07-06 18:07:17'),
(98, '/', '2025-07-06 22:23:33'),
(99, '/dashboard/admin', '2025-07-06 22:23:35'),
(100, '/dashboard/admin/users', '2025-07-06 22:23:43'),
(101, '/dashboard/admin/content', '2025-07-06 22:23:48'),
(102, '/dashboard/admin/users', '2025-07-06 22:47:42'),
(103, '/termin', '2025-07-06 22:47:43'),
(104, '/', '2025-07-06 23:01:47'),
(105, '/termin', '2025-07-06 23:01:49'),
(106, '/termin', '2025-07-06 23:04:30'),
(107, '/', '2025-07-06 23:05:16'),
(108, '/news', '2025-07-06 23:05:18'),
(109, '/der-verein', '2025-07-06 23:05:21'),
(110, '/abteilung', '2025-07-06 23:05:25'),
(111, '/schuetzenfest', '2025-07-06 23:05:26'),
(112, '/termin', '2025-07-06 23:05:29'),
(113, '/dashboard/admin', '2025-07-06 23:05:30'),
(114, '/news', '2025-07-06 23:05:32'),
(115, '/der-verein', '2025-07-06 23:07:08'),
(116, '/abteilung', '2025-07-06 23:07:09'),
(117, '/schuetzenfest', '2025-07-06 23:07:10'),
(118, '/termin', '2025-07-06 23:07:11'),
(119, '/dashboard/admin', '2025-07-06 23:07:11'),
(120, '/login', '2025-07-06 23:07:13'),
(121, '/', '2025-07-06 23:07:15'),
(122, '/dashboard/admin', '2025-07-06 23:07:16'),
(123, '/dashboard/admin/content', '2025-07-06 23:07:34'),
(124, '/der-verein', '2025-07-06 23:10:09'),
(125, '/dashboard/admin', '2025-07-06 23:10:56'),
(126, '/dashboard/admin/content', '2025-07-06 23:10:58'),
(127, '/der-verein', '2025-07-06 23:12:29'),
(128, '/dashboard/admin', '2025-07-06 23:14:00'),
(129, '/dashboard/admin/content', '2025-07-06 23:14:02'),
(130, '/der-verein', '2025-07-06 23:14:19'),
(131, '/abteilung', '2025-07-06 23:15:26'),
(132, '/der-verein', '2025-07-06 23:26:57'),
(133, '/', '2025-07-06 23:44:05'),
(134, '/termin', '2025-07-06 23:44:07'),
(135, '/', '2025-07-06 23:45:31'),
(136, '/termin', '2025-07-06 23:45:33'),
(137, '/', '2025-07-06 23:45:47'),
(138, '/registration', '2025-07-06 23:45:49'),
(139, '/dashboard/admin', '2025-07-06 23:45:52'),
(140, '/dashboard/admin/content', '2025-07-06 23:45:57'),
(141, '/schuetzenfest', '2025-07-06 23:45:59'),
(142, '/termin', '2025-07-06 23:46:00'),
(143, '/schuetzenfest', '2025-07-06 23:46:01'),
(144, '/abteilung', '2025-07-06 23:46:03'),
(145, '/der-verein', '2025-07-06 23:46:04'),
(146, '/termin', '2025-07-06 23:46:05'),
(147, '/', '2025-07-06 23:49:17'),
(148, '/termin', '2025-07-06 23:49:19'),
(149, '/', '2025-07-06 23:49:49'),
(150, '/termin', '2025-07-06 23:51:14'),
(151, '/dashboard/admin', '2025-07-06 23:52:31'),
(152, '/dashboard/admin/content', '2025-07-06 23:52:33'),
(153, '/', '2025-07-06 23:56:29'),
(154, '/termin', '2025-07-06 23:56:31'),
(155, '/der-verein', '2025-07-06 23:56:42'),
(156, '/news', '2025-07-06 23:56:43'),
(157, '/dashboard/admin', '2025-07-06 23:56:44'),
(158, '/', '2025-07-06 23:59:52'),
(159, '/termin', '2025-07-06 23:59:55'),
(160, '/', '2025-07-07 00:00:05'),
(161, '/termin', '2025-07-07 00:00:06'),
(162, '/termin', '2025-07-07 00:00:15'),
(163, '/login', '2025-07-07 00:00:18'),
(164, '/', '2025-07-07 00:00:26'),
(165, '/termin', '2025-07-07 00:00:27'),
(166, '/abteilung', '2025-07-07 00:01:54'),
(167, '/dashboard/admin', '2025-07-07 00:01:56'),
(168, '/', '2025-07-07 00:03:40'),
(169, '/termin', '2025-07-07 00:03:42'),
(170, '/', '2025-07-07 00:04:39'),
(171, '/termin', '2025-07-07 00:04:40'),
(172, '/', '2025-07-07 00:05:44'),
(173, '/', '2025-07-07 00:05:46'),
(174, '/termin', '2025-07-07 00:05:48'),
(175, '/', '2025-07-07 00:06:22'),
(176, '/termin', '2025-07-07 00:06:32'),
(177, '/schuetzenfest', '2025-07-07 00:06:33'),
(178, '/der-verein', '2025-07-07 00:06:35'),
(179, '/abteilung', '2025-07-07 00:06:36'),
(180, '/der-verein', '2025-07-07 00:06:36'),
(181, '/news', '2025-07-07 00:06:37'),
(182, '/news', '2025-07-07 00:22:26'),
(183, '/dashboard/admin', '2025-07-07 00:22:29'),
(184, '/dashboard/admin/content', '2025-07-07 00:23:10'),
(185, '/news', '2025-07-07 00:23:38'),
(186, '/der-verein', '2025-07-07 00:24:15'),
(187, '/abteilung', '2025-07-07 00:24:16'),
(188, '/news', '2025-07-07 00:24:31'),
(189, '/abteilung', '2025-07-07 00:24:34'),
(190, '/dashboard/admin', '2025-07-07 00:24:48'),
(191, '/dashboard/admin/content', '2025-07-07 00:24:50'),
(192, '/dashboard/admin/content', '2025-07-07 00:32:53'),
(193, '/abteilung', '2025-07-07 00:33:29'),
(194, '/der-verein', '2025-07-07 00:33:35'),
(195, '/news', '2025-07-07 00:33:36'),
(196, '/dashboard/admin', '2025-07-07 00:33:38'),
(197, '/dashboard/admin/content', '2025-07-07 00:33:41'),
(198, '/der-verein', '2025-07-07 00:34:45'),
(199, '/abteilung', '2025-07-07 00:34:46'),
(200, '/news', '2025-07-07 00:34:53'),
(201, '/', '2025-07-07 08:20:03'),
(202, '/abteilung', '2025-07-07 08:20:15'),
(203, '/news', '2025-07-07 08:20:20'),
(204, '/news', '2025-07-07 08:20:27'),
(205, '/abteilung', '2025-07-07 08:20:48'),
(206, '/dashboard/admin', '2025-07-07 08:55:31'),
(207, '/dashboard/admin/users', '2025-07-07 08:55:33'),
(208, '/dashboard/admin/users', '2025-07-07 08:55:46'),
(209, '/login', '2025-07-07 08:56:28'),
(210, '/', '2025-07-07 08:56:31'),
(211, '/dashboard/leiter', '2025-07-07 08:56:33'),
(212, '/login', '2025-07-07 08:56:35'),
(213, '/', '2025-07-07 08:57:34'),
(214, '/dashboard/admin', '2025-07-07 08:57:35'),
(215, '/dashboard/admin/users', '2025-07-07 08:57:37'),
(216, '/login', '2025-07-07 08:58:25'),
(217, '/', '2025-07-07 08:59:26'),
(218, '/dashboard/leiter', '2025-07-07 08:59:29'),
(219, '/dashboard/leiter', '2025-07-07 09:35:20'),
(220, '/dashboard/leiter', '2025-07-07 09:35:56'),
(221, '/dashboard/leiter', '2025-07-07 09:36:52'),
(222, '/login', '2025-07-07 09:37:04'),
(223, '/', '2025-07-07 09:37:06'),
(224, '/dashboard/admin', '2025-07-07 09:37:08'),
(225, '/dashboard/admin/content', '2025-07-07 09:37:10'),
(226, '/login', '2025-07-07 09:37:41'),
(227, '/news', '2025-07-07 09:37:43'),
(228, '/', '2025-07-07 09:37:45'),
(229, '/', '2025-07-07 09:37:48'),
(230, '/login', '2025-07-07 09:41:23'),
(231, '/', '2025-07-07 09:41:27'),
(232, '/dashboard/leiter', '2025-07-07 09:41:29'),
(233, '/login', '2025-07-07 09:41:31'),
(234, '/', '2025-07-07 09:41:34'),
(235, '/dashboard/admin', '2025-07-07 09:41:36'),
(236, '/dashboard/admin/content', '2025-07-07 09:41:38'),
(237, '/dashboard/admin/users', '2025-07-07 09:41:41'),
(238, '/login', '2025-07-07 09:42:13'),
(239, '/', '2025-07-07 09:42:15'),
(240, '/termin', '2025-07-07 09:42:18'),
(241, '/schuetzenfest', '2025-07-07 09:42:19'),
(242, '/abteilung', '2025-07-07 09:42:21'),
(243, '/der-verein', '2025-07-07 09:42:22'),
(244, '/news', '2025-07-07 09:42:23'),
(245, '/', '2025-07-07 09:42:30'),
(246, '/', '2025-07-07 09:45:43'),
(247, '/', '2025-07-07 09:45:52'),
(248, '/login', '2025-07-07 09:47:24'),
(249, '/', '2025-07-07 09:47:27'),
(250, '/news', '2025-07-07 09:49:38'),
(251, '/der-verein', '2025-07-07 09:51:13'),
(252, '/abteilung', '2025-07-07 09:51:31'),
(253, '/schuetzenfest', '2025-07-07 09:52:11'),
(254, '/termin', '2025-07-07 09:52:43'),
(255, '/', '2025-07-07 09:55:04'),
(256, '/registration', '2025-07-07 09:55:05'),
(257, '/login', '2025-07-07 09:55:08'),
(258, '/registration', '2025-07-07 09:55:25'),
(259, '/login', '2025-07-07 09:56:04'),
(260, '/', '2025-07-07 09:56:13'),
(261, '/login', '2025-07-07 09:56:22'),
(262, '/', '2025-07-07 09:56:36'),
(263, '/login', '2025-07-07 09:56:39'),
(264, '/', '2025-07-07 09:56:41'),
(265, '/login', '2025-07-07 09:56:48'),
(266, '/', '2025-07-07 09:56:55'),
(267, '/dashboard/admin', '2025-07-07 09:57:00'),
(268, '/dashboard/admin/content', '2025-07-07 09:57:05'),
(269, '/dashboard/admin/users', '2025-07-07 09:57:23'),
(270, '/login', '2025-07-07 09:57:49'),
(271, '/', '2025-07-07 09:58:04'),
(272, '/dashboard/leiter', '2025-07-07 09:58:06'),
(273, '/news', '2025-07-07 09:59:00'),
(274, '/dashboard/leiter', '2025-07-07 09:59:08'),
(275, '/der-verein', '2025-07-07 09:59:12'),
(276, '/dashboard/leiter', '2025-07-07 09:59:19'),
(277, '/login', '2025-07-07 09:59:30'),
(278, '/', '2025-07-07 09:59:37'),
(279, '/dashboard/admin', '2025-07-07 09:59:38'),
(280, '/dashboard/admin/content', '2025-07-07 09:59:39'),
(281, '/news', '2025-07-07 09:59:53'),
(282, '/dashboard/admin', '2025-07-07 09:59:55'),
(283, '/dashboard/admin/content', '2025-07-07 09:59:56'),
(284, '/news', '2025-07-07 10:00:01'),
(285, '/dashboard/admin', '2025-07-07 10:00:03'),
(286, '/dashboard/admin/content', '2025-07-07 10:00:05'),
(287, '/dashboard/admin/events', '2025-07-07 10:00:41'),
(288, '/dashboard/admin/departments', '2025-07-07 10:00:42'),
(289, '/dashboard/admin/users', '2025-07-07 10:00:43'),
(290, '/dashboard/admin/content', '2025-07-07 10:00:44'),
(291, '/dashboard/admin/users', '2025-07-07 10:00:59'),
(292, '/dashboard/admin/content', '2025-07-07 10:01:02'),
(293, '/login', '2025-07-07 10:01:32'),
(294, '/', '2025-07-07 10:01:35'),
(295, '/registration', '2025-07-07 10:01:36'),
(296, '/', '2025-07-13 10:47:09'),
(297, '/downloads', '2025-07-13 10:47:11'),
(298, '/login', '2025-07-13 10:47:13'),
(299, '/', '2025-07-13 10:47:15'),
(300, '/dashboard/admin', '2025-07-13 10:47:16'),
(301, '/dashboard/admin', '2025-07-13 10:52:58'),
(302, '/dashboard/admin/link-manager', '2025-07-13 10:52:59'),
(303, '/dashboard/admin/link-manager', '2025-07-13 11:02:36'),
(304, '/downloads', '2025-07-13 11:03:13'),
(305, '/downloads', '2025-07-13 11:16:37'),
(306, '/dashboard/admin', '2025-07-13 11:16:39'),
(307, '/dashboard/admin/link-manager', '2025-07-13 11:16:40'),
(308, '/downloads', '2025-07-13 11:17:11'),
(309, '/', '2025-07-13 12:54:34'),
(310, '/news', '2025-07-13 12:54:35'),
(311, '/', '2025-07-13 12:54:37'),
(312, '/der-verein', '2025-07-13 12:54:38'),
(313, '/termin', '2025-07-13 12:54:39'),
(314, '/login', '2025-07-13 12:54:41'),
(315, '/', '2025-07-13 12:54:44'),
(316, '/news', '2025-07-13 12:54:47'),
(317, '/events', '2025-07-13 12:54:48'),
(318, '/der-verein', '2025-07-13 12:54:49'),
(319, '/abteilung', '2025-07-13 12:54:50'),
(320, '/schuetzenfest', '2025-07-13 12:54:50'),
(321, '/termin', '2025-07-13 12:54:51'),
(322, '/downloads', '2025-07-13 12:54:52'),
(323, '/forum', '2025-07-13 12:54:53'),
(324, '/events', '2025-07-13 13:05:29'),
(325, '/login', '2025-07-13 13:05:40'),
(326, '/', '2025-07-13 13:05:42'),
(327, '/dashboard/admin', '2025-07-13 13:05:54'),
(328, '/dashboard/admin/events', '2025-07-13 13:05:56'),
(329, '/dashboard/admin/departments', '2025-07-13 13:05:57'),
(330, '/dashboard/admin/departments', '2025-07-13 13:06:00'),
(331, '/dashboard/admin/events', '2025-07-13 13:06:02'),
(332, '/events', '2025-07-13 13:06:57'),
(333, '/forum', '2025-07-13 13:07:25'),
(334, '/downloads', '2025-07-13 13:07:25'),
(335, '/termin', '2025-07-13 13:07:26'),
(336, '/schuetzenfest', '2025-07-13 13:07:27'),
(337, '/abteilung', '2025-07-13 13:07:28'),
(338, '/der-verein', '2025-07-13 13:07:29'),
(339, '/news', '2025-07-13 13:07:29'),
(340, '/events', '2025-07-13 13:07:30'),
(341, '/dashboard/admin', '2025-07-13 13:07:40'),
(342, '/dashboard/admin/events', '2025-07-13 13:07:42'),
(343, '/dashboard/admin/link-manager', '2025-07-13 13:07:43'),
(344, '/dashboard/admin/events', '2025-07-13 13:07:43'),
(345, '/dashboard/admin/events', '2025-07-13 13:07:46'),
(346, '/dashboard/admin/users', '2025-07-13 13:07:58'),
(347, '/dashboard/admin/content', '2025-07-13 13:08:00'),
(348, '/dashboard/admin/content', '2025-07-13 13:10:03'),
(349, '/', '2025-07-13 13:10:05'),
(350, '/der-verein', '2025-07-13 13:10:07'),
(351, '/news', '2025-07-13 13:10:07'),
(352, '/abteilung', '2025-07-13 13:10:08'),
(353, '/schuetzenfest', '2025-07-13 13:10:09'),
(354, '/termin', '2025-07-13 13:10:10'),
(355, '/', '2025-07-13 13:20:38'),
(356, '/', '2025-07-13 13:24:48'),
(357, '/termin', '2025-07-13 13:25:52'),
(358, '/dashboard/admin', '2025-07-13 13:25:55'),
(359, '/dashboard/admin/events', '2025-07-13 13:25:58'),
(360, '/dashboard/admin/link-manager', '2025-07-13 13:25:58'),
(361, '/dashboard/admin/events', '2025-07-13 13:25:59'),
(362, '/dashboard/admin/departments', '2025-07-13 13:26:00'),
(363, '/dashboard/admin/users', '2025-07-13 13:26:00'),
(364, '/dashboard/admin/content', '2025-07-13 13:26:00'),
(365, '/dashboard/admin/users', '2025-07-13 13:26:02'),
(366, '/dashboard/admin/departments', '2025-07-13 13:26:03'),
(367, '/dashboard/admin/events', '2025-07-13 13:26:03'),
(368, '/dashboard/admin/content', '2025-07-13 13:27:55'),
(369, '/dashboard/admin/users', '2025-07-13 13:27:55'),
(370, '/dashboard/admin/link-manager', '2025-07-13 14:29:41'),
(371, '/dashboard/admin/events', '2025-07-13 14:29:45'),
(372, '/dashboard/admin/departments', '2025-07-13 14:29:46'),
(373, '/dashboard/admin/users', '2025-07-13 14:29:49'),
(374, '/dashboard/admin/content', '2025-07-13 14:29:50'),
(375, '/dashboard/admin/events', '2025-07-13 14:29:53'),
(376, '/dashboard/admin/link-manager', '2025-07-13 14:29:54'),
(377, '/dashboard/admin/events', '2025-07-13 14:29:55'),
(378, '/dashboard/admin/content', '2025-07-13 19:13:14'),
(379, '/dashboard/admin/users', '2025-07-13 19:13:17'),
(380, '/dashboard/admin/departments', '2025-07-13 19:13:20'),
(381, '/dashboard/admin/events', '2025-07-13 19:13:21'),
(382, '/dashboard/admin/link-manager', '2025-07-13 19:13:22'),
(383, '/dashboard/admin/events', '2025-07-13 19:13:23'),
(384, '/dashboard/admin/content', '2025-07-13 19:13:24'),
(385, '/dashboard/admin/content', '2025-07-13 19:19:23'),
(386, '/dashboard/admin/users', '2025-07-13 19:19:30'),
(387, '/dashboard/admin/users', '2025-07-13 19:22:15'),
(388, '/downloads', '2025-07-13 19:22:21'),
(389, '/kalender', '2025-07-13 19:22:22'),
(390, '/termin', '2025-07-13 19:22:26'),
(391, '/schuetzenfest', '2025-07-13 19:22:27'),
(392, '/der-verein', '2025-07-13 19:22:29'),
(393, '/dashboard/admin', '2025-07-13 19:22:30'),
(394, '/dashboard/admin/link-manager', '2025-07-13 19:22:31'),
(395, '/dashboard/admin/users', '2025-07-13 19:23:03'),
(396, '/dashboard/admin/users', '2025-07-13 19:25:39'),
(397, '/dashboard/admin/users', '2025-07-13 19:26:56'),
(398, '/dashboard/admin/content', '2025-07-13 19:27:00'),
(399, '/dashboard/admin/users', '2025-07-13 19:27:02'),
(400, '/dashboard/admin/content', '2025-07-13 19:27:03'),
(401, '/dashboard/admin/users', '2025-07-13 19:27:05'),
(402, '/dashboard/admin/content', '2025-07-13 19:27:06'),
(403, '/dashboard/admin/departments', '2025-07-13 19:27:08'),
(404, '/dashboard/admin/content', '2025-07-13 19:27:09'),
(405, '/dashboard/admin/departments', '2025-07-13 19:27:41'),
(406, '/dashboard/admin/departments', '2025-07-13 19:30:21'),
(407, '/dashboard/admin/content', '2025-07-13 19:30:22'),
(408, '/dashboard/admin/users', '2025-07-13 19:30:25'),
(409, '/dashboard/admin/content', '2025-07-13 19:30:26'),
(410, '/dashboard/admin/content', '2025-07-13 19:32:04'),
(411, '/dashboard/admin/content', '2025-07-13 19:32:33'),
(412, '/dashboard/admin/content', '2025-07-13 19:34:20'),
(413, '/dashboard/admin/users', '2025-07-13 19:34:23'),
(414, '/dashboard/admin/departments', '2025-07-13 19:34:24'),
(415, '/dashboard/admin/content', '2025-07-13 19:34:27'),
(416, '/news', '2025-07-13 19:34:30'),
(417, '/der-verein', '2025-07-13 19:34:32'),
(418, '/abteilung', '2025-07-13 19:34:33'),
(419, '/schuetzenfest', '2025-07-13 19:34:34'),
(420, '/abteilung', '2025-07-13 19:34:35'),
(421, '/termin', '2025-07-13 19:34:35'),
(422, '/kalender', '2025-07-13 19:34:35'),
(423, '/downloads', '2025-07-13 19:34:36'),
(424, '/dashboard/admin', '2025-07-13 19:34:39'),
(425, '/dashboard/admin/content', '2025-07-13 19:35:19'),
(426, '/dashboard/admin/departments', '2025-07-13 19:35:20'),
(427, '/dashboard/admin/users', '2025-07-13 19:35:21'),
(428, '/dashboard/admin/content', '2025-07-13 19:35:24'),
(429, '/dashboard/admin/users', '2025-07-13 19:35:26'),
(430, '/dashboard/admin/content', '2025-07-13 19:35:56'),
(431, '/dashboard/admin/users', '2025-07-13 19:36:25'),
(432, '/dashboard/admin/departments', '2025-07-13 19:36:27'),
(433, '/dashboard/admin/link-manager', '2025-07-13 19:36:28'),
(434, '/dashboard/admin/events', '2025-07-13 19:37:38'),
(435, '/dashboard/admin/departments', '2025-07-13 19:37:38'),
(436, '/dashboard/admin/users', '2025-07-13 19:37:39'),
(437, '/dashboard/admin/content', '2025-07-13 19:37:39'),
(438, '/dashboard/admin/link-manager', '2025-07-13 19:37:40'),
(439, '/downloads', '2025-07-13 19:45:07'),
(440, '/dashboard/admin', '2025-07-13 19:45:07'),
(441, '/dashboard/admin/link-manager', '2025-07-13 19:45:08'),
(442, '/dashboard/admin/link-manager', '2025-07-13 19:51:29'),
(443, '/dashboard/admin/link-manager', '2025-07-13 19:59:04'),
(444, '/dashboard/admin/content', '2025-07-13 20:01:57'),
(445, '/dashboard/admin/users', '2025-07-13 20:01:58'),
(446, '/dashboard/admin/events', '2025-07-13 20:01:59'),
(447, '/dashboard/admin/link-manager', '2025-07-13 20:01:59'),
(448, '/dashboard/admin/content', '2025-07-13 20:02:00'),
(449, '/dashboard/admin/link-manager', '2025-07-13 20:02:01'),
(450, '/schuetzenfest', '2025-07-13 20:03:26'),
(451, '/termin', '2025-07-13 20:03:28'),
(452, '/downloads', '2025-07-13 20:03:30'),
(453, '/dashboard/admin', '2025-07-13 20:03:31'),
(454, '/dashboard/admin/content', '2025-07-13 20:03:34'),
(455, '/dashboard/admin/users', '2025-07-13 20:03:35'),
(456, '/dashboard/admin/content', '2025-07-13 20:03:37'),
(457, '/dashboard/admin/users', '2025-07-13 20:03:38'),
(458, '/dashboard/admin/content', '2025-07-13 20:03:38'),
(459, '/dashboard/admin/content', '2025-07-13 20:04:39'),
(460, '/dashboard/admin/link-manager', '2025-07-13 20:04:41'),
(461, '/dashboard/admin/link-manager', '2025-07-13 20:10:09'),
(462, '/dashboard/admin/link-manager', '2025-07-13 20:12:05'),
(463, '/dashboard/admin/link-manager', '2025-07-13 20:13:41'),
(464, '/dashboard/admin/link-manager', '2025-07-13 20:15:10'),
(465, '/dashboard/admin/link-manager', '2025-07-13 20:18:56'),
(466, '/abteilung', '2025-07-13 20:25:15'),
(467, '/schuetzenfest', '2025-07-13 20:25:16'),
(468, '/termin', '2025-07-13 20:25:18'),
(469, '/downloads', '2025-07-13 20:25:20'),
(470, '/dashboard/admin', '2025-07-13 20:25:21'),
(471, '/dashboard/admin/users', '2025-07-13 20:25:23'),
(472, '/dashboard/admin/content', '2025-07-13 20:25:26'),
(473, '/dashboard/admin/users', '2025-07-13 20:25:26'),
(474, '/dashboard/admin/content', '2025-07-13 20:25:30'),
(475, '/dashboard/admin/users', '2025-07-13 20:25:33'),
(476, '/dashboard/admin/content', '2025-07-13 20:25:35'),
(477, '/dashboard/admin/link-manager', '2025-07-13 20:25:37'),
(478, '/dashboard/admin/events', '2025-07-13 20:25:37'),
(479, '/dashboard/admin/users', '2025-07-13 20:25:38'),
(480, '/dashboard/admin/content', '2025-07-13 20:25:39'),
(481, '/dashboard/admin/users', '2025-07-13 20:25:41'),
(482, '/dashboard/admin/content', '2025-07-13 20:25:41'),
(483, '/dashboard/admin/content', '2025-07-13 20:30:14'),
(484, '/dashboard/admin/events', '2025-07-13 20:30:16'),
(485, '/dashboard/admin/link-manager', '2025-07-13 20:30:16'),
(486, '/dashboard/admin/link-manager', '2025-07-13 20:35:01'),
(487, '/dashboard/admin/link-manager', '2025-07-13 20:36:03'),
(488, '/dashboard/admin/link-manager', '2025-07-13 20:36:43'),
(489, '/dashboard/admin/link-manager', '2025-07-13 20:38:23'),
(490, '/dashboard/admin/link-manager', '2025-07-13 20:39:18'),
(491, '/dashboard/admin/link-manager', '2025-07-13 20:41:34'),
(492, '/dashboard/admin/link-manager', '2025-07-13 20:44:48'),
(493, '/dashboard/admin/link-manager', '2025-07-13 20:46:08'),
(494, '/dashboard/admin/link-manager', '2025-07-13 20:52:51'),
(495, '/dashboard/admin/link-manager', '2025-07-13 20:57:48'),
(496, '/dashboard/admin/link-manager', '2025-07-13 21:00:25'),
(497, '/dashboard/admin/link-manager', '2025-07-13 21:00:51'),
(498, '/dashboard/admin/link-manager', '2025-07-13 21:01:03'),
(499, '/dashboard/admin/link-manager', '2025-07-13 21:01:31'),
(500, '/dashboard/admin/link-manager', '2025-07-13 21:02:31'),
(501, '/news', '2025-07-13 21:02:35'),
(502, '/dashboard/admin', '2025-07-13 21:02:38'),
(503, '/dashboard/admin/content', '2025-07-13 21:02:38'),
(504, '/dashboard/admin/link-manager', '2025-07-13 21:02:42'),
(505, '/dashboard/admin/events', '2025-07-13 21:02:43'),
(506, '/dashboard/admin/users', '2025-07-13 21:02:43'),
(507, '/dashboard/admin/link-manager', '2025-07-13 21:02:44'),
(508, '/dashboard/admin/link-manager', '2025-07-13 21:02:46'),
(509, '/dashboard/admin/link-manager', '2025-07-13 21:03:00'),
(510, '/dashboard/admin/link-manager', '2025-07-13 21:04:04'),
(511, '/dashboard/admin/events', '2025-07-13 21:04:09'),
(512, '/dashboard/admin/users', '2025-07-13 21:04:09'),
(513, '/dashboard/admin/content', '2025-07-13 21:04:10'),
(514, '/dashboard/admin/users', '2025-07-13 21:04:11'),
(515, '/dashboard/admin/content', '2025-07-13 21:04:47'),
(516, '/dashboard/admin/users', '2025-07-13 21:04:49'),
(517, '/dashboard/admin/users', '2025-07-13 21:05:20'),
(518, '/login', '2025-07-13 21:06:22'),
(519, '/login', '2025-07-13 21:06:52'),
(520, '/downloads', '2025-07-13 21:07:12'),
(521, '/downloads', '2025-07-13 21:08:15'),
(522, '/login', '2025-07-13 21:09:26'),
(523, '/', '2025-07-13 21:09:27'),
(524, '/dashboard/admin', '2025-07-13 21:09:42'),
(525, '/login', '2025-07-13 21:09:46'),
(526, '/', '2025-07-13 21:10:28'),
(527, '/dashboard/leiter', '2025-07-13 21:10:29'),
(528, '/dashboard/leiter/content', '2025-07-13 21:10:31'),
(529, '/dashboard/leiter/events', '2025-07-13 21:10:31'),
(530, '/dashboard/leiter/content', '2025-07-13 21:10:35'),
(531, '/dashboard/leiter/events', '2025-07-13 21:10:44'),
(532, '/dashboard/leiter/content', '2025-07-13 21:10:45');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sektionen`
--

CREATE TABLE `sektionen` (
  `SektionsID` int(11) NOT NULL,
  `BeitragsID` int(11) NOT NULL,
  `Reihenfolge` int(11) NOT NULL,
  `Modus` tinyint(1) NOT NULL,
  `Text` text DEFAULT NULL,
  `BildURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `termine`
--
-- Tabelle zum Planen der Termine 
CREATE TABLE `termine` (
  `TerminID` int(11) NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Beschreibung` text DEFAULT NULL,
  `Datum` datetime NOT NULL,
  `Ort` varchar(255) DEFAULT NULL,
  `ErstelltVon` int(11) NOT NULL,
  `Wiederholungstyp` enum('Keine','Wöchentlich','Monatlich','Jährlich') NOT NULL DEFAULT 'Keine'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `termine`
--

INSERT INTO `termine` (`TerminID`, `Titel`, `Beschreibung`, `Datum`, `Ort`, `ErstelltVon`, `Wiederholungstyp`) VALUES
(1, 'Bob', 'Hallo bock zu labern ;)', '2025-07-15 18:00:00', 'Delmenhorst', 5, 'Wöchentlich');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `abteilungen`
--
ALTER TABLE `abteilungen`
  ADD PRIMARY KEY (`AbteilungsID`);

--
-- Indizes für die Tabelle `beitraege`
--
ALTER TABLE `beitraege`
  ADD PRIMARY KEY (`BeitragsID`),
  ADD KEY `fk_beitraege_benutzer_idx` (`ErstelltVon`),
  ADD KEY `fk_beitraege_kategorien_idx` (`KategorieID`);

--
-- Indizes für die Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  ADD PRIMARY KEY (`BenutzerID`),
  ADD UNIQUE KEY `Email_UNIQUE` (`Email`),
  ADD KEY `fk_benutzer_rollen_idx` (`RollenID`);

--
-- Indizes für die Tabelle `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`DownloadID`),
  ADD KEY `fk_downloads_benutzer_idx` (`ErstelltVon`);

--
-- Indizes für die Tabelle `kategorien`
--
ALTER TABLE `kategorien`
  ADD PRIMARY KEY (`KategorieID`);

--
-- Indizes für die Tabelle `rollen`
--
ALTER TABLE `rollen`
  ADD PRIMARY KEY (`RollenID`);

--
-- Indizes für die Tabelle `seitenaufrufe`
--
ALTER TABLE `seitenaufrufe`
  ADD PRIMARY KEY (`AufrufID`);

--
-- Indizes für die Tabelle `sektionen`
--
ALTER TABLE `sektionen`
  ADD PRIMARY KEY (`SektionsID`),
  ADD KEY `fk_sektionen_beitraege_idx` (`BeitragsID`);

--
-- Indizes für die Tabelle `termine`
--
ALTER TABLE `termine`
  ADD PRIMARY KEY (`TerminID`),
  ADD KEY `fk_termine_benutzer_idx` (`ErstelltVon`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `abteilungen`
--
ALTER TABLE `abteilungen`
  MODIFY `AbteilungsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `beitraege`
--
ALTER TABLE `beitraege`
  MODIFY `BeitragsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT für Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  MODIFY `BenutzerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `downloads`
--
ALTER TABLE `downloads`
  MODIFY `DownloadID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `kategorien`
--
ALTER TABLE `kategorien`
  MODIFY `KategorieID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT für Tabelle `rollen`
--
ALTER TABLE `rollen`
  MODIFY `RollenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `seitenaufrufe`
--
ALTER TABLE `seitenaufrufe`
  MODIFY `AufrufID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=533;

--
-- AUTO_INCREMENT für Tabelle `sektionen`
--
ALTER TABLE `sektionen`
  MODIFY `SektionsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `termine`
--
ALTER TABLE `termine`
  MODIFY `TerminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `beitraege`
--
ALTER TABLE `beitraege`
  ADD CONSTRAINT `fk_beitraege_benutzer` FOREIGN KEY (`ErstelltVon`) REFERENCES `benutzer` (`BenutzerID`),
  ADD CONSTRAINT `fk_beitraege_kategorien` FOREIGN KEY (`KategorieID`) REFERENCES `kategorien` (`KategorieID`);

--
-- Constraints der Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  ADD CONSTRAINT `fk_benutzer_rollen` FOREIGN KEY (`RollenID`) REFERENCES `rollen` (`RollenID`);

--
-- Constraints der Tabelle `downloads`
--
ALTER TABLE `downloads`
  ADD CONSTRAINT `fk_downloads_benutzer` FOREIGN KEY (`ErstelltVon`) REFERENCES `benutzer` (`BenutzerID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `sektionen`
--
ALTER TABLE `sektionen`
  ADD CONSTRAINT `fk_sektionen_beitraege` FOREIGN KEY (`BeitragsID`) REFERENCES `beitraege` (`BeitragsID`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `termine`
--
ALTER TABLE `termine`
  ADD CONSTRAINT `fk_termine_benutzer` FOREIGN KEY (`ErstelltVon`) REFERENCES `benutzer` (`BenutzerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
