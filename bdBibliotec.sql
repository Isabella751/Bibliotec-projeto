-- ===========================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ===========================================================
CREATE DATABASE IF NOT EXISTS bdBibliotec;
USE bdBibliotec;

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
  celular VARCHAR(20) NULL,
  curso VARCHAR(100) NOT NULL,
  perfil ENUM('Aluno', 'Admin') DEFAULT 'Aluno',
  criado_em DATE DEFAULT CURRENT_DATE
);

-- ===========================================================
-- TABELA DE ADMINS
-- ===========================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL, 
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  celular VARCHAR(20) NOT NULL,
  criado_em DATE DEFAULT CURRENT_DATE
);

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
    classificacao ENUM('Livre', '10+', '12+', '14+', '16+', '18+') DEFAULT 'Livre',
    sinopse TEXT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


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


-- ===========================================================
-- TABELA DE EMPRÉSTIMOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT(CURRENT_DATE),
    data_devolução DATE NOT NULL,
    status_emprestimo ENUM('Emprestado', 'Devolvido', 'Atrasado') DEFAULT 'Emprestado',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


-- ===========================================================
-- TABELA DE ITENS DO EMPRÉSTIMO
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


-- ===========================================================
-- TABELA DE HISTORICO
-- ===========================================================
CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
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

