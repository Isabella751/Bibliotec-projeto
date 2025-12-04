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
  `data_reserva` date NOT NULL,
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
  `data_reserva` date NOT NULL DEFAULT curdate(),
  `data_devolução` date NOT NULL,
  `status_reserva` enum('Emprestado','Devolvido','Atrasado') DEFAULT 'Emprestado',
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

-- Copiando estrutura para tabela bdbibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `curso` varchar(100) DEFAULT NULL,
  `perfil` enum('Aluno','Admin') DEFAULT 'Aluno',
  `criado_em` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `criado_em`) VALUES
	(1, 'Isabella Leite dos Santos', '12345678901', 'isabella.leite562@gmail.com', 'isa123', '2009-02-09', '(11) 99999-9998', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', '2025-12-01'),
	(2, 'Giovanna Santana da Silva', '01987654321', 'gigisantanasilva@gmail.com', 'gi0909', '2008-02-07', '(11) 95335-0971', NULL, 'Aluno', '2025-12-01'),
	(3, 'Vitor Pimentel', '10120230344', 'vitor.pimentel@gmail.com', '0403', '1001-02-03', '(11) 99999-2345', 'Técnico em Equipamentos Biomédicos', '2025-12-01');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
