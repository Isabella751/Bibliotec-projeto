-- ===========================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ===========================================================
CREATE DATABASE IF NOT EXISTS bdBibliotec;

-- ===========================================================
-- TABELA DE USUÁRIOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS usuarios (
	  id INT AUTO_INCREMENT PRIMARY KEY,
	  nome VARCHAR(100) NOT NULL,
	  cpf VARCHAR(11) UNIQUE NOT NULL, 
	  email VARCHAR(100) UNIQUE NOT NULL,
	  senha VARCHAR(100) NOT NULL,
	  data_nascimento DATE NOT NULL,
	  celular VARCHAR(20) NOT NULL,
	  curso VARCHAR(100) NULL,
	  perfil ENUM('Aluno', 'Admin', 'visitante') DEFAULT 'visitante',
	  criado_em DATE DEFAULT CURRENT_DATE
);

INSERT INTO usuarios (nome, cpf, email, senha, data_nascimento, celular, curso, perfil)
VALUES 
('João Silva', '12345678901', 'joao@gmail.com', 'senha123', '1998-05-12', '11999998888', 'Engenharia', 'Aluno'),
('Maria Oliveira', '98765432100', 'maria@gmail.com', 'senha456', '1997-07-20', '11988887777', 'Direito', 'Aluno'),
('Carlos Souza', '11122233344', 'carlos@gmail.com', 'senha789', '1995-02-10', '11977776666', 'Administração', 'Admin');


-- ===========================================================
-- TABELA DE LIVROS
-- ===========================================================
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    editora VARCHAR(100) NULL,
    ano_publicacao SMALLINT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    idioma VARCHAR(50) DEFAULT 'Português',
    formato ENUM('Físico', 'E-book', 'Audiobook') DEFAULT 'Físico',
    caminho_capa VARCHAR(255) NULL,
    sinopse TEXT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse)
VALUES
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', 'HarperCollins', 1954, '9780261102385', 'Português', 'Físico', '/capas/senhor-dos-aneis.jpg', 'A jornada épica para destruir o Um Anel.'),
('Dom Casmurro', 'Machado de Assis', 'Romance', 'Páginas', 1899, '9788525418933', 'Português', 'Físico', '/capas/dom-casmurro.jpg', 'A história de Bentinho e Capitu.'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Fantasia', 'Rocco', 1997, '9788532511401', 'Português', 'Físico', '/capas/harry-potter1.jpg', 'O início da saga de Harry Potter.');


-- ===========================================================
-- TABELA DE AVALIAÇÕES
-- ===========================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 0 AND nota <= 10),
    comentario TEXT,
    data_avaliacao DATE DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario)
VALUES
(1, 1, 10, 'Fantástico! Uma leitura obrigatória.'),
(2, 2, 9, 'Muito bom, clássico da literatura brasileira.'),
(3, 3, 8, 'Divertido e envolvente, recomendo para jovens.');


-- ===========================================================
-- TABELA DE RESERVAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_reserva DATE NOT NULL DEFAULT(CURRENT_DATE),
    data_devolucao DATE NOT NULL,
    status_reserva ENUM('Emprestado', 'Devolvido', 'Atrasado') DEFAULT 'Emprestado',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO reservas (usuario_id, data_reserva, data_devolucao, status_reserva)
VALUES
(1, '2025-11-26', '2025-12-15', 'Emprestado'),
(2, '2025-11-25', '2025-12-10', 'Emprestado'),
(3, '2025-11-20', '2025-12-05', 'Devolvido');


-- ===========================================================
-- TABELA DE ITENS DA RESERVA
-- ===========================================================
CREATE TABLE IF NOT EXISTS reserva_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_prevista DATE NOT NULL,
    data_devolvido DATE NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

INSERT INTO reserva_itens (reserva_id, livro_id, data_prevista, data_devolvido)
VALUES
(1, 1, '2025-12-10', NULL),
(1, 3, '2025-12-10', NULL),
(2, 2, '2025-12-05', NULL);


-- ===========================================================
-- TABELA DE HISTORICO
-- ===========================================================
CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_reserva DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    status_livro ENUM('Em andamento', 'No prazo', 'Em atraso', 'Perdido', 'Extraviado') DEFAULT 'Em andamento',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

-- ===========================================================
-- TABELA DE FAVORITOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_favoritado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);