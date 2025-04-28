-- initial_schema.sql

USE komunalinis_db;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: komunalinis_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `EmployeeTimeSlots`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmployeeTimeSlots` (
  `timeslot_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(36) DEFAULT NULL,
  `slot_date` date NOT NULL,
  `time_from` time NOT NULL,
  `time_to` time NOT NULL,
  `is_taken` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`timeslot_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `EmployeeTimeSlots_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `Users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeTimeSlots`
--

LOCK TABLES `EmployeeTimeSlots` WRITE;
/*!40000 ALTER TABLE `EmployeeTimeSlots` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmployeeTimeSlots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GarbageCollectionSchedule`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GarbageCollectionSchedule` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int NOT NULL,
  `waste_id` int NOT NULL,
  `collection_date` date NOT NULL,
  `comment` text,
  PRIMARY KEY (`schedule_id`),
  KEY `location_id` (`location_id`),
  KEY `waste_id` (`waste_id`),
  CONSTRAINT `GarbageCollectionSchedule_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`),
  CONSTRAINT `GarbageCollectionSchedule_ibfk_2` FOREIGN KEY (`waste_id`) REFERENCES `WasteTypes` (`waste_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GarbageCollectionSchedule`
--

LOCK TABLES `GarbageCollectionSchedule` WRITE;
/*!40000 ALTER TABLE `GarbageCollectionSchedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `GarbageCollectionSchedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Locations`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Locations`
--

LOCK TABLES `Locations` WRITE;
/*!40000 ALTER TABLE `Locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `Locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservations`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reservations` (
  `ReservationId` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `timeslot_id` int DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `topic_id` int NOT NULL,
  `status` varchar(50) DEFAULT 'Confirmed',
  PRIMARY KEY (`ReservationId`),
  KEY `user_id` (`user_id`),
  KEY `timeslot_id` (`timeslot_id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `Reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Reservations_ibfk_2` FOREIGN KEY (`timeslot_id`) REFERENCES `EmployeeTimeSlots` (`timeslot_id`),
  CONSTRAINT `Reservations_ibfk_3` FOREIGN KEY (`topic_id`) REFERENCES `VisitTopics` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservations`
--

LOCK TABLES `Reservations` WRITE;
/*!40000 ALTER TABLE `Reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'User');
INSERT INTO `Roles` VALUES (2,'Employee');
INSERT INTO `Roles` VALUES (3,'Administrator');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `Id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role_id` int NOT NULL DEFAULT '1',
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `AccessFailedCount` int NOT NULL DEFAULT '0',
  `ConcurrencyStamp` varchar(255) NOT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `SecurityStamp` varchar(255) NOT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `LockoutEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `LockoutEnd` datetime DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VisitTopics`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VisitTopics` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `topic_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VisitTopics`
--

LOCK TABLES `VisitTopics` WRITE;
/*!40000 ALTER TABLE `VisitTopics` DISABLE KEYS */;
INSERT INTO `VisitTopics` VALUES (1,'Sutarčių sudarymas','Pasirašyti naują sutartį ar pratęsti seną');
INSERT INTO `VisitTopics` VALUES (2,'Klaidos sąskaitose','Sąskaitų tikslinimas, korekcijos');
INSERT INTO `VisitTopics` VALUES (3,'Bendros konsultacijos','Bendro pobūdžio klausimai ir konsultacijos');
/*!40000 ALTER TABLE `VisitTopics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WasteTypes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WasteTypes` (
  `waste_id` int NOT NULL AUTO_INCREMENT,
  `waste_name` varchar(100) NOT NULL,
  PRIMARY KEY (`waste_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WasteTypes`
--

LOCK TABLES `WasteTypes` WRITE;
/*!40000 ALTER TABLE `WasteTypes` DISABLE KEYS */;
INSERT INTO `WasteTypes` VALUES (1,'Household');
INSERT INTO `WasteTypes` VALUES (2,'Plastic/Metal/Paper');
INSERT INTO `WasteTypes` VALUES (3,'Glass');
/*!40000 ALTER TABLE `WasteTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'komunalinis_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-27 13:48:42
