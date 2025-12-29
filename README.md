# API BancoOk

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FF4716?style=for-the-badge&logo=typeorm&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Modelos de Dados](#modelos-de-dados)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Padrões de Resposta](#padrões-de-resposta)
- [Contribuindo](#contribuindo)

---

## 📖 Sobre o Projeto

**API BancoOk** é uma API RESTful desenvolvida em TypeScript para gerenciamento de usuários com sistema completo de autenticação JWT. O projeto implementa as melhores práticas de desenvolvimento, incluindo arquitetura em camadas, testes unitários e tipagem estática.

### Principais Características

- ✅ Autenticação JWT (JSON Web Token)
- ✅ CRUD completo de usuários
- ✅ Validação de dados
- ✅ Arquitetura em camadas (Controller → Service → Repository)
- ✅ Testes unitários com Jest
- ✅ TypeORM para gerenciamento de banco de dados
- ✅ SQLite como banco de dados
- ✅ Middleware de autenticação
- ✅ Tratamento de erros padronizado
- ✅ CORS habilitado

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas, promovendo separação de responsabilidades e facilitando manutenção:

```
┌─────────────────┐
│   Controllers   │  ← Recebe requisições HTTP
└────────┬────────┘
         │
┌────────▼────────┐
│    Services     │  ← Lógica de negócio
└────────┬────────┘
         │
┌────────▼────────┐
│  Repositories   │  ← Acesso aos dados
└────────┬────────┘
         │
┌────────▼────────┐
│    Database     │  ← SQLite
└─────────────────┘
```

### Camadas

- **Controllers**: Gerenciam requisições HTTP e respostas
- **Services**: Contém a lógica de negócio e validações
- **Repositories**: Interface com o banco de dados
- **Entities**: Modelos de dados do TypeORM
- **Middleware**: Interceptadores (autenticação, validação)
- **Utils**: Funções auxiliares (respostas HTTP padronizadas)

---

## 🚀 Tecnologias Utilizadas

### Core

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Express](https://expressjs.com/)** - Framework web minimalista

### Banco de Dados

- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript
- **[SQLite](https://www.sqlite.org/)** - Banco de dados relacional leve
- **[Reflect Metadata](https://www.npmjs.com/package/reflect-metadata)** - Suporte a decorators

### Autenticação

- **[JSON Web Token (JWT)](https://jwt.io/)** - Tokens de autenticação

### Testes

- **[Jest](https://jestjs.io/)** - Framework de testes
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - Preprocessador TypeScript para Jest

### Ferramentas de Desenvolvimento

- **[ts-node-dev](https://www.npmjs.com/package/ts-node-dev)** - Recarga automática durante desenvolvimento
- **[tsx](https://github.com/esbuild-kit/tsx)** - Executor TypeScript rápido
- **[CORS](https://www.npmjs.com/package/cors)** - Middleware para habilitar CORS

---

## 📁 Estrutura do Projeto

```
API-BancoOk/
│
├── build/                          # Arquivos compilados (JavaScript)
│   ├── index.js
│   └── index.d.ts
│
├── src/                            # Código fonte TypeScript
│   ├── __mocks__/                  # Mocks para testes
│   │   ├── mockEntityManager.mock.ts
│   │   ├── mockRequest.mock.ts
│   │   └── mockResponse.mock.ts
│   │
│   ├── controllers/                # Controladores HTTP
│   │   ├── LoginController.ts      # Gerencia autenticação
│   │   ├── UserController.ts       # Gerencia CRUD de usuários
│   │   └── UserController.spec.ts  # Testes do UserController
│   │
│   ├── database/                   # Configuração do banco de dados
│   │   ├── index.ts                # Configuração do DataSource
│   │   └── migrations/             # Migrações do banco
│   │       └── 1765799286480-User.ts
│   │
│   ├── entities/                   # Entidades TypeORM
│   │   └── User.ts                 # Modelo de usuário
│   │
│   ├── interfaces/                 # Interfaces TypeScript
│   │   └── IUser.ts                # Interface de usuário
│   │
│   ├── middleware/                 # Middlewares
│   │   └── verifyAuth.ts           # Verificação de autenticação JWT
│   │
│   ├── models/                     # Modelos de dados
│   │   └── http-response.ts        # Interface de resposta HTTP
│   │
│   ├── repositories/               # Repositórios de dados
│   │   ├── user-repositories.ts    # Repositório de usuários
│   │   └── UserRepository.spec.ts  # Testes do repositório
│   │
│   ├── services/                   # Lógica de negócio
│   │   ├── UserService.ts          # Serviço de usuários
│   │   └── UserService.spec.ts     # Testes do serviço
│   │
│   ├── utils/                      # Utilitários
│   │   └── http-helper.ts          # Helpers para respostas HTTP
│   │
│   ├── index.ts                    # Entrada da aplicação
│   └── routes.ts                   # Definição de rotas
│
├── jest.config.ts                  # Configuração do Jest
├── tsconfig.json                   # Configuração do TypeScript
├── package.json                    # Dependências e scripts
└── README.md                       # Este arquivo
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** >= 16.x
- **npm** ou **yarn**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd API-BancoOk
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente** (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=5000
JWT_SECRET=123456789
```

4. **Execute as migrações do banco de dados**

```bash
npm run migration:run
```

5. **Inicie o servidor**

**Modo de desenvolvimento (com hot reload):**

```bash
npm run dev
```

**Modo watch com tsx:**

```bash
npm run start:watch
```

**Modo produção:**

```bash
npm run build
npm start
```

O servidor estará rodando em: **http://localhost:5000**

---

## 🌐 Endpoints da API

### Base URL

```
http://localhost:5000
```

### 1. Health Check

Verifica se a API está funcionando.

**Endpoint:**

```
GET /
```

**Resposta de Sucesso (200):**

```json
{
  "message": "API is running!"
}
```

---

### 2. Criar Usuário

Cria um novo usuário no sistema.

**Endpoint:**

```
POST /user
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (201):**

```json
{
  "message": "User created successfully"
}
```

**Respostas de Erro:**

- **400 Bad Request** - Campos obrigatórios faltando

```json
{
  "message": "Bad Request: Todos os campos são Obrigatórios"
}
```

- **409 Conflict** - Email já cadastrado

```json
{
  "message": "Email already registered"
}
```

---

### 3. Login

Autentica um usuário e retorna um token JWT.

**Endpoint:**

```
POST /login
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro (500):**

```json
{
  "message": "Error !Credentials invalid!!"
}
```

---

### 4. Buscar Usuário

Retorna os dados de um usuário específico. **Requer autenticação.**

**Endpoint:**

```
GET /user/:userId
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parâmetros de URL:**

- `userId` (string) - ID do usuário

**Exemplo:**

```
GET /user/123e4567-e89b-12d3-a456-426614174000
```

**Resposta de Sucesso (200):**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Respostas de Erro:**

- **401 Unauthorized** - Token inválido ou ausente

```json
{
  "message": "Invalid token"
}
```

---

### 5. Deletar Usuário

Remove um usuário do sistema.

**Endpoint:**

```
DELETE /user
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "User deleted successfully"
}
```

**Respostas de Erro:**

- **400 Bad Request** - user_id não fornecido

```json
{
  "message": "user_id é obrigatório"
}
```

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

### Como Funciona

1. **Login**: O usuário envia email e senha para `/login`
2. **Token**: A API retorna um token JWT válido
3. **Uso**: O token deve ser incluído no header `Authorization` em todas as requisições protegidas

### Formato do Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estrutura do Token

O token JWT contém:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "sub": "123e4567-e89b-12d3-a456-426614174000"
}
```

- `name`: Nome do usuário
- `email`: Email do usuário
- `sub`: ID do usuário (subject)

### Rotas Protegidas

As seguintes rotas requerem autenticação:

- `GET /user/:userId` - Buscar usuário

### Secret do Token

⚠️ **IMPORTANTE**: Em produção, altere o secret do token no arquivo [verifyAuth.ts](src/middleware/verifyAuth.ts) e [UserService.ts](src/services/UserService.ts):

```typescript
const tokenKey = "SUA_CHAVE_SECRETA_SEGURA";
```

Recomenda-se usar uma variável de ambiente:

```typescript
const tokenKey = process.env.JWT_SECRET || "default-secret";
```

---

## 💾 Modelos de Dados

### User Entity

Entidade principal do sistema, armazenada na tabela `users`.

**Arquivo:** [User.ts](src/entities/User.ts)

```typescript
{
  user_id: string;      // UUID gerado automaticamente
  name: string;         // Nome do usuário (obrigatório)
  email: string;        // Email único (obrigatório)
  password: string;     // Senha em texto plano (obrigatório)
}
```

**Exemplo:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

⚠️ **Nota de Segurança**: A senha é armazenada em texto plano. Em produção, recomenda-se usar bcrypt ou outra biblioteca para hash de senhas.

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor com hot reload (ts-node-dev)
npm run dev

# Iniciar servidor com tsx watch
npm run start:watch
```

### Produção

```bash
# Compilar TypeScript para JavaScript
npm run build

# Iniciar servidor em produção
npm start
```

### Testes

```bash
# Executar todos os testes
npm test
```

### Banco de Dados

```bash
# Executar migrações pendentes
npm run migration:run

# Reverter última migração
npm run migration:revert

# Criar nova migração
npm run migration:create
```

### TypeORM CLI

```bash
# Acessar CLI do TypeORM
npm run typeorm
```

---

## 🧪 Testes

O projeto utiliza **Jest** para testes unitários.

### Estrutura de Testes

- **Controladores**: [UserController.spec.ts](src/controllers/UserController.spec.ts)
- **Serviços**: [UserService.spec.ts](src/services/UserService.spec.ts)
- **Repositórios**: [UserRepository.spec.ts](src/repositories/UserRepository.spec.ts)

### Executar Testes

```bash
npm test
```

### Mocks

Os mocks estão localizados em [__mocks__](src/__mocks__/):

- `mockEntityManager.mock.ts` - Mock do EntityManager do TypeORM
- `mockRequest.mock.ts` - Mock de Request do Express
- `mockResponse.mock.ts` - Mock de Response do Express

### Configuração

A configuração do Jest está em [jest.config.ts](jest.config.ts).

**Principais configurações:**

- **Preset**: `ts-jest`
- **TestEnvironment**: `node`
- **ClearMocks**: `true` - Limpa mocks automaticamente
- **CoverageProvider**: `v8`

---

## 🌍 Variáveis de Ambiente

Embora o projeto não use um arquivo `.env` por padrão, você pode configurá-lo adicionando as seguintes variáveis:

```env
# Porta do servidor
PORT=5000

# Secret do JWT
JWT_SECRET=sua_chave_secreta_aqui

# Configuração do banco de dados
DB_PATH=./src/database/db.sqlite
```

Para usar variáveis de ambiente, modifique os arquivos:

- [index.ts](src/index.ts) - Porta do servidor
- [verifyAuth.ts](src/middleware/verifyAuth.ts) - Secret do JWT
- [UserService.ts](src/services/UserService.ts) - Secret do JWT
- [database/index.ts](src/database/index.ts) - Caminho do banco

---

## 📊 Padrões de Resposta

A API utiliza helpers padronizados para respostas HTTP, localizados em [http-helper.ts](src/utils/http-helper.ts).

### Códigos de Status

| Código | Função        | Descrição                  |
| ------ | ------------- | -------------------------- |
| 200    | `ok()`        | Sucesso                    |
| 201    | `created()`   | Recurso criado com sucesso |
| 204    | `noContent()` | Sem conteúdo               |
| 400    | `badRequest()`| Requisição inválida        |
| 409    | `conflict()`  | Conflito (ex: email duplicado) |
| 500    | `serverError()` | Erro interno do servidor |

### Exemplo de Uso

```typescript
import * as HttpResponse from '../utils/http-helper';

// Sucesso
return HttpResponse.ok({ data: user });

// Criado
return HttpResponse.created({ message: "User created successfully" });

// Erro
return HttpResponse.badRequest({ message: "Invalid data" });
```

---

## 🛡️ Segurança

### Recomendações para Produção

1. **Hash de Senhas**: Implementar bcrypt para hash de senhas

```bash
npm install bcrypt @types/bcrypt
```

```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

2. **Variáveis de Ambiente**: Usar secrets seguros para JWT

```typescript
const tokenKey = process.env.JWT_SECRET;
```

3. **Validação de Dados**: Implementar validação robusta (ex: class-validator, joi)

4. **Rate Limiting**: Adicionar rate limiting para prevenir ataques

```bash
npm install express-rate-limit
```

5. **Helmet**: Adicionar headers de segurança

```bash
npm install helmet
```

6. **HTTPS**: Usar HTTPS em produção

7. **Sanitização**: Sanitizar inputs para prevenir SQL Injection (TypeORM já protege)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**

```bash
git checkout -b feature/MinhaFeature
```

3. **Commit suas mudanças**

```bash
git commit -m 'Adiciona MinhaFeature'
```

4. **Push para a branch**

```bash
git push origin feature/MinhaFeature
```

5. **Abra um Pull Request**

### Padrões de Código

- Use TypeScript
- Siga os padrões ESLint (se configurado)
- Escreva testes para novas features
- Documente mudanças significativas

---

## 📝 Licença

Este projeto está sob a licença **ISC**.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por Vitor

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.


---

## 📚 Recursos Adicionais

### Documentação das Tecnologias

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JWT.io](https://jwt.io/)

### Tutoriais Relacionados

- [TypeScript com Express](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeORM com SQLite](https://typeorm.io/data-source-options#sqlite-data-source-options)
- [Autenticação JWT em Node.js](https://jwt.io/introduction)

---

## ⚡ Performance

### Otimizações Implementadas

- TypeORM com eager/lazy loading configurável
- Separação de responsabilidades em camadas
- Uso de async/await para operações assíncronas
- SQLite para desenvolvimento rápido

### Recomendações para Escala

- Migrar para PostgreSQL ou MySQL para produção
- Implementar connection pooling
- Adicionar cache (Redis)
- Usar CDN para assets estáticos
- Implementar load balancing

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## 📈 Histórico de Versões

### v1.0.0 - Data Atual

- ✅ CRUD completo de usuários
- ✅ Autenticação JWT
- ✅ Testes unitários
- ✅ Arquitetura em camadas
- ✅ TypeORM com SQLite
- ✅ Middleware de autenticação

---

**🚀 Happy Coding!**
