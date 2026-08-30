-- MySQL dump 10.13  Distrib 9.7.1, for Win64 (x86_64)
--
-- Host: localhost    Database: mpesa_rent_wallet
-- ------------------------------------------------------
-- Server version	9.7.1

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
-- Table structure for table `landlords`
--

DROP TABLE IF EXISTS `landlords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landlords` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `businessName` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalId` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_landlord_user` (`userId`),
  CONSTRAINT `fk_landlord_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `landlordId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyName` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `units` int DEFAULT NULL,
  `monthlyRent` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `propertyCode` (`propertyCode`),
  KEY `fk_property_landlord` (`landlordId`),
  CONSTRAINT `fk_property_landlord` FOREIGN KEY (`landlordId`) REFERENCES `landlords` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tenant_properties`
--

DROP TABLE IF EXISTS `tenant_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant_properties` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenantId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joinedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tp_user` (`tenantId`),
  KEY `fk_tp_property` (`propertyId`),
  CONSTRAINT `fk_tp_property` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tp_user` FOREIGN KEY (`tenantId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tenants`
--

DROP TABLE IF EXISTS `tenants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenants` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `landlordId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenantCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullName` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationalId` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitNumber` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthlyRent` decimal(12,2) DEFAULT '0.00',
  `status` enum('ACTIVE','VACATED') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenantCode` (`tenantCode`),
  KEY `fk_tenant_unit` (`unitId`),
  CONSTRAINT `fk_tenant_unit` FOREIGN KEY (`unitId`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tenantId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rentPeriodStart` date DEFAULT NULL,
  `rentPeriodEnd` date DEFAULT NULL,
  `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_userId` (`userId`),
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitNumber` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bedrooms` int DEFAULT '1',
  `floorNumber` int DEFAULT '1',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthlyRent` decimal(12,2) DEFAULT '0.00',
  `status` enum('VACANT','OCCUPIED') COLLATE utf8mb4_unicode_ci DEFAULT 'VACANT',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unitCode` (`unitCode`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `units_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_phone` (`phone`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenantId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rentGoal` int NOT NULL DEFAULT '25000',
  `dueDate` date DEFAULT NULL,
  `savedAmount` int NOT NULL DEFAULT '0',
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'mpesa_rent_wallet'
--

--
-- Dumping routines for database 'mpesa_rent_wallet'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-30 19:15:14
