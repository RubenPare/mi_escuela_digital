-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_escolar
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `idalumnos` int NOT NULL AUTO_INCREMENT,
  `legajo` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `documento` int NOT NULL,
  `mail` varchar(45) DEFAULT NULL,
  `fecha_nacimiento` datetime DEFAULT NULL,
  `activo` tinyint DEFAULT NULL,
  PRIMARY KEY (`idalumnos`),
  UNIQUE KEY `idalumnos_UNIQUE` (`idalumnos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignaciones`
--

DROP TABLE IF EXISTS `asignaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaciones` (
  `idasignaciones` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `materia_id` int NOT NULL,
  `ciclo_lectivo_id` int NOT NULL,
  `activo` tinyint NOT NULL,
  PRIMARY KEY (`idasignaciones`),
  UNIQUE KEY `idasignaciones_UNIQUE` (`idasignaciones`),
  UNIQUE KEY `materia_id_UNIQUE` (`materia_id`),
  UNIQUE KEY `ciclo_lectivo_id_UNIQUE` (`ciclo_lectivo_id`),
  UNIQUE KEY `activo_UNIQUE` (`activo`),
  KEY `usuario_id_idx` (`usuario_id`),
  CONSTRAINT `ciclo_lectivo_id` FOREIGN KEY (`ciclo_lectivo_id`) REFERENCES `ciclos_lectivos` (`idciclos_lectivos`),
  CONSTRAINT `materia_id` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`idmaterias`),
  CONSTRAINT `usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaciones`
--

LOCK TABLES `asignaciones` WRITE;
/*!40000 ALTER TABLE `asignaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `idasistencia` int NOT NULL,
  `fk_alumno_id` int NOT NULL,
  `fkciclo_lectivo` int NOT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `fk_usuario_quientomo` int NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idasistencia`),
  KEY `fk_alumno_id_idx` (`fk_alumno_id`),
  KEY `fkciclo_lectivo_idx` (`fkciclo_lectivo`),
  KEY `fk_usuario_quientomo_idx` (`fk_usuario_quientomo`),
  CONSTRAINT `fk_alumno_id` FOREIGN KEY (`fk_alumno_id`) REFERENCES `alumnos` (`idalumnos`),
  CONSTRAINT `fk_usuario_quientomo` FOREIGN KEY (`fk_usuario_quientomo`) REFERENCES `usuarios` (`idusuarios`),
  CONSTRAINT `fkciclo_lectivo` FOREIGN KEY (`fkciclo_lectivo`) REFERENCES `ciclos_lectivos` (`idciclos_lectivos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `idcalificaciones` int NOT NULL,
  `fkalumno_id` int NOT NULL,
  `trimestre` varchar(45) DEFAULT NULL,
  `nota` varchar(45) DEFAULT NULL,
  `usuario_id_profesor` int NOT NULL,
  `creado_en` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcalificaciones`),
  KEY `fkalumno_id_idx` (`fkalumno_id`),
  KEY `usuario_id_profesor_idx` (`usuario_id_profesor`),
  CONSTRAINT `fkalumno_id` FOREIGN KEY (`fkalumno_id`) REFERENCES `alumnos` (`idalumnos`),
  CONSTRAINT `usuario_id_profesor` FOREIGN KEY (`usuario_id_profesor`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificaciones`
--

LOCK TABLES `calificaciones` WRITE;
/*!40000 ALTER TABLE `calificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `calificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclos_lectivos`
--

DROP TABLE IF EXISTS `ciclos_lectivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclos_lectivos` (
  `idciclos_lectivos` int NOT NULL AUTO_INCREMENT,
  `año` int NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `activo` tinyint NOT NULL,
  PRIMARY KEY (`idciclos_lectivos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclos_lectivos`
--

LOCK TABLES `ciclos_lectivos` WRITE;
/*!40000 ALTER TABLE `ciclos_lectivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `ciclos_lectivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comunicados`
--

DROP TABLE IF EXISTS `comunicados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunicados` (
  `idcomunicados` int NOT NULL,
  `usuario_id_autor` int NOT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `mensaje` varchar(45) DEFAULT NULL,
  `dirigido_a_curso_id` int NOT NULL,
  PRIMARY KEY (`idcomunicados`),
  KEY `usuario_id_autor_idx` (`usuario_id_autor`),
  KEY `dirigido_a_curso_id_idx` (`dirigido_a_curso_id`),
  CONSTRAINT `dirigido_a_curso_id` FOREIGN KEY (`dirigido_a_curso_id`) REFERENCES `cursos` (`idcursos`),
  CONSTRAINT `usuario_id_autor` FOREIGN KEY (`usuario_id_autor`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comunicados`
--

LOCK TABLES `comunicados` WRITE;
/*!40000 ALTER TABLE `comunicados` DISABLE KEYS */;
/*!40000 ALTER TABLE `comunicados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `idcursos` int NOT NULL AUTO_INCREMENT,
  `nivel` int NOT NULL,
  `division` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcursos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `idinscripciones` int NOT NULL AUTO_INCREMENT,
  `alumno_id` int NOT NULL,
  `fkcurso_id` int NOT NULL,
  `fecha_inscripcion` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idinscripciones`),
  KEY `alumno_id_idx` (`alumno_id`),
  KEY `curso_id_idx` (`fkcurso_id`),
  CONSTRAINT `alumno_id` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`idalumnos`),
  CONSTRAINT `fkcurso_id` FOREIGN KEY (`fkcurso_id`) REFERENCES `cursos` (`idcursos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `idmaterias` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idmaterias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observaciones`
--

DROP TABLE IF EXISTS `observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observaciones` (
  `idobservaciones` int NOT NULL AUTO_INCREMENT,
  `fkj_alumno_id` int NOT NULL,
  `fk_usuario_id` int NOT NULL,
  `tipo_conducta` varchar(45) DEFAULT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idobservaciones`),
  KEY `fkalumno_id_idx` (`fkj_alumno_id`),
  KEY `fk_usuario_id_idx` (`fk_usuario_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`fk_usuario_id`) REFERENCES `usuarios` (`idusuarios`),
  CONSTRAINT `fkj_alumno_id` FOREIGN KEY (`fkj_alumno_id`) REFERENCES `alumnos` (`idalumnos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observaciones`
--

LOCK TABLES `observaciones` WRITE;
/*!40000 ALTER TABLE `observaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `observaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `idpermisos` int NOT NULL AUTO_INCREMENT,
  `permisoscol` varchar(45) DEFAULT NULL,
  `codigo` int NOT NULL,
  PRIMARY KEY (`idpermisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preceptores_curso`
--

DROP TABLE IF EXISTS `preceptores_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preceptores_curso` (
  `idpreceptores_curso` int NOT NULL,
  `usuario_id_preceptor` int NOT NULL,
  `curso_id` int NOT NULL,
  `fecha_desde` varchar(45) DEFAULT NULL,
  `fecha_hasta` varchar(45) DEFAULT NULL,
  `activo` tinyint DEFAULT NULL,
  PRIMARY KEY (`idpreceptores_curso`),
  UNIQUE KEY `idpreceptores_curso_UNIQUE` (`idpreceptores_curso`),
  KEY `usuario_id_preceptor_idx` (`usuario_id_preceptor`),
  KEY `curso_id_idx` (`curso_id`),
  CONSTRAINT `curso_id` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`idcursos`),
  CONSTRAINT `usuario_id_preceptor` FOREIGN KEY (`usuario_id_preceptor`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preceptores_curso`
--

LOCK TABLES `preceptores_curso` WRITE;
/*!40000 ALTER TABLE `preceptores_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `preceptores_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_permiso`
--

DROP TABLE IF EXISTS `rol_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_permiso` (
  `roles_id` int DEFAULT NULL,
  `permisos_id` int DEFAULT NULL,
  UNIQUE KEY `roles_id_UNIQUE` (`roles_id`),
  UNIQUE KEY `permisos_id_UNIQUE` (`permisos_id`),
  CONSTRAINT `permisos_id` FOREIGN KEY (`permisos_id`) REFERENCES `permisos` (`idpermisos`),
  CONSTRAINT `roles_id` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`idroles`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_permiso`
--

LOCK TABLES `rol_permiso` WRITE;
/*!40000 ALTER TABLE `rol_permiso` DISABLE KEYS */;
/*!40000 ALTER TABLE `rol_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idroles` int NOT NULL AUTO_INCREMENT,
  `rolescol` varchar(45) DEFAULT NULL,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idroles`),
  UNIQUE KEY `id_UNIQUE` (`idroles`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idusuarios` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `contraseña` varchar(45) NOT NULL,
  `fkrol_id` int NOT NULL,
  `mail` varchar(45) NOT NULL,
  `activo` tinyint NOT NULL,
  `creado_en` datetime NOT NULL,
  PRIMARY KEY (`idusuarios`),
  UNIQUE KEY `mail_UNIQUE` (`mail`),
  UNIQUE KEY `idusuarios_UNIQUE` (`idusuarios`),
  KEY `roles_id_idx` (`fkrol_id`),
  CONSTRAINT `fkrol_id` FOREIGN KEY (`fkrol_id`) REFERENCES `roles` (`idroles`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-05 17:33:45
