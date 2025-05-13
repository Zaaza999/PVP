-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2025 at 08:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

Set SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
Set time_zone = "+00:00";


/*!40101 Set @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 Set @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 Set @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 Set NAMES utf8mb4 */;

--
-- Database: `komunalinis_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `AggregatedCounter`
--

CREATE TABLE `AggregatedCounter` (
  `Id` int(11) NOT NULL,
  `Key` varchar(100) NOT NULL,
  `Value` int(11) NOT NULL,
  `ExpireAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `AggregatedCounter`
--

INSERT INTO `AggregatedCounter` (`Id`, `Key`, `Value`, `ExpireAt`) VALUES
(1, 'stats:succeeded', 1, NULL),
(2, 'stats:succeeded:2025-05-13', 1, '2025-06-13 18:00:03'),
(3, 'stats:succeeded:2025-05-13-18', 1, '2025-05-14 18:00:03');

-- --------------------------------------------------------

--
-- Table structure for table `Applications`
--

CREATE TABLE `Applications` (
  `Id` int(11) NOT NULL,
  `FormType` longtext NOT NULL,
  `Date` datetime(6) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `StatusId` int(11) NOT NULL,
  `Discriminator` varchar(34) NOT NULL,
  `PropertyAddress` longtext DEFAULT NULL,
  `PropertyOwnerFullName` longtext DEFAULT NULL,
  `CorrespondenceAddress` longtext DEFAULT NULL,
  `PhoneNumber` longtext DEFAULT NULL,
  `EmailAddress` longtext DEFAULT NULL,
  `EffectiveFrom` datetime(6) DEFAULT NULL,
  `FrequencyPerMonth` int(11) DEFAULT NULL,
  `ApplicantFullName` longtext DEFAULT NULL,
  `ContainerRequest_PropertyAddress` longtext DEFAULT NULL,
  `ContainerRequest_PropertyOwnerFullName` longtext DEFAULT NULL,
  `ContainerRequest_CorrespondenceAddress` longtext DEFAULT NULL,
  `ContainerRequest_PhoneNumber` longtext DEFAULT NULL,
  `ContainerRequest_EmailAddress` longtext DEFAULT NULL,
  `EmailForInvoices` longtext DEFAULT NULL,
  `ContainerVolumeLiters` int(11) DEFAULT NULL,
  `EmptyingFrequencyPerYear` int(11) DEFAULT NULL,
  `ContainerRequest_ApplicantFullName` longtext DEFAULT NULL,
  `ContainerSizeChangeRequest_PropertyAddress` longtext DEFAULT NULL,
  `ContainerSizeChangeRequest_PropertyOwnerFullName` longtext DEFAULT NULL,
  `ContainerSizeChangeRequest_CorrespondenceAddress` longtext DEFAULT NULL,
  `ContainerSizeChangeRequest_PhoneNumber` longtext DEFAULT NULL,
  `ContainerSizeChangeRequest_EmailAddress` longtext DEFAULT NULL,
  `CurrentCapacityLiters` int(11) DEFAULT NULL,
  `NewCapacityLiters` int(11) DEFAULT NULL,
  `ContainerSizeChangeRequest_ApplicantFullName` longtext DEFAULT NULL,
  `EmailInvoiceRequest_PropertyAddress` longtext DEFAULT NULL,
  `EmailInvoiceRequest_PropertyOwnerFullName` longtext DEFAULT NULL,
  `EmailInvoiceRequest_CorrespondenceAddress` longtext DEFAULT NULL,
  `EmailInvoiceRequest_PhoneNumber` longtext DEFAULT NULL,
  `EmailInvoiceRequest_EmailAddress` longtext DEFAULT NULL,
  `EmailInvoiceRequest_ApplicantFullName` longtext DEFAULT NULL,
  `PayerDataChangeRequest_PropertyOwnerFullName` longtext DEFAULT NULL,
  `PayerDataChangeRequest_CorrespondenceAddress` longtext DEFAULT NULL,
  `PayerDataChangeRequest_PhoneNumber` longtext DEFAULT NULL,
  `PayerDataChangeRequest_EmailAddress` longtext DEFAULT NULL,
  `CompanyCode` longtext DEFAULT NULL,
  `TenantFullName` longtext DEFAULT NULL,
  `TenantCompanyCode` longtext DEFAULT NULL,
  `PayerDataChangeRequest_PropertyAddress` longtext DEFAULT NULL,
  `BuildingUniqueNumber` longtext DEFAULT NULL,
  `RegisteredArea` double DEFAULT NULL,
  `RegisteredPurpose` longtext DEFAULT NULL,
  `LeaseStartDateOrUsageStartDate` datetime(6) DEFAULT NULL,
  `PaymentNoticeMailingAddress` longtext DEFAULT NULL,
  `PaymentNoticeEmail` longtext DEFAULT NULL,
  `RepresentativePosition` longtext DEFAULT NULL,
  `PropertyUnsuitability_PropertyAddress` longtext DEFAULT NULL,
  `PropertyUnsuitability_PropertyOwnerFullName` longtext DEFAULT NULL,
  `PropertyUnsuitability_CorrespondenceAddress` longtext DEFAULT NULL,
  `PropertyUnsuitability_PhoneNumber` longtext DEFAULT NULL,
  `PropertyUnsuitability_EmailAddress` longtext DEFAULT NULL,
  `Area` double DEFAULT NULL,
  `PropertyUnsuitability_BuildingUniqueNumber` longtext DEFAULT NULL,
  `PropertyUnsuitability_ApplicantFullName` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_PropertyAddress` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_PropertyOwnerFullName` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_CorrespondenceAddress` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_PhoneNumber` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_EmailAddress` longtext DEFAULT NULL,
  `PropertyUsageDeclaration_ApplicantFullName` longtext DEFAULT NULL,
  `RefundRequest_ApplicantFullName` longtext DEFAULT NULL,
  `RefundRequest_CorrespondenceAddress` longtext DEFAULT NULL,
  `PayerCode` longtext DEFAULT NULL,
  `PaymentReason` longtext DEFAULT NULL,
  `PaymentDate` datetime(6) DEFAULT NULL,
  `PaymentAmount` double DEFAULT NULL,
  `TransactionNumber` longtext DEFAULT NULL,
  `RefundAccountNumber` longtext DEFAULT NULL,
  `ResidentCountDeclaration_PropertyAddress` longtext DEFAULT NULL,
  `ResidentCountDeclaration_PropertyOwnerFullName` longtext DEFAULT NULL,
  `ResidentCountDeclaration_CorrespondenceAddress` longtext DEFAULT NULL,
  `ResidentCountDeclaration_PhoneNumber` longtext DEFAULT NULL,
  `ResidentCountDeclaration_EmailAddress` longtext DEFAULT NULL,
  `ResidentCountDeclaration_ApplicantFullName` longtext DEFAULT NULL,
  `ResidentCountDeclaration_Area` double DEFAULT NULL,
  `WasteFeeExemption_PropertyAddress` longtext DEFAULT NULL,
  `WasteFeeExemption_PropertyOwnerFullName` longtext DEFAULT NULL,
  `WasteFeeExemption_CorrespondenceAddress` longtext DEFAULT NULL,
  `WasteFeeExemption_PhoneNumber` longtext DEFAULT NULL,
  `WasteFeeExemption_EmailAddress` longtext DEFAULT NULL,
  `WasteFeeExemption_Area` double DEFAULT NULL,
  `WasteFeeExemption_BuildingUniqueNumber` longtext DEFAULT NULL,
  `PeriodFrom` datetime(6) DEFAULT NULL,
  `PeriodTo` datetime(6) DEFAULT NULL,
  `WaterSupplyStatus` longtext DEFAULT NULL,
  `ElectricityMeterStatus` longtext DEFAULT NULL,
  `InitialWaterReading` double DEFAULT NULL,
  `InitialElectricityReading` double DEFAULT NULL,
  `WasteFeeExemption_ApplicantFullName` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_PropertyAddress` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_PropertyOwnerFullName` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_CorrespondenceAddress` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_PhoneNumber` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_EmailAddress` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_Area` double DEFAULT NULL,
  `WasteFeeExemptionBusiness_BuildingUniqueNumber` longtext DEFAULT NULL,
  `WasteFeeExemptionBusiness_PeriodFrom` datetime(6) DEFAULT NULL,
  `WasteFeeExemptionBusiness_PeriodTo` datetime(6) DEFAULT NULL,
  `WasteFeeExemptionBusiness_ApplicantFullName` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Applications`
--

INSERT INTO `Applications` (`Id`, `FormType`, `Date`, `user_id`, `StatusId`, `Discriminator`, `PropertyAddress`, `PropertyOwnerFullName`, `CorrespondenceAddress`, `PhoneNumber`, `EmailAddress`, `EffectiveFrom`, `FrequencyPerMonth`, `ApplicantFullName`, `ContainerRequest_PropertyAddress`, `ContainerRequest_PropertyOwnerFullName`, `ContainerRequest_CorrespondenceAddress`, `ContainerRequest_PhoneNumber`, `ContainerRequest_EmailAddress`, `EmailForInvoices`, `ContainerVolumeLiters`, `EmptyingFrequencyPerYear`, `ContainerRequest_ApplicantFullName`, `ContainerSizeChangeRequest_PropertyAddress`, `ContainerSizeChangeRequest_PropertyOwnerFullName`, `ContainerSizeChangeRequest_CorrespondenceAddress`, `ContainerSizeChangeRequest_PhoneNumber`, `ContainerSizeChangeRequest_EmailAddress`, `CurrentCapacityLiters`, `NewCapacityLiters`, `ContainerSizeChangeRequest_ApplicantFullName`, `EmailInvoiceRequest_PropertyAddress`, `EmailInvoiceRequest_PropertyOwnerFullName`, `EmailInvoiceRequest_CorrespondenceAddress`, `EmailInvoiceRequest_PhoneNumber`, `EmailInvoiceRequest_EmailAddress`, `EmailInvoiceRequest_ApplicantFullName`, `PayerDataChangeRequest_PropertyOwnerFullName`, `PayerDataChangeRequest_CorrespondenceAddress`, `PayerDataChangeRequest_PhoneNumber`, `PayerDataChangeRequest_EmailAddress`, `CompanyCode`, `TenantFullName`, `TenantCompanyCode`, `PayerDataChangeRequest_PropertyAddress`, `BuildingUniqueNumber`, `RegisteredArea`, `RegisteredPurpose`, `LeaseStartDateOrUsageStartDate`, `PaymentNoticeMailingAddress`, `PaymentNoticeEmail`, `RepresentativePosition`, `PropertyUnsuitability_PropertyAddress`, `PropertyUnsuitability_PropertyOwnerFullName`, `PropertyUnsuitability_CorrespondenceAddress`, `PropertyUnsuitability_PhoneNumber`, `PropertyUnsuitability_EmailAddress`, `Area`, `PropertyUnsuitability_BuildingUniqueNumber`, `PropertyUnsuitability_ApplicantFullName`, `PropertyUsageDeclaration_PropertyAddress`, `PropertyUsageDeclaration_PropertyOwnerFullName`, `PropertyUsageDeclaration_CorrespondenceAddress`, `PropertyUsageDeclaration_PhoneNumber`, `PropertyUsageDeclaration_EmailAddress`, `PropertyUsageDeclaration_ApplicantFullName`, `RefundRequest_ApplicantFullName`, `RefundRequest_CorrespondenceAddress`, `PayerCode`, `PaymentReason`, `PaymentDate`, `PaymentAmount`, `TransactionNumber`, `RefundAccountNumber`, `ResidentCountDeclaration_PropertyAddress`, `ResidentCountDeclaration_PropertyOwnerFullName`, `ResidentCountDeclaration_CorrespondenceAddress`, `ResidentCountDeclaration_PhoneNumber`, `ResidentCountDeclaration_EmailAddress`, `ResidentCountDeclaration_ApplicantFullName`, `ResidentCountDeclaration_Area`, `WasteFeeExemption_PropertyAddress`, `WasteFeeExemption_PropertyOwnerFullName`, `WasteFeeExemption_CorrespondenceAddress`, `WasteFeeExemption_PhoneNumber`, `WasteFeeExemption_EmailAddress`, `WasteFeeExemption_Area`, `WasteFeeExemption_BuildingUniqueNumber`, `PeriodFrom`, `PeriodTo`, `WaterSupplyStatus`, `ElectricityMeterStatus`, `InitialWaterReading`, `InitialElectricityReading`, `WasteFeeExemption_ApplicantFullName`, `WasteFeeExemptionBusiness_PropertyAddress`, `WasteFeeExemptionBusiness_PropertyOwnerFullName`, `WasteFeeExemptionBusiness_CorrespondenceAddress`, `WasteFeeExemptionBusiness_PhoneNumber`, `WasteFeeExemptionBusiness_EmailAddress`, `WasteFeeExemptionBusiness_Area`, `WasteFeeExemptionBusiness_BuildingUniqueNumber`, `WasteFeeExemptionBusiness_PeriodFrom`, `WasteFeeExemptionBusiness_PeriodTo`, `WasteFeeExemptionBusiness_ApplicantFullName`) VALUES
(2, 'EmailInvoiceRequest', '2025-05-13 17:42:00.468420', '4bfeedf6-053a-4aa0-a48b-424b472311e1', 11, 'EmailInvoiceRequest', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'teastas', 'Mantvydas Bira', 'testas', '+37060288266', 'manbir@ktu.lt', 'Mantvydas Bira', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ApplicationStatuses`
--

CREATE TABLE `ApplicationStatuses` (
  `Id` int(11) NOT NULL,
  `Name` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ApplicationStatuses`
--

INSERT INTO `ApplicationStatuses` (`Id`, `Name`) VALUES
(1, 'Patvirtinta'),
(2, 'Nepatvirtinta'),
(3, 'Peržiūrėta'),
(4, 'Laukiama patvirtinimo'),
(5, 'Vykdoma'),
(6, 'Užbaigta'),
(7, 'Atšaukta'),
(8, 'Atmesta'),
(9, 'Sulaikyta'),
(10, 'Nepavyko'),
(11, 'Reikia peržiūros'),
(12, 'Tiriama'),
(13, 'Laukiama apmokėjimo'),
(14, 'Juodraštis'),
(15, 'Archyvuota');

-- --------------------------------------------------------

--
-- Table structure for table `AspNetRoleClaims`
--

CREATE TABLE `AspNetRoleClaims` (
  `Id` int(11) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AspNetUserClaims`
--

CREATE TABLE `AspNetUserClaims` (
  `Id` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AspNetUserLogins`
--

CREATE TABLE `AspNetUserLogins` (
  `LoginProvider` varchar(255) NOT NULL,
  `ProviderKey` varchar(255) NOT NULL,
  `ProviderDisplayName` longtext DEFAULT NULL,
  `UserId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AspNetUserRoles`
--

CREATE TABLE `AspNetUserRoles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `AspNetUserRoles`
--

INSERT INTO `AspNetUserRoles` (`UserId`, `RoleId`) VALUES
('4bfeedf6-053a-4aa0-a48b-424b472311e1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `AspNetUserTokens`
--

CREATE TABLE `AspNetUserTokens` (
  `UserId` varchar(255) NOT NULL,
  `LoginProvider` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Value` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Counter`
--

CREATE TABLE `Counter` (
  `Id` int(11) NOT NULL,
  `Key` varchar(100) NOT NULL,
  `Value` int(11) NOT NULL,
  `ExpireAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DistributedLock`
--

CREATE TABLE `DistributedLock` (
  `Resource` varchar(100) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `EmployeeTimeSlots`
--

CREATE TABLE `EmployeeTimeSlots` (
  `timeslot_id` int(11) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `slot_date` datetime(6) NOT NULL,
  `time_from` time(6) NOT NULL,
  `time_to` time(6) NOT NULL,
  `is_taken` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `GarbageCollectionSchedule`
--

CREATE TABLE `GarbageCollectionSchedule` (
  `schedule_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `waste_id` int(11) NOT NULL,
  `collection_date` datetime(6) NOT NULL,
  `comment` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Hash`
--

CREATE TABLE `Hash` (
  `Id` int(11) NOT NULL,
  `Key` varchar(100) NOT NULL,
  `Field` varchar(40) NOT NULL,
  `Value` longtext DEFAULT NULL,
  `ExpireAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Hash`
--

INSERT INTO `Hash` (`Id`, `Key`, `Field`, `Value`, `ExpireAt`) VALUES
(1, 'recurring-Job:waste-reminder', 'Queue', 'default', NULL),
(2, 'recurring-Job:waste-reminder', 'Cron', '0 18 * * *', NULL),
(3, 'recurring-Job:waste-reminder', 'TimeZoneId', 'UTC', NULL),
(4, 'recurring-Job:waste-reminder', 'Job', '{\"Type\":\"KomunalinisCentras.Backend.Jobs.ReminderJob, KomunalinisCentras.Backend, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null\",\"Method\":\"RunAsync\",\"ParameterTypes\":\"[]\",\"Arguments\":\"[]\"}', NULL),
(5, 'recurring-Job:waste-reminder', 'CreatedAt', '2025-05-13T17:19:23.2036583Z', NULL),
(6, 'recurring-Job:waste-reminder', 'NextExecution', '2025-05-14T18:00:00.0000000Z', NULL),
(7, 'recurring-Job:waste-reminder', 'V', '2', NULL),
(8, 'recurring-Job:waste-reminder', 'LastExecution', '2025-05-13T18:00:01.5769323Z', NULL),
(10, 'recurring-Job:waste-reminder', 'LastJobId', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Job`
--

CREATE TABLE `Job` (
  `Id` int(11) NOT NULL,
  `StateId` int(11) DEFAULT NULL,
  `StateName` varchar(20) DEFAULT NULL,
  `InvocationData` longtext NOT NULL,
  `Arguments` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ExpireAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Job`
--

INSERT INTO `Job` (`Id`, `StateId`, `StateName`, `InvocationData`, `Arguments`, `CreatedAt`, `ExpireAt`) VALUES
(1, 3, 'Succeeded', '{\"Type\":\"KomunalinisCentras.Backend.Jobs.ReminderJob, KomunalinisCentras.Backend, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null\",\"Method\":\"RunAsync\",\"ParameterTypes\":\"[]\",\"Arguments\":\"[]\"}', '[]', '2025-05-13 18:00:01.601796', '2025-05-14 18:00:03.627684');

-- --------------------------------------------------------

--
-- Table structure for table `JobParameter`
--

CREATE TABLE `JobParameter` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `Name` varchar(40) NOT NULL,
  `Value` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `JobParameter`
--

INSERT INTO `JobParameter` (`Id`, `JobId`, `Name`, `Value`) VALUES
(1, 1, 'RecurringJobId', '\"waste-reminder\"'),
(2, 1, 'Time', '1747159201'),
(3, 1, 'CurrentCulture', '\"en-US\"'),
(4, 1, 'CurrentUICulture', '\"en-US\"');

-- --------------------------------------------------------

--
-- Table structure for table `JobQueue`
--

CREATE TABLE `JobQueue` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `FetchedAt` datetime(6) DEFAULT NULL,
  `Queue` varchar(50) NOT NULL,
  `FetchToken` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `JobState`
--

CREATE TABLE `JobState` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Reason` varchar(100) DEFAULT NULL,
  `Data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `List`
--

CREATE TABLE `List` (
  `Id` int(11) NOT NULL,
  `Key` varchar(100) NOT NULL,
  `Value` longtext DEFAULT NULL,
  `ExpireAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Locations`
--

CREATE TABLE `Locations` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PropertyUsageDeclarationEntries`
--

CREATE TABLE `PropertyUsageDeclarationEntries` (
  `Id` int(11) NOT NULL,
  `Address` longtext NOT NULL,
  `BuildingUniqueNumber` longtext NOT NULL,
  `RegisteredPurpose` longtext NOT NULL,
  `ActualPurpose` longtext NOT NULL,
  `RegisteredArea` double NOT NULL,
  `ActualArea` double NOT NULL,
  `PropertyUsageDeclarationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reservations`
--

CREATE TABLE `Reservations` (
  `ReservationId` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `timeslot_id` int(11) NOT NULL,
  `reservation_date` datetime(6) NOT NULL,
  `status` longtext NOT NULL,
  `topic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Residents`
--

CREATE TABLE `Residents` (
  `Id` int(11) NOT NULL,
  `FullName` longtext NOT NULL,
  `PersonalData` longtext NOT NULL,
  `AdditionalInfo` longtext DEFAULT NULL,
  `ResidentCountDeclarationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `Id` varchar(255) NOT NULL,
  `role_name` longtext NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`Id`, `role_name`, `Name`, `NormalizedName`, `ConcurrencyStamp`) VALUES
('1', 'client', 'client', 'CLIENT', NULL),
('2', 'worker', 'worker', 'WORKER', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Server`
--

CREATE TABLE `Server` (
  `Id` varchar(100) NOT NULL,
  `Data` longtext NOT NULL,
  `LastHeartbeat` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Set`
--

CREATE TABLE `Set` (
  `Id` int(11) NOT NULL,
  `Key` varchar(100) NOT NULL,
  `Value` varchar(256) NOT NULL,
  `Score` float NOT NULL,
  `ExpireAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Set`
--

INSERT INTO `Set` (`Id`, `Key`, `Value`, `Score`, `ExpireAt`) VALUES
(1, 'recurring-jobs', 'waste-reminder', 1747250000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `State`
--

CREATE TABLE `State` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Reason` varchar(100) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `Data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `State`
--

INSERT INTO `State` (`Id`, `JobId`, `Name`, `Reason`, `CreatedAt`, `Data`) VALUES
(1, 1, 'Enqueued', 'Triggered by recurring Job scheduler', '2025-05-13 18:00:01.617849', '{\"EnqueuedAt\":\"2025-05-13T18:00:01.6140660Z\",\"Queue\":\"default\"}'),
(2, 1, 'Processing', NULL, '2025-05-13 18:00:03.597047', '{\"StartedAt\":\"2025-05-13T18:00:03.5921463Z\",\"ServerId\":\"desktop-as2bpu7:6000:f5c06db3-7972-469f-b8b9-d210f5bd4cec\",\"WorkerId\":\"05267599-ed33-464a-a2ff-e18da0cb18b6\"}'),
(3, 1, 'Succeeded', NULL, '2025-05-13 18:00:03.623736', '{\"SucceededAt\":\"2025-05-13T18:00:03.6184420Z\",\"PerformanceDuration\":\"12\",\"Latency\":\"2003\"}');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `Id` varchar(255) NOT NULL,
  `first_name` longtext DEFAULT NULL,
  `last_name` longtext DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `subscription` tinyint(1) NOT NULL,
  `RoleId` varchar(255) DEFAULT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `Email` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext DEFAULT NULL,
  `SecurityStamp` longtext DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL,
  `PhoneNumber` longtext DEFAULT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`Id`, `first_name`, `last_name`, `address`, `subscription`, `RoleId`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`) VALUES
('4bfeedf6-053a-4aa0-a48b-424b472311e1', 'Mantvydas', 'Bira', NULL, 0, '1', 'manbir@ktu.lt123A', 'MANBIR@KTU.LT123A', 'manbir@ktu.lt123A', 'MANBIR@KTU.LT123A', 0, 'AQAAAAIAAYagAAAAEC5AESoNeg28ISfF3xi3CqrxPG8m/Zz40Fxf4deL/CoKHcayBVV7Nod28/2o4f1F+g==', 'M7YYNOXB52EDGJN6POZVSRTOYAF2XZF5', '9f3f3cbd-fc83-41d6-bfbd-795588905260', NULL, 0, 0, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `VisitTopics`
--

CREATE TABLE `VisitTopics` (
  `topic_id` int(11) NOT NULL,
  `topic_name` longtext NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `WasteTypes`
--

CREATE TABLE `WasteTypes` (
  `waste_id` int(11) NOT NULL,
  `waste_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__EFMigrationsHistory`
--

CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__EFMigrationsHistory`
--

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES
('20250513171903_refundRequestFormaaa', '8.0.4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AggregatedCounter`
--
ALTER TABLE `AggregatedCounter`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_CounterAggregated_Key` (`Key`);

--
-- Indexes for table `Applications`
--
ALTER TABLE `Applications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Applications_StatusId` (`StatusId`),
  ADD KEY `IX_Applications_user_id` (`user_id`);

--
-- Indexes for table `ApplicationStatuses`
--
ALTER TABLE `ApplicationStatuses`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `AspNetRoleClaims`
--
ALTER TABLE `AspNetRoleClaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`);

--
-- Indexes for table `AspNetUserClaims`
--
ALTER TABLE `AspNetUserClaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetUserClaims_UserId` (`UserId`);

--
-- Indexes for table `AspNetUserLogins`
--
ALTER TABLE `AspNetUserLogins`
  ADD PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  ADD KEY `IX_AspNetUserLogins_UserId` (`UserId`);

--
-- Indexes for table `AspNetUserRoles`
--
ALTER TABLE `AspNetUserRoles`
  ADD PRIMARY KEY (`UserId`,`RoleId`),
  ADD KEY `IX_AspNetUserRoles_RoleId` (`RoleId`);

--
-- Indexes for table `AspNetUserTokens`
--
ALTER TABLE `AspNetUserTokens`
  ADD PRIMARY KEY (`UserId`,`LoginProvider`,`Name`);

--
-- Indexes for table `Counter`
--
ALTER TABLE `Counter`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Counter_Key` (`Key`);

--
-- Indexes for table `EmployeeTimeSlots`
--
ALTER TABLE `EmployeeTimeSlots`
  ADD PRIMARY KEY (`timeslot_id`),
  ADD KEY `IX_EmployeeTimeSlots_employee_id` (`employee_id`);

--
-- Indexes for table `GarbageCollectionSchedule`
--
ALTER TABLE `GarbageCollectionSchedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `IX_GarbageCollectionSchedule_location_id` (`location_id`),
  ADD KEY `IX_GarbageCollectionSchedule_waste_id` (`waste_id`);

--
-- Indexes for table `Hash`
--
ALTER TABLE `Hash`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Hash_Key_Field` (`Key`,`Field`);

--
-- Indexes for table `Job`
--
ALTER TABLE `Job`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Job_StateName` (`StateName`);

--
-- Indexes for table `JobParameter`
--
ALTER TABLE `JobParameter`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_JobParameter_JobId_Name` (`JobId`,`Name`),
  ADD KEY `FK_JobParameter_Job` (`JobId`);

--
-- Indexes for table `JobQueue`
--
ALTER TABLE `JobQueue`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_JobQueue_QueueAndFetchedAt` (`Queue`,`FetchedAt`);

--
-- Indexes for table `JobState`
--
ALTER TABLE `JobState`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_JobState_Job` (`JobId`);

--
-- Indexes for table `List`
--
ALTER TABLE `List`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `PropertyUsageDeclarationEntries`
--
ALTER TABLE `PropertyUsageDeclarationEntries`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_PropertyUsageDeclarationEntries_PropertyUsageDeclarationId` (`PropertyUsageDeclarationId`);

--
-- Indexes for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD PRIMARY KEY (`ReservationId`),
  ADD KEY `IX_Reservations_timeslot_id` (`timeslot_id`),
  ADD KEY `IX_Reservations_topic_id` (`topic_id`),
  ADD KEY `IX_Reservations_user_id` (`user_id`);

--
-- Indexes for table `Residents`
--
ALTER TABLE `Residents`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Residents_ResidentCountDeclarationId` (`ResidentCountDeclarationId`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RoleNameIndex` (`NormalizedName`);

--
-- Indexes for table `Server`
--
ALTER TABLE `Server`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Set`
--
ALTER TABLE `Set`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Set_Key_Value` (`Key`,`Value`);

--
-- Indexes for table `State`
--
ALTER TABLE `State`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_HangFire_State_Job` (`JobId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  ADD KEY `EmailIndex` (`NormalizedEmail`),
  ADD KEY `IX_Users_RoleId` (`RoleId`);

--
-- Indexes for table `VisitTopics`
--
ALTER TABLE `VisitTopics`
  ADD PRIMARY KEY (`topic_id`);

--
-- Indexes for table `WasteTypes`
--
ALTER TABLE `WasteTypes`
  ADD PRIMARY KEY (`waste_id`);

--
-- Indexes for table `__EFMigrationsHistory`
--
ALTER TABLE `__EFMigrationsHistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AggregatedCounter`
--
ALTER TABLE `AggregatedCounter`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Applications`
--
ALTER TABLE `Applications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ApplicationStatuses`
--
ALTER TABLE `ApplicationStatuses`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `AspNetRoleClaims`
--
ALTER TABLE `AspNetRoleClaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `AspNetUserClaims`
--
ALTER TABLE `AspNetUserClaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Counter`
--
ALTER TABLE `Counter`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `EmployeeTimeSlots`
--
ALTER TABLE `EmployeeTimeSlots`
  MODIFY `timeslot_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GarbageCollectionSchedule`
--
ALTER TABLE `GarbageCollectionSchedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Hash`
--
ALTER TABLE `Hash`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Job`
--
ALTER TABLE `Job`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `JobParameter`
--
ALTER TABLE `JobParameter`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `JobQueue`
--
ALTER TABLE `JobQueue`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `JobState`
--
ALTER TABLE `JobState`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `List`
--
ALTER TABLE `List`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PropertyUsageDeclarationEntries`
--
ALTER TABLE `PropertyUsageDeclarationEntries`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Reservations`
--
ALTER TABLE `Reservations`
  MODIFY `ReservationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Residents`
--
ALTER TABLE `Residents`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Set`
--
ALTER TABLE `Set`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4003;

--
-- AUTO_INCREMENT for table `State`
--
ALTER TABLE `State`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `VisitTopics`
--
ALTER TABLE `VisitTopics`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `WasteTypes`
--
ALTER TABLE `WasteTypes`
  MODIFY `waste_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Applications`
--
ALTER TABLE `Applications`
  ADD CONSTRAINT `FK_Applications_ApplicationStatuses_StatusId` FOREIGN KEY (`StatusId`) REFERENCES `ApplicationStatuses` (`Id`),
  ADD CONSTRAINT `FK_Applications_Users_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `AspNetRoleClaims`
--
ALTER TABLE `AspNetRoleClaims`
  ADD CONSTRAINT `FK_AspNetRoleClaims_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `AspNetUserClaims`
--
ALTER TABLE `AspNetUserClaims`
  ADD CONSTRAINT `FK_AspNetUserClaims_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `AspNetUserLogins`
--
ALTER TABLE `AspNetUserLogins`
  ADD CONSTRAINT `FK_AspNetUserLogins_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `AspNetUserRoles`
--
ALTER TABLE `AspNetUserRoles`
  ADD CONSTRAINT `FK_AspNetUserRoles_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AspNetUserRoles_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `AspNetUserTokens`
--
ALTER TABLE `AspNetUserTokens`
  ADD CONSTRAINT `FK_AspNetUserTokens_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `EmployeeTimeSlots`
--
ALTER TABLE `EmployeeTimeSlots`
  ADD CONSTRAINT `FK_EmployeeTimeSlots_Users_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `GarbageCollectionSchedule`
--
ALTER TABLE `GarbageCollectionSchedule`
  ADD CONSTRAINT `FK_GarbageCollectionSchedule_Locations_location_id` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_GarbageCollectionSchedule_WasteTypes_waste_id` FOREIGN KEY (`waste_id`) REFERENCES `WasteTypes` (`waste_id`) ON DELETE CASCADE;

--
-- Constraints for table `JobParameter`
--
ALTER TABLE `JobParameter`
  ADD CONSTRAINT `FK_JobParameter_Job` FOREIGN KEY (`JobId`) REFERENCES `Job` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `JobState`
--
ALTER TABLE `JobState`
  ADD CONSTRAINT `FK_JobState_Job` FOREIGN KEY (`JobId`) REFERENCES `Job` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PropertyUsageDeclarationEntries`
--
ALTER TABLE `PropertyUsageDeclarationEntries`
  ADD CONSTRAINT `FK_PropertyUsageDeclarationEntries_Applications_PropertyUsageDe~` FOREIGN KEY (`PropertyUsageDeclarationId`) REFERENCES `Applications` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD CONSTRAINT `FK_Reservations_EmployeeTimeSlots_timeslot_id` FOREIGN KEY (`timeslot_id`) REFERENCES `EmployeeTimeSlots` (`timeslot_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Reservations_Users_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Reservations_VisitTopics_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `VisitTopics` (`topic_id`) ON DELETE CASCADE;

--
-- Constraints for table `Residents`
--
ALTER TABLE `Residents`
  ADD CONSTRAINT `FK_Residents_Applications_ResidentCountDeclarationId` FOREIGN KEY (`ResidentCountDeclarationId`) REFERENCES `Applications` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `State`
--
ALTER TABLE `State`
  ADD CONSTRAINT `FK_HangFire_State_Job` FOREIGN KEY (`JobId`) REFERENCES `Job` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `FK_Users_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`);
COMMIT;

/*!40101 Set CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 Set CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 Set COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/* -----------------------------------------------------------
   Pabaiga
   ----------------------------------------------------------- */
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS      = 1;
COMMIT;
