# 💰 Refund API

Uma API REST robusta para gerenciamento de reembolsos corporativos, desenvolvida com Node.js, TypeScript, Express e Prisma.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Autenticação](#autenticação)
- [Upload de Arquivos](#upload-de-arquivos)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

A **Refund API** é uma solução completa para gerenciamento de solicitações de reembolso em empresas. Permite que funcionários registrem despesas, façam upload de comprovantes e que gestores tenham controle total sobre as solicitações.

### Principais Características

- **Autenticação JWT** para segurança
- **Sistema de roles** (funcionário/gerente)
- **Upload de comprovantes** com validação
- **Paginação** e **filtros** avançados
- **Validação robusta** com Zod
- **Tratamento de erros** centralizado
- **Banco de dados PostgreSQL** com Prisma ORM

## ⚡ Funcionalidades

### 👥 Gestão de Usuários

- ✅ Cadastro de usuários
- ✅ Autenticação com JWT
- ✅ Sistema de roles (employee/manager)
- ✅ Criptografia de senhas com bcrypt

### 💸 Gestão de Reembolsos

- ✅ Criação de solicitações de reembolso
- ✅ Listagem com paginação e filtros
- ✅ Categorização por tipo de despesa
- ✅ Exclusão de reembolsos
- ✅ Associação com comprovantes

### 📎 Upload de Arquivos

- ✅ Upload de comprovantes
- ✅ Validação de tipos de arquivo
- ✅ Controle de acesso por role
- ✅ Armazenamento local organizado

## 🛠 Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional

### Segurança & Validação

- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas
- **Zod** - Validação de schemas
- **CORS** - Controle de acesso cross-origin

### Utilitários

- **Multer** - Upload de arquivos
- **express-async-errors** - Tratamento de erros assíncronos
- **tsx** - Execução de TypeScript

### DevTools

- **Docker** - Containerização do PostgreSQL
- **Insomnia** - Documentação das rotas (arquivo incluído)

## 🏗 Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
src/
├── controllers/     # Lógica de controle das rotas
├── middlewares/     # Middlewares de autenticação e autorização
├── routes/          # Definição das rotas da API
├── database/        # Configuração do Prisma
├── configs/         # Configurações (upload, etc.)
├── utils/           # Utilitários e classes de erro
├── types/           # Definições de tipos TypeScript
├── interfaces/      # Interfaces TypeScript
├── providers/       # Provedores de serviços
└── express/         # Configuração do Express
```

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para o banco de dados)
- **Git**

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/refund-api.git
cd refund-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados**

```bash
docker-compose up -d
```

4. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

5. **Execute as migrações do banco**

```bash
npx prisma migrate dev
```

6. **Gere o cliente Prisma**

```bash
npx prisma generate
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3333

# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/refund_db"
POSTGRES_USER=usuario
POSTGRES_PASSWORD=senha
POSTGRES_DB=refund_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# Upload
MULTER_FOLDER=./tmp
```

### Docker

O projeto inclui um `docker-compose.yml` para facilitar a configuração do PostgreSQL:

```bash
# Iniciar o banco de dados
docker-compose up -d

# Parar o banco de dados
docker-compose down
```

## 🎮 Uso

### Desenvolvimento

```bash
# Executar em modo de desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3333`

### Prisma Studio

Para visualizar e editar dados do banco:

```bash
npx prisma studio
```

## 📚 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint    | Descrição        | Autenticação |
| ------ | ----------- | ---------------- | ------------ |
| POST   | `/sessions` | Login do usuário | ❌           |

### 👥 Usuários

| Método | Endpoint | Descrição           | Autenticação |
| ------ | -------- | ------------------- | ------------ |
| POST   | `/users` | Cadastro de usuário | ❌           |

### 💸 Reembolsos

| Método | Endpoint       | Descrição         | Autenticação |
| ------ | -------------- | ----------------- | ------------ |
| GET    | `/refunds`     | Listar reembolsos | ✅           |
| POST   | `/refunds`     | Criar reembolso   | ✅           |
| DELETE | `/refunds/:id` | Deletar reembolso | ✅           |

### 📎 Uploads

| Método | Endpoint   | Descrição         | Autenticação | Role     |
| ------ | ---------- | ----------------- | ------------ | -------- |
| POST   | `/uploads` | Upload de arquivo | ✅           | employee |

### Parâmetros de Query - Listagem de Reembolsos

- `name` (string, opcional): Filtrar por nome do usuário
- `page` (number, opcional): Página atual (padrão: 1)
- `perPage` (number, opcional): Itens por página (padrão: 10)

### Exemplo de Uso

```bash
# Login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@email.com", "password": "senha123"}'

# Criar reembolso
curl -X POST http://localhost:3333/refunds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Almoço de negócios",
    "amount": 45.50,
    "category": "food",
    "filepath": "/uploads/comprovante.pdf"
  }'
```

## 🗃 Modelos de Dados

### User (Usuário)

```typescript
{
  id: string          // UUID único
  name: string        // Nome completo
  email: string       // Email único
  password: string    // Senha criptografada
  role: UserRole      // employee | manager
  refunds: Refund[]   // Reembolsos associados
  createdAt: Date     // Data de criação
  updatedAt: Date     // Data de atualização
}
```

### Refund (Reembolso)

```typescript
{
  id: string // UUID único
  name: string // Descrição do reembolso
  amount: number // Valor (float)
  category: Category // Categoria da despesa
  filepath: string // Caminho do comprovante
  userId: string // ID do usuário
  user: User // Usuário associado
  createdAt: Date // Data de criação
  updatedAt: Date // Data de atualização
}
```

### Enums

**UserRole:**

- `employee` - Funcionário
- `manager` - Gerente

**Category:**

- `food` - Alimentação
- `transport` - Transporte
- `accommodation` - Hospedagem
- `services` - Serviços
- `others` - Outros

## 🔒 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

1. **Login**: Envie credenciais para `/sessions`
2. **Token**: Receba um token JWT válido
3. **Autorização**: Inclua o token no header: `Authorization: Bearer <token>`

### Middleware de Autenticação

```typescript
// Rotas protegidas
routes.use(authenticate)
routes.use('/refunds', refundsRoutes)
```

### Sistema de Roles

- **employee**: Pode criar e visualizar próprios reembolsos
- **manager**: Acesso total ao sistema

## 📁 Upload de Arquivos

### Configuração

- **Pasta de destino**: `./tmp/uploads`
- **Tipos permitidos**: Definidos no controller
- **Middleware**: Multer para processamento
- **Acesso**: Apenas usuários com role `employee`

### Estrutura de Arquivos

```
tmp/
└── uploads/
    ├── comprovante1.pdf
    ├── nota_fiscal.jpg
    └── recibo.png
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa com hot-reload

# Prisma
npx prisma migrate dev    # Executa migrações
npx prisma generate      # Gera cliente Prisma
npx prisma studio        # Interface visual do banco
npx prisma reset         # Reseta o banco de dados
```

## 📊 Recursos Adicionais

### Tratamento de Erros

O projeto inclui um sistema robusto de tratamento de erros:

- **AppError**: Classe customizada para erros da aplicação
- **Middleware global**: Captura e formata erros
- **Validação**: Zod para validação de entrada

### Paginação

Todas as listagens incluem paginação automática:

```json
{
  "refunds": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "totalRecords": 25,
    "totalPages": 3
  }
}
```

### Documentação da API

O projeto inclui um arquivo `Insomnia_2025-06-27.yaml` com todas as rotas documentadas e exemplos de uso.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- **TypeScript** para tipagem
- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens

## 👨‍💻 Autor

**Guilherme Sanches**

- LinkedIn: [Guilherme Sanches](https://linkedin.com/in/guilhermesanches-dev)

---

<div align="center">
  <strong>Desenvolvido com ❤️ por devgsanches</strong>
</div>
