-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 06. Jul 2025 um 20:09
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.0.30

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
(4, 'News', 'Viele neune Infos', NULL, 2, NULL, 1, '2025-07-06 16:18:25', NULL),
(5, 'Termisn', 'Hey', NULL, 9, 4, 1, '2025-07-06 16:31:48', NULL),
(6, 'Was geht ab!', 'Es wird nur Gewonnen', '', 5, 1, 1, '2025-07-06 16:59:29', NULL),
(7, 'Test 123', 'c546a51c6a51x', '', 3, 1, 5, '2025-07-06 18:06:50', NULL),
(8, 'ölkcsnölknlc', 'cnclknaüokncokn', '', 3, 1, 5, '2025-07-06 18:07:16', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--

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
(2, 'Jan', 'Boos', 'JB@gmail.com', '$2b$10$JrglxTJkfYvMZ0Z732ExBOyQGhR8RliZraywUuGmc6EAb0YueWvrS', 3, '2025-07-05 12:50:52'),
(3, 'Aleks', 'Oost', 'AJ@geil.schilff', '$2b$10$QvXGvys.FOkQzHpzuLq5yO8UZ8A9QTF9kES7g7k4ri5kyM3W1CNVS', 2, '2025-07-05 12:54:23'),
(4, 'Sarah', 'Jahnaschke', 'Klein@zwerg.mico', '$2b$10$qiNEtGwMZwOO.GhUa0QmieX9pSS4gZ5p4MbVuKqH2SaanKFimQWC.', 3, '2025-07-05 12:57:30'),
(5, 'Niclas', 'RR', 'N@R.R', '$2b$10$0gbEGkujIatDx4OKsjy71OHnBFGmTLgze1WiFz7.KhmJUuAFAlZ72', 3, '2025-07-05 12:59:27');

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
(97, '/abteilung-component', '2025-07-06 18:07:17');

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

CREATE TABLE `termine` (
  `TerminID` int(11) NOT NULL,
  `Titel` varchar(255) NOT NULL,
  `Beschreibung` text DEFAULT NULL,
  `Datum` datetime NOT NULL,
  `Ort` varchar(255) DEFAULT NULL,
  `ErstelltVon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `BeitragsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  MODIFY `BenutzerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `AufrufID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT für Tabelle `sektionen`
--
ALTER TABLE `sektionen`
  MODIFY `SektionsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `termine`
--
ALTER TABLE `termine`
  MODIFY `TerminID` int(11) NOT NULL AUTO_INCREMENT;

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
