-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2026 at 06:34 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studyhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `Id` int(11) NOT NULL,
  `FacultyId` int(11) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Description` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`Id`, `FacultyId`, `Name`, `Description`) VALUES
(1, 1, 'Programozás alapjai', 'C és Python alapok'),
(2, 1, 'Adatszerkezetek', 'Algoritmusok és listák'),
(3, 1, 'Webfejlesztés', 'HTML, CSS, JS'),
(4, 4, 'Java programozás', 'Objektumorientált Java'),
(5, 4, 'Adatbázisrendszerek', 'SQL és relációs modellek'),
(6, 7, 'Beágyazott rendszerek', 'Mikrokontrollerek'),
(7, 7, 'Számítógép-hálózatok', 'TCP/IP'),
(8, 10, 'Szoftvertechnológia', 'Agilis fejlesztés'),
(9, 10, 'Mobil alkalmazásfejlesztés', 'Android'),
(10, 13, 'C# programozás', '.NET alapok'),
(11, 13, 'Játékfejlesztés', 'Unity'),
(12, 3, 'Marketing alapjai', 'Piacelemzés'),
(13, 3, 'Vállalatgazdaságtan', 'Gazdasági modellek'),
(14, 12, 'Pénzügyek', 'Befektetések'),
(15, 12, 'Számvitel', 'Könyvelés'),
(16, 2, 'Alkotmányjog', 'Magyar jogrendszer'),
(17, 2, 'Polgári jog', 'Szerződések'),
(18, 5, 'Filozófia', 'Etika'),
(19, 6, 'Diszkrét matematika', 'Gráfok'),
(20, 8, 'Anyagtudomány', 'Fémek és műanyagok');

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `Id` int(11) NOT NULL,
  `UniversityId` int(11) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Description` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`Id`, `UniversityId`, `Name`, `Description`) VALUES
(1, 1, 'Természettudományi és Informatikai Kar', 'Informatika és természettudományok'),
(2, 1, 'Állam- és Jogtudományi Kar', 'Jogi képzések'),
(3, 1, 'Gazdaságtudományi Kar', 'Gazdasági és menedzsment szakok'),
(4, 2, 'Informatikai Kar', 'Programozás és informatikai rendszerek'),
(5, 2, 'Bölcsészettudományi Kar', 'Humán tudományok'),
(6, 2, 'Természettudományi Kar', 'Matematika és fizika'),
(7, 3, 'Villamosmérnöki és Informatikai Kar', 'IT és elektronika'),
(8, 3, 'Gépészmérnöki Kar', 'Gépészeti képzések'),
(9, 3, 'Gazdaság- és Társadalomtudományi Kar', 'Menedzsment'),
(10, 4, 'Informatikai Kar', 'Szoftverfejlesztés'),
(11, 4, 'Műszaki Kar', 'Mérnöki szakok'),
(12, 4, 'Gazdaságtudományi Kar', 'Üzleti képzések'),
(13, 5, 'Műszaki és Informatikai Kar', 'IT és mérnöki'),
(14, 5, 'Közgazdaságtudományi Kar', 'Gazdaság'),
(15, 5, 'Bölcsészettudományi Kar', 'Humán területek');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `Id` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL,
  `Title` varchar(64) NOT NULL,
  `AttachmentUrl` varchar(256) DEFAULT NULL,
  `Description` varchar(512) DEFAULT NULL,
  `UploaderUserId` int(11) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `LastEdited` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`Id`, `CourseId`, `Title`, `AttachmentUrl`, `Description`, `UploaderUserId`, `CreatedAt`, `LastEdited`) VALUES
