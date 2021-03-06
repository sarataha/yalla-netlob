-- MySQL dump 10.16  Distrib 10.1.20-MariaDB, for osx10.12 (x86_64)
--
-- Host: yala_netlob_development    Database: yala_netlob_development
-- ------------------------------------------------------
-- Server version	10.1.20-MariaDB

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
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (3,38),(3,39),(4,38),(4,44),(5,39),(6,38),(7,38),(7,46);
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(30) NOT NULL,
  `group_admin` int(11) NOT NULL,
  PRIMARY KEY (`group_id`),
  KEY `group_admin` (`group_admin`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`group_admin`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (3,'baby',45),(4,'bal7a',45),(5,'oo',38),(6,'ay7aga',46),(7,'opensource1',44);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invited_users`
--

DROP TABLE IF EXISTS `invited_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invited_users` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`order_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `invited_users_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invited_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invited_users`
--

LOCK TABLES `invited_users` WRITE;
/*!40000 ALTER TABLE `invited_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `invited_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notifier_id` int(11) NOT NULL,
  `notified_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `notifier_name` varchar(255) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `order_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifier_id` (`notifier_id`),
  KEY `notified_id` (`notified_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`notifier_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`notified_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (53,38,45,58,'mariam ',0,'mariammaclunch'),(54,38,39,58,'mariam ',0,'mariammaclunch'),(55,38,39,59,'mariam ',0,'mariammmlunch'),(56,38,44,59,'mariam ',0,'mariammmlunch'),(57,44,38,59,'wafaa mahmoud',1,'mariammmlunch'),(58,44,38,60,'wafaa mahmoud ',0,'wafaa mahmoudmaclunch'),(59,44,46,60,'wafaa mahmoud ',0,'wafaa mahmoudmaclunch'),(60,38,44,60,'mariam',1,'wafaa mahmoudmaclunch'),(61,46,44,60,'yomna',1,'wafaa mahmoudmaclunch'),(62,46,38,61,'yomna ',0,'yomnatab3ybreakfast'),(63,38,46,61,'mariam',1,'yomnatab3ybreakfast'),(64,46,50,62,'yomna ',0,'yomnakjndfbreakfast');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
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
  `order_time` datetime NOT NULL,
  `order_name` varchar(255) DEFAULT NULL,
  `invited_count` int(11) DEFAULT '0',
  PRIMARY KEY (`order_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (52,'lunch','waiting',45,'sdf','','2017-04-18 03:08:41','sososdflunch',1),(58,'lunch','waiting',38,'mac','','2017-04-19 10:36:53','mariammaclunch',2),(59,'lunch','waiting',38,'mm','','2017-04-19 10:38:00','mariammmlunch',2),(60,'lunch','finished',44,'mac','C:\\fakepath\\images.png','2017-04-19 11:22:22','wafaa mahmoudmaclunch',2),(61,'breakfast','waiting',46,'tab3y','','2017-04-19 11:28:57','yomnatab3ybreakfast',1),(62,'breakfast','waiting',46,'kjndf','','2017-04-19 11:39:01','yomnakjndfbreakfast',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_items`
--

DROP TABLE IF EXISTS `orders_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `comment` varchar(50) DEFAULT NULL,
  `order_date` date NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `user_id` (`user_id`),
  KEY `orders_items_ibfk_1` (`order_id`),
  CONSTRAINT `orders_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_items`
--

LOCK TABLES `orders_items` WRITE;
/*!40000 ALTER TABLE `orders_items` DISABLE KEYS */;
INSERT INTO `orders_items` VALUES (1,60,38,'ayakl',1,'','2017-04-19',3),(2,60,46,'akl',2,'','2017-04-19',2),(3,61,44,'ukhkjn',2,'','2017-04-19',1);
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
  PRIMARY KEY (`order_id`,`user_id`),
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
INSERT INTO `orders_users` VALUES (59,44),(60,38),(60,46),(61,38);
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
INSERT INTO `user_friends` VALUES (38,39),(38,40),(38,44),(38,45),(38,46),(39,38),(39,40),(39,45),(40,38),(42,43),(43,42),(44,38),(44,46),(45,38),(45,39),(46,38),(46,44),(46,50),(50,46);
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
  `facebook_id` bigint(20) DEFAULT NULL,
  `facebook_token` varchar(255) DEFAULT NULL,
  `twitter_id` bigint(20) DEFAULT NULL,
  `twitter_token` varchar(255) DEFAULT NULL,
  `google_id` bigint(20) DEFAULT NULL,
  `google_token` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `facebook_id` (`facebook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (38,'mariam','miro_mg@hotmail.com','$2a$10$cz0kRbYISiheVx.CSsUY8uOZD0NRAxn6nNZT98wJ1QlZyYAvUnGne','/assets/img/profile/b6c6d546da27b49714aee587f3e14ea2',NULL,NULL,NULL,NULL,NULL,NULL,1),(39,'toto','toto@lolo.com','$2a$10$IuqMvbFZS4nejkTlky3vdOduDZWtVKZHCEwgoDtnPcSo9EJ6HW4iK',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),(40,'moe','moe@g.com','$2a$10$dexYSI6DNrEluMaBeTrAk.fyvH.XUMPQ9ZqzlQnA6dbXlftbU65Dm',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),(41,'wafaa','wafaa@k.com','$2a$10$CEKtnVWQP3UhzBQdp/DezuiS.onA3Ryzk1yYPzHB8B4Vq9AfYeXuy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),(42,'sara','st.elzayat@gmail.com','$2a$10$CqLvkAXlG.NaKuBYEKmkNu36tS0Jf18PPVEdU2pj1LaXKrRhG8pGW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(43,'yalla','yallanetlob@gmail.com','$2a$10$x9XKGNshqyoBae1ScxJqSOHGd5RCEkx6JpopA26zWDNLyc9dT/kgm',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(44,'wafaa mahmoud','wafaa_mahmoud94x@yahoo.com','$2a$10$ZyF8udiPrJ4h2FdS0lcMr.BhrLwxL5w41XSPQiBuhIx8GyOQkpZfW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(45,'soso','soso@toto.com','$2a$10$jtFxQkOHl3pupbg81a/dwefXDB2buoBJXlr0eiDCZ2ST20Et/POzu',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(46,'yomna','yomna.2811@gmail.com','$2a$10$RHOoClHiFObpx/5JU522qunpif/IF1NIZD7QyNn5GmuLq3Ih6DmwO','/assets/img/profile/e8dc9125438a4825a003872a39f3d8a5',NULL,NULL,NULL,NULL,NULL,NULL,1),(48,'Mariam_Selim','',NULL,'https://pbs.twimg.com/profile_images/526412495552913408/mgvVNJ2-_normal.jpeg',NULL,NULL,57903108,'57903108-OkBgXGOaBsJmgFRjXpiXeByTudyZ0QF1vZy1Epb7p',NULL,NULL,0),(50,'Mariam Gamal','mariam.gamal.mg@gmail.com',NULL,'https://lh4.googleusercontent.com/-qCziIQykSuM/AAAAAAAAAAI/AAAAAAAACR0/IunyGZNH4Pk/photo.jpg?sz=50',NULL,NULL,NULL,NULL,9223372036854775807,'ya29.GlsyBFM5bPz82419LJbFlnWXCWKafJCVlVEKuweatyJjmpLdeoSnK8hOnyzSn_06MlHHJcGEZIUlqfp609ENi68GkIq3Ee1MQXTgp9OVXjLmyHbS2PMCN0KEOjTM',0);
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

-- Dump completed on 2017-04-19 13:31:12
