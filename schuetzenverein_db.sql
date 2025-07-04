-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 04. Jul 2025 um 21:24
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
-- Tabellenstruktur für Tabelle `abteilungs_daten`
--

CREATE TABLE `abteilungs_daten` (
  `AbteilungsID` int(11) NOT NULL,
  `Abteilungsname` varchar(45) DEFAULT NULL,
  `Abteilungsbeschreibung` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `beitrags_daten`
--

CREATE TABLE `beitrags_daten` (
  `BeitragsID` int(11) NOT NULL,
  `Titel` varchar(45) DEFAULT NULL,
  `Inhalt` longtext DEFAULT NULL,
  `Erstellungsdatum` date DEFAULT NULL,
  `Aenderungsdatum` date DEFAULT NULL,
  `CreatorID` int(11) DEFAULT NULL,
  `AbteilungsID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kommentar_daten`
--

CREATE TABLE `kommentar_daten` (
  `KommentarID` int(11) NOT NULL,
  `Inhalt` longtext DEFAULT NULL,
  `Erstellungsdatum` date DEFAULT NULL,
  `BeitragsID` int(11) DEFAULT NULL,
  `NutzerID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `nutzer_daten`
--

CREATE TABLE `nutzer_daten` (
  `NutzerID` int(11) NOT NULL,
  `Vorname` varchar(45) DEFAULT NULL,
  `Nachname` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Passwort` varchar(45) DEFAULT NULL,
  `RoleID` int(11) DEFAULT NULL,
  `LastLogin` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `nutzer_daten`
--

INSERT INTO `nutzer_daten` (`NutzerID`, `Vorname`, `Nachname`, `Email`, `Passwort`, `RoleID`, `LastLogin`) VALUES
(5, 'Niclas Jeremy Martin', 'Rieckers', 'rieckersniclas@gmail.com', '$2b$10$cge0N1Z8LeEaMomycvgizetVjYfCipLzXALBBn', 3, NULL),
(7, 'Jan', 'Boos', 'JB@gmail.com', '$2b$10$5MDlY.CfomMdsITWV7ijZ.TrrDmDf2vHWmqxYw', 1, NULL),
(8, 'Franz', 'osen', 'OF@g.g', '$2b$10$wOA..4aXNAI0MG2fovXy8uhqjlSh7VXtSsNyLo', 1, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rechts_daten`
--

CREATE TABLE `rechts_daten` (
  `RechteID` int(11) NOT NULL,
  `Code` longtext DEFAULT NULL,
  `Text` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `rechts_daten`
--

INSERT INTO `rechts_daten` (`RechteID`, `Code`, `Text`) VALUES
(1, 'READ_ALL', 'Nutzer kann alle öffentlichen Inhalte sehen und kommentieren.'),
(2, 'WRITE_SECTION', 'Nutzer kann Beiträge und Termine für die eigene Abteilung erstellen und verwalten.'),
(3, 'ADMIN_FULL_ACCESS', 'Nutzer hat vollen administrativen Zugriff auf alle Bereiche der Anwendung.');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rollen_daten`
--

CREATE TABLE `rollen_daten` (
  `RollenID` int(11) NOT NULL,
  `RollenName` varchar(45) DEFAULT NULL,
  `RechteID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `rollen_daten`
--

INSERT INTO `rollen_daten` (`RollenID`, `RollenName`, `RechteID`) VALUES
(1, 'Mitglied', 1),
(2, 'Abteilungsleiter', 2),
(3, 'Admin', 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `termin_daten`
--

CREATE TABLE `termin_daten` (
  `TerminID` int(11) NOT NULL,
  `Titel` varchar(45) DEFAULT NULL,
  `Beschreibung` longtext DEFAULT NULL,
  `Datum` date DEFAULT NULL,
  `Uhrzeit` time DEFAULT NULL,
  `Ort` varchar(45) DEFAULT NULL,
  `AbteilungsID` int(11) DEFAULT NULL,
  `Erstellungsdatum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `abteilungs_daten`
--
ALTER TABLE `abteilungs_daten`
  ADD PRIMARY KEY (`AbteilungsID`);

--
-- Indizes für die Tabelle `beitrags_daten`
--
ALTER TABLE `beitrags_daten`
  ADD PRIMARY KEY (`BeitragsID`),
  ADD KEY `fs_CreatorID_idx` (`CreatorID`),
  ADD KEY `fs_AbteilungsID_idx` (`AbteilungsID`);

--
-- Indizes für die Tabelle `kommentar_daten`
--
ALTER TABLE `kommentar_daten`
  ADD PRIMARY KEY (`KommentarID`),
  ADD KEY `fs_BeitragsID_idx` (`BeitragsID`),
  ADD KEY `fs_NutzerID_idx` (`NutzerID`);

--
-- Indizes für die Tabelle `nutzer_daten`
--
ALTER TABLE `nutzer_daten`
  ADD PRIMARY KEY (`NutzerID`),
  ADD KEY `fs_RollenID_idx` (`RoleID`);

--
-- Indizes für die Tabelle `rechts_daten`
--
ALTER TABLE `rechts_daten`
  ADD PRIMARY KEY (`RechteID`);

--
-- Indizes für die Tabelle `rollen_daten`
--
ALTER TABLE `rollen_daten`
  ADD PRIMARY KEY (`RollenID`),
  ADD KEY `RechteID_idx` (`RechteID`);

--
-- Indizes für die Tabelle `termin_daten`
--
ALTER TABLE `termin_daten`
  ADD PRIMARY KEY (`TerminID`),
  ADD KEY `fs_AbteilungsID_idx` (`AbteilungsID`),
  ADD KEY `fs_AbteilungsID_zu_Termin_idx` (`AbteilungsID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `abteilungs_daten`
--
ALTER TABLE `abteilungs_daten`
  MODIFY `AbteilungsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `beitrags_daten`
--
ALTER TABLE `beitrags_daten`
  MODIFY `BeitragsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `kommentar_daten`
--
ALTER TABLE `kommentar_daten`
  MODIFY `KommentarID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `nutzer_daten`
--
ALTER TABLE `nutzer_daten`
  MODIFY `NutzerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `rechts_daten`
--
ALTER TABLE `rechts_daten`
  MODIFY `RechteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `rollen_daten`
--
ALTER TABLE `rollen_daten`
  MODIFY `RollenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `termin_daten`
--
ALTER TABLE `termin_daten`
  MODIFY `TerminID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `beitrags_daten`
--
ALTER TABLE `beitrags_daten`
  ADD CONSTRAINT `fs_AbteilungsIDZuBeitrag` FOREIGN KEY (`AbteilungsID`) REFERENCES `abteilungs_daten` (`AbteilungsID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fs_NutzerIDZuBeitrag` FOREIGN KEY (`CreatorID`) REFERENCES `nutzer_daten` (`NutzerID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `kommentar_daten`
--
ALTER TABLE `kommentar_daten`
  ADD CONSTRAINT `fs_BeitragsIDZuKommentare` FOREIGN KEY (`BeitragsID`) REFERENCES `beitrags_daten` (`BeitragsID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fs_NutzerIDZuKommentare` FOREIGN KEY (`NutzerID`) REFERENCES `nutzer_daten` (`NutzerID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `nutzer_daten`
--
ALTER TABLE `nutzer_daten`
  ADD CONSTRAINT `fs_RollenIDZuNutzer` FOREIGN KEY (`RoleID`) REFERENCES `rollen_daten` (`RollenID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `rollen_daten`
--
ALTER TABLE `rollen_daten`
  ADD CONSTRAINT `fs_RechteIDZuRolle` FOREIGN KEY (`RechteID`) REFERENCES `rechts_daten` (`RechteID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `termin_daten`
--
ALTER TABLE `termin_daten`
  ADD CONSTRAINT `fs_AbteilungsIDZuTermine` FOREIGN KEY (`AbteilungsID`) REFERENCES `abteilungs_daten` (`AbteilungsID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