(1, 1, 'C nyelv alapok', '/files/c_alapok.pdf', 'Változók, ciklusok', 1, '2026-01-30 00:38:33', NULL),
(2, 1, 'Python jegyzet', '/files/python.pdf', 'Lista, dict', 2, '2026-01-30 00:38:33', NULL),
(3, 2, 'Linked listák', '/files/linked_list.pdf', 'Adatszerkezet', 1, '2026-01-30 00:38:33', NULL),
(4, 2, 'Stack és Queue', '/files/stack_queue.pdf', 'LIFO, FIFO', 3, '2026-01-30 00:38:33', NULL),
(5, 3, 'HTML alapok', '/files/html.pdf', 'HTML5', 2, '2026-01-30 00:38:33', NULL),
(6, 3, 'CSS alapok', '/files/css.pdf', 'Flexbox', 2, '2026-01-30 00:38:33', NULL),
(7, 3, 'JavaScript', '/files/js.pdf', 'DOM', 1, '2026-01-30 00:38:33', NULL),
(8, 4, 'Java OOP', '/files/java_oop.pdf', 'Osztályok', 3, '2026-01-30 00:38:33', NULL),
(9, 4, 'Interface-ek', '/files/interface.pdf', 'Absztrakció', 3, '2026-01-30 00:38:33', NULL),
(10, 5, 'SQL SELECT', '/files/sql_select.pdf', 'Lekérdezések', 4, '2026-01-30 00:38:33', NULL),
(11, 5, 'JOIN-ok', '/files/sql_join.pdf', 'Kapcsolatok', 4, '2026-01-30 00:38:33', NULL),
(12, 6, 'Arduino alapok', '/files/arduino.pdf', 'Mikrokontroller', 5, '2026-01-30 00:38:33', NULL),
(13, 6, 'Szenzorok', '/files/sensor.pdf', 'I/O', 5, '2026-01-30 00:38:33', NULL),
(14, 7, 'OSI modell', '/files/osi.pdf', 'Hálózati rétegek', 1, '2026-01-30 00:38:33', NULL),
(15, 7, 'IP címzés', '/files/ip.pdf', 'IPv4', 1, '2026-01-30 00:38:33', NULL),
(16, 8, 'SCRUM', '/files/scrum.pdf', 'Agilis módszertan', 2, '2026-01-30 00:38:33', NULL),
(17, 8, 'Git flow', '/files/git.pdf', 'Verziókezelés', 2, '2026-01-30 00:38:33', NULL),
(18, 9, 'Android alapok', '/files/android.pdf', 'Activity', 3, '2026-01-30 00:38:33', NULL),
(19, 9, 'Intentek', '/files/intent.pdf', 'Navigáció', 3, '2026-01-30 00:38:33', NULL),
(20, 10, 'C# alapok', '/files/csharp.pdf', 'OOP', 4, '2026-01-30 00:38:33', NULL),
(21, 10, '.NET Core', '/files/dotnet.pdf', 'Backend', 4, '2026-01-30 00:38:33', NULL),
(22, 11, 'Unity alapok', '/files/unity.pdf', 'GameObject', 5, '2026-01-30 00:38:33', NULL),
(23, 11, 'Physics', '/files/physics.pdf', 'Collider', 5, '2026-01-30 00:38:33', NULL),
(24, 12, 'Marketing mix', '/files/4p.pdf', '4P modell', 2, '2026-01-30 00:38:33', NULL),
(25, 13, 'Cash flow', '/files/cashflow.pdf', 'Pénzügyi kimutatás', 2, '2026-01-30 00:38:33', NULL),
(26, 14, 'Befektetések', '/files/invest.pdf', 'Részvények', 3, '2026-01-30 00:38:33', NULL),
(27, 15, 'Mérleg', '/files/merleg.pdf', 'Eszközök', 3, '2026-01-30 00:38:33', NULL),
(28, 16, 'Alaptörvény', '/files/alaptorveny.pdf', 'Jogforrások', 4, '2026-01-30 00:38:33', NULL),
(29, 17, 'Szerződések', '/files/contract.pdf', 'Polgári jog', 4, '2026-01-30 00:38:33', NULL),
(30, 18, 'Etika', '/files/etika.pdf', 'Morálfilozófia', 5, '2026-01-30 00:38:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `note_comments`
--

CREATE TABLE `note_comments` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Text` varchar(256) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Token` varchar(64) NOT NULL,
  `Date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `Id` int(11) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Description` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`Id`, `Name`, `Description`) VALUES
