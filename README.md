    # Sistema de Gerenciamento de Planos de Aula

    Aplicacao para cadastro, organizacao e consulta de planos de aula, com suporte de Inteligencia Artificial para gerar recomendacoes pedagogicas a partir do tema da aula.

    ## Objetivo

    O projeto tem como objetivo apoiar docentes e conteudistas no planejamento de aulas. Alem de funcionar como um cadastro de planos de aula, o sistema deve sugerir conteudos complementares, topicos relacionados e tags recomendadas com base no titulo, disciplina e resumo informados pelo usuario.

    ## Cenario

    A equipe de desenvolvimento do laboratorio de pesquisa esta criando uma plataforma centralizada para organizar conteudos pedagogicos e facilitar o planejamento de aulas. Para tornar o fluxo mais produtivo, o sistema inclui uma funcionalidade de assistencia inteligente, usando uma API de LLM ou servico equivalente.

    ## Funcionalidades

    ### Planos de aula

    - Listagem de planos com paginacao.
    - Cadastro de novos planos de aula.
    - Edicao de planos existentes.
    - Exclusao de planos.
    - Busca por titulo da aula.
    - Filtros por disciplina, tags e data prevista.
    - Ordenacao por titulo ou data de cadastro.

    ### Campos do plano

    - Titulo da aula.
    - Objetivo.
    - Ementa ou resumo.
    - Data prevista.
    - Disciplina.
    - Conteudos.
    - Recursos de apoio.
    - Tags.

    ### Smart Assist com IA

    No formulario de cadastro ou edicao, o usuario pode acionar o botao **Gerar Recomendacoes com IA**.

    Fluxo esperado:

    1. O frontend envia para o backend o titulo da aula, a disciplina e a ementa/resumo.
    2. O backend monta um prompt para atuar como um assistente pedagogico.
    3. A API de IA retorna sugestoes em formato estruturado, preferencialmente JSON.
    4. O frontend preenche automaticamente os campos de conteudos, topicos relacionados e 3 tags recomendadas.

    ## Requisitos Tecnicos

    ### Backend

    A API RESTful pode ser implementada com uma das seguintes stacks:

    - Python com Flask.
    - Node.js com Express ou Fastify.

    Requisitos do backend:

    - Validacao dos dados recebidos.
    - Persistencia em MySQL, PostgreSQL ou SQLite.
    - Integracao com uma API de IA/LLM.
    - Prompt claro para garantir resposta estruturada.
    - Chave da API configurada por variavel de ambiente.
    - Endpoint de health check em `/health`.
    - Tratamento de erros nas operacoes principais.

    ### Frontend

    - SPA (Single Page Application).
    - Tela de listagem com filtros e paginacao.
    - Formulario de cadastro e edicao com validacao.
    - Loading state enquanto a IA processa a recomendacao.
    - Tratamento visual de erro caso a API de IA falhe ou demore.

    ## Observabilidade

    O sistema deve registrar logs estruturados nas principais operacoes, principalmente durante a interacao com a IA.

    Exemplo de log:

    ```text
    [INFO] AI Request: Title="Introducao ao OSPF", Discipline="Redes", TokenUsage=180, Latency=1.4s
    ```

    ## DevOps

    Itens diferenciais para a entrega:

    - Pipeline de CI no GitHub Actions ou similar.
    - Execucao de linter a cada push.
    - Dockerfile(s) para a aplicacao.
    - Arquivo `docker-compose.yml` para execucao local.
    - Ambiente executavel com um unico comando.

    Sugestoes de ferramentas:

    - Python: `flake8` e `black`.
    - JavaScript: `ESLint` e `Prettier`.

    ## Variaveis de Ambiente

    As chaves sensiveis nao devem ficar hardcoded no codigo. Use um arquivo `.env` local e mantenha esse arquivo no `.gitignore`.

    Exemplo:

    ```env
    DATABASE_URL=sqlite:///database.db
    AI_API_KEY=sua-chave-aqui
    AI_MODEL=nome-do-modelo
    ```

    ## Como Executar

    > Atualize esta secao de acordo com a stack escolhida e os scripts implementados no projeto.

    ### Com Docker

    ```bash
    docker compose up --build
    ```

    ### Backend

    ```bash
    # Exemplo para Python
    pip install -r requirements.txt
    flask run
    ```

    ```bash
    # Exemplo para Node.js
    npm install
    npm run dev
    ```

    ### Frontend

    ```bash
    npm install
    npm run dev
    ```

    ## Estrutura Sugerida do Projeto

    ```text
    .
    |-- backend/
    |   |-- src/
    |   |-- tests/
    |   `-- Dockerfile
    |-- frontend/
    |   |-- src/
    |   `-- Dockerfile
    |-- docker-compose.yml
    |-- .env.example
    |-- .gitignore
    `-- README.md
    ```

    ## Entrega

    - Repositorio Git publico.
    - README detalhado.
    - Video de ate 5 minutos apresentando a solucao.
    - Demonstracao das principais escolhas tecnicas.
    - Explicacao da organizacao do projeto.
    - Descricao das dificuldades encontradas.
    - Demonstracao ou descricao dos itens bonus implementados.

    ## Boas Praticas
    - Criar um prompt de IA orientado ao papel de "Assistente Pedagogico".
    - Solicitar resposta da IA em JSON para facilitar o uso no frontend.
    - Nunca versionar chaves de API.
    - Usar `.env` para configuracoes locais.
    - Incluir `.env` no `.gitignore`.
    - Aplicar validacao no frontend e no backend.
    - Tratar erros de integracao com a IA de forma clara para o usuario.
    - Manter logs uteis para depuracao e observabilidade.
