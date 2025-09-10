# D4C ETL Project

Este projeto consiste em uma aplicação ETL (Extract, Transform, Load) com backend em .NET 9 e frontend em React com TypeScript.

## 📋 Pré-requisitos

### Backend

- .NET 9 SDK
- SQLite

### Frontend

- Node.js (versão 18 ou superior)
- npm

## 🚀 Como executar o projeto

### 1. Backend (.NET) Configuração inicial

1.  Navegue até a pasta do backend:

```
cd backend/d4cETL
```

2.  Restaure as dependências:

```
dotnet restore
```

4.  Execute as migrações do banco de dados:

```
dotnet ef database update
```

Executar o backend

```
dotnet run
```

O backend estará disponível em:

- HTTP : http://localhost:5131
- Swagger : http://localhost:5131/swagger

### 2. Frontend (React) Configuração inicial

1.  Navegue até a pasta do frontend:

```

cd frontend

```

2.  Instale as dependências:

```

npm install

```


Executar o frontend

```

npm run dev

```


O frontend estará disponível em: http://localhost:5173

## 🔧 Scripts disponíveis

### Backend

- dotnet run - Executa a aplicação
- dotnet build - Compila o projeto
- dotnet ef migrations add - Cria nova migração
- dotnet ef database update - Aplica migrações

### Frontend

- npm run dev - Executa em modo desenvolvimento

## 📁 Estrutura do projeto

```

d4c/
├── backend/
│   └── d4cETL/
│       ├── Api/              # 
Controllers e endpoints
│       ├── Application/      # 
Lógica de aplicação
│       ├── Domain/          # 
Entidades e regras de negócio
│       ├── Infrastructure/  # 
Acesso a dados e serviços externos
│       └── Program.cs       # 
Ponto de entrada
├── frontend/
│   ├── src/
│   │   ├── components/      # 
Componentes React
│   │   ├── pages/          # 
Páginas da aplicação
│   │   ├── services/       # 
Serviços de API
│   │   ├── stores/         # 
Gerenciamento de estado
│   │   └── types/          # 
Definições TypeScript
│   └── package.json
└── README.md

```

## 🌐 URLs importantes

- Frontend : http://localhost:5173
- Backend API : http://localhost:5131
- Swagger/OpenAPI : http://localhost:5131/swagger

## 🛠️ Desenvolvimento

### Executar ambos simultaneamente

1. 1. Terminal 1 - Backend:

```

cd backend/d4cETL
dotnet run

```

2. 1. Terminal 2 - Frontend:

```

cd frontend
npm run dev

```

### Configuração do ambiente

Certifique-se de que:

- O backend está rodando na porta 5131
- O frontend está configurado para fazer requisições para a URL correta do backend

## 📝 Notas importantes

- O projeto usa Entity Framework Core para acesso ao banco de dados, instale caso necessário

```
dotnet add package Microsoft.EntityFrameworkCore
```

- O frontend utiliza Vite como bundler para desenvolvimento rápido

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se o .NET 9 SDK está instalado
- Confirme se a string de conexão está correta
- Execute dotnet ef database update para aplicar migrações

### Frontend não carrega

- Verifique se o Node.js está instalado
- Execute npm install para instalar dependências
- Confirme se a porta 5173 não está sendo usada por outro processo

```

```
