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
  `perfil` enum('Admin','Aluno') DEFAULT 'Admin',
  `criado_em` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.admins: ~1 rows (aproximadamente)
INSERT INTO `admins` (`id`, `nome`, `cpf`, `email`, `senha`, `perfil`, `criado_em`) VALUES
	(2, 'Giovanna Santana', '57593573877', 'gigisantanasilva@gmail.com', 'giadm', 'Admin', '2025-12-12');

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

-- Copiando estrutura para tabela bdbibliotec.codigos_verificacao
CREATE TABLE IF NOT EXISTS `codigos_verificacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `codigo` varchar(5) NOT NULL,
  `expiracao` datetime NOT NULL,
  `dados_usuario` text NOT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_expiracao` (`expiracao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.codigos_verificacao: ~0 rows (aproximadamente)

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

-- Copiando estrutura para evento bdbibliotec.limpar_codigos_expirados
DELIMITER //
CREATE EVENT `limpar_codigos_expirados` ON SCHEDULE EVERY 1 HOUR STARTS '2025-12-11 14:12:39' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM codigos_verificacao WHERE expiracao < NOW()//
DELIMITER ;

-- Copiando estrutura para evento bdbibliotec.limpar_tokens_expirados
DELIMITER //
CREATE EVENT `limpar_tokens_expirados` ON SCHEDULE EVERY 5 MINUTE STARTS '2025-12-10 08:36:54' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM reset_tokens WHERE expiracao < NOW() OR usado = 1//
DELIMITER ;

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
  `destaque` tinyint(1) DEFAULT 0,
  `visualizacoes` int(11) DEFAULT 0,
  `ultima_visualizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.livros: ~1 rows (aproximadamente)
INSERT INTO `livros` (`id`, `titulo`, `autor`, `genero`, `editora`, `ano_publicacao`, `isbn`, `idioma`, `formato`, `caminho_capa`, `classificacao`, `sinopse`, `ativo`, `criado_em`, `atualizado_em`, `destaque`, `visualizacoes`, `ultima_visualizacao`) VALUES
	(1, 'Vidas Secas', 'Graciliano Ramos', 'Romance', 'Editora Itatiaia', 2024, '6554700277', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/61AzJECJepL._SY466_.jpg', 'Livre', '"Vidas Secas" é um retrato magistral das condições humanas diante das adversidades, explorando temas universais como a busca por um lar, a esperança em meio à desolação e a resistência humana perante a natureza implacável. A linguagem precisa e a intensidade emocional conferem à obra um status atemporal, tornando-a uma leitura fundamental para quem deseja compreender as complexidades sociais e humanas do Brasil rural do século XX.', 1, '2025-12-12 11:21:02', '2025-12-12 11:21:02', 0, 0, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reset_tokens: ~3 rows (aproximadamente)
INSERT INTO `reset_tokens` (`id`, `usuario_id`, `token`, `expiracao`, `usado`) VALUES
	(14, 11, '507170072cb905bdc28b76c36c1effc7d09001d6b49a55d98a85e571170583e5', '2025-12-10 11:02:04', 0),
	(15, 11, '46f3a79360a4cfbcff87c3859e6ee1ece7fd15c75d988a7c62a7bd625a614ec4', '2025-12-10 11:02:43', 0),
	(16, 12, '1174f49e8df1f6fe226df9a5a908305e85fbca8c9e3d5d39c85f237283333d30', '2025-12-10 11:08:28', 0);

-- Copiando estrutura para tabela bdbibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `data_nascimento` date NOT NULL,
  `celular` varchar(20) NULL,
  `curso` varchar(100) NOT NULL,
  `perfil` enum('Aluno') DEFAULT 'Aluno',
  `criado_em` date DEFAULT curdate(),
  `email_verificado` tinyint(4) DEFAULT 0,
  `email_confirmado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.usuarios: ~5 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `criado_em`, `email_verificado`, `email_confirmado`) VALUES
	(9, 'Vitor Pimentel', '33575843791', 'vitorpimentel@gmail.com', 'vitor1234', '2009-05-04', '(55) 46754-7457', 'Técnico em Eletrônica', 'Aluno', '2025-12-08', 0, 0),
	(11, 'Isabella Leite', '15652071907', 'isabella.leite562@gmail.com', 'isa12345', '2009-02-09', '(11) 78889-9871', 'Técnico em Redes de Computadores', 'Aluno', '2025-12-08', 0, 0),
	(12, 'Leandro Quisbert', '70012892483', 'leandro.chq123@gmail.com', 'Panguço123', '2007-04-30', '(11) 94405-0584', 'Técnico em Produção de Moda', 'Aluno', '2025-12-09', 0, 0),
	(13, 'Lorena Marques da Silva', '50125092857', 'llomarques1103@gmail.com', '12345678', '2007-03-11', '(11) 96783-0824', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', '2025-12-09', 0, 0),
	(14, 'Bibliotec', '16635964096', 'bibliotec.suport@gmail.com', 'livro1234', '2000-12-02', '(11) 92421-4124', 'Técnico em Soldagem', 'Aluno', '2025-12-10', 0, 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
