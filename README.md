<div align="center">

# Sistema de Gerenciamento de Planos de Aula

**Frontend SPA moderno para cadastro, organização e consulta de planos de aula com Smart Assist.**

[Visão Geral](#visão-geral) | [Funcionalidades](#funcionalidades) | [Tecnologias](#tech-stack) | [Como Rodar](#como-rodar)

</div>

## Visão Geral

O **Sistema de Gerenciamento de Planos de Aula** é uma aplicação frontend criada para o desafio técnico de gerenciamento pedagógico.

A interface permite listar, buscar, filtrar, ordenar, criar, editar, visualizar e excluir planos de aula. O projeto também integra uma funcionalidade chamada **Smart Assist**, preparada para consumir uma API REST e gerar recomendações automáticas de conteúdos e tags.

O foco da aplicação é entregar uma experiência limpa, responsiva e pronta para apresentação técnica, com arquitetura organizada em componentes, páginas, serviços, schemas, tipos e utilitários.

## Objetivos

- Criar uma SPA moderna para gerenciamento de planos de aula
- Implementar CRUD completo preparado para API REST
- Adicionar busca, filtros, ordenação e paginação
- Validar formulários com React Hook Form e Zod
- Integrar a funcionalidade Smart Assist via endpoint HTTP
- Garantir responsividade e boa usabilidade em desktop e mobile
- Manter código organizado, reutilizável e fácil de apresentar

## Contexto

A aplicação foi desenvolvida para apoiar docentes, instrutores e conteudistas no planejamento de aulas.

Cada plano de aula possui informações essenciais como título, objetivo, ementa, disciplina, data prevista, conteúdos, recursos de apoio e tags.

O Smart Assist melhora o fluxo de cadastro ao sugerir conteúdos complementares, tópicos relacionados e tags com base nos dados principais da aula.

## Funcionalidades

- **Listagem de Planos**: visualização em tabela no desktop e cards em telas menores
- **Busca e Filtros**:
  - Busca por título da aula
  - Filtro por disciplina
  - Filtro por tag
  - Filtro por data prevista
- **Ordenação**:
  - Título A-Z e Z-A
  - Data de cadastro mais recente ou mais antiga
- **Paginação**: navegação entre páginas de resultados
- **CRUD Completo**:
  - Cadastro de plano
  - Edição de plano
  - Visualização de detalhes
  - Exclusão com modal de confirmação
- **Validação de Formulário**:
  - Título com no mínimo 3 caracteres
  - Objetivo com no mínimo 5 caracteres
  - Ementa/Resumo com no mínimo 10 caracteres
  - Data prevista válida
  - Disciplina obrigatória
- **Smart Assist**:
  - Botão com loading
  - Requisição preparada para API real
  - Tratamento visual de erro
  - Preenchimento automático de conteúdos e tags
- **Fallback Local**:
  - Modo opcional com `localStorage` para testar sem backend
  - Recomendações locais temporárias para demonstração

## Tech Stack

| Tecnologia        | Finalidade                                  |
| ----------------- | ------------------------------------------- |
| React             | Biblioteca principal de UI                  |
| TypeScript        | Tipagem estática e contratos da aplicação   |
| Vite              | Build tool e dev server                     |
| Tailwind CSS      | Estilização utilitária e responsiva         |
| React Router DOM  | Gerenciamento de rotas da SPA               |
| React Hook Form   | Controle e performance dos formulários      |
| Zod               | Validação de schemas                        |
| Axios             | Cliente HTTP para consumo da API REST       |
| Lucide React      | Ícones da interface                         |
| ESLint            | Padronização e análise do código            |
| Prettier          | Formatação automática                       |

## Rotas

| Rota                 | Descrição                   |
| -------------------- | --------------------------- |
| `/planos`            | Listagem de planos de aula  |
| `/planos/novo`       | Cadastro de novo plano      |
| `/planos/:id`        | Detalhes do plano           |
| `/planos/:id/editar` | Edição de plano existente   |

## Entidade Plano de Aula

```ts
interface LessonPlan {
  id: string;
  tituloAula: string;
  objetivo: string;
  ementaResumo: string;
  dataPrevista: string;
  disciplina: string;
  conteudos?: string[];
  recursosApoio?: string[];
  tags?: string[];
  dataCadastro: string;
}
```

## Integração com API

A URL base da API é configurada por variável de ambiente:

```env
VITE_API_URL=http://localhost:3000
```

### Endpoints esperados

```text
GET    /lesson-plans
GET    /lesson-plans/:id
POST   /lesson-plans
PUT    /lesson-plans/:id
DELETE /lesson-plans/:id
POST   /smart-assist/recommendations
```

### Query params da listagem

```text
page
limit
search
disciplina
tag
dataPrevista
sortBy
order
```

## Smart Assist

No formulário de cadastro e edição, o botão **Gerar Recomendações com IA** envia para o backend:

```json
{
  "tituloAula": "Introdução ao OSPF",
  "disciplina": "Redes de Computadores",
  "ementaResumo": "Aula introdutória sobre funcionamento do protocolo OSPF."
}
```

Endpoint:

```text
POST /smart-assist/recommendations
```

Resposta esperada:

```json
{
  "conteudosComplementares": [
    "Conceito de roteamento dinâmico",
    "Diferença entre OSPF e RIP"
  ],
  "topicosRelacionados": [
    "Protocolos de roteamento",
    "Redes TCP/IP"
  ],
  "tagsRecomendadas": ["redes", "ospf", "roteamento"]
}
```

Quando a chamada retorna com sucesso, a aplicação preenche automaticamente os campos de conteúdos e tags. Em caso de falha, exibe uma mensagem amigável.

## Backend

A API REST foi desenvolvida com Node.js e Express.

### Tecnologias do Backend

| Tecnologia | Finalidade |
| --- | --- |
| Node.js + Express | Servidor e rotas da API |
| Sequelize | ORM para banco de dados |
| SQLite | Banco de dados |
| CORS | Liberação de acesso cross-origin |
| dotenv | Variáveis de ambiente |

### Como Rodar só o Backend

```bash
npm run api
```

### Como Rodar com Docker

```bash
docker-compose up --build
```

A aplicação sobe completa com um único comando, frontend na porta **5173** e backend na porta **3000**.

### Endpoint de Health Check

```text
GET /health
```

Retorna status da API, timestamp, uptime e ambiente.

### Estrutura do Backend

```text
src/
  config/
    database.js
  database/
    migrations/
    models/
    seeders/
  middlewares/
    planos.middleware.js
  modules/
    planos/
      plano.controller.js
      plano.routes.js
      plano.service.js
    smartAssist/
      smartAssist.routes.js
      smartAssist.service.js
  index.js
```


## Modo sem Backend

Se a API em `http://localhost:3000` não estiver rodando, o navegador pode mostrar:

```text
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

Isso significa que o frontend tentou chamar o backend, mas não encontrou nenhum serviço ativo nessa porta.

Para testar a aplicação sem backend, use no `.env`:

```env
VITE_USE_LOCAL_FALLBACK=true
```

Nesse modo, o CRUD usa `localStorage` e o Smart Assist retorna recomendações locais temporárias.

Para voltar a consumir a API REST real:

```env
VITE_USE_LOCAL_FALLBACK=false
```

## Como Rodar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível no endereço exibido pelo Vite, geralmente:

```text
http://localhost:5173
```

Em alguns ambientes Windows, caso o PowerShell bloqueie `npm.ps1`, execute:

```bash
npm.cmd run dev
```

## Scripts

| Script            | Descrição                                 |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Inicia o servidor local do Vite           |
| `npm run build`   | Valida TypeScript e gera build de produção |
| `npm run preview` | Serve localmente o build gerado           |
| `npm run lint`    | Executa análise com ESLint                |
| `npm run format`  | Formata arquivos com Prettier             |

## Estrutura do Projeto

```text
src/
  components/
    Layout.tsx
    Navbar.tsx
    Button.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    Badge.tsx
    Loading.tsx
    EmptyState.tsx
    ConfirmModal.tsx
  pages/
    LessonPlansList.tsx
    LessonPlanForm.tsx
    LessonPlanDetails.tsx
  services/
    api.ts
    lessonPlansService.ts
    smartAssistService.ts
    localLessonPlansStore.ts
  schemas/
    lessonPlanSchema.ts
  types/
    lessonPlan.ts
  utils/
    formatDate.ts
    cn.ts
  App.tsx
  main.tsx
  index.css
```

## Qualidade e Validação

O projeto foi preparado para ser validado com:

```bash
npm run lint
npm run build
```

Esses comandos verificam problemas de lint, importação, tipagem TypeScript e build de produção.

## Link do vídeo da explicação do projeto => 
`https://youtu.be/ArU9CAvYhFo`