(1, 'Szegedi Tudományegyetem', 'Dél-Magyarország legnagyobb egyeteme'),
(2, 'Eötvös Loránd Tudományegyetem', 'Budapest vezető egyeteme'),
(3, 'Budapesti Műszaki és Gazdaságtudományi Egyetem', 'Mérnöki és informatikai képzések'),
(4, 'Debreceni Egyetem', 'Kelet-Magyarország oktatási központja'),
(5, 'Pécsi Tudományegyetem', 'Az egyik legrégebbi magyar egyetem');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Nickname` varchar(64) NOT NULL,
  `Email` varchar(64) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `AvatarURL` varchar(64) NOT NULL DEFAULT 'DefaultAvatar.svg',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `LastLogin` datetime DEFAULT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Nickname`, `Email`, `Password`, `AvatarURL`, `CreatedAt`, `LastLogin`, `IsAdmin`) VALUES
(1, 'szabi', 'szabi@gmail.com', '$2a$12$aw4.RSz2gejA2qj0A.AAA.kY9iTU6HM2evaG2dHvJ98jJ28zPLvnO\n\n\n', 'DefaultAvatar.svg', '2026-01-30 00:37:11', NULL, 0),
(2, 'anna', 'anna@gmail.com', '$2a$12$aw4.RSz2gejA2qj0A.AAA.kY9iTU6HM2evaG2dHvJ98jJ28zPLvnO\n\n\n', 'DefaultAvatar.svg', '2026-01-30 00:37:11', NULL, 0),
(3, 'peter', 'peter@gmail.com', '$2a$12$aw4.RSz2gejA2qj0A.AAA.kY9iTU6HM2evaG2dHvJ98jJ28zPLvnO\n\n\n', 'DefaultAvatar.svg', '2026-01-30 00:37:11', NULL, 0),
(4, 'dani', 'dani@gmail.com', '$2a$12$aw4.RSz2gejA2qj0A.AAA.kY9iTU6HM2evaG2dHvJ98jJ28zPLvnO\n\n\n', 'DefaultAvatar.svg', '2026-01-30 00:37:11', NULL, 0),
(5, 'kata', 'kata@gmail.com', '$2a$12$aw4.RSz2gejA2qj0A.AAA.kY9iTU6HM2evaG2dHvJ98jJ28zPLvnO\n\n\n', 'DefaultAvatar.svg', '2026-01-30 00:37:11', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `COURSES_ID_TO_FACULTIES_ID` (`FacultyId`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FACULTIES_UNVIERSITYID_TO_UNIVERSITIES_ID` (`UniversityId`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NOTES_COURSEID_TO_COURSES_ID` (`CourseId`),
  ADD KEY `NOTES_UPLOADERUSERID_TO_USERS_ID` (`UploaderUserId`);

--
-- Indexes for table `note_comments`
--
ALTER TABLE `note_comments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NOTE_COMMENTS_USERID_TO_USERS_ID` (`UserId`) USING BTREE;

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `SESSIONS_USERID_TO_USERS_ID` (`UserId`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Name` (`Name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Nickname` (`Nickname`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `note_comments`
--
ALTER TABLE `note_comments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `universities`
--
ALTER TABLE `universities`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `COURSES_ID_TO_FACULTIES_ID` FOREIGN KEY (`FacultyId`) REFERENCES `faculties` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `faculties`
--
ALTER TABLE `faculties`
  ADD CONSTRAINT `FACULTIES_UNVIERSITYID_TO_UNIVERSITIES_ID` FOREIGN KEY (`UniversityId`) REFERENCES `universities` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `NOTES_COURSEID_TO_COURSES_ID` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `NOTES_UPLOADERUSERID_TO_USERS_ID` FOREIGN KEY (`UploaderUserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `note_comments`
--
ALTER TABLE `note_comments`
  ADD CONSTRAINT `NOTE_LIKES_USERID_TO_USERS_ID` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `SESSIONS_USERID_TO_USERS_ID` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
