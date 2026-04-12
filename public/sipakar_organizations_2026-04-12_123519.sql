-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 10.0.15.250    Database: sipakar
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `head_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (2,'Badan Kepegawaian, Pendidikan, Dan Pelatihan','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','','','',''),(3,'Badan Kesatuan Bangsa Dan Politik','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','Jl Trunojoyo No. 12','(0353) 893526','',''),(4,'Badan Penanggulangan Bencana Daerah','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','Jl.  A. Yani   No.  06.','( 0353 )  881826','',''),(5,'Badan Pendapatan Daerah','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','Jl P Mastumapel No 1 Bojonegoro','881826','',''),(6,'Badan Pengelolaan Keuangan Dan Aset Daerah','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','','','',''),(7,'Badan Perencanaan Pembangunan Daerah','2026-04-09 19:24:57','2026-04-09 19:24:57','Badan','','','',''),(8,'Dinas Kebudayaan Dan Pariwisata','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jl. Teuku Umar No. 80 Bojonegoro','(0353) 881571','',''),(9,'Dinas Kepemudaan Dan Olahraga','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jl. Pattimura No. 36 Bojonegoro','(0353) 881257','',''),(10,'Dinas Kependudukan Dan Pencatatan Sipil','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jl. Patimura 26 A Bojonegoro WA','(0353) 881256','',''),(11,'Dinas Kesehatan','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jalan Dr. Cipto, Mojo Kampung, Mojokampung, Kabupaten Bojonegoro','(0353) 881350','',''),(12,'Dinas Ketahanan Pangan dan Pertanian','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jalan Raya Sukowati No. 412 Kapas, Bojonegoro','(0353) 881410','',''),(13,'Dinas Komunikasi Dan Informatika','2026-04-09 19:24:57','2026-04-09 19:24:57','Dinas','Jl. P. Mas Tumapel No. 1 Bojonegoro Gedung Pemkab Lantai 3','(0353) 881826','',''),(14,'Dinas Lingkungan Hidup','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl. Dr. Wahidin No.40 Bojonegoro - Jawa Timur','(0353) 881826','',''),(15,'Dinas Pekerjaan Umum Bina Marga Dan Penataan Ruang','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl. Lettu Suyitno 39, Bojonegoro','(0353) 881447','',''),(16,'Dinas Pekerjaan Umum Sumber Daya Air','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl Basuki Rahcmad no. 4a Bojonegoro','(0353) 881491','',''),(17,'Dinas Pemadam Kebakaran','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl. Ahmad Yani No. 06 Bojonegoro','(0353) 113','',''),(18,'Dinas Pemberdayaan Masyarakat Dan Desa','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jln. Panglima Sudirman No. 161 Kelurahan Klangon Kecamatan Bojonegoro','(0353) 881512','',''),(19,'Dinas Pemberdayaan Perempuan, Perlindungan Anak Dan Keluarga Berencana','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jln. Patimura No. 01 Bojonegoro - Jawa Timur','(0353) 889515','',''),(20,'Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Mal Pelayanan Publik, Jl. Veteran No.227, Ngrowo, Kec. Bojonegoro','0822-3309-9988','',''),(21,'Dinas Pendidikan','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl. Patimura No. 9 Bojonegoro','(0353) 881580','',''),(22,'Dinas Perdagangan, Koperasi dan Usaha Mikro','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','','','',''),(23,'Dinas Perhubungan','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jalan Pattimura No.36 A','(0353) 885219','',''),(24,'Dinas Perindustrian Dan Tenaga Kerja','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','','','',''),(25,'Dinas Perpustakaan Dan Kearsipan','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jl.Patimura Nomor 1A Kabupaten Bojonegoro','08161433200','',''),(26,'Dinas Perumahan, Kawasan Permukiman Dan Cipta Karya','2026-04-09 19:24:58','2026-04-09 19:24:58','Dinas','Jalan Lettu Soeyitno Nomor 39b Bojonegoro','(0353) 887444','',''),(27,'Dinas Peternakan Dan Perikanan','2026-04-09 19:24:59','2026-04-09 19:24:59','Dinas','Jl. Basuki Rahmad No. 02 - Kode Pos 62115 - Kab. Bojonegoro - Prov. Jawa Timur','(0353) 881172','',''),(28,'Dinas Sosial','2026-04-09 19:24:59','2026-04-09 19:24:59','Dinas','Jl. Dr Wahidin No. 40 Bojonegoro','(0353) 888918','',''),(29,'Satuan Polisi Pamong Praja','2026-04-09 19:24:59','2026-04-09 19:24:59','Dinas','Jl. P. Mas Tumapel No. 1 Bojonegoro','082228911677','',''),(30,'SEKDA','2026-04-09 19:24:59','2026-04-09 19:24:59','Sekretariat','','','',''),(31,'Kecamatan Balen','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(32,'Kecamatan Baureno','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(33,'Kecamatan Bubulan','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(34,'Kecamatan Bojonegoro','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(35,'Kecamatan Kalitidu','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(36,'Kecamatan Gondang','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(37,'Kecamatan Dander','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(38,'Kecamatan Kanor','2026-04-09 19:24:59','2026-04-09 19:24:59','Kecamatan','','','',''),(39,'Kecamatan Kapas','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','Jl. Ahmad Yani No. 37 Desa Tikusan Kecamatan Kapas Kabupaten Bojonegoro','(0353) 885080','',''),(40,'Kecamatan Kasiman','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(41,'Kecamatan Kedewan','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(42,'Kecamatan Kedungadem','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(43,'Kecamatan Kepohbaru','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(44,'Kecamatan Malo','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','Jalan Brawijaya No. 277, Malo','0353 511023','',''),(45,'Kecamatan Margomulyo','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(46,'Kecamatan Ngambon','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(47,'Kecamatan Ngasem','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(48,'Kecamatan Ngraho','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(49,'Kecamatan Padangan','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(50,'Kecamatan Purwosari','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(51,'Kecamatan Temayang','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(52,'Kecamatan Trucuk','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(53,'Kecamatan Tambakrejo','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(54,'Kecamatan Gayam','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(55,'Kecamatan Sumberrejo','2026-04-09 19:25:00','2026-04-09 19:25:00','Kecamatan','','','',''),(56,'Kecamatan Sukosewu','2026-04-09 19:25:01','2026-04-09 19:25:01','Kecamatan','','','',''),(57,'Kecamatan Sugihwaras','2026-04-09 19:25:01','2026-04-09 19:25:01','Kecamatan','','','',''),(58,'Kecamatan Sekar','2026-04-09 19:25:01','2026-04-09 19:25:01','Kecamatan','','','',''),(59,'Inspektorat','2026-04-09 19:25:01','2026-04-09 19:25:01','Inspektorat','Jl. Trunojoyo No. 12 Lt. 1 Bojonegoro','(0353) 881336','',''),(60,'RSUD Dr. R. Sosodoro Bojonegoro','2026-04-09 19:25:01','2026-04-09 19:25:01','RSUD','Jl.Veteran No 36 Bojonegoro','(0353) 888118','',''),(61,'RSUD SUMBERREJO KABUPATEN BOJONEGORO','2026-04-09 19:25:01','2026-04-09 19:25:01','RSUD','Jl. Raya No. 231 Sumberrejo Bojonegoro','(0353) 331530','',''),(62,'RSUD Padangan','2026-04-09 19:25:01','2026-04-09 19:25:01','RSUD','Jl. Dr. Soetomo No. 02 Padangan Bojonegoro','(0353) 551166','',''),(63,'RSUD Kepohbaru','2026-04-09 19:25:01','2026-04-09 19:25:01','RSUD','Jl. Raya Kepohbaru-Gunungsari No. 472 Kecamatan Kepohbaru','(0353) 3418013','',''),(64,'Sekretariat Dewan','2026-04-09 19:25:01','2026-04-09 19:25:01','Sekretariat','Bojonegoro','08161433200','','');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-12 12:35:23
