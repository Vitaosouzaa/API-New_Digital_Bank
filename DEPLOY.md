# 🚀 Guia de Deploy no Vercel

## ✅ CORREÇÕES IMPLEMENTADAS

Todas as correções críticas foram aplicadas:

- ✅ **index.ts**: Porta dinâmica, DB inicializa antes das rotas, exporta para Vercel
- ✅ **vercel.json**: Configuração correta para API Node.js com TypeScript
- ✅ **database/index.ts**: Suporte a PostgreSQL/MySQL para produção (SQLite apenas dev)
- ✅ **UserService.ts**: JWT secret via variável de ambiente
- ✅ **verifyAuth.ts**: JWT secret via variável de ambiente, validação melhorada
- ✅ **UserController**: Try-catch, validações, tratamento de erros
- ✅ **LoginController**: Validações, retorna 401 para credenciais inválidas
- ✅ **routes.ts**: Middleware de erro global, rotas reorganizadas
- ✅ **Validações**: Email regex, senha mínima 6 caracteres
- ✅ **404 Handler**: Rotas não encontradas retornam 404

---

## 📋 PRÉ-REQUISITOS PARA DEPLOY

### 1. Conta no Vercel
- Criar conta em: https://vercel.com
- Conectar com seu GitHub

### 2. Banco de Dados em Produção

⚠️ **IMPORTANTE**: SQLite NÃO funciona no Vercel (sistema de arquivos read-only).

Você precisa usar um banco de dados externo. Opções recomendadas:

#### Opção A: **Neon** (PostgreSQL Serverless - GRÁTIS)
```bash
# 1. Criar conta: https://neon.tech
# 2. Criar novo projeto
# 3. Copiar a CONNECTION STRING
```

#### Opção B: **Supabase** (PostgreSQL - GRÁTIS)
```bash
# 1. Criar conta: https://supabase.com
# 2. Criar novo projeto
# 3. Ir em Settings > Database
# 4. Copiar a Connection String
```

#### Opção C: **PlanetScale** (MySQL Serverless - GRÁTIS)
```bash
# 1. Criar conta: https://planetscale.com
# 2. Criar novo database
# 3. Copiar a CONNECTION STRING
```

#### Opção D: **Railway** (PostgreSQL/MySQL - GRÁTIS)
```bash
# 1. Criar conta: https://railway.app
# 2. Criar novo projeto PostgreSQL
# 3. Copiar a CONNECTION STRING
```

---

## 🗂️ PASSO 1: Preparar o Repositório

### 1.1 Criar arquivo `.env` local

```bash
# Na raiz do projeto
cp .env.example .env
```

Edite o `.env`:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=minha_chave_super_secreta_123
FRONTEND_URL=http://localhost:5173
```

### 1.2 Adicionar `.env` ao `.gitignore`

Certifique-se de que `.env` está no `.gitignore`:

```
# .gitignore
node_modules/
.env
build/
dist/
*.sqlite
```

### 1.3 Instalar dependência do PostgreSQL (se usar Neon/Supabase)

```bash
npm install pg
```

### 1.4 Commit e Push

```bash
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

---

## 🌐 PASSO 2: Deploy no Vercel

### 2.1 Importar Projeto

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `API-BancoOk`
4. Clique em **"Import"**

### 2.2 Configurar Variáveis de Ambiente

Na tela de configuração do projeto, vá em **"Environment Variables"**:

| Name | Value | Environment |
|------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `JWT_SECRET` | `sua_chave_secreta_MUITO_segura_aqui` | Production |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Production |
| `FRONTEND_URL` | `https://seu-frontend.vercel.app` | Production |

⚠️ **IMPORTANTE**: 
- Use uma JWT_SECRET forte (mínimo 32 caracteres)
- Use a CONNECTION STRING do banco de dados que você criou (Neon, Supabase, etc)

### 2.3 Configurar Build & Deploy

Vercel detecta automaticamente TypeScript. Mas você pode verificar:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 2.4 Deploy!

Clique em **"Deploy"** e aguarde!

---

## 🧪 PASSO 3: Testar o Deploy

### 3.1 Verificar se a API está funcionando

Após o deploy, o Vercel vai fornecer uma URL como:
```
https://api-banco-ok.vercel.app
```

Teste o health check:

```bash
curl https://api-banco-ok.vercel.app/
```

Resposta esperada:
```json
{
  "message": "API is running!",
  "environment": "production"
}
```

