-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           11.8.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para dblivrariabibliotec
CREATE DATABASE IF NOT EXISTS `dblivrariabibliotec` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `dblivrariabibliotec`;

-- Copiando estrutura para tabela dblivrariabibliotec.avaliacoes
CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `nota` decimal(2,1) DEFAULT NULL CHECK (`nota` >= 0 and `nota` <= 5),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.avaliacoes: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivrariabibliotec.emprestimos
CREATE TABLE IF NOT EXISTS `emprestimos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `data_emprestimo` date NOT NULL DEFAULT curdate(),
  `data_devolução` date DEFAULT NULL,
  `status_emprestimo` enum('Emprestado','Devolvido','Atrasado') DEFAULT 'Emprestado',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `emprestimos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.emprestimos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivrariabibliotec.emprestimo_itens
CREATE TABLE IF NOT EXISTS `emprestimo_itens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emprestimo_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_prevista` date DEFAULT NULL,
  `data_devolvido` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emprestimo_id` (`emprestimo_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `emprestimo_itens_ibfk_1` FOREIGN KEY (`emprestimo_id`) REFERENCES `emprestimos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `emprestimo_itens_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.emprestimo_itens: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivrariabibliotec.historico
CREATE TABLE IF NOT EXISTS `historico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_emprestimo` date DEFAULT NULL,
  `data_devolução` date DEFAULT NULL,
  `status_livro` enum('Em andamento','No prazo','Em atraso','Perdido','Extraviado') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `historico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historico_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.historico: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivrariabibliotec.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `editora` varchar(100) DEFAULT NULL,
  `ano_publicacao` smallint(6) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `idioma` varchar(50) DEFAULT 'Português',
  `formato` enum('Físico','E-book','Audiobook') DEFAULT 'Físico',
  `caminho_capa` varchar(255) DEFAULT NULL,
  `sinopse` text DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.livros: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivrariabibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `curso` varchar(100) DEFAULT NULL,
  `perfil` enum('Aluno','Admin') DEFAULT 'Aluno',
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.usuarios: ~8 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `criado_em`) VALUES
	(1, 'Giovanna Santos', 'giovanna.santos@example.com', '123456', '2003-04-15', '(11) 98876-4321', 'Análise e Desenvolvimento de Sistemas', 'Aluno', '2025-10-31 12:11:05'),
	(2, 'Lucas Almeida', 'lucas.almeida@example.com', 'senha123', '2000-09-02', '(11) 97654-3322', 'Engenharia de Software', 'Aluno', '2025-10-31 12:11:05'),
	(3, 'Mariana Costa', 'mariana.costa@example.com', 'mariana@123', '1999-12-20', '(21) 99745-2211', 'Ciência da Computação', 'Aluno', '2025-10-31 12:11:05'),
	(4, 'Rafael Oliveira', 'rafael.oliveira@example.com', 'rafael321', '2001-05-10', '(31) 99888-5566', 'Sistemas de Informação', 'Aluno', '2025-10-31 12:11:05'),
	(5, 'Amanda Rocha', 'amanda.rocha@example.com', 'amanda@senha', '2002-11-03', '(41) 98777-2233', 'Redes de Computadores', 'Aluno', '2025-10-31 12:11:05'),
	(6, 'Beatriz Lima', 'beatriz.lima@example.com', 'bea12345', '2004-07-28', '(71) 98111-3344', 'Banco de Dados', 'Aluno', '2025-10-31 12:11:05'),
	(7, 'Felipe Carvalho', 'felipe.carvalho@example.com', 'admin123', '1995-08-18', '(61) 99955-7788', NULL, 'Admin', '2025-10-31 12:11:05'),
	(8, 'Juliana Mendes', 'juliana.mendes@example.com', 'adm!senha', '1998-03-25', '(81) 98844-9900', NULL, 'Admin', '2025-10-31 12:11:05'),
	(9, 'Isabella Leite', 'isabellaleite@example.com', 'isa123', '2009-02-09', '(11) 95436-2335', 'Metalurgia', 'Aluno', '2025-10-31 12:31:25');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
