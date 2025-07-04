-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 04. Jul 2025 um 23:02
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
  `KategorieID` int(11) NOT NULL,
  `ErstelltVon` int(11) NOT NULL,
  `Erstellungsdatum` timestamp NOT NULL DEFAULT current_timestamp(),
  `Aenderungsdatum` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'News und Schützenverein Bremen Huchting'),
(2, 'News'),
(3, 'Der Verein'),
(4, 'Abteilungen'),
(5, 'Meisterschaften'),
(6, 'Schießstände'),
(7, 'Schützenfest'),
(8, 'Downloads'),
(9, 'Termine'),
(10, 'Terminanfrage');

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
  MODIFY `BeitragsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  MODIFY `BenutzerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `kategorien`
--
ALTER TABLE `kategorien`
  MODIFY `KategorieID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `rollen`
--
ALTER TABLE `rollen`
  MODIFY `RollenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
