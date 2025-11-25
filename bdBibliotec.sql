dblivrariabibliotecdblivraria
-- ===========================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ===========================================================
CREATE DATABASE IF NOT EXISTS dblivrariaBibliotec;
USE dblivrariaBibliotec;

-- ===========================================================
-- TABELA DE USUÁRIOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL, 
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  celular VARCHAR(20),
  curso VARCHAR(100),
  perfil ENUM('Aluno', 'Admin') DEFAULT 'Aluno',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE usuarios

-- ===========================================================
-- TABELA DE LIVROS
-- ===========================================================
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(100),
    editora VARCHAR(100),
    ano_publicacao SMALLINT,
    isbn VARCHAR(20),
    idioma VARCHAR(50) DEFAULT 'Português',
    formato ENUM('Físico', 'E-book', 'Audiobook') DEFAULT 'Físico',
    caminho_capa VARCHAR(255),
    sinopse TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE livros
-- ===========================================================
-- TABELA DE AVALIAÇÕES
-- ===========================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    nota DECIMAL(2,1) CHECK (nota >= 0 AND nota <= 10),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

DROP TABLE avaliacoes
-- ===========================================================
-- TABELA DE EMPRÉSTIMOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT(CURRENT_DATE),
    data_devolução DATE NULL,
    status_emprestimo ENUM('Emprestado', 'Devolvido', 'Atrasado') DEFAULT 'Emprestado',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

DROP TABLE emprestimos
-- ===========================================================
-- TABELA DE ITENS DO EMPRÉSTIMO
-- ===========================================================
CREATE TABLE IF NOT EXISTS emprestimo_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emprestimo_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_prevista DATE,
    data_devolvido DATE,
    FOREIGN KEY (emprestimo_id) REFERENCES emprestimos(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

DROP TABLE emprestimo_itens
-- ===========================================================
-- TABELA DE HISTORICO
-- ===========================================================
CREATE TABLE if NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_emprestimo DATE,
	 data_devolução DATE,
	 status_livro ENUM('Em andamento', 'No prazo', 'Em atraso', 'Perdido', 'Extraviado'),
	 FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

DROP TABLE historico
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

DROP TABLE favoritos