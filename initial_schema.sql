/* -----------------------------------------------------------
   Bendri nustatymai
   ----------------------------------------------------------- */
SET SQL_MODE              = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone             = '+00:00';
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS    = 0;
SET UNIQUE_CHECKS         = 0;

/* -----------------------------------------------------------
   1. Lentelės
   ----------------------------------------------------------- */

/* -- Roles -------------------------------------------------- */
CREATE TABLE `Roles` (
  `Id`              varchar(255)  NOT NULL,
  `role_name`       longtext      NOT NULL,
  `Name`            varchar(256)  DEFAULT NULL,
  `NormalizedName`  varchar(256)  DEFAULT NULL,
  `ConcurrencyStamp` longtext     DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- Users -------------------------------------------------- */
CREATE TABLE `Users` (
  `Id`                     varchar(255) NOT NULL,
  `first_name`             longtext     DEFAULT NULL,
  `last_name`              longtext     DEFAULT NULL,
  `address`                longtext     DEFAULT NULL,
  `RoleId`                 varchar(255) DEFAULT NULL,
  `UserName`               varchar(256) DEFAULT NULL,
  `NormalizedUserName`     varchar(256) DEFAULT NULL,
  `Email`                  varchar(256) DEFAULT NULL,
  `NormalizedEmail`        varchar(256) DEFAULT NULL,
  `EmailConfirmed`         tinyint(1)   NOT NULL,
  `PasswordHash`           longtext     DEFAULT NULL,
  `SecurityStamp`          longtext     DEFAULT NULL,
  `ConcurrencyStamp`       longtext     DEFAULT NULL,
  `PhoneNumber`            longtext     DEFAULT NULL,
  `PhoneNumberConfirmed`   tinyint(1)   NOT NULL,
  `TwoFactorEnabled`       tinyint(1)   NOT NULL,
  `LockoutEnd`             datetime(6)  DEFAULT NULL,
  `LockoutEnabled`         tinyint(1)   NOT NULL,
  `AccessFailedCount`      int(11)      NOT NULL, 
  `subscription`           boolean      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY        `EmailIndex`    (`NormalizedEmail`),
  KEY        `IX_Users_RoleId` (`RoleId`),
  CONSTRAINT `FK_Users_Roles_RoleId`
      FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- AspNetRoleClaims --------------------------------------- */
CREATE TABLE `AspNetRoleClaims` (
  `Id`         int(11)      NOT NULL AUTO_INCREMENT,
  `RoleId`     varchar(255) NOT NULL,
  `ClaimType`  longtext     DEFAULT NULL,
  `ClaimValue` longtext     DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_Roles_RoleId`
      FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- AspNetUserClaims --------------------------------------- */
CREATE TABLE `AspNetUserClaims` (
  `Id`         int(11)      NOT NULL AUTO_INCREMENT,
  `UserId`     varchar(255) NOT NULL,
  `ClaimType`  longtext     DEFAULT NULL,
  `ClaimValue` longtext     DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_Users_UserId`
      FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- AspNetUserLogins --------------------------------------- */
CREATE TABLE `AspNetUserLogins` (
  `LoginProvider`      varchar(255) NOT NULL,
  `ProviderKey`        varchar(255) NOT NULL,
  `ProviderDisplayName` longtext    DEFAULT NULL,
  `UserId`             varchar(255) NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserLogins_Users_UserId`
      FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- AspNetUserRoles ---------------------------------------- */
CREATE TABLE `AspNetUserRoles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_Roles_RoleId`
      FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_Users_UserId`
      FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- AspNetUserTokens --------------------------------------- */
CREATE TABLE `AspNetUserTokens` (
  `UserId`         varchar(255) NOT NULL,
  `LoginProvider`  varchar(255) NOT NULL,
  `Name`           varchar(255) NOT NULL,
  `Value`          longtext     DEFAULT NULL,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_Users_UserId`
      FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- Applications ------------------------------------------- */
CREATE TABLE `Applications` (
  `application_id` int(11)      NOT NULL AUTO_INCREMENT,
  `form_type`      varchar(100) NOT NULL,
  `data`           longtext     NOT NULL,
  `submitted_at`   datetime     NOT NULL,
  `user_id`        varchar(255) NOT NULL,
  `approved`       tinyint(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (`application_id`),
  KEY `IX_Applications_UserId` (`user_id`),
  CONSTRAINT `FK_Applications_Users_UserId`
      FOREIGN KEY (`user_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- EmployeeTimeSlots -------------------------------------- */
CREATE TABLE `EmployeeTimeSlots` (
  `timeslot_id` int(11)      NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(255) NOT NULL,
  `slot_date`   datetime(6)  NOT NULL,
  `time_from`   time(6)      NOT NULL,
  `time_to`     time(6)      NOT NULL,
  `is_taken`    tinyint(1)   NOT NULL,
  PRIMARY KEY (`timeslot_id`),
  KEY `IX_EmployeeTimeSlots_EmployeeId` (`employee_id`),
  CONSTRAINT `FK_EmployeeTimeSlots_Users_EmployeeId`
      FOREIGN KEY (`employee_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- Locations ---------------------------------------------- */
CREATE TABLE `Locations` (
  `location_id`   int(11)      NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `description`   longtext     DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- WasteTypes --------------------------------------------- */
CREATE TABLE `WasteTypes` (
  `waste_id`   int(11)      NOT NULL AUTO_INCREMENT,
  `waste_name` varchar(100) NOT NULL,
  PRIMARY KEY (`waste_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- GarbageCollectionSchedule ------------------------------ */
CREATE TABLE `GarbageCollectionSchedule` (
  `schedule_id`     int(11)     NOT NULL AUTO_INCREMENT,
  `location_id`     int(11)     NOT NULL,
  `waste_id`        int(11)     NOT NULL,
  `collection_date` datetime(6) NOT NULL,
  `comment`         longtext    DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `IX_GarbageCollectionSchedule_LocationId` (`location_id`),
  KEY `IX_GarbageCollectionSchedule_WasteId`    (`waste_id`),
  CONSTRAINT `FK_GarbageCollectionSchedule_Locations_LocationId`
      FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_GarbageCollectionSchedule_WasteTypes_WasteId`
      FOREIGN KEY (`waste_id`)    REFERENCES `WasteTypes`  (`waste_id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- VisitTopics -------------------------------------------- */
CREATE TABLE `VisitTopics` (
  `topic_id`   int(11)  NOT NULL AUTO_INCREMENT,
  `topic_name` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- Reservations ------------------------------------------- */
CREATE TABLE `Reservations` (
  `ReservationId`   int(11)      NOT NULL AUTO_INCREMENT,
  `user_id`         varchar(255) NOT NULL,
  `timeslot_id`     int(11)      NOT NULL,
  `reservation_date` datetime(6) NOT NULL,
  `status`          longtext     NOT NULL,
  `topic_id`        int(11)      NOT NULL,
  PRIMARY KEY (`ReservationId`),
  KEY `IX_Reservations_UserId`     (`user_id`),
  KEY `IX_Reservations_TimeslotId` (`timeslot_id`),
  KEY `IX_Reservations_TopicId`    (`topic_id`),
  CONSTRAINT `FK_Reservations_Users_UserId`
      FOREIGN KEY (`user_id`)     REFERENCES `Users`            (`Id`)           ON DELETE CASCADE,
  CONSTRAINT `FK_Reservations_EmployeeTimeSlots_TimeslotId`
      FOREIGN KEY (`timeslot_id`) REFERENCES `EmployeeTimeSlots`(`timeslot_id`)  ON DELETE CASCADE,
  CONSTRAINT `FK_Reservations_VisitTopics_TopicId`
      FOREIGN KEY (`topic_id`)    REFERENCES `VisitTopics`      (`topic_id`)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -- __EFMigrationsHistory ---------------------------------- */
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId`   varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* -----------------------------------------------------------
   2. Pradiniai duomenys
   ----------------------------------------------------------- */

/* -- Roles (Worker + Client) -------------------------------- */
INSERT INTO `Roles` (`Id`, `role_name`, `Name`, `NormalizedName`, `ConcurrencyStamp`) VALUES
('1', 'worker', 'Worker', 'WORKER', NULL),
('2', 'client', 'Client', 'CLIENT', NULL), 
('3', 'admin', 'Admin', 'ADMIN', NULL);

LOCK TABLES `WasteTypes` WRITE;
/*!40000 ALTER TABLE `WasteTypes` DISABLE KEYS */;
INSERT INTO `WasteTypes` VALUES (1,'Household');
INSERT INTO `WasteTypes` VALUES (2,'Plastic/Metal/Paper');
INSERT INTO `WasteTypes` VALUES (3,'Glass');
/*!40000 ALTER TABLE `WasteTypes` ENABLE KEYS */;
UNLOCK TABLES;

/* -- Users -------------------------------------------------- */
INSERT INTO `Users`
(`Id`,`first_name`,`last_name`,`address`,`RoleId`,`UserName`,`NormalizedUserName`,`Email`,`NormalizedEmail`,
 `EmailConfirmed`,`PasswordHash`,`SecurityStamp`,`ConcurrencyStamp`,`PhoneNumber`,`PhoneNumberConfirmed`,
 `TwoFactorEnabled`,`LockoutEnd`,`LockoutEnabled`,`AccessFailedCount`)
VALUES
('1c6457eb-9e45-4e3e-817c-dcfea8211fe8','testas','testas',NULL,NULL,
 'testa3s@ktu.ltA','TESTA3S@KTU.LTA','testa3s@ktu.ltA','TESTA3S@KTU.LTA',
 0,'AQAAAAIAAYagAAAAEPQZsKUcpFY+1khglfTDrmScccZJNiLFUf/bDuQKaMprmwax3nZfmyRhSO98fsaU1A==',
 'PMPLRYS4YZEAYZDI4WIFF7G3BY4V7BYR','9d2e9dc6-9dbd-4224-ae0c-0628e2c06ab7',
 NULL,0,0,NULL,1,0),
('8464743a-b56d-427d-8936-a5786a832623','Mantvydas','Bira',NULL,'1',
 'manbir@ktu.lt','MANBIR@KTU.LT','manbir@ktu.lt','MANBIR@KTU.LT',
 0,'AQAAAAIAAYagAAAAENIAHxuqJkEVnyZu5BMQMYMm9VgPzIPNlV2mvtnXlqeTKZe1HBBJzdP3rLklVCIztQ==',
 'CBIJIFYEKVKYS4ZVC4CFNDDAYWXNOV3R','56f2b8d4-ccdb-4565-b398-66f27b95ea0b',
 NULL,0,0,NULL,1,0),
('ad9ca330-1d5d-476b-b93a-69ecae22cc3e','Mantvydas','Bira',NULL,NULL,
 'testa33s@ktu.ltA','TESTA33S@KTU.LTA','testa33s@ktu.ltA','TESTA33S@KTU.LTA',
 0,'AQAAAAIAAYagAAAAEKKm/5/uKpHE5j+6tuv6uNy2Klv7OBSatEd9JvP/SLXSCJhiMZIpSfXFaY95kvzeiA==',
 'XA4QL7F3BFT3ONAQOTQQFQ7DOCLHSJFB','bb50d978-c759-42d5-b187-dcc6c0d39e9f',
 NULL,0,0,NULL,1,0),
('ee5c4252-c171-4851-8961-071be957af0d','Mantvydas','Bira',NULL,'1',
 'manbir11@ktu.lt','MANBIR11@KTU.LT','manbir11@ktu.lt','MANBIR11@KTU.LT',
 0,'AQAAAAIAAYagAAAAEOVOFqrEu27Od6lmlIDI9eST07jT9licEJynkOSmJfg5LZbUJ8P3GLA2Vbd8JTeirQ==',
 'JIW6OUVA3GTK2XFTMU7PMZLGYVJCCAEE','6d27edd1-db84-4384-a652-ec8327e656b4',
 NULL,0,0,NULL,1,0);

/* -- AspNetUserRoles (priskiriame Worker rolę vienam vartotojui) -- */
INSERT INTO `AspNetUserRoles` (`UserId`,`RoleId`) VALUES
('ee5c4252-c171-4851-8961-071be957af0d','1');

/* -- Applications ------------------------------------------ */
INSERT INTO `Applications`
(`application_id`,`form_type`,`data`,`submitted_at`,`user_id`,`approved`) VALUES
(2,'WasteFeeExemption','{\"patalpuAdresas\":\"Taikos pr. 1, Kaunas – Jonas Jonaitis\",\"savininkoVardas\":\"Jonas Jonaitis\",\"korespondencijosAdresas\":\"korespondencijos@el.pastas.lt, 860000000\",\"telefonas\":\"860000000\",\"elPastas\":\"korespondencijos@el.pastas.lt\",\"data\":\"2025-04-29\",\"turtoAdresas\":\"Turto g. 5, Kaunas\",\"bendrasPlotas\":\"80\",\"unikalusNr\":\"1234-5678-9101\",\"laikotarpisNuo\":\"2025-05-01\",\"laikotarpisIki\":\"2025-10-01\",\"vandensTiekimas\":\"nevykdomas\",\"elektrosSkaitiklis\":\"neirengtas\",\"vandensParodymai\":\"\",\"elektrosParodymai\":\"\",\"vardasPavarde\":\"Jonas Jonaitis\"}',
 '2025-04-29 19:28:32','8464743a-b56d-427d-8936-a5786a832623',0);

/* -- __EFMigrationsHistory --------------------------------- */
INSERT INTO `__EFMigrationsHistory` (`MigrationId`,`ProductVersion`) VALUES
('20250429185255_update','8.0.4'),
('20250429205047_AddApprovedToApplication','8.0.4'),
('20250429224308_ApplicationApprovedStatus','8.0.4'),
('20250429231715_removeJsonIgnoreInApplicationSubmittedBy','8.0.4'),
('20250429231823_removeJsonIgnoreInApplicationSubmittedBy1','8.0.4'),
('20250430000327_removeUnnecessaryIdFromRole','8.0.4');

/* -----------------------------------------------------------
   3. Pabaiga
   ----------------------------------------------------------- */
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS      = 1;
COMMIT;

