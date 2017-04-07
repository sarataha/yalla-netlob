-- MySQL dump 10.14  Distrib 5.5.52-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: yala_netlob_development
-- ------------------------------------------------------
-- Server version	5.5.52-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_members` (
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(30) NOT NULL,
  `group_admin` int(11) NOT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `group_name` (`group_name`),
  KEY `group_admin` (`group_admin`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`group_admin`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `meal_type` varchar(50) NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `resturant` varchar(60) NOT NULL,
  `menu_img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_items`
--

DROP TABLE IF EXISTS `orders_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_items` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `comment` varchar(50) DEFAULT NULL,
  `order_date` date NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`order_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_items`
--

LOCK TABLES `orders_items` WRITE;
/*!40000 ALTER TABLE `orders_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_users`
--

DROP TABLE IF EXISTS `orders_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_users` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_users_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_users`
--

LOCK TABLES `orders_users` WRITE;
/*!40000 ALTER TABLE `orders_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_friends`
--

DROP TABLE IF EXISTS `user_friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_friends` (
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `user_id` (`user_id`),
  KEY `user_friends_ibfk_2` (`friend_id`),
  CONSTRAINT `user_friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `user_friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_friends`
--

LOCK TABLES `user_friends` WRITE;
/*!40000 ALTER TABLE `user_friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Danny99','Deion_Rau@example.com','whatever',NULL),(2,'Jarred_Pagac18','Mohammad_Cremin@example.net','whatever',NULL),(3,'Oma.Doyle','Eldora62@example.net','whatever',NULL),(4,'Bailey.Denesik26','Elton.Schinner@example.com','whatever',NULL),(5,'Phyllis76','Scarlett.Herzog97@example.org','whatever',NULL),(6,'Johnpaul29','Karen_Keebler4@example.com','whatever',NULL),(7,'Evalyn27','Damien_Goodwin@example.org','whatever',NULL),(8,'Clement.Bailey25','Jarrell.Brekke48@example.net','whatever',NULL),(9,'Gerhard26','Jonas8@example.org','whatever',NULL),(10,'Sara','123456789','$2a$10$bNAWS37JAKvdPTzanw8dWOGv5ndsKdL9moQAd9VMIb5',NULL),(11,'taha','','$2a$10$sfNghgSkRA2ZtrgRxgJph.BAOL0.7HCufhxrIxDllOG',NULL),(22,'iamhappy','iamhappy','$2a$10$NAqF6sU.hvKjZNoNcDEOd.7uZP7DF5.0irZ4bmvf.pZ',NULL),(28,'iamsara','sara@sara.com','$2a$10$HtOUTJyW.u6RFE5CUYGl..MCP05tvANq4yezwVFBpsp',NULL),(30,'wafaa','sara1@sara.com','$2a$10$a9ecPdJ.hJ1MBVL12KZ.c.UueRSuWdNBgwr2nS/L0Lf',NULL),(31,'mariam','sara2@sara.com','$2a$10$gopicSa7cEkEpHeXzq2o2uKkmA5C.Ahl.RqwISamTnS',NULL),(33,'himynameismariam','sara4@sara.com','$2a$10$qH4MMrHgnig0JTmAfWOE9O7Sf3lyMaB/Iy2j/53TpUK',NULL),(34,'testme','sara16@sara.com','$2a$10$EIwfjhWondbk5WpAyUbrCewra8Z7DeFM6o2ZswY.wAn',NULL),(35,'hellofolks','my@email.com','$2a$10$kP.5To9RmqIxvwGexCMSiezYP.k5ku8ue/UsxZAegl2',NULL),(36,'test1','myy@email.com','$2a$10$yRHZ8lBb6gRaH5eBB/lLjuRJFggelRJ7Ia5a5RWyv8I',NULL),(37,'tera1234','lo@lol.com','$2a$10$nWQfJlGkoYsbNsFLb9dXGumnobvHBcReUH8A0EFx7nc',NULL),(38,'what','1111111111','$2a$10$tfY2vyv997frtUmmTG4Vxu6MeJFPjQFu9nLSCPDYMC8',NULL),(39,'what','123123','$2a$10$WW96vAj0gstcZs67sa/JMupIlJro4s6gHGb3EzctPT3',NULL),(40,'testusername','iamsara@iam.com','$2a$10$RTLVXeLiPQPQbLlboYaCO.YMEvgvcawgVnusMxowK5G',NULL),(41,'finaltest','final@final.com','$2a$10$1yyOFBsiUdmMvLVBkG0r0O/RBt9h.TsGYBwBDPadMFL',NULL),(42,'notthefinal','not@not.com','$2a$10$iYbxO.kc9WPkA/VT0vK3BOFkvRegwycdXD7gCU8jgVF',NULL),(43,'notthefinal','hello@hello.com','$2a$10$SulCm.saRwN5baCkuyGD8eF.HiMX2l8GkqAl8eixVxo',NULL),(44,'notthefinal','la@la.com','$2a$10$EvYWLWDHXBeOUryC4wcxe.SiS3Yq/wdfeAQXUf7m.cr',NULL),(45,'notthefinal','haha@haha.com','$2a$10$ckHZa4YF2gA37hvYDXEgg.gfh1CnjPGCdBCGqKn4rj5',NULL),(46,'notthefinal','hehe@hehe.com','$2a$10$SMktTQwhAN4OUASy1UKvkuo6oyA4346ODmZrfMZ/MYr',NULL),(47,'notthefinal','vaaa@vaaa.com','$2a$10$271tP0j3eWsvz4LZ1hp1j.N3omntNxDXF019PHQr/Vx',NULL),(48,'notthefinal','c@c.com','$2a$10$SEYb/wtZ0sQV8dxJ2ax/NuPZdB7QKll5g8y780w2X5f',NULL),(49,'notthefinal','x@x.co','$2a$10$nV09a3Z/QAtV06jW91bbN.UrfiTSP4SBOYUNf9MW9gw',NULL),(50,'notthefinal','ha@ha.com','$2a$10$FdgcugAKJi0Kv47HE2Nj8unYLpkpiTspkoo37zbmy53',NULL),(51,'notthefinal','ha@haaa.com','$2a$10$OocBuRGYxGKfan71BgLSvOBjwBPkqVx0Win9OmJgn78',NULL),(52,'notthefinal','test@test.comm','$2a$10$HN0TqX37T.Yt4LPIU8OsYeF9lpi18Vyt/WiooVrzY9b',NULL),(53,'notthefinal','hi@c.com','$2a$10$q9h71iICadnT1EP7HsZ4BOgEMpZDMXwTibXtlA.AJ6H',NULL),(54,'notthefinal','1@1.com','$2a$10$/5y0Cai8s4pVi.jhwUyg/eqPb6GLy9h0y5MSMt/vCsC',NULL),(55,'sara','s@s.com','$2a$10$FJrmqB2tjAojl8BZAXvLou.YTbh8PCK5Nhh/uZ1f7xb',NULL),(56,'testmey','test@mey.com','$2a$10$yG9QuquGupY8/eymXImHPeEKfBpCTnRIixF.Eo1TrLKXhfQEZthie',NULL),(57,'sara','b@b.com','$2a$10$5wOReG4r9e0CEhfJap0ZO.6WQtSMnvHOy1tB4FRR8Nf7D7uqCxUUm',NULL),(58,'sara','1@z.cm','$2a$10$JiuKmO3xNM0xElAKTFy5yecqMvlYW1PegMJYOMsDXnMwETxED7FS2',NULL),(59,'x','x@v.com','$2a$10$qYxyNjI5avhUMwB6Sx/ENexMvCIvu3MowsYgPq7xWRGi5XemUFPT6',NULL),(60,'q','q@q.com','$2a$10$7MeZz2F4sduTU9cziIqKmuLNiNkPCln6THRdTlaIXgwGmN0h0zP3e',NULL),(61,'w','w@w.com','$2a$10$txPcUpOk2BnvV5iqrwQiPOMlGCD5nOMR5SYewt7Li5IIBGJfUzY/G',NULL),(62,'c','c@sara.com','$2a$10$6l6eTktFbEjgJ7aYILJwre3vOZW8T5rnIetF8LeOlf0mTACWwLmsu',NULL),(63,'Hello','hiiiii@hiii.com','$2a$10$yA8tKtOVJDbXZBMUP/r0wO8WjVVadi.a/ASG4LlXi4dIR.ZFZJEjO',NULL),(64,'mynameisnotsara','1@2.3','$2a$10$seXWRxh9giLQj9oQaK.9/O8j6tk04KXz7R6m7K8y.p8CUltKKkpve',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-07 21:57:05
