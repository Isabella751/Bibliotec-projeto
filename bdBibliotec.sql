-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.0.2-MariaDB - mariadb.org binary distribution
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivrariabibliotec.usuarios: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