### 3.2 Testar o endpoint de registro

```bash
curl -X POST https://api-banco-ok.vercel.app/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 3.3 Testar o login

```bash
curl -X POST https://api-banco-ok.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

Deve retornar um token JWT.

---

## 🔍 PASSO 4: Verificar Logs

Se algo der errado:

1. Acesse o dashboard do Vercel
2. Vá em **"Deployments"**
3. Clique no deployment mais recente
4. Vá em **"Functions"** > **"src/index.ts"**
5. Clique em **"View Logs"**

---

## 🗄️ PASSO 5: Rodar Migrações (Primeira Vez)

Se você estiver usando um banco de dados novo, precisa criar as tabelas.

### Opção A: Rodar Migrações Localmente

```bash
# No seu .env local, adicione a DATABASE_URL de produção temporariamente
DATABASE_URL=postgresql://...

# Rodar migrations
npm run migration:run
```

### Opção B: Usar `synchronize: true` (APENAS PRIMEIRA VEZ!)

No [database/index.ts](src/database/index.ts), temporariamente mude:

```typescript
synchronize: true, // ⚠️ APENAS PARA CRIAR TABELAS INICIAIS
```

Depois do primeiro deploy bem-sucedido, volte para:

```typescript
synchronize: false, // ✅ Sempre false em produção
```

---

## 🔄 Redeploys Automáticos

Após o primeiro deploy, **cada push** para a branch `main` vai fazer um redeploy automático!

```bash
git add .
git commit -m "feat: nova feature"
git push origin main
```

O Vercel vai automaticamente:
1. Detectar o push
2. Fazer build
3. Rodar testes (se configurado)
4. Fazer deploy

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "Cannot find module 'pg'"

**Solução**: Instale o driver do PostgreSQL
```bash
npm install pg
```

### Erro: "Database connection failed"

**Soluções**:
1. Verifique se a `DATABASE_URL` está correta no Vercel
2. Certifique-se de que o banco de dados está acessível publicamente
3. Verifique se o SSL está configurado corretamente

### Erro: "ECONNREFUSED" ou timeout

**Solução**: O Vercel pode estar bloqueando a conexão. Use um banco serverless como Neon ou Supabase.

### Erro: "Token invalid" mesmo com token correto

**Solução**: Verifique se a `JWT_SECRET` no Vercel é a mesma usada para gerar o token.

### Erro 500 em todas as rotas

**Soluções**:
1. Verificar logs no Vercel
2. Verificar se o banco de dados está conectando
3. Verificar se todas as variáveis de ambiente estão configuradas

---

## 📊 MONITORAMENTO

### Logs em Tempo Real

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Ver logs em tempo real
vercel logs
```

### Analytics

O Vercel fornece analytics grátis:
- Número de requests
- Tempo de resposta
- Erros

Acesse em: **Dashboard > Analytics**

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### ✅ Checklist de Segurança

- [ ] JWT_SECRET forte (mínimo 32 caracteres aleatórios)
- [ ] `synchronize: false` no TypeORM (produção)
- [ ] CORS configurado apenas para seu frontend
- [ ] Variáveis de ambiente nunca no código
- [ ] HTTPS habilitado (Vercel faz automaticamente)
- [ ] Rate limiting (considerar adicionar)
- [ ] Validação de inputs em todos os endpoints
- [ ] Senhas com hash (⚠️ IMPLEMENTAR bcrypt!)

### ⚠️ TODO: Implementar Hash de Senhas

Atualmente as senhas estão em texto plano. **URGENTE para produção:**

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

---

## 🎯 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. **Implementar hash de senhas** (bcrypt)
2. **Adicionar rate limiting** (express-rate-limit)
3. **Configurar domínio customizado** no Vercel
4. **Adicionar monitoramento** (Sentry, LogRocket)
5. **Implementar refresh tokens**
6. **Adicionar testes E2E**
7. **Configurar CI/CD** (GitHub Actions)

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verificar logs no Vercel
2. Testar localmente com `NODE_ENV=production`
3. Verificar documentação do Vercel: https://vercel.com/docs

---

## 🎉 SUCESSO!

Se tudo deu certo, sua API está no ar! 🚀

**URL da API**: `https://seu-projeto.vercel.app`

Agora você pode consumir essa API no seu frontend React!

---

**Desenvolvido com ❤️ por Vitor**
