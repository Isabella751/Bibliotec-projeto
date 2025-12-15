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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bdbibliotec.livros: ~16 rows (aproximadamente)
INSERT INTO `livros` (`id`, `titulo`, `autor`, `genero`, `editora`, `ano_publicacao`, `isbn`, `idioma`, `formato`, `caminho_capa`, `classificacao`, `sinopse`, `ativo`, `criado_em`, `atualizado_em`, `destaque`, `visualizacoes`, `ultima_visualizacao`) VALUES
	(1, 'Vidas Secas', 'Graciliano Ramos', 'Romance', 'Editora Itatiaia', 2024, '6554700277', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/61AzJECJepL._SY466_.jpg', 'Livre', '"Vidas Secas" é um retrato magistral das condições humanas diante das adversidades, explorando temas universais como a busca por um lar, a esperança em meio à desolação e a resistência humana perante a natureza implacável. A linguagem precisa e a intensidade emocional conferem à obra um status atemporal, tornando-a uma leitura fundamental para quem deseja compreender as complexidades sociais e humanas do Brasil rural do século XX.', 1, '2025-12-12 11:21:02', '2025-12-15 09:50:02', 0, 42, '2025-12-15 09:50:02'),
	(2, 'A Metamorfose', 'Franz Kafka', 'Ficção', 'Principis', 2019, '8594318782', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/51H+90dUjzL._SY445_SX342_ML2_.jpg', '16+', 'O caixeiro-viajante Gregor acorda metamorfoseado em um enorme inseto e percebe que tudo mudou e não só em sua vida, mas no mundo. Ele, então, acompanha as reações de sua família ao perceberem o estranho ser em que ele se tornou. E, enquanto luta para se manter vivo, reflete sobre o comportamento de seus pais, de sua irmã e sobre a sua nova vida', 0, '2025-12-14 11:42:27', '2025-12-15 09:02:07', 0, 21, '2025-12-15 09:02:07'),
	(3, 'O Pequeno Príncipe', 'Antonie de Saint-Exupéry', 'Fantasia', 'HarperCollins', 2018, '8595081514', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/51TO7PCLMuL._SY445_SX342_ML2_.jpg', 'Livre', 'Um piloto cai com seu avião no deserto e ali encontra uma criança loura e frágil. Ela diz ter vindo de um pequeno planeta distante. E ali, na convivência com o piloto perdido, os dois repensam os seus valores e encontram o sentido da vida. Com essa história mágica, sensível, comovente, às vezes triste, e só aparentemente infantil, o escritor francês Antoine de Saint-Exupéry criou há 70 anos um dos maiores clássicos da literatura universal. Não há adulto que não se comova ao se lembrar de quando o leu quando criança. Trata-se da maior obra existencialista do século XX, segundo Martin Heidegger. Livro mais traduzido da história, depois do Alcorão e da Bíblia, ele agora chega ao Brasil em nova edição, completa, com a tradução de Luiz Fernando Emediato e enriquecida com um caderno ilustrado sobre a obra e a curta e trágica vida do autor.', 0, '2025-12-14 13:27:46', '2025-12-14 17:50:55', 0, 15, '2025-12-14 17:50:55'),
	(4, 'Orgulho e Preconceito', 'Jane Austen', 'Romance', 'Penguin-Companhia', 2011, '8563560158', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41HF69KafUS._SY445_SX342_ML2_.jpg', 'Livre', 'Na Inglaterra do final do século XVIII, as possibilidades de ascensão social eram limitadas para uma mulher sem dote. Elizabeth Bennet, de vinte anos, uma das cinco filhas de um espirituoso mas imprudente senhor, no entanto, é um novo tipo de heroína, que não precisará de estereótipos femininos para conquistar o nobre Fitzwilliam Darcy e defender suas posições com perfeita lucidez de uma filósofa liberal da província. Lizzy é uma espécie de Cinderela esclarecida, iluminista, protofeminista.\nNeste livro, Jane Austen faz também uma crítica à futilidade das mulheres na voz dessa admirável heroína - recompensada, ao final, com uma felicidade que não lhe parecia possível na classe em que nasceu.', 1, '2025-12-14 13:35:19', '2025-12-14 17:13:29', 0, 10, '2025-12-14 17:13:29'),
	(5, 'O Diário de Anne Frank', 'Anne Frank', 'Autobiografia', 'Principis', 2020, '6550970407', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41ujmhW4HNL._SY445_SX342_ML2_.jpg', '14+', 'Uma poderosa lembrança dos horrores de uma guerra, um testemunho eloquente do espírito humano. Assim podemos descrever os relatos feitos por Anne em seu diário. Isolados do mundo exterior, os Frank enfrentaram a fome, o tédio e a terrível realidade do confinamento, além da ameaça constante de serem descobertos. Nas páginas de seu diário, Anne Frank registra as impressões sobre esse longo período no esconderijo. Alternando momentos de medo e alegria, as anotações se mostram um fascinante relato sobre a coragem e a fraqueza humanas e, sobretudo, um vigoroso autorretrato de uma menina sensível e determinada.', 1, '2025-12-14 14:20:00', '2025-12-14 17:25:57', 0, 1, '2025-12-14 17:25:57'),
	(6, 'Diário de um Banana 1', 'Jeff Kinney', 'Ficção', 'VR Editora', 2008, '8576831309', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41gBzGDn3XL._SY445_SX342_ML2_.jpg', 'Livre', 'Não é fácil ser criança. E ninguém sabe disso melhor do que Greg Heffley, que se vê mergulhado no mundo do ensino fundamental, onde fracotes são obrigados a dividir os corredores com garotos mais altos, mais malvados e que já se barbeiam. Em Diário de um Banana, o autor e ilustrados Jeff Kinney nos apresenta um herói improvável. Como Greg diz em seu diário. Só não espere que seja todo Querido Diário isso, Querido Diário aquilo. Para nossa sorte, o que Greg Heffley diz que fará e o que ele realmente faz são duas coisas bem diferentes.', 1, '2025-12-14 17:55:24', '2025-12-15 09:12:44', 0, 4, '2025-12-15 09:12:44'),
	(7, 'O menino do pijama listrado', 'John Boyne', 'Ficção', 'Seguinte', 2007, '853591112X', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41lCCL6N4nL._SY445_SX342_ML2_.jpg', '12+', 'Bruno tem nove anos e não sabe nada sobre o Holocausto e a Solução Final contra os judeus. Também não faz idéia que seu país está em guerra com boa parte da Europa, e muito menos que sua família está envolvida no conflito. Na verdade, Bruno sabe apenas que foi obrigado a abandonar a espaçosa casa em que vivia em Berlim e a mudar-se para uma região desolada, onde ele não tem ninguém para brincar nem nada para fazer. Da janela do quarto, Bruno pode ver uma cerca, e para além dela centenas de pessoas de pijama, que sempre o deixam com frio na barriga.\nEm uma de suas andanças Bruno conhece Shmuel, um garoto do outro lado da cerca que curiosamente nasceu no mesmo dia que ele. Conforme a amizade dos dois se intensifica, Bruno vai aos poucos tentando elucidar o mistério que ronda as atividades de seu pai. O menino do pijama listrado é uma fábula sobre amizade em tempos de guerra, e sobre o que acontece quando a inocência é colocada diante de um monstro terrível e inimaginável.', 1, '2025-12-15 08:40:33', '2025-12-15 08:40:33', 0, 0, NULL),
	(8, 'Calibã e a Bruxa: Mulheres, Corpos e Acumulação Primitiva', 'Silvia Federici', 'Ciências Sociais', 'Editora Elefante', 2019, '8593115039', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/71ZYS4nfw7L._SY522_.jpg', '12+', 'As acadêmicas feministas desenvolveram um esquema interpretativo que lança bastante luz sobre duas questões históricas muito importantes: como explicar a execução de centenas de milhares de "bruxas" no começo da Era Moderna, e por que o surgimento do capitalismo coincide com essa guerra contra as mulheres. Segundo esse esquema, a caça às bruxas buscou destruir o controle que as mulheres haviam exercido sobre sua própria função reprodutiva, e preparou o terreno para o desenvolvimento de um regime patriarcal mais opressor. Essa interpretação também defende que a caça às bruxas tinha raízes nas transformações sociais que acompanharam o surgimento do capitalismo. No entanto, as circunstâncias históricas específicas em que a perseguição às bruxas se desenvolveu ― e as razões pelas quais o surgimento do capitalismo exigiu um ataque genocida contra as mulheres ― ainda não tinham sido investigadas. Essa é a tarefa que empreendo em Calibã e a bruxa, começando pela análise da caça às bruxas no contexto das crises demográfica e econômica europeias dos séculos XVI e XVII e das políticas de terra e trabalho da época mercantilista. Meu esforço aqui é apenas um esboço da pesquisa que seria necessária para esclarecer as conexões mencionadas e, especialmente, a relação entre a caça às bruxas e o desenvolvimento contemporâneo de uma nova divisão sexual do trabalho que confinou as mulheres ao trabalho reprodutivo. No entanto, convém demonstrar que a perseguição às bruxas ― assim como o tráfico de escravos e os cercamentos ― constituiu um aspecto central da acumulação e da formação do proletariado moderno, tanto na Europa como no Novo Mundo. ― Silvia Federici', 1, '2025-12-15 08:45:27', '2025-12-15 08:45:27', 0, 0, NULL),
	(9, 'Cartas de amor aos mortos', 'Ava Dellaira', 'Romance', 'Seguinte', 2014, '8565765415', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41jdKstktWL._SY445_SX342_ML2_.jpg', '14+', 'Prestes a começar o ensino médio, Laurel decide mudar de escola para não ter que encarar as pessoas comentando sobre a morte de sua irmã mais velha, May. A rotina no novo colégio não está fácil, e, para completar, a professora de inglês passa uma tarefa nada usual: escrever uma carta para alguém que já morreu. Laurel começa a escrever em seu caderno várias mensagens para Kurt Cobain, Janis Joplin, Amy Winehouse, Elizabeth Bishop… sem nunca entregá-las à professora. Nessas cartas, ela analisa a história de cada uma dessas personalidades e tenta desvendar os mistérios que envolvem suas mortes. Ao mesmo tempo, conta sua própria vida, como as amizades no novo colégio e seu primeiro amor: um garoto misterioso chamado Sky. Mas Laurel não pode escapar de seu passado. Só quando ela escrever a verdade sobre o que se passou com ela e com a irmã é que poderá aceitar o que aconteceu e perdoar May e a si mesma. E só quando enxergar a irmã como realmente era - encantadora e incrível, mas imperfeita como qualquer um - é que poderá seguir em frente e descobrir seu próprio caminho. “Uma história brilhante sobre a coragem necessária para continuar vivendo depois que nosso mundo desmorona. Uma celebração comovente do amor, da amizade e da família.” - Laurie Halse Anderson, autora de Fale! “Assim como Kurt, Janis, Amelia e outros que já se foram mas de algum jeito permanecem aqui, Cartas de amor aos mortos deixa uma marca indelével.” - Gayle Forman, autora de Se eu ficar', 1, '2025-12-15 08:49:54', '2025-12-15 08:49:54', 0, 0, NULL),
	(10, 'Os sete maridos de Evelyn Hugo', 'Taylor Jenkins Reid', 'Romance', 'Paralela', 2019, '8584391509', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/91yEPgRcELL._SY425_.jpg', '18+', 'Lendária estrela de Hollywood, Evelyn Hugo sempre esteve sob os holofotes ― seja estrelando uma produção vencedora do Oscar, protagonizando algum escândalo ou aparecendo com um novo marido… pela sétima vez. Agora, prestes a completar oitenta anos e reclusa em seu apartamento no Upper East Side, a famigerada atriz decide contar a própria história ― ou sua “verdadeira história” ―, mas com uma condição: que Monique Grant, jornalista iniciante e até então desconhecida, seja a entrevistadora. Ao embarcar nessa misteriosa empreitada, a jovem repórter começa a se dar conta de que nada é por acaso ― e que suas trajetórias podem estar profunda e irreversivelmente conectadas.\n\n“Evelyn Hugo faz Elizabeth Taylor parecer sem graça. Você vai rir com ela, chorar, sofrer, e então voltar para a primeira página e fazer tudo de novo.” ― Heather Cocks e Jessica Morgan, autoras de The Royal We', 1, '2025-12-15 08:57:37', '2025-12-15 08:57:37', 0, 0, NULL),
	(11, 'De volta aos anos 90', 'Maurene Goo', 'Fantasia', 'Seguinte', 2023, '8555342759', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/61jvgVDwKtL._SY445_SX342_ML2_.jpg', '14+', 'Samantha King está prestes a terminar o ensino médio. A pressão sobre o futuro não é nada perto das brigas com a mãe, Priscilla, que desaprova todas as suas escolhas. Após uma discussão, Samantha pede um carro de aplicativo que a transporta no tempo direto para os anos 90 ― mais especificamente, para a adolescência de sua mãe.\nNessa nova realidade, Sam precisa se adaptar a um mundo com pouca tecnologia, roupas estranhas e preconceitos menos velados, enquanto tenta ajudar sua mãe a impedir um trauma que a marcou pelo resto da vida. Como se tudo isso já não fosse o suficiente, Sam ainda precisa lidar com seus próprios sentimentos amorosos, que atravessam as épocas.\nEntre calças jeans de cintura baixa e celulares sem internet, Maurene Goo nos apresenta o romance perfeito sobre relações familiares e como às vezes precisamos chegar nos lugares mais inusitados para descobrir quem somos ― e quem queremos nos tornar.', 1, '2025-12-15 09:05:02', '2025-12-15 09:12:05', 0, 2, '2025-12-15 09:12:05'),
	(12, 'O iluminado', 'Stephen King', 'Terror', 'Suma', 2012, '8581050484', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/8147kKLLvOL._SY425_.jpg', '12+', 'O romance, magistralmente levado ao cinema por Stanley Kubrick, continua apaixonando (e aterrorizando) novas gerações de leitores. A luta assustadora entre dois mundos. Um menino e o desejo assassino de poderosas forças malignas. Uma família refém do mal. Nesta guerra sem testemunhas, vencerá o mais forte. Danny Torrance não é um menino comum. É capaz de ouvir pensamentos e transportar-se no tempo. Danny é iluminado. Será uma maldição ou uma bênção? A resposta pode estar guardada na imponência assustadora do hotel Overlook. Em O iluminado, quando Jack Torrance consegue o emprego de zelador no velho hotel, todos os problemas da família parecem estar solucionados. Não mais o desemprego e as noites de bebedeiras. Não mais o sofrimento da esposa, Wendy. Tranquilidade e ar puro para o pequeno Danny livrar-se das convulsões que assustam a família. Só que o Overlook não é um hotel comum. O tempo esqueceu-se de enterrar velhos ódios e de cicatrizar antigas feridas, e espíritos malignos ainda residem nos corredores. O hotel é uma chaga aberta de ressentimento e desejo de vingança. É uma sentença de morte. E somente os poderes de Danny podem fazer frente à disseminação do mal.', 1, '2025-12-15 09:11:02', '2025-12-15 09:11:02', 0, 0, NULL),
	(13, 'A Bela e a Fera', 'Gabrielle de Villeneuve', 'Infantil', 'Ciranda Cultural', 2020, '8538093355', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/91ypfDztn9L._SY425_.jpg', 'Livre', 'Bela é a filha caçula de um comerciante que passa por dificuldades financeiras, até que uma oportunidade aparece e ele parte em uma viagem a trabalho. Ao perguntar para as filhas o que desejavam de presente quando retornasse, Bela é a única que pede algo singelo ao pai: uma rosa. Durante a jornada o comerciante se abriga em um castelo e se depara com as rosas mais lindas que já encontrara. Quando ele colhe uma flor, uma horrível fera aparece furiosa e reivindica uma das filhas do comerciante como forma de reparar o roubo. Corajosamente, Bela se voluntaria e se torna prisioneira da terrível Fera em seu lindo castelo.', 1, '2025-12-15 09:16:09', '2025-12-15 09:16:09', 0, 0, NULL),
	(14, 'Harry Potter e a Pedra Filosofal: 1', 'J.K. Rowling', 'Fantasia', 'Rocco', 2017, '8532530788', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_ML2_.jpg', '10+', 'Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. Até os 10 anos, Harry foi uma espécie de gata borralheira: maltratado pelos tios, herdava roupas velhas do primo gorducho, tinha óculos remendados e era tratado como um estorvo. No dia de seu aniversário de 11 anos, entretanto, ele parece deslizar por um buraco sem fundo, como o de Alice no país das maravilhas, que o conduz a um mundo mágico. Descobre sua verdadeira história e seu destino: ser um aprendiz de feiticeiro até o dia em que terá que enfrentar a pior força do mal, o homem que assassinou seus pais. O menino de olhos verde, magricela e desengonçado, tão habituado à rejeição, descobre, também, que é um herói no universo dos magos. Potter fica sabendo que é a única pessoa a ter sobrevivido a um ataque do tal bruxo do mal e essa é a causa da marca em forma de raio que ele carrega na testa. Ele não é um garoto qualquer, ele sequer é um feiticeiro qualquer ele é Harry Potter, símbolo de poder, resistência e um líder natural entre os sobrenaturais. A fábula, recheada de fantasmas, paredes que falam, caldeirões, sapos, unicórnios, dragões e gigantes, não é, entretanto, apenas um passatempo.', 1, '2025-12-15 09:28:05', '2025-12-15 09:28:05', 0, 0, NULL),
	(15, 'Dom Quixote', 'Miguel de Cervantes', 'Romance', 'Literatus', 2025, '6585765338', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/71gjGvmLXKL._SY425_.jpg', '12+', 'Influenciado pelas gloriosas histórias de cavalaria, um homem já de idade avançada resolve se aventurar pelo mundo montado em um pangaré e em companhia de um simples camponês. Nesta adaptação, as aventuras de Dom Quixote e Sancho Pança exaltam a essência do Cavaleiro da Triste Figura.', 1, '2025-12-15 09:34:42', '2025-12-15 09:34:42', 0, 0, NULL),
	(16, '1984', 'George Orwell', 'Ficção', 'Principis', 2021, '6555522267', 'Português', 'Físico', 'https://m.media-amazon.com/images/I/61t0bwt1s3L._SY425_.jpg', '16+', 'Publicado em 1949, o texto de Orwell nasceu destinado à polêmica. Traduzido em mais de sessenta países, virou minissérie, filmes, quadrinhos, mangás e até uma ópera. Ganhou holofotes em 1999, quando uma produtora holandesa batizou seu reality show de Big Brother. 1984 foi responsável pela popularização de muitos termos e conceitos, como Grande Irmão, duplopensar, novidioma, buraco da memória e 2 2 5. O trabalho de Winston, o herói de 1984, é reescrever artigos de jornais do passado, de modo que o registro histórico sempre apoie a ideologia do Partido. Grande parte do Ministério também destrói os documentos que não foram revisados, dessa forma não há como provar que o governo esteja mentindo. Winston é um trabalhador diligente e habilidoso, mas odeia secretamente o Partido e sonha com a rebelião contra o Grande Irmão.', 1, '2025-12-15 09:38:00', '2025-12-15 09:38:00', 0, 0, NULL);

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

-- Copiando dados para a tabela bdbibliotec.reservas: ~2 rows (aproximadamente)
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

-- Copiando dados para a tabela bdbibliotec.reserva_itens: ~2 rows (aproximadamente)
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

-- Copiando dados para a tabela bdbibliotec.usuarios: ~4 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `token_verificacao`, `expiracao_token`, `criado_em`, `email_verificado`, `email_confirmado`, `reset_token`, `reset_token_expires`) VALUES
	(9, 'Vitor Pimentel', '33575843791', 'vitorpimentel@gmail.com', 'vitor1234', '2009-05-04', '(55) 46754-7457', 'Técnico em Eletrônica', 'Aluno', NULL, NULL, '2025-12-08', 0, 0, NULL, NULL),
	(13, 'Lorena Marques da Silva', '50125092857', 'llomarques1103@gmail.com', '12345678', '2007-03-11', '(11) 96783-0824', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-09', 0, 0, NULL, NULL),
	(19, 'Nicolly Nicastro', '45754165099', 'nickk45@gmail.com', 'nicastrocolly', '2008-05-05', '(11) 96723-3452', 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-12', 0, 0, NULL, NULL),
	(21, 'Gabriel Lopes da Silva', '56367925066', 'gabriel0w0@yahoo.com', '12345678', '2006-04-23', NULL, 'Técnico em Desenvolvimento de Sistemas', 'Aluno', NULL, NULL, '2025-12-12', 0, 0, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
