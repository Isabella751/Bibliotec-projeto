-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.1.2-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para bdbibliotec
CREATE DATABASE IF NOT EXISTS `bdbibliotec` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bdbibliotec`;

-- Copiando estrutura para tabela bdbibliotec.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `criado_em` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.admins: ~1 rows (aproximadamente)
INSERT INTO `admins` (`id`, `nome`, `cpf`, `email`, `senha`, `criado_em`) VALUES
	(1, 'Giovanna Santana', '12345678901', 'gigisantanasilva@gmail.com', 'giadm', '2025-12-04');

-- Copiando estrutura para tabela bdbibliotec.avaliacoes
CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `nota` int(11) NOT NULL CHECK (`nota` >= 0 and `nota` <= 10),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.avaliacoes: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.favoritos
CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_favoritado` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.favoritos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.historico
CREATE TABLE IF NOT EXISTS `historico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_emprestimo` date NOT NULL,
  `data_devolucao` date NOT NULL,
  `status_livro` enum('Em andamento','No prazo','Em atraso','Perdido','Extraviado') DEFAULT 'Em andamento',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.historico: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `genero` varchar(100) NOT NULL,
  `editora` varchar(100) DEFAULT NULL,
  `ano_publicacao` smallint(6) DEFAULT NULL,
  `isbn` varchar(20) NOT NULL,
  `idioma` varchar(50) DEFAULT 'Português',
  `formato` enum('Físico','E-book','Audiobook') DEFAULT 'Físico',
  `caminho_capa` varchar(255) DEFAULT NULL,
  `classificacao` enum('Livre','10+','12+','14+','16+','18+') DEFAULT 'Livre',
  `sinopse` text DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` datetime DEFAULT current_timestamp(),
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.livros: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `data_emprestimo` date NOT NULL DEFAULT curdate(),
  `data_devolução` date NOT NULL,
  `status_emprestimo` enum('Emprestado','Devolvido','Atrasado') DEFAULT 'Emprestado',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reservas: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.reserva_itens
CREATE TABLE IF NOT EXISTS `reserva_itens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reserva_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_prevista` date NOT NULL,
  `data_devolvido` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reserva_id` (`reserva_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reserva_itens: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.reset_tokens
CREATE TABLE IF NOT EXISTS `reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiracao` datetime NOT NULL,
  `usado` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reset_tokens: ~6 rows (aproximadamente)
INSERT INTO `reset_tokens` (`id`, `usuario_id`, `token`, `expiracao`, `usado`) VALUES
	(5, 14, '5ccfb1616b6062b7d60ee934f83e015bfd7702f6fe02054f8b3283e369c147cd', '2025-12-10 09:39:49', 0),
	(6, 14, '34a941ca6233282e57a85e85f902095dcb13b03c6faa223c606ad0e3dc0dd918', '2025-12-10 09:02:23', 0),
	(7, 14, 'db7e0d4323fe7fd0b88da7854991af2d1653a7621d2a7286ebb71ae73348398c', '2025-12-10 09:03:14', 0),
	(8, 14, '2825b4ac527e27367666be05a800092c3c9a106ca9cbb709d79bf3969c872dbb', '2025-12-10 09:05:38', 0),
	(9, 14, 'ee49c503ec9ab8e7f6a0b9485c07b26cf600c0f8406f30ed73a9e1d3060cc7a3', '2025-12-10 09:06:19', 0),
	(10, 14, '00ce0b29216437a43b193398409da1ecd97ca0d2d3e54c06e2e8ee0cf94867bb', '2025-12-10 09:06:53', 0);

-- Copiando estrutura para tabela bdbibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `data_nascimento` date NOT NULL,
  `celular` varchar(20) NOT NULL,
  `curso` varchar(100) NOT NULL,
  `perfil` enum('Aluno','Admin') DEFAULT 'Aluno',
  `criado_em` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.usuarios: ~6 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `criado_em`) VALUES
	(8, 'Leandro Quisbert', '92772590860', 'leandrinhoqui@gmail.com', 'lele1234', '2024-12-06', '(12) 41252-3564', 'Técnico em Administração', 'Aluno', '2025-12-05'),
	(9, 'Vitor Pimentel', '33575843791', 'vitorpimentel@gmail.com', 'vitor1234', '2009-05-04', '(55) 46754-7457', 'Técnico em Eletrônica', 'Aluno', '2025-12-08'),
	(11, 'Isabella Leite', '15652071907', 'isabella.leite562@gmail.com', 'isa12345', '2009-02-09', '(11) 78889-9871', 'Técnico em Redes de Computadores', 'Aluno', '2025-12-08'),
	(12, 'Leandro Quisbert', '70012892483', 'leandro.chq123@gmail.com', 'Panguço123', '2007-04-30', '(11) 94405-0584', 'Técnico em Produção de Moda', 'Aluno', '2025-12-09'),
	(13, 'Lorena Marques da Silva', '50125092857', 'llomarques1103@gmail.com', '12345678', '2007-03-11', '(11) 96783-0824', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', '2025-12-09'),
	(14, 'Bibliotec', '16635964096', 'bibliotec.suport@gmail.com', 'livro1234', '2000-12-02', '(11) 92421-4124', 'Técnico em Soldagem', 'Aluno', '2025-12-10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
