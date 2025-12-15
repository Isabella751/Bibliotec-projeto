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


-- Copiando estrutura do banco de dados para bdbibliotec
CREATE DATABASE IF NOT EXISTS `bdbibliotec` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bdbibliotec`;

-- Copiando estrutura para tabela bdbibliotec.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `perfil` enum('Admin','Aluno') DEFAULT 'Admin',
  `criado_em` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.admins: ~1 rows (aproximadamente)
INSERT INTO `admins` (`id`, `nome`, `cpf`, `email`, `senha`, `perfil`, `criado_em`) VALUES
	(5, 'Giovanna Santana Silva', '51473580056', 'gigisantanasilva@gmail.com', 'giadm123', 'Admin', '2025-12-14');

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
  CONSTRAINT `fk_avaliacoes_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_avaliacoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
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
  CONSTRAINT `fk_favoritos_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
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
  CONSTRAINT `fk_historico_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_historico_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.livros: ~5 rows (aproximadamente)
INSERT INTO `livros` (`id`, `titulo`, `autor`, `genero`, `editora`, `ano_publicacao`, `isbn`, `idioma`, `formato`, `caminho_capa`, `classificacao`, `sinopse`, `ativo`, `criado_em`, `atualizado_em`, `destaque`, `visualizacoes`, `ultima_visualizacao`) VALUES
	(1, 'Vidas Secas', 'Graciliano Ramos', 'Romance', 'Editora Itatiaia', 2024, '6554700277', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/61AzJECJepL._SY466_.jpg', 'Livre', '"Vidas Secas" é um retrato magistral das condições humanas diante das adversidades, explorando temas universais como a busca por um lar, a esperança em meio à desolação e a resistência humana perante a natureza implacável. A linguagem precisa e a intensidade emocional conferem à obra um status atemporal, tornando-a uma leitura fundamental para quem deseja compreender as complexidades sociais e humanas do Brasil rural do século XX.', 1, '2025-12-12 11:21:02', '2025-12-14 17:25:51', 0, 40, '2025-12-14 17:25:51'),
	(2, 'A Metamorfose', 'Franz Kafka', 'Ficção', 'Principis', 2019, '8594318782', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/51H+90dUjzL._SY445_SX342_ML2_.jpg', '16+', 'O caixeiro-viajante Gregor acorda metamorfoseado em um enorme inseto e percebe que tudo mudou e não só em sua vida, mas no mundo. Ele, então, acompanha as reações de sua família ao perceberem o estranho ser em que ele se tornou. E, enquanto luta para se manter vivo, reflete sobre o comportamento de seus pais, de sua irmã e sobre a sua nova vida', 0, '2025-12-14 11:42:27', '2025-12-14 17:26:53', 0, 18, '2025-12-14 17:26:53'),
	(3, 'O Pequeno Príncipe', 'Antonie de Saint-Exupéry', 'Fantasia', 'HarperCollins', 2018, '8595081514', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/51TO7PCLMuL._SY445_SX342_ML2_.jpg', 'Livre', 'Um piloto cai com seu avião no deserto e ali encontra uma criança loura e frágil. Ela diz ter vindo de um pequeno planeta distante. E ali, na convivência com o piloto perdido, os dois repensam os seus valores e encontram o sentido da vida. Com essa história mágica, sensível, comovente, às vezes triste, e só aparentemente infantil, o escritor francês Antoine de Saint-Exupéry criou há 70 anos um dos maiores clássicos da literatura universal. Não há adulto que não se comova ao se lembrar de quando o leu quando criança. Trata-se da maior obra existencialista do século XX, segundo Martin Heidegger. Livro mais traduzido da história, depois do Alcorão e da Bíblia, ele agora chega ao Brasil em nova edição, completa, com a tradução de Luiz Fernando Emediato e enriquecida com um caderno ilustrado sobre a obra e a curta e trágica vida do autor.', 0, '2025-12-14 13:27:46', '2025-12-14 17:50:55', 0, 15, '2025-12-14 17:50:55'),
	(4, 'Orgulho e Preconceito', 'Jane Austen', 'Romance', 'Penguin-Companhia', 2011, '8563560158', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41HF69KafUS._SY445_SX342_ML2_.jpg', 'Livre', 'Na Inglaterra do final do século XVIII, as possibilidades de ascensão social eram limitadas para uma mulher sem dote. Elizabeth Bennet, de vinte anos, uma das cinco filhas de um espirituoso mas imprudente senhor, no entanto, é um novo tipo de heroína, que não precisará de estereótipos femininos para conquistar o nobre Fitzwilliam Darcy e defender suas posições com perfeita lucidez de uma filósofa liberal da província. Lizzy é uma espécie de Cinderela esclarecida, iluminista, protofeminista.\nNeste livro, Jane Austen faz também uma crítica à futilidade das mulheres na voz dessa admirável heroína - recompensada, ao final, com uma felicidade que não lhe parecia possível na classe em que nasceu.', 1, '2025-12-14 13:35:19', '2025-12-14 17:13:29', 0, 10, '2025-12-14 17:13:29'),
	(5, 'O Diário de Anne Frank', 'Anne Frank', 'Autobiografia', 'Principis', 2020, '6550970407', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41ujmhW4HNL._SY445_SX342_ML2_.jpg', '14+', 'Uma poderosa lembrança dos horrores de uma guerra, um testemunho eloquente do espírito humano. Assim podemos descrever os relatos feitos por Anne em seu diário. Isolados do mundo exterior, os Frank enfrentaram a fome, o tédio e a terrível realidade do confinamento, além da ameaça constante de serem descobertos. Nas páginas de seu diário, Anne Frank registra as impressões sobre esse longo período no esconderijo. Alternando momentos de medo e alegria, as anotações se mostram um fascinante relato sobre a coragem e a fraqueza humanas e, sobretudo, um vigoroso autorretrato de uma menina sensível e determinada.', 1, '2025-12-14 14:20:00', '2025-12-14 17:25:57', 0, 1, '2025-12-14 17:25:57'),
	(6, 'Diário de um Banana 1', 'Jeff Kinney', 'Ficção', 'VR Editora', 2008, '8576831309', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41gBzGDn3XL._SY445_SX342_ML2_.jpg', 'Livre', 'Não é fácil ser criança. E ninguém sabe disso melhor do que Greg Heffley, que se vê mergulhado no mundo do ensino fundamental, onde fracotes são obrigados a dividir os corredores com garotos mais altos, mais malvados e que já se barbeiam. Em Diário de um Banana, o autor e ilustrados Jeff Kinney nos apresenta um herói improvável. Como Greg diz em seu diário. Só não espere que seja todo Querido Diário isso, Querido Diário aquilo. Para nossa sorte, o que Greg Heffley diz que fará e o que ele realmente faz são duas coisas bem diferentes.', 1, '2025-12-14 17:55:24', '2025-12-14 17:55:24', 0, 0, NULL);

-- Copiando estrutura para tabela bdbibliotec.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `data_reserva` date NOT NULL DEFAULT curdate(),
  `data_retirada_prevista` date NOT NULL,
  `data_devolucao_real` date DEFAULT NULL,
  `status_reserva` enum('Reservado','Emprestado','Cancelado','Expirado') DEFAULT 'Reservado',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_reservas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reservas: ~1 rows (aproximadamente)
INSERT INTO `reservas` (`id`, `usuario_id`, `data_reserva`, `data_retirada_prevista`, `data_devolucao_real`, `status_reserva`) VALUES
	(1, 9, '2025-12-14', '2025-12-24', NULL, 'Reservado'),
	(2, 13, '2025-12-14', '2025-12-14', NULL, 'Reservado');

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
  CONSTRAINT `fk_reserva_itens_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reserva_itens_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reserva_itens: ~1 rows (aproximadamente)
INSERT INTO `reserva_itens` (`id`, `reserva_id`, `livro_id`, `data_prevista`, `data_devolvido`) VALUES
	(1, 1, 2, '2026-01-07', NULL),
	(2, 2, 3, '2025-12-28', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.reset_tokens: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdbibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `data_nascimento` date NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `curso` varchar(100) NOT NULL,
  `perfil` enum('Aluno') DEFAULT 'Aluno',
  `token_verificacao` varchar(255) DEFAULT NULL,
  `expiracao_token` datetime DEFAULT NULL,
  `criado_em` date DEFAULT curdate(),
  `email_verificado` tinyint(4) DEFAULT 0,
  `email_confirmado` tinyint(1) DEFAULT 0,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.usuarios: ~5 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `token_verificacao`, `expiracao_token`, `criado_em`, `email_verificado`, `email_confirmado`, `reset_token`, `reset_token_expires`) VALUES
	(9, 'Vitor Pimentel', '33575843791', 'vitorpimentel@gmail.com', 'vitor1234', '2009-05-04', '(55) 46754-7457', 'Técnico em Eletrônica', 'Aluno', NULL, NULL, '2025-12-08', 0, 0, NULL, NULL),
	(13, 'Lorena Marques da Silva', '50125092857', 'llomarques1103@gmail.com', '12345678', '2007-03-11', '(11) 96783-0824', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-09', 0, 0, NULL, NULL),
	(19, 'Nicolly Nicastro', '45754165099', 'nickk45@gmail.com', 'nicastrocolly', '2008-05-05', '(11) 96723-3452', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-12', 0, 0, NULL, NULL),
	(21, 'Gabriel Lopes da Silva', '56367925066', 'gabriel0w0@yahoo.com', '12345678', '2006-04-23', NULL, 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-12', 0, 0, NULL, NULL)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
