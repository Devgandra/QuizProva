
/* =============================================================================
   script.js — Quiz de Prova (Banco de Dados • TypeScript • POO)
   -----------------------------------------------------------------------------
   Feito no padrão BR: comentário explicando, variável em português,
   e sem firula desnecessária. Só o básico que funciona bem. 🇧🇷☕
   ============================================================================= */

/* -----------------------------
   CONFIGURAÇÃO DOS NÍVEIS
   ----------------------------- */
const NIVEIS = {
  todos:   { rotulo: "Todos os níveis", desc: "Mistura tudo, igual prova de verdade" },
  facil:   { rotulo: "🟢 Fácil",        desc: "Conceito direto, quase de graça" },
  medio:   { rotulo: "🟡 Médio",        desc: "Precisa ter estudado um pouco" },
  dificil: { rotulo: "🟠 Difícil",      desc: "Aqui o bicho pega" },
  ultra:   { rotulo: "🔴 Ultra Difícil", desc: "Questão pra separar os monstros" }
};

const ORDEM_NIVEIS = ["todos", "facil", "medio", "dificil", "ultra"];

/* =============================================================================
   BANCO DE QUESTÕES
   Cada questão tem: nivel, tema, pergunta, alternativas, correta (índice) e explicacao.
   ============================================================================= */
const QUIZZES = {

  /* ===========================================================================
     🗄️  BANCO DE DADOS
     ======================================================================== */
  bd: {
    titulo: "Quiz de Banco de Dados",
    subtitulo: "Baseado no mapa mental + o que mais cai em prova de BD relacional.",
    questoes: [

      /* ---------- FÁCIL ---------- */
      {
        nivel: "facil",
        tema: "Conceitos Fundamentais",
        pergunta: "No mapa mental, 'dado' aparece como a forma primária dos fatos. Isso significa que:",
        alternativas: [
          "O dado sozinho já carrega significado e valor para o negócio.",
          "O dado é o fato bruto, que isolado não tem significado; informação é o dado processado.",
          "Dado e informação são exatamente a mesma coisa, só mudam de nome.",
          "Dado é o resultado final de uma consulta SQL já formatada."
        ],
        correta: 1,
        explicacao: "Dado é matéria-prima (fato bruto). Quando passa pelo processo de transformação ele vira informação, e aí sim ganha o 'valor adicional' citado no mapa mental. Por isso a alternativa B é a correta — as outras confundem dado com informação."
      },
      {
        nivel: "facil",
        tema: "Processo de Transformação",
        pergunta: "A regra 'Entrada Lixo, Saída Lixo' (ELSL) significa que:",
        alternativas: [
          "Se o banco estiver cheio, o sistema fica lento.",
          "Se os dados de entrada forem ruins, o resultado do processamento também será ruim.",
          "Todo dado só pode entrar no banco uma única vez.",
          "O banco exclui automaticamente registros errados."
        ],
        correta: 1,
        explicacao: "ELSL (GIGO em inglês) é um alerta sobre a qualidade do dado de entrada: o processo de transformação depende do que entra. Se entra dado ruim, a informação gerada também será ruim, não importa quanto o sistema seja moderno."
      },
      {
        nivel: "facil",
        tema: "Normalização",
        pergunta: "A Primeira Forma Normal (1FN) exige basicamente que:",
        alternativas: [
          "Não existam grupos de repetição nem atributos multivalorados.",
          "Toda tabela tenha no mínimo duas chaves estrangeiras.",
          "Os dados estejam em arquivos separados por vírgula.",
          "Toda coluna seja do tipo texto."
        ],
        correta: 0,
        explicacao: "1FN = eliminação de grupos de repetição e ausência de atributos multivalorados (aquele campo que guarda 'telefone1; telefone2; telefone3'). Cada célula deve guardar um valor atômico. Assim cada informação fica no seu próprio campo/linha."
      },
      {
        nivel: "facil",
        tema: "Linguagem SQL",
        pergunta: "Os comandos CREATE, ALTER e DROP pertencem a qual sublinguagem do SQL?",
        alternativas: ["DML", "DDL", "DCL", "TCL"],
        correta: 1,
        explicacao: "DDL (Data Definition Language) define a estrutura do banco: CREATE, ALTER, DROP e TRUNCATE. DML mexe nos dados (INSERT/UPDATE/DELETE/SELECT), DCL cuida de permissões (GRANT/REVOKE) e TCL controla transações (COMMIT/ROLLBACK)."
      },
      {
        nivel: "facil",
        tema: "Modelagem de Dados",
        pergunta: "Uma chave primária (PRIMARY KEY) tem qual papel?",
        alternativas: [
          "Permitir valores repetidos para facilitar agrupamentos.",
          "Identificar de forma única cada registro da tabela e não aceitar valores nulos.",
          "Ligar a tabela a outra tabela obrigatoriamente.",
          "Ordenar automaticamente as linhas por nome."
        ],
        correta: 1,
        explicacao: "A chave primária identifica unicamente cada linha da tabela: não pode repetir e não pode ser nula. Quem liga tabelas é a chave estrangeira (FK) — esse é o erro clássico da alternativa C."
      },

      /* ---------- MÉDIO ---------- */
      {
        nivel: "medio",
        tema: "Modelagem de Dados",
        pergunta: "Sobre o Modelo Entidade-Relacionamento (MER), é correto afirmar que:",
        alternativas: [
          "Descreve entidades e relacionamentos de forma conceitual, independente de SGBD ou linguagem.",
          "É a implementação física final, com tipos de dados e índices definidos.",
          "É um comando SQL usado para criar tabelas automaticamente.",
          "Só pode ser usado depois que todas as tabelas já estão normalizadas."
        ],
        correta: 0,
        explicacao: "O MER é conceitual: representa entidades (coisas sobre as quais guardamos dados) e relacionamentos (ligações entre elas) de maneira independente de implementação. Suas vantagens no mapa mental são justamente a sintaxe robusta e a comunicação fácil com o usuário/cliente."
      },
      {
        nivel: "medio",
        tema: "Modelagem de Dados",
        pergunta: "Na evolução dos esquemas de projeto, o modelo que define tabelas, colunas e chaves já pensando no relacional é o:",
        alternativas: ["Conceitual", "Lógico", "Físico", "Executivo"],
        correta: 1,
        explicacao: "Conceitual = independente de SGBD (o MER). Lógico = já em tabelas/colunas/chaves, seguindo o modelo relacional. Físico = implementação real no SGBD (tipos, índices, tablespaces, particionamento)."
      },
      {
        nivel: "medio",
        tema: "Normalização",
        pergunta: "Uma tabela está na Segunda Forma Normal (2FN) quando:",
        alternativas: [
          "Ela está na 1FN e não possui atributo que dependa de apenas parte de uma chave primária composta.",
          "Ela está na 1FN e não possui nenhuma chave estrangeira.",
          "Ela está na 1FN e todos os atributos são numéricos.",
          "Ela está na 1FN e tem somente uma tabela por assunto."
        ],
        correta: 0,
        explicacao: "2FN = 1FN + dependência funcional completa em relação à chave primária. Aqui entra o caso da chave primária composta: nenhum atributo não-chave pode depender só de parte da chave (isso é dependência parcial, que a 2FN elimina)."
      },
      {
        nivel: "medio",
        tema: "Linguagem SQL",
        pergunta: "INSERT, UPDATE, DELETE e SELECT pertencem a qual sublinguagem?",
        alternativas: ["DDL", "DML", "DCL", "DQL pura e separada da DML em todos os padrões ISO"],
        correta: 1,
        explicacao: "Esses comandos são DML (Data Manipulation Language), responsáveis por manipular os registros. O SELECT, apesar de alguns professores chamarem de DQL, no padrão normalmente é ensinado junto da DML."
      },
      {
        nivel: "medio",
        tema: "Linguagem SQL",
        pergunta: "Qual comando cria uma nova tabela no banco de dados?",
        alternativas: [
          "INSERT TABLE aluno (...);",
          "CREATE TABLE aluno (...);",
          "ALTER TABLE aluno (...);",
          "MAKE TABLE aluno (...);"
        ],
        correta: 1,
        explicacao: "Quem cria é o CREATE TABLE. ALTER TABLE modifica uma tabela que já existe (adiciona/remove colunas), INSERT insere linhas e 'MAKE TABLE' não existe em SQL."
      },

      /* ---------- DIFÍCIL ---------- */
      {
        nivel: "dificil",
        tema: "Normalização",
        pergunta: "Uma relação está na Terceira Forma Normal (3FN) quando, além de estar na 2FN:",
        alternativas: [
          "Não possui dependências transitivas — nenhum atributo não-chave depende de outro atributo não-chave.",
          "Possui no máximo três colunas por tabela.",
          "Todos os atributos são chave primária.",
          "Não possui nenhuma chave estrangeira circular."
        ],
        correta: 0,
        explicacao: "3FN elimina dependência transitiva: um atributo não-chave não pode depender de outro atributo não-chave. Exemplo: na tabela Aluno(id, id_curso, nome_curso), 'nome_curso' depende de 'id_curso' e não da chave — então essa tabela fere a 3FN."
      },
      {
        nivel: "dificil",
        tema: "Linguagem SQL",
        pergunta: "Qual a diferença entre INNER JOIN e LEFT JOIN?",
        alternativas: [
          "INNER JOIN retorna só as linhas com correspondência nas duas tabelas; LEFT JOIN retorna todas as linhas da esquerda, mesmo sem correspondência.",
          "LEFT JOIN retorna só as linhas com correspondência; INNER JOIN traz NULL onde não há match.",
          "Os dois retornam exatamente o mesmo conjunto de dados.",
          "INNER JOIN funciona apenas com chave primária e LEFT JOIN apenas com chave estrangeira."
        ],
        correta: 0,
        explicacao: "INNER JOIN é a interseção: só as linhas que casam nas duas tabelas. LEFT JOIN mantém todas as linhas da tabela da esquerda e preenche com NULL onde não há par na direita. Inverter a explicação (como na alternativa B) é erro clássico de prova."
      },
      {
        nivel: "dificil",
        tema: "Linguagem SQL",
        pergunta: "Sobre WHERE e HAVING em consultas com agregação, o correto é:",
        alternativas: [
          "WHERE filtra linhas antes do agrupamento; HAVING filtra grupos depois da agregação.",
          "HAVING filtra linhas antes do agrupamento; WHERE filtra grupos depois.",
          "São sinônimos e podem ser trocados sem alterar o resultado.",
          "WHERE só funciona com COUNT e HAVING só com SUM."
        ],
        correta: 0,
        explicacao: "A ordem lógica é: FROM → WHERE (filtra linhas) → GROUP BY → funções de agregação → HAVING (filtra os grupos) → ORDER BY. Por isso, condição sobre agregado (ex.: COUNT(*) > 5) vai no HAVING, nunca no WHERE."
      },
      {
        nivel: "dificil",
        tema: "Transações",
        pergunta: "A sigla ACID, que define as propriedades de uma transação, representa:",
        alternativas: [
          "Atomicidade, Consistência, Isolamento, Durabilidade.",
          "Agrupamento, Controle, Integridade, Distribuição.",
          "Acesso, Conferência, Índice, Descarte.",
          "Alteração, Consulta, Inserção, Deleção."
        ],
        correta: 0,
        explicacao: "ACID = Atomicidade (tudo ou nada), Consistência (respeita as regras), Isolamento (transações concorrentes não se atrapalham) e Durabilidade (o que foi commitado persiste mesmo com queda de energia)."
      },
      {
        nivel: "dificil",
        tema: "Integridade",
        pergunta: "A integridade referencial garante que:",
        alternativas: [
          "Uma chave estrangeira só aceita valores que existam na chave primária referenciada (ou NULL, se permitido).",
          "Todos os campos de uma tabela sejam obrigatórios.",
          "As consultas sempre retornem pelo menos uma linha.",
          "Os dados sejam armazenados em ordem alfabética."
        ],
        correta: 0,
        explicacao: "Integridade referencial é o que impede um 'filho órfão': o valor da FK precisa existir na tabela pai (ou ser NULL, quando a coluna permite). Sem ela, dá para gravar pedido de um cliente que não existe."
      },

      /* ---------- ULTRA DIFÍCIL ---------- */
      {
        nivel: "ultra",
        tema: "Normalização",
        pergunta: "Na tabela Pedido(cod_pedido, cod_produto, qtd, nome_produto), com chave primária composta (cod_pedido, cod_produto), qual problema exatamente essa tabela apresenta?",
        alternativas: [
          "Dependência funcional parcial: nome_produto depende apenas de cod_produto, que é parte da chave composta.",
          "Dependência transitiva: nome_produto é derivado do valor de qtd.",
          "Violação de 1FN por atributo multivalorado em nome_produto.",
          "Nenhum problema: a chave composta resolve tudo."
        ],
        correta: 0,
        explicacao: "A chave é composta por (cod_pedido, cod_produto). O atributo nome_produto depende só de cod_produto — parte da chave — e isso é dependência parcial, que quebra a 2FN. A solução é separar em uma tabela Produto(cod_produto, nome_produto)."
      },
      {
        nivel: "ultra",
        tema: "Normalização",
        pergunta: "Qual é a diferença central entre 3FN e a Forma Normal de Boyce-Codd (FNBC/BCNF)?",
        alternativas: [
          "Na FNBC toda determinante funcional precisa ser uma chave candidata; a 3FN ainda admite que um atributo não-chave seja determinante em alguns casos.",
          "A FNBC só se aplica a tabelas sem chave primária.",
          "A 3FN é mais rígida, pois já elimina qualquer dependência funcional.",
          "As duas são idênticas, só mudam de nome por causa do autor."
        ],
        correta: 0,
        explicacao: "A regra da FNBC é mais forte: para TODO determinante X, X deve ser chave candidata. Na 3FN existe uma exceção (quando o atributo é chave da própria relação), o que permite alguns casos que a FNBC rejeitaria. Logo, toda tabela em FNBC está em 3FN, mas não o contrário."
      },
      {
        nivel: "ultra",
        tema: "Transações",
        pergunta: "Qual das opções descreve corretamente a anomalia de concorrência conhecida como 'leitura fantasma' (phantom read)?",
        alternativas: [
          "Uma transação executa a mesma consulta de intervalo duas vezes e, na segunda, aparecem linhas novas que foram inseridas por outra transação.",
          "Uma transação lê dados que ainda não sofreram COMMIT e que depois são desfeitos.",
          "Uma transação lê o mesmo registro duas vezes e obtém valores diferentes porque ele foi alterado.",
          "A transação nunca consegue finalizar por falta de permissão."
        ],
        correta: 0,
        explicacao: "Fantasma é o surgimento de linhas novas no resultado de um mesmo predicado (range). A alternativa B descreve leitura suja (dirty read) e a C descreve leitura não repetível (non-repeatable read). São as três anomalias clássicas cobradas junto com o nível de isolamento."
      },
      {
        nivel: "ultra",
        tema: "Linguagem SQL",
        pergunta: "Sobre índices em banco de dados, é correto afirmar que:",
        alternativas: [
          "Aceleram consultas de leitura (WHERE, JOIN, ORDER BY), mas ocupam espaço e tornam INSERT/UPDATE/DELETE mais lentos.",
          "Aceleram todos os tipos de operação, inclusive inserção e exclusão, sem custo.",
          "São obrigatoriamente criados em toda coluna de texto pelo SGBD.",
          "Servem para garantir a integridade referencial sozinhos, sem FK."
        ],
        correta: 0,
        explicacao: "Índice é como o índice de um livro: acha rápido, mas precisa ser atualizado a cada escrita. Então ajuda na leitura e atrapalha a escrita, além de consumir espaço. É um trade-off, e é justamente isso que a prova cobra."
      },
      {
        nivel: "ultra",
        tema: "Linguagem SQL",
        pergunta: "Qual a diferença entre COUNT(*) e COUNT(coluna) em uma agregação?",
        alternativas: [
          "COUNT(*) conta todas as linhas, inclusive as que possuem NULL; COUNT(coluna) ignora os valores NULL daquela coluna.",
          "COUNT(*) ignora NULL e COUNT(coluna) conta NULL como 1.",
          "Os dois retornam sempre o mesmo valor, não importa a coluna.",
          "COUNT(coluna) só funciona junto com GROUP BY e COUNT(*) só sem GROUP BY."
        ],
        correta: 0,
        explicacao: "COUNT(*) conta linhas, não se importando com valores nulos. COUNT(coluna) conta apenas as linhas em que aquela coluna NÃO é nula. Em uma coluna opcional, os dois resultados podem ser diferentes — e essa pegadinha adora cair."
      },
      {
        nivel: "ultra",
        tema: "Modelagem de Dados",
        pergunta: "Em um relacionamento N:N entre Aluno e Curso, a forma correta no modelo relacional é:",
        alternativas: [
          "Criar uma tabela associativa com as duas chaves estrangeiras, formando uma chave primária composta.",
          "Colocar a chave primária de Curso como coluna multivalorada dentro de Aluno.",
          "Criar duas tabelas iguais e juntá-las com UNION em toda consulta.",
          "Simplesmente declarar as duas chaves primárias em uma das tabelas."
        ],
        correta: 0,
        explicacao: "Relações N:N sempre viram tabela associativa (Aluno_Curso) contendo as FKs de Aluno e Curso. A chave primária composta (id_aluno, id_curso) garante que o mesmo par não se repita. As outras opções violam a 1FN (multivalorado) ou a 1FN/2FN."
      }
    ]
  },

  /* ===========================================================================
     🔷  TYPESCRIPT
     ======================================================================== */
  ts: {
    titulo: "Quiz de TypeScript",
    subtitulo: "Da tipagem básica até conditional types — o que mais cai na prova.",
    questoes: [

      /* ---------- FÁCIL ---------- */
      {
        nivel: "facil",
        tema: "Visão Geral",
        pergunta: "O que é TypeScript, na prática?",
        alternativas: [
          "Um superset do JavaScript que adiciona tipagem estática e é compilado para JavaScript.",
          "Uma linguagem que substitui totalmente o JavaScript e roda direto no navegador sem compilar.",
          "Um framework de interface, tipo React.",
          "Um banco de dados baseado em tipos."
        ],
        correta: 0,
        explicacao: "TypeScript é JavaScript + tipos. Ele NÃO roda no navegador do jeito que está: o compilador (tsc) transpila o código para JavaScript, que é o que o navegador/Node entendem. O sistema de tipos é apagado nesse processo."
      },
      {
        nivel: "facil",
        tema: "Tipagem Básica",
        pergunta: "Qual linha declara corretamente uma variável do tipo string?",
        alternativas: [
          "let nome = string(\"Ana\");",
          "let nome: string = \"Ana\";",
          "string let nome := \"Ana\";",
          "variable nome<String> = \"Ana\";"
        ],
        correta: 1,
        explicacao: "A anotação de tipo em TS vem depois do nome da variável, com dois pontos: let nome: string = \"Ana\". Também vale lembrar que o tipo pode ser inferido — let nome = \"Ana\" já é string automaticamente."
      },
      {
        nivel: "facil",
        tema: "Interfaces",
        pergunta: "Para que serve uma interface em TypeScript?",
        alternativas: [
          "Descrever o formato esperado de um objeto (quais propriedades e tipos ele tem).",
          "Criar uma página visual para o usuário navegar.",
          "Substituir funções por constantes.",
          "Instalar dependências do projeto."
        ],
        correta: 0,
        explicacao: "Interface descreve a 'forma' (shape) de um objeto. Ela não gera código em runtime — serve para o compilador avisar se você usar um objeto que não bate com o contrato definido."
      },
      {
        nivel: "facil",
        tema: "Inferência",
        pergunta: "Se eu escrevo let idade = 20;, qual o tipo de idade?",
        alternativas: ["any", "number", "string", "unknown"],
        correta: 1,
        explicacao: "TypeScript infere o tipo pelo valor atribuído. Como 20 é number, a variável é number. Por inferência, ela rejeitará idade = \"vinte\" — esse é o ganho de segurança sem precisar escrever o tipo na mão."
      },
      {
        nivel: "facil",
        tema: "Interfaces e Types",
        pergunta: "Qual das diferenças abaixo é verdadeira sobre interface e type?",
        alternativas: [
          "interface pode ser declarada várias vezes e é mesclada (declaration merging); type alias não permite redeclaração.",
          "type pode ser declarado várias vezes; interface não.",
          "Os dois são idênticos em cem por cento dos cenários possíveis.",
          "interface só aceita tipos primitivos."
        ],
        correta: 0,
        explicacao: "Interfaces com o mesmo nome se fundem (declaration merging), o que é útil em bibliotecas. Um type alias com o mesmo nome dá erro de duplicidade. Em troca, o type é mais flexível para unions, tuplas e tipos mapeados."
      },

      /* ---------- MÉDIO ---------- */
      {
        nivel: "medio",
        tema: "Union Types",
        pergunta: "No tipo let id: string | number;, o que isso quer dizer?",
        alternativas: [
          "id aceita string OU number, mas com qualquer um dos dois você só pode usar operações comuns aos dois até fazer uma verificação.",
          "id aceita qualquer coisa, é um any disfarçado.",
          "id aceita string e number ao mesmo tempo na mesma variável.",
          "id é uma tupla de string seguida de number."
        ],
        correta: 0,
        explicacao: "Union é 'ou': o valor é um dos tipos. O compilador só deixa usar métodos comuns aos dois (narrowing). Para usar toUpperCase(), você precisa provar antes com typeof id === \"string\" que ali é string."
      },
      {
        nivel: "medio",
        tema: "Funções",
        pergunta: "Na função function logar(user: string, senha?: string) {}, o ponto de interrogação em senha indica que:",
        alternativas: [
          "O parâmetro é opcional e seu tipo efetivo é string | undefined.",
          "O parâmetro é obrigatório, mas aceita null.",
          "O parâmetro é uma função.",
          "O parâmetro é privado."
        ],
        correta: 0,
        explicacao: "O '?' torna o parâmetro opcional. Sem ele, chamar logar(\"ana\") daria erro. Detalhe importante: parâmetros opcionais precisam vir depois dos obrigatórios."
      },
      {
        nivel: "medio",
        tema: "Modificadores de Tipo",
        pergunta: "Para que serve readonly em TypeScript?",
        alternativas: [
          "Impedir que a propriedade seja reatribuída depois de inicializada.",
          "Tornar a propriedade privada.",
          "Permitir leitura apenas no console.log.",
          "Converter a propriedade para number automaticamente."
        ],
        correta: 0,
        explicacao: "readonly é proteção em tempo de compilação: a propriedade só pode ser definida na declaração ou no construtor. Não confunda com private, que controla quem pode ACESSAR, enquanto readonly controla se pode ALTERAR."
      },
      {
        nivel: "medio",
        tema: "Enum",
        pergunta: "O que um enum numérico faz em TypeScript?",
        alternativas: [
          "Cria um conjunto nomeado de constantes com valores numéricos sequenciais, gerando código real no JavaScript compilado.",
          "É apenas um comentário ignorado pelo compilador.",
          "Cria automaticamente uma tabela no banco.",
          "Só pode ser usado dentro de interfaces."
        ],
        correta: 0,
        explicacao: "enum gera um objeto real após a compilação, mapeando nome → número (ex.: Status.Ativo === 0). É diferente de um union de strings, que some no JavaScript gerado."
      },
      {
        nivel: "medio",
        tema: "Configuração",
        pergunta: "Para que serve o strict: true no tsconfig.json?",
        alternativas: [
          "Ativa um conjunto de checagens rigorosas, como strictNullChecks e noImplicitAny, aumentando a segurança dos tipos.",
          "Deixa o código mais rápido em execução.",
          "Impede o uso de funções assíncronas.",
          "Formata o código automaticamente com espaçamento padronizado."
        ],
        correta: 0,
        explicacao: "strict liga várias verificações rígidas de uma vez (strictNullChecks, noImplicitAny, strictFunctionTypes etc.). Deixar strict desligado é pedir para o compilador ignorar erros — em prova, é sempre esperado modo estrito."
      },

      /* ---------- DIFÍCIL ---------- */
      {
        nivel: "dificil",
        tema: "any vs unknown",
        pergunta: "Qual a vantagem do tipo unknown em relação ao any?",
        alternativas: [
          "unknown também aceita qualquer valor, mas obriga você a verificar o tipo antes de usá-lo; any desliga a checagem.",
          "unknown é mais rápido em runtime que any.",
          "unknown aceita qualquer valor enquanto any só aceita primitivos.",
          "Os dois são exatamente iguais em comportamento."
        ],
        correta: 0,
        explicacao: "any é a porta dos fundos: o compilador desiste de verificar e você perde a segurança. unknown é a porta com catraca: aceita tudo na entrada, mas você precisa provar o tipo (typeof, instanceof) antes de manipular. Por isso unknown é o 'any seguro'."
      },
      {
        nivel: "dificil",
        tema: "Tipos Especiais",
        pergunta: "Quando uma função tem o tipo de retorno never?",
        alternativas: [
          "Quando ela nunca retorna normalmente — por exemplo, sempre lança erro ou entra em loop infinito.",
          "Quando ela retorna undefined.",
          "Quando ela não recebe parâmetros.",
          "Quando ela retorna null."
        ],
        correta: 0,
        explicacao: "never representa a ausência total de retorno possível. Uma função que lança exceção sempre ou nunca termina tem retorno never. Retorno undefined ou null é o tipo void, não never — essa troca de conceito é a pegadinha clássica."
      },
      {
        nivel: "dificil",
        tema: "Generics",
        pergunta: "Em function primeiro<T>(lista: T[]): T, qual é o papel de T?",
        alternativas: [
          "É um parâmetro de tipo: o chamador define qual tipo será usado, mantendo a informação de tipo em vez de virar any.",
          "É um tipo fixo reservado do TypeScript, equivalente a object.",
          "É uma variável comum que guarda números.",
          "É um apelido obrigatório para a biblioteca React."
        ],
        correta: 0,
        explicacao: "Generics parametrizam tipos. Com primeiro<number>([1,2,3]) o retorno é number; com string, é string. Isso preserva a informação de tipo e evita o any, que apagaria toda a checagem."
      },
      {
        nivel: "dificil",
        tema: "Type Guards",
        pergunta: "Qual recurso permite ao TypeScript estreitar o tipo dentro de um bloco (ex.: saber que ali é string)?",
        alternativas: [
          "Type guard (typeof, instanceof, in ou uma função de predicado tipo 'x is string').",
          "O operador de concatenação (+) entre tipos.",
          "O modificador static da classe.",
          "O uso de var em vez de let."
        ],
        correta: 0,
        explicacao: "Type guards reduzem (narrowing) o tipo de um union para o compilador. typeof e instanceof são os mais usados; há também o 'in' para propriedades e funções de predicado que retornam 'valor is Tipo'."
      },
      {
        nivel: "dificil",
        tema: "Tipos Especiais",
        pergunta: "Qual a diferença entre void e never?",
        alternativas: [
          "void indica que a função retorna, mas sem valor útil; never indica que ela nunca retorna.",
          "void é para funções assíncronas e never para síncronas.",
          "void é um erro do compilador e never é válido.",
          "São sinônimos, o compilador trata igual."
        ],
        correta: 0,
        explicacao: "Uma função que apenas executa algo e não devolve valor tem retorno void (retorna undefined). Já never é para funções que não completam: lançam sempre ou nunca terminam. São conceitos diferentes, não sinônimos."
      },

      /* ---------- ULTRA DIFÍCIL ---------- */
      {
        nivel: "ultra",
        tema: "Utility Types",
        pergunta: "O que Partial<Usuario> faz com o tipo Usuario?",
        alternativas: [
          "Transforma todas as propriedades em opcionais.",
          "Remove todas as propriedades.",
          "Torna todas as propriedades somente leitura.",
          "Converte todas as propriedades para string."
        ],
        correta: 0,
        explicacao: "Partial<T> mapeia cada propriedade de T para T[K] | undefined, ou seja, todas viram opcionais. É ótimo para funções de atualização parcial. Readonly<T> é que deixa tudo imutável, Pick/Omit selecionam ou removem chaves."
      },
      {
        nivel: "ultra",
        tema: "Utility Types",
        pergunta: "Qual a diferença entre Pick<Usuario, \"nome\"> e Omit<Usuario, \"nome\">?",
        alternativas: [
          "Pick seleciona apenas as chaves informadas; Omit remove as chaves informadas e mantém o resto.",
          "Pick remove as chaves e Omit seleciona — são o inverso um do outro em relação à descrição correta.",
          "Os dois fazem a mesma coisa com nomes diferentes.",
          "Pick só funciona com tipos primitivos."
        ],
        correta: 0,
        explicacao: "Pick<T, K> constrói um tipo só com as chaves K. Omit<T, K> constrói o tipo sem as chaves K. Ou seja, são complementares. Trocar as definições é exatamente o erro que a alternativa B comete."
      },
      {
        nivel: "ultra",
        tema: "Conditional Types",
        pergunta: "Em type SoString<T> = T extends string ? \"sim\" : \"nao\";, o que está acontecendo?",
        alternativas: [
          "É um tipo condicional: se T for atribuível a string, o resultado é \"sim\", senão \"nao\".",
          "É uma validação em runtime que retorna sim ou nao ao executar.",
          "É uma função que compara duas strings em tempo de execução.",
          "É um erro de sintaxe, pois extends só existe em classes."
        ],
        correta: 0,
        explicacao: "Conditional types rodam em tempo de compilação: 'T extends U ? X : Y'. Nada disso existe no JavaScript gerado. Junto com a palavra-chave infer, é a base dos utility types nativos do TypeScript."
      },
      {
        nivel: "ultra",
        tema: "Tipos Avançados",
        pergunta: "Para que serve o operador keyof?",
        alternativas: [
          "Produz um union com os nomes (chaves) das propriedades de um tipo.",
          "Retorna o valor de uma propriedade em runtime.",
          "Remove as chaves de um objeto.",
          "Cria uma nova instância da classe."
        ],
        correta: 0,
        explicacao: "keyof T gera um union de literais com as chaves de T. Ex.: keyof Usuario = \"id\" | \"nome\". Combinado com tipos mapeados (type X = { [K in keyof T]: ... }), é a base da criação de tipos derivados, como Partial e Readonly."
      },
      {
        nivel: "ultra",
        tema: "Recursos da Linguagem",
        pergunta: "Sobre sobrecarga de função (function overloads) em TypeScript, é correto dizer que:",
        alternativas: [
          "Declara-se assinaturas de chamada antes de uma única implementação compatível com todas elas.",
          "Pode-se escrever várias implementações completas com o mesmo nome e o compilador escolhe em runtime.",
          "É proibida em TypeScript, só existe em Java e C#.",
          "Só funciona em métodos static."
        ],
        correta: 0,
        explicacao: "Overload em TS é só na camada de tipos: você escreve as assinaturas (sinais) e depois UMA implementação que aceite todas as variações. É diferente do overload de linguagens como Java, onde há vários corpos de método."
      },
      {
        nivel: "ultra",
        tema: "Type Guards",
        pergunta: "Por que é errado usar any no lugar de unknown? Qual a diferença real entre os dois?",
        alternativas: [
          "any aceita tudo e contamina o código, desligando a checagem; unknown aceita tudo, mas exige verificação antes do uso.",
          "any é mais restrito que unknown.",
          "unknown aceita qualquer valor em runtime e any não.",
          "Os dois foram removidos nas versões recentes do TypeScript."
        ],
        correta: 0,
        explicacao: "any é o escape de tipo: uma vez usado, o compilador para de checar aquele trecho e o 'any' se espalha. unknown é o 'any seguro': aceita qualquer valor na atribuição, mas obriga você a provar o tipo (typeof/instanceof) antes de manipular. São parecidos na entrada, mas opostos na segurança."
      }
    ]
  },

  /* ===========================================================================
     🧩  PROGRAMAÇÃO ORIENTADA A OBJETOS
     ======================================================================== */
  poo: {
    titulo: "Quiz de Programação Orientada a Objetos",
    subtitulo: "Pilares da POO + princípios SOLID, o que mais cai na prova.",
    questoes: [

      /* ---------- FÁCIL ---------- */
      {
        nivel: "facil",
        tema: "Classes e Objetos",
        pergunta: "Qual a diferença entre classe e objeto na POO?",
        alternativas: [
          "A classe é o molde/modelo; o objeto é uma instância criada a partir dela.",
          "O objeto é o molde e a classe é a instância.",
          "Os dois são a mesma coisa, só mudam de nome.",
          "A classe só existe em banco de dados."
        ],
        correta: 0,
        explicacao: "Classe define atributos e comportamentos (o molde). Objeto é a concretização desse molde, com valores próprios. Ex.: a classe Aluno define nome/matrícula; cada aluno criado é um objeto com seus próprios dados."
      },
      {
        nivel: "facil",
        tema: "Encapsulamento",
        pergunta: "O que o encapsulamento protege?",
        alternativas: [
          "Os atributos internos do objeto, que devem ser acessados por métodos controlados, e não diretamente de fora.",
          "O código-fonte, deixando-o ilegível para outros programadores.",
          "O banco de dados, impedindo consultas não autorizadas.",
          "A memória, liberando objetos automaticamente."
        ],
        correta: 0,
        explicacao: "Encapsulamento esconde o estado interno e expõe apenas o necessário (getters/setters/métodos). Isso evita que alguém de fora coloque o objeto em estado inválido, como definir uma idade negativa diretamente."
      },
      {
        nivel: "facil",
        tema: "Classes e Objetos",
        pergunta: "Dentro de uma classe, qual a diferença entre atributo e método?",
        alternativas: [
          "Atributo guarda estado (dados); método define comportamento (ações).",
          "Atributo é uma ação e método é um dado.",
          "Os dois guardam apenas números.",
          "Método é sempre público e atributo sempre privado."
        ],
        correta: 0,
        explicacao: "Atributos representam o estado do objeto, e métodos representam o que ele sabe fazer. Essa separação estado x comportamento é a base da modelagem em POO."
      },
      {
        nivel: "facil",
        tema: "Construtores",
        pergunta: "Para que serve o construtor de uma classe?",
        alternativas: [
          "Inicializar o objeto no momento da criação, normalmente atribuindo valores aos atributos.",
          "Destruir o objeto da memória.",
          "Listar todos os métodos da classe.",
          "Impedir a herança."
        ],
        correta: 0,
        explicacao: "O construtor roda quando o objeto é instanciado (new) e serve para deixar o objeto em estado válido já no nascimento. Quem gerencia a memória depois é o garbage collector (ou destrutor, em algumas linguagens)."
      },
      {
        nivel: "facil",
        tema: "Herança",
        pergunta: "O que a herança permite?",
        alternativas: [
          "Que uma classe reutilize atributos e métodos de outra, criando uma relação 'é um'.",
          "Que duas classes sejam exatamente iguais.",
          "Que um objeto tenha dois tipos primitivos ao mesmo tempo.",
          "Que métodos sejam executados mais rápido."
        ],
        correta: 0,
        explicacao: "Herança estabelece relação 'é um': Cachorro é um Animal, então herda o que Animal tem e pode especializar. É uma forma de reúso, mas use com parcimônia — composição costuma ser mais flexível."
      },

      /* ---------- MÉDIO ---------- */
      {
        nivel: "medio",
        tema: "Polimorfismo",
        pergunta: "Polimorfismo na POO significa que:",
        alternativas: [
          "Um mesmo método pode assumir comportamentos diferentes conforme o tipo real do objeto.",
          "Uma classe pode ter vários nomes diferentes.",
          "Um objeto pode ter várias classes ao mesmo tempo.",
          "Todo método precisa ter o mesmo nome da classe."
        ],
        correta: 0,
        explicacao: "Polimorfismo ('muitas formas') permite chamar a mesma assinatura, e cada subclasse responder do seu jeito. Ex.: animal.emitirSom() late se for Cachorro e mia se for Gato — sem o código cliente precisar saber disso."
      },
      {
        nivel: "medio",
        tema: "Abstração",
        pergunta: "O que é abstração em POO?",
        alternativas: [
          "Expor apenas as características essenciais e esconder os detalhes internos de implementação.",
          "Deixar o código mais complexo de propósito.",
          "Transformar todo atributo em público.",
          "Remover métodos da classe."
        ],
        correta: 0,
        explicacao: "Abstração é focar no que o objeto faz, e não em como ele faz. É por isso que você usa lista.add() sem saber se dentro há array ou lista encadeada — o detalhe está escondido."
      },
      {
        nivel: "medio",
        tema: "Classes Abstratas",
        pergunta: "Qual é a característica principal de uma classe abstrata?",
        alternativas: [
          "Não pode ser instanciada diretamente; serve de base para subclasses.",
          "Não pode ter métodos implementados.",
          "Não pode ser herdada.",
          "Só pode conter atributos estáticos."
        ],
        correta: 0,
        explicacao: "Classe abstrata é incompleta de propósito: não se faz new nela, apenas herda. Ela pode ter métodos concretos e abstratos. Quem não tem nenhuma implementação e só define contrato é a interface."
      },
      {
        nivel: "medio",
        tema: "Interfaces",
        pergunta: "Qual a diferença mais marcante entre interface e classe abstrata?",
        alternativas: [
          "Uma classe pode implementar várias interfaces, mas herdar apenas uma classe (abstrata ou não).",
          "Interface pode ter atributos de instância e classe abstrata não.",
          "Classe abstrata aceita múltipla herança de classes na maioria das linguagens.",
          "Interface gera código em runtime, classe abstrata não."
        ],
        correta: 0,
        explicacao: "A grande vantagem da interface é a multiplicidade: implementa-se quantas quiser. Já a herança de classe é única (na maioria das linguagens). Por isso se diz 'herança é única, implementação é múltipla'."
      },
      {
        nivel: "medio",
        tema: "Classes e Objetos",
        pergunta: "Para que serve a palavra-chave this dentro de um método?",
        alternativas: [
          "Referenciar o objeto atual, diferenciando atributos de instância de parâmetros com o mesmo nome.",
          "Chamar a classe pai obrigatoriamente.",
          "Criar um novo objeto.",
          "Declarar uma constante global."
        ],
        correta: 0,
        explicacao: "this aponta para o objeto que está recebendo a chamada. Em this.nome = nome, o lado esquerdo é o atributo do objeto e o direito é o parâmetro — sem this haveria ambiguidade."
      },

      /* ---------- DIFÍCIL ---------- */
      {
        nivel: "dificil",
        tema: "Sobrescrita e Sobrecarga",
        pergunta: "Qual a diferença entre sobrescrita (override) e sobrecarga (overload)?",
        alternativas: [
          "Override redefine um método herdado mantendo a assinatura; overload cria métodos com o mesmo nome e assinaturas diferentes.",
          "Override cria vários métodos com o mesmo nome; overload redefine o método do pai.",
          "São sinônimos, a tradução muda conforme a região.",
          "Override só existe em interfaces."
        ],
        correta: 0,
        explicacao: "Override = mesma assinatura, comportamento novo na subclasse (polimorfismo). Overload = mesmo nome, parâmetros diferentes (ex.: calcular(int) e calcular(int, int)). Trocar os conceitos é o erro clássico."
      },
      {
        nivel: "dificil",
        tema: "Composição e Herança",
        pergunta: "Por que a composição costuma ser preferida à herança?",
        alternativas: [
          "Porque gera menor acoplamento e maior flexibilidade, evitando a rigidez da hierarquia de classes.",
          "Porque composição deixa o código mais rápido que herança sempre.",
          "Porque herança não permite reúso nenhum.",
          "Porque composição elimina a necessidade de encapsulamento."
        ],
        correta: 0,
        explicacao: "Herança cria acoplamento forte: mudar a superclasse afeta as subclasses. Composição ('tem um') permite trocar o comportamento em runtime, com menos dependência estrutural. Daí o princípio 'prefira composição a herança'."
      },
      {
        nivel: "dificil",
        tema: "Membros Estáticos",
        pergunta: "O que significa um atributo static em uma classe?",
        alternativas: [
          "Ele pertence à classe e é compartilhado por todas as instâncias, não a um objeto específico.",
          "Ele é imutável e privado.",
          "Ele só pode ser usado em métodos abstratos.",
          "Ele é criado uma vez para cada objeto."
        ],
        correta: 0,
        explicacao: "Membro static existe na classe, não na instância. Um contador static de objetos criados, por exemplo, é o mesmo para todos. Acessa-se por Classe.membro, não por objeto.membro."
      },
      {
        nivel: "dificil",
        tema: "Encapsulamento",
        pergunta: "Para que servem getters e setters?",
        alternativas: [
          "Controlar o acesso a atributos privados, permitindo validar ou transformar valores na leitura/escrita.",
          "Expor atributos públicos como se fossem privados.",
          "Criar construtores alternativos.",
          "Impedir a criação de objetos."
        ],
        correta: 0,
        explicacao: "Getter/setter são a porta de entrada controlada: o atributo continua privado, mas o acesso passa por um método que pode validar (ex.: recusar idade negativa). É encapsulamento aplicado, não burocracia inútil."
      },
      {
        nivel: "dificil",
        tema: "Modificadores de Acesso",
        pergunta: "Qual a diferença entre private e protected?",
        alternativas: [
          "private só é acessível na própria classe; protected também é acessível nas subclasses.",
          "protected só é acessível na própria classe; private também nas subclasses.",
          "Os dois liberam acesso para qualquer classe do projeto.",
          "private é usado só em atributos e protected só em métodos."
        ],
        correta: 0,
        explicacao: "private é o mais fechado: nem a subclasse enxerga. protected abre o acesso para a hierarquia (classe e suas herdeiras). public é o mais aberto de todos. Essa gradação é pergunta frequente."
      },

      /* ---------- ULTRA DIFÍCIL ---------- */
      {
        nivel: "ultra",
        tema: "SOLID",
        pergunta: "O princípio da Responsabilidade Única (SRP) diz que:",
        alternativas: [
          "Uma classe deve ter apenas um motivo para mudar, ou seja, uma única responsabilidade.",
          "Uma classe deve ter apenas um método.",
          "Um projeto deve ter apenas uma classe.",
          "Uma função deve retornar apenas um tipo primitivo."
        ],
        correta: 0,
        explicacao: "SRP não é 'um método por classe', é 'uma razão para mudar'. Uma classe que calcula imposto, salva no banco e manda e-mail tem três motivos para mudar — logo, deve ser dividida. As alternativas B e C exageram a ideia e estão erradas."
      },
      {
        nivel: "ultra",
        tema: "SOLID",
        pergunta: "O princípio Aberto/Fechado (OCP) afirma que as entidades de software devem:",
        alternativas: [
          "Estar abertas para extensão e fechadas para modificação.",
          "Ser sempre públicas para alteração por qualquer classe.",
          "Ser abertas só para leitura e fechadas para escrita.",
          "Poder ser modificadas apenas pelo autor original."
        ],
        correta: 0,
        explicacao: "OCP: você deve conseguir adicionar comportamento novo (extensão) sem mexer no código já testado (modificação). Abstrações/interfaces e polimorfismo são as ferramentas para isso — na prática, trocar if/else por novas implementações."
      },
      {
        nivel: "ultra",
        tema: "SOLID",
        pergunta: "O princípio da Substituição de Liskov (LSP) determina que:",
        alternativas: [
          "Objetos de uma subclasse devem poder substituir objetos da superclasse sem quebrar o comportamento esperado.",
          "Toda superclasse deve ter mais métodos que a subclasse.",
          "Toda subclasse deve ser idêntica à superclasse.",
          "Classes filhas não podem sobrescrever métodos."
        ],
        correta: 0,
        explicacao: "LSP garante que o polimorfismo funcione de verdade: se o código espera um Animal e recebe um Cachorro, tudo deve continuar funcionando. O exemplo clássico de violação é fazer Pinguim herdar de Ave com método voar() que lança exceção."
      },
      {
        nivel: "ultra",
        tema: "SOLID",
        pergunta: "O princípio da Inversão de Dependência (DIP) recomenda que:",
        alternativas: [
          "Módulos de alto nível dependam de abstrações, e não de implementações concretas.",
          "Toda classe dependa diretamente de outra classe concreta.",
          "As dependências sejam invertidas trocando herança por variáveis globais.",
          "Só classes abstratas possam ter métodos."
        ],
        correta: 0,
        explicacao: "DIP: dependa de interfaces, não de classes concretas (ex.: um ServicoPedido depende de RepositorioPedido interface, não de MySQLPedido). Isso permite trocar a implementação e testar com mocks — é a base da injeção de dependência."
      },
      {
        nivel: "ultra",
        tema: "Qualidade de Projeto",
        pergunta: "Sobre acoplamento e coesão, o objetivo de um bom projeto orientado a objetos é:",
        alternativas: [
          "Baixo acoplamento entre classes e alta coesão dentro de cada classe.",
          "Alto acoplamento e baixa coesão, para centralizar o código.",
          "Alto acoplamento e alta coesão.",
          "Tanto faz, isso não afeta a manutenção."
        ],
        correta: 0,
        explicacao: "Coesão alta = a classe faz uma coisa só e faz bem. Acoplamento baixo = as classes dependem pouco umas das outras. Essa combinação é o que torna o sistema fácil de manter e evoluir. O contrário vira aquele código em que mexer em um ponto quebra três lugares."
      }
    ]
  }
};

/* =============================================================================
   MOTOR DO QUIZ
   Uma "classe" simples pra não repetir código nas três páginas.
   ============================================================================= */
class Quiz {
  constructor(chave) {
    this.chave = chave;
    this.config = QUIZZES[chave];
    this.raiz = document.getElementById("quiz-" + chave);
    this.nivelEscolhido = "todos";
    this.estado = "selecao"; // selecao | jogando | resultado
    this.render();
  }

  /* Embaralha um array do jeito clássico (Fisher-Yates) */
  embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /* Monta a tela de escolha do nível */
  render() {
    if (this.estado === "selecao") this.telaSelecao();
    else if (this.estado === "jogando") this.telaQuestao();
    else this.telaResultado();
  }

  /* ------------------------- TELA 1: escolha do nível ------------------------ */
  telaSelecao() {
    const total = this.config.questoes.length;
    let botoes = "";

    ORDEM_NIVEIS.forEach((nivel) => {
      const qtd =
        nivel === "todos"
          ? total
          : this.config.questoes.filter((q) => q.nivel === nivel).length;
      const info = NIVEIS[nivel];
      const selecionado = nivel === this.nivelEscolhido ? " selecionado" : "";
      botoes += `
        <button type="button" class="nivel${selecionado}" data-nivel="${nivel}">
          ${info.rotulo}
          <small>${qtd} questão(ões) — ${info.desc}</small>
        </button>`;
    });

    this.raiz.innerHTML = `
      <div class="quiz-cabecalho">
        <h3 class="quiz-titulo">${this.config.titulo}</h3>
        <p class="quiz-sub">${this.config.subtitulo}</p>
      </div>

      <ul class="quiz-instrucoes">
        <li>Escolha um nível abaixo.</li>
        <li>As questões aparecem uma por vez, em ordem embaralhada.</li>
        <li>No final você vê o placar e a correção das que errou.</li>
      </ul>

      <div class="niveis">${botoes}</div>

      <div class="quiz-acoes">
        <button type="button" class="btn btn-primario" id="btnIniciar-${this.chave}">
          Começar quiz →
        </button>
      </div>
    `;

    // Clique nos níveis
    this.raiz.querySelectorAll(".nivel").forEach((botao) => {
      botao.addEventListener("click", () => {
        this.nivelEscolhido = botao.dataset.nivel;
        this.telaSelecao();
      });
    });

    // Botão iniciar (usa querySelector porque getElementById só existe no document)
    this.raiz
      .querySelector("#btnIniciar-" + this.chave)
      .addEventListener("click", () => this.iniciar());
  }

  /* ------------------------- Início do jogo ------------------------- */
  iniciar() {
    let lista = this.config.questoes;
    if (this.nivelEscolhido !== "todos") {
      lista = lista.filter((q) => q.nivel === this.nivelEscolhido);
    }

    // Embaralha as questões e também as alternativas de cada uma
    this.questoes = this.embaralhar(lista).map((q) => {
      const alternativasEmbaralhadas = this.embaralhar(
        q.alternativas.map((texto, indice) => ({
          texto,
          correta: indice === q.correta
        }))
      );
      return { ...q, alternativasMisturadas: alternativasEmbaralhadas };
    });

    this.indiceAtual = 0;
    this.acertos = 0;
    this.erros = [];
    this.respondida = false;
    this.estado = "jogando";
    this.render();
  }

  /* ------------------------- TELA 2: questão ------------------------- */
  telaQuestao() {
    const questao = this.questoes[this.indiceAtual];
    const total = this.questoes.length;
    const numero = this.indiceAtual + 1;
    const porcentagem = Math.round((numero / total) * 100);

    const letras = ["A", "B", "C", "D", "E", "F"];
    let htmlAlternativas = "";

    questao.alternativasMisturadas.forEach((alt, i) => {
      htmlAlternativas += `
        <button type="button" class="alternativa" data-indice="${i}">
          <span class="letra">${letras[i]}</span>
          <span>${alt.texto}</span>
        </button>`;
    });

    this.raiz.innerHTML = `
      <div class="progresso-topo">
        <span>Questão ${numero} de ${total}</span>
        <span>Acertos até agora: <strong>${this.acertos}</strong></span>
      </div>
      <div class="barra"><div class="barra-fill" style="width:${porcentagem}%"></div></div>

      <div class="etiquetas">
        <span class="etiqueta ${questao.nivel}">${NIVEIS[questao.nivel].rotulo}</span>
        <span class="etiqueta">${questao.tema}</span>
      </div>

      <h3 class="pergunta">${questao.pergunta}</h3>
      <div class="alternativas">${htmlAlternativas}</div>

      <div id="feedback-${this.chave}"></div>

      <div class="quiz-acoes" id="acoes-${this.chave}"></div>
    `;

    this.raiz.querySelectorAll(".alternativa").forEach((botao) => {
      botao.addEventListener("click", () => {
        this.responder(Number(botao.dataset.indice));
      });
    });
  }

  /* ------------------------- Resposta do usuário ------------------------- */
  responder(indiceEscolhido) {
    if (this.respondida) return;
    this.respondida = true;

    const questao = this.questoes[this.indiceAtual];
    const alternativas = questao.alternativasMisturadas;
    const acertou = alternativas[indiceEscolhido].correta;
    const botoes = this.raiz.querySelectorAll(".alternativa");

    // Pinta as alternativas e trava os cliques
    botoes.forEach((botao, i) => {
      botao.classList.add("travada");
      if (alternativas[i].correta) botao.classList.add("certa");
      else if (i === indiceEscolhido) botao.classList.add("errada");
    });

    if (acertou) {

      this.acertos++;

      this.raiz.querySelector("#feedback-" + this.chave).innerHTML = `
        <div class="feedback ok">
          <h4>✅ Boa! Resposta correta.</h4>
          <p><strong>Por quê:</strong> ${questao.explicacao}</p>
        </div>`;

    } else {

      // Guarda pra revisão do final
      this.erros.push({
        pergunta: questao.pergunta,
        nivel: questao.nivel,
        tema: questao.tema,
        suaResposta: alternativas[indiceEscolhido].texto,
        respostaCerta: alternativas.find((a) => a.correta).texto,
        explicacao: questao.explicacao
      });

      this.raiz.querySelector("#feedback-" + this.chave).innerHTML = `
        <div class="feedback erro">
          <h4>❌ Errou essa.</h4>
          <p><strong>Resposta correta:</strong> ${alternativas.find((a) => a.correta).texto}</p>
          <p><strong>Motivo:</strong> ${questao.explicacao}</p>
        </div>`;
    }

    // Botão de avançar
    const ehUltima = this.indiceAtual === this.questoes.length - 1;
    this.raiz.querySelector("#acoes-" + this.chave).innerHTML = `
      <button type="button" class="btn btn-primario" id="btnProxima-${this.chave}">
        ${ehUltima ? "Ver resultado 🏁" : "Próxima questão →"}
      </button>`;

    this.raiz
      .querySelector("#btnProxima-" + this.chave)
      .addEventListener("click", () => {
        if (ehUltima) {
          this.estado = "resultado";
          this.render();
        } else {
          this.indiceAtual++;
          this.respondida = false;
          this.render();
        }
      });
  }

  /* ------------------------- TELA 3: resultado ------------------------- */
  telaResultado() {
    const total = this.questoes.length;
    const acertos = this.acertos;
    const erros = this.erros.length;
    const porcentagem = Math.round((acertos / total) * 100);

    // Mensagem de acordo com o desempenho
    let mensagem;
    if (porcentagem === 100) {
      mensagem = "<strong>Gabaritou! 🏆</strong> Pode ir tranquilo pra prova, tá afiado.";
    } else if (porcentagem >= 80) {
      mensagem = "<strong>Mandou muito bem! 🚀</strong> Revisa só os pontos das questões erradas e tá pronto.";
    } else if (porcentagem >= 60) {
      mensagem = "<strong>Tá no caminho! 💪</strong> Boa base, mas dá uma lida nas explicações abaixo antes da prova.";
    } else if (porcentagem >= 40) {
      mensagem = "<strong>Atenção! 📚</strong> Precisa revisar os temas que errou com calma — o resumo ajuda bastante.";
    } else {
      mensagem = "<strong>Calma, dá tempo! ☕</strong> Volta no conteúdo, revê o mapa mental e refaz o quiz.";
    }

    let htmlRevisao = "";

    if (erros === 0) {
      htmlRevisao = `
        <div class="quadro-perfeito">
          🎉 Você não errou nenhuma questão. Nada a revisar nesse nível!
        </div>`;
    } else {
      htmlRevisao = this.erros
        .map((erro, i) => {
          return `
            <article class="revisao-item">
              <div class="etiquetas">
                <span class="etiqueta ${erro.nivel}">${NIVEIS[erro.nivel].rotulo}</span>
                <span class="etiqueta">${erro.tema}</span>
              </div>
              <h4>${i + 1}. ${erro.pergunta}</h4>

              <div class="revisao-bloco sua">
                <span>Sua resposta</span>
                ${erro.suaResposta}
              </div>

              <div class="revisao-bloco certa">
                <span>Resposta correta</span>
                ${erro.respostaCerta}
              </div>

              <div class="revisao-bloco explica">
                <span>Por que a correta está certa e a sua errada</span>
                ${erro.explicacao}
              </div>
            </article>`;
        })
        .join("");
    }

    this.raiz.innerHTML = `
      <div class="quiz-cabecalho">
        <h3 class="quiz-titulo">🏁 Resultado — ${this.config.titulo}</h3>
        <p class="quiz-sub">Nível: ${NIVEIS[this.nivelEscolhido].rotulo}</p>
      </div>

      <div class="resultado-placar">
        <div class="placar-item acertos">
          <span>Acertos</span>
          <strong>${acertos}</strong>
        </div>
        <div class="placar-item erros">
          <span>Erros</span>
          <strong>${erros}</strong>
        </div>
        <div class="placar-item pct">
          <span>Aproveitamento</span>
          <strong>${porcentagem}%</strong>
        </div>
      </div>

      <div class="mensagem-final">${mensagem}</div>

      <div class="revisao">
        <h3>📋 Correção das questões erradas</h3>
        <p>Motivo do erro e por que a alternativa correta é a certa.</p>
        ${htmlRevisao}
      </div>

      <div class="quiz-acoes">
        <button type="button" class="btn btn-secundario" id="btnRefazer-${this.chave}">
          Escolher outro nível
        </button>
        <button type="button" class="btn btn-primario" id="btnDeNovo-${this.chave}">
          Refazer as ${total} questões ↻
        </button>
      </div>
    `;

    this.raiz
      .querySelector("#btnRefazer-" + this.chave)
      .addEventListener("click", () => {
        this.estado = "selecao";
        this.render();
      });

    this.raiz
      .querySelector("#btnDeNovo-" + this.chave)
      .addEventListener("click", () => this.iniciar());
  }
}

/* =============================================================================
   NAVEGAÇÃO ENTRE AS PÁGINAS (menu)
   ============================================================================= */
function irPara(pagina) {
  document.querySelectorAll(".pagina").forEach((secao) => {
    secao.classList.remove("ativa");
  });

  const destino = document.getElementById("pagina-" + pagina);
  if (destino) destino.classList.add("ativa");

  document.querySelectorAll(".menu-link").forEach((link) => {
    link.classList.toggle("ativo", link.dataset.pagina === pagina);
  });

  // Fecha o menu mobile
  document.getElementById("menu").classList.remove("aberto");
  document.getElementById("btnMenu").setAttribute("aria-expanded", "false");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =============================================================================
   INICIALIZAÇÃO — roda quando a página carrega
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {

  // Cria o quiz de cada matéria
  new Quiz("bd");
  new Quiz("ts");
  new Quiz("poo");

  // Navegação (inclusive nos cards da home)
  document.querySelectorAll("[data-pagina]").forEach((elemento) => {
    elemento.addEventListener("click", (evento) => {
      evento.preventDefault();
      irPara(elemento.dataset.pagina);
    });
  });

  // Botão do menu no mobile
  const btnMenu = document.getElementById("btnMenu");
  const menu = document.getElementById("menu");

  btnMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", String(aberto));
  });

  // Se a URL já vier com hash, abre a página certa
  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById("pagina-" + hash)) {
    irPara(hash);
  }
});


/* =============================================================================
   PARTE NOVA: LEITOR DE ARQUIVOS E PASTAS (drag and drop)
   Arquivo original: leitor-arquivos.js
   ============================================================================= */

/* =============================================================================
   leitor-arquivos.js
   -----------------------------------------------------------------------------
   Responsabilidade: receber a "dropada" do usuário (arquivo OU pasta) e devolver
   uma lista de "documentos" prontos pra análise.

   AGORA ACEITA TUDO:
     - TEXTO   -> .txt .md .ts .js .sql .java .json .html .csv, etc. (lê direto)
     - PDF     -> extrai o texto com pdf.js E guarda as páginas como imagem
                  pra embutir no PDF final (anexo).
     - IMAGEM  -> .png .jpg .jpeg .webp .gif .bmp (texto por OCR com Tesseract
                  E a imagem embutida no PDF final).
     - DOCX    -> .docx (texto via mammoth; se faltar, tenta via ZIP).
     - OFFICE  -> .pptx .xlsx .odt .ods .odp (texto via JSZip).
     - DIA     -> .dia (é gzip + XML: descomprime e limpa as tags).
     - RTF     -> .rtf (limpa os códigos de formatação).
     - OUTROS  -> qualquer extensão. Mesmo sem texto, a gente guarda o arquivo
                  pra ele aparecer na lista do PDF final.

   SEM LIMITES: não tem teto de quantidade de arquivos, nem de páginas de PDF,
   nem de imagens no OCR. É só o que o navegador aguentar (cuidado com milhares
   de arquivos + OCR, que fica lento).

   PACOTE DE PASTA: arrastar pasta no navegador é cheio de pegadinha, então a
   gente tenta TRÊS estratégias, na ordem, até achar arquivo:
     1) getAsFileSystemHandle()  -> API nova (Chrome/Edge). A mais confiável.
     2) webkitGetAsEntry()       -> API clássica (Chrome/Edge/Firefox).
     3) dataTransfer.files       -> último recurso (arquivos soltos).

   Feito no padrão BR: comentário explicando e nome de variável em português. 🇧🇷☕
   ============================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     CONFIGURAÇÃO — mexa aqui se quiser voltar a pôr limite
     --------------------------------------------------------------------------- */

  const CONFIG = {
    limiteArquivos: 0,        // 0 = SEM limite de quantidade de arquivos
    maxPaginasPdfImagem: 0,   // 0 = TODAS as páginas do PDF viram imagem anexa
    maxImagensOcr: 0,         // 0 = TODAS as imagens passam pelo OCR
    ignorarPastas: [],        // nada de pasta ignorada aqui
    incluirSubpastas: false   // por padrão NÃO entra em subpastas (evita pegar arquivo que você não quer)
  };

  const EXTENSOES_TEXTO = [
    "txt", "md", "markdown", "text", "log",
    "js", "mjs", "cjs", "ts", "tsx", "jsx", "json", "jsonc",
    "css", "scss", "sass", "less",
    "html", "htm", "xml", "svg",
    "sql", "java", "cs", "py", "c", "cpp", "h", "hpp",
    "php", "rb", "go", "rs", "kt", "swift", "dart", "lua", "r",
    "yml", "yaml", "toml", "ini", "conf", "cfg",
    "csv", "tsv", "sh", "bash", "bat", "ps1", "env"
  ];

  const EXTENSOES_IMAGEM = ["png", "jpg", "jpeg", "webp", "gif", "bmp", "avif", "ico", "tiff", "tif"];
  const EXTENSOES_DOCX = ["docx", "docm"];
  const EXTENSOES_OFFICE_ZIP = ["pptx", "pptm", "xlsx", "xlsm", "odt", "ods", "odp"];
  const EXTENSOES_RTF = ["rtf"];
  const EXTENSOES_DIA = ["dia"];

  const LIMITE_TEXTO = 2 * 1024 * 1024;    // 2 MB por arquivo de texto
  const LIMITE_PDF = 200 * 1024 * 1024;    // 200 MB por PDF
  const LIMITE_IMAGEM = 60 * 1024 * 1024;  // 60 MB por imagem
  const LIMITE_OFFICE = 100 * 1024 * 1024; // 100 MB por office/dia

  const diagnostico = {
    itens: 0,
    comHandle: 0,
    comEntrada: 0,
    arquivosSoltos: 0,
    estrategiaUsada: "nenhuma",
    encontrados: 0
  };

  /* ---------------------------------------------------------------------------
     FUNÇÕES AUXILIARES
     --------------------------------------------------------------------------- */

  function pegarExtensao(nome) {
    const partes = String(nome).split(".");
    if (partes.length < 2) return "";
    return partes.pop().toLowerCase();
  }

  // Descobre o tipo do arquivo. TODO arquivo tem um tipo; "outro" quer dizer
  // "não sei ler o texto, mas aceito e listo no PDF".
  function detectarTipo(arquivo) {
    const extensao = pegarExtensao(arquivo.name);
    const mime = String(arquivo.type || "").toLowerCase();

    if (extensao === "pdf" || mime === "application/pdf") return "pdf";
    if (EXTENSOES_IMAGEM.indexOf(extensao) !== -1 || mime.indexOf("image/") === 0) return "imagem";
    if (EXTENSOES_DOCX.indexOf(extensao) !== -1) return "docx";
    if (EXTENSOES_OFFICE_ZIP.indexOf(extensao) !== -1) return "office";
    if (EXTENSOES_DIA.indexOf(extensao) !== -1) return "dia";
    if (EXTENSOES_RTF.indexOf(extensao) !== -1) return "rtf";
    if (EXTENSOES_TEXTO.indexOf(extensao) !== -1 || mime.indexOf("text/") === 0) return "texto";
    return "outro";
  }

  function ehArquivoTexto(nome) {
    return EXTENSOES_TEXTO.indexOf(pegarExtensao(nome)) !== -1;
  }

  // Agora aceita QUALQUER arquivo. Mantido pra compatibilidade.
  function ehArquivoAceito() {
    return true;
  }

  function ehPastaIgnorada(nomePasta) {
    return CONFIG.ignorarPastas.indexOf(String(nomePasta).toLowerCase()) !== -1;
  }

  function passarDoLimite(lista) {
    return CONFIG.limiteArquivos > 0 && lista.length >= CONFIG.limiteArquivos;
  }

  function montarCaminho(prefixo, nome) {
    if (!prefixo) return nome;
    return prefixo.charAt(prefixo.length - 1) === "/"
      ? prefixo + nome
      : prefixo + "/" + nome;
  }

  function avisar(avisarProgresso, total) {
    if (avisarProgresso) avisarProgresso(total);
  }

  function arquivoParaDataUrl(arquivo) {
    return new Promise(function (resolver, rejeitar) {
      const leitor = new FileReader();
      leitor.onload = function () { resolver(leitor.result); };
      leitor.onerror = function () { rejeitar(new Error("não deu pra ler o arquivo")); };
      leitor.readAsDataURL(arquivo);
    });
  }

  // Tira as tags/marcadores de XML e sobra só o texto legível.
  function limparXml(xml) {
    return String(xml || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&#?[a-z0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function descomprimirGzip(arrayBuffer) {
    if (typeof DecompressionStream === "undefined") return "";
    try {
      const fluxo = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"));
      return await new Response(fluxo).text();
    } catch (erro) {
      return "";
    }
  }

  /* ---------------------------------------------------------------------------
     ESTRATÉGIA 1 — File System Access API (getAsFileSystemHandle)
     --------------------------------------------------------------------------- */

  async function percorrerHandle(handle, caminhoAtual, lista, avisarProgresso, profundidade) {
    if (!handle || passarDoLimite(lista)) return;

    if (handle.kind === "file") {
      try {
        const arquivo = await handle.getFile();
        lista.push({ arquivo: arquivo, caminho: montarCaminho(caminhoAtual, handle.name) });
        avisar(avisarProgresso, lista.length);
      } catch (erro) { /* arquivo ilegível: segue o baile */ }
      return;
    }

    if (handle.kind === "directory") {
      if (ehPastaIgnorada(handle.name)) return;
      // Só entra em subpasta se o usuário mandar. Assim ele não pega arquivo a mais.
      if (profundidade > 0 && !CONFIG.incluirSubpastas) return;
      const caminhoPasta = montarCaminho(caminhoAtual, handle.name);
      try {
        for await (const filho of handle.values()) {
          if (passarDoLimite(lista)) return;
          await percorrerHandle(filho, caminhoPasta, lista, avisarProgresso, profundidade + 1);
        }
      } catch (erro) { /* pasta ilegível: ignora */ }
    }
  }

  /* ---------------------------------------------------------------------------
     ESTRATÉGIA 2 — webkitGetAsEntry (clássica)
     --------------------------------------------------------------------------- */

  function percorrerEntrada(entrada, caminhoAtual, lista, avisarProgresso, profundidade) {
    return new Promise(function (resolver) {
      if (!entrada) { resolver(); return; }

      if (entrada.isFile) {
        if (passarDoLimite(lista)) { resolver(); return; }
        entrada.file(
          function (arquivo) {
            lista.push({ arquivo: arquivo, caminho: montarCaminho(caminhoAtual, entrada.name) });
            avisar(avisarProgresso, lista.length);
            resolver();
          },
          function () { resolver(); }
        );
        return;
      }

      if (entrada.isDirectory) {
        if (ehPastaIgnorada(entrada.name)) { resolver(); return; }
        // Só entra em subpasta se o usuário mandar.
        if (profundidade > 0 && !CONFIG.incluirSubpastas) { resolver(); return; }

        let leitor;
        try {
          leitor = entrada.createReader();
        } catch (erro) { resolver(); return; }

        const caminhoPasta = montarCaminho(caminhoAtual, entrada.name);

        function lerLote() {
          leitor.readEntries(
            function (filhos) {
              if (!filhos || filhos.length === 0) { resolver(); return; }
              let indice = 0;
              function proximo() {
                if (indice >= filhos.length) { lerLote(); return; }
                const filho = filhos[indice];
                indice += 1;
                percorrerEntrada(filho, caminhoPasta, lista, avisarProgresso, profundidade + 1).then(proximo);
              }
              proximo();
            },
            function () { resolver(); }
          );
        }

        lerLote();
        return;
      }

      resolver();
    });
  }

  /* ---------------------------------------------------------------------------
     CAPTURA SÍNCRONA (tem que ser AGORA, durante o evento de drop)
     --------------------------------------------------------------------------- */

  function capturar(dataTransfer) {
    const capturado = { handles: [], entradas: [], arquivos: [] };

    const itens = dataTransfer && dataTransfer.items ? dataTransfer.items : [];
    diagnostico.itens = itens.length || 0;

    for (let i = 0; i < itens.length; i += 1) {
      const item = itens[i];
      if (!item || item.kind !== "file") continue;

      if (typeof item.getAsFileSystemHandle === "function") {
        try {
          const promessa = item.getAsFileSystemHandle();
          if (promessa) capturado.handles.push(promessa);
        } catch (erro) { /* ignora */ }
      }

      if (typeof item.webkitGetAsEntry === "function") {
        try {
          const entrada = item.webkitGetAsEntry();
          if (entrada) capturado.entradas.push(entrada);
        } catch (erro) { /* ignora */ }
      }
    }

    diagnostico.comHandle = capturado.handles.length;
    diagnostico.comEntrada = capturado.entradas.length;

    const arquivos = dataTransfer && dataTransfer.files ? dataTransfer.files : [];
    for (let i = 0; i < arquivos.length; i += 1) capturado.arquivos.push(arquivos[i]);
    diagnostico.arquivosSoltos = capturado.arquivos.length;

    return capturado;
  }

  /* ---------------------------------------------------------------------------
     FUNÇÃO PRINCIPAL DE LEITURA DA DROPADA
     --------------------------------------------------------------------------- */

  async function lerDrop(dataTransfer, avisarProgresso) {
    const capturado = capturar(dataTransfer);

    if (capturado.handles.length) {
      const lista = [];
      for (let i = 0; i < capturado.handles.length; i += 1) {
        try {
          const handle = await capturado.handles[i];
          await percorrerHandle(handle, "", lista, avisarProgresso, 0);
        } catch (erro) { /* tenta o próximo */ }
      }
      if (lista.length) {
        diagnostico.estrategiaUsada = "getAsFileSystemHandle";
        diagnostico.encontrados = lista.length;
        return lista;
      }
    }

    if (capturado.entradas.length) {
      const lista = [];
      for (let i = 0; i < capturado.entradas.length; i += 1) {
        await percorrerEntrada(capturado.entradas[i], "", lista, avisarProgresso, 0);
      }
      if (lista.length) {
        diagnostico.estrategiaUsada = "webkitGetAsEntry";
        diagnostico.encontrados = lista.length;
        return lista;
      }
    }

    const soltos = capturado.arquivos.map(function (arquivo) {
      return { arquivo: arquivo, caminho: arquivo.webkitRelativePath || arquivo.name };
    });
    diagnostico.estrategiaUsada = soltos.length ? "dataTransfer.files" : "nenhuma";
    diagnostico.encontrados = soltos.length;
    return soltos;
  }

  /* ---------------------------------------------------------------------------
     LEITURA DE PDF (pdf.js)
     --------------------------------------------------------------------------- */

  async function extrairDePdf(arquivo, avisarProgresso, caminho) {
    const pdfjs = window.pdfjsLib;
    if (!pdfjs) return { texto: "", paginasImagens: [], numPaginas: 0, erro: "pdf.js não carregou." };

    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const buffer = await arquivo.arrayBuffer();
    const documentoPdf = await pdfjs.getDocument({ data: buffer, isEvalSupported: false }).promise;

    let texto = "";
    const paginasImagens = [];
    const total = documentoPdf.numPages;
    const limiteImagem = CONFIG.maxPaginasPdfImagem > 0
      ? Math.min(total, CONFIG.maxPaginasPdfImagem)
      : total; // 0 = todas

    for (let p = 1; p <= total; p += 1) {
      if (avisarProgresso) avisarProgresso(0, 0, caminho + " (página " + p + "/" + total + ")", "pdf");
      const pagina = await documentoPdf.getPage(p);

      const conteudo = await pagina.getTextContent();
      texto += "\n\n[Página " + p + "]\n" + conteudo.items.map(function (i) { return i.str; }).join(" ");

      if (p <= limiteImagem) {
        try {
          const visao = pagina.getViewport({ scale: 1.4 });
          const tela = document.createElement("canvas");
          tela.width = visao.width;
          tela.height = visao.height;
          await pagina.render({ canvasContext: tela.getContext("2d"), viewport: visao }).promise;
          paginasImagens.push(tela.toDataURL("image/jpeg", 0.6));
        } catch (erro) { /* render falhou: segue só com o texto */ }
      }
    }

    return { texto: texto, paginasImagens: paginasImagens, numPaginas: total, erro: "" };
  }

  /* ---------------------------------------------------------------------------
     LEITURA DE IMAGEM (OCR com Tesseract)
     --------------------------------------------------------------------------- */

  let imagensNoOcr = 0;

  async function extrairDeImagem(arquivo, avisarProgresso, caminho) {
    let dataUrl = "";
    try { dataUrl = await arquivoParaDataUrl(arquivo); } catch (erro) { /* segue */ }

    if (!window.Tesseract) return { texto: "", dataUrl: dataUrl, ocrOk: false };
    if (CONFIG.maxImagensOcr > 0 && imagensNoOcr >= CONFIG.maxImagensOcr) {
      return { texto: "", dataUrl: dataUrl, ocrOk: false };
    }

    imagensNoOcr += 1;
    try {
      if (avisarProgresso) avisarProgresso(0, 0, caminho, "ocr");
      const resultado = await window.Tesseract.recognize(arquivo, "por+eng");
      const texto = (resultado && resultado.data && resultado.data.text) || "";
      return { texto: texto, dataUrl: dataUrl, ocrOk: true };
    } catch (erro) {
      return { texto: "", dataUrl: dataUrl, ocrOk: false };
    }
  }

  /* ---------------------------------------------------------------------------
     LEITURA DE OFFICE / DIA / RTF
     --------------------------------------------------------------------------- */

  async function extrairDeDocx(arquivo) {
    // 1) jeito bom: mammoth
    if (window.mammoth && typeof window.mammoth.extractRawText === "function") {
      try {
        const resultado = await window.mammoth.extractRawText({ arrayBuffer: await arquivo.arrayBuffer() });
        if (resultado && resultado.value) return resultado.value;
      } catch (erro) { /* cai no plano B */ }
    }
    // 2) plano B: é um ZIP com word/document.xml
    return extrairDeZip(arquivo);
  }

  async function extrairDeZip(arquivo) {
    if (!window.JSZip) return "";
    try {
      const zip = await window.JSZip.loadAsync(await arquivo.arrayBuffer());
      const alvo = /(word\/document\.xml|ppt\/slides\/slide\d+\.xml|xl\/sharedStrings\.xml|xl\/worksheets\/sheet\d+\.xml|content\.xml)$/i;
      const nomes = Object.keys(zip.files).filter(function (n) { return alvo.test(n); });
      const partes = [];
      for (let i = 0; i < nomes.length; i += 1) {
        const conteudo = await zip.files[nomes[i]].async("string");
        partes.push(limparXml(conteudo));
      }
      return partes.join("\n\n");
    } catch (erro) {
      return "";
    }
  }

  async function extrairDeDia(arquivo) {
    const xml = await descomprimirGzip(await arquivo.arrayBuffer());
    if (xml) return limparXml(xml);
    // Se não veio gzip, tenta ler como texto mesmo.
    try { return limparXml(await arquivo.text()); } catch (erro) { return ""; }
  }

  async function extrairDeRtf(arquivo) {
    try {
      const bruto = await arquivo.text();
      return bruto
        .replace(/\\'[0-9a-f]{2}/gi, " ")
        .replace(/\\[a-z]+-?\d* ?/gi, " ")
        .replace(/[{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } catch (erro) {
      return "";
    }
  }

  /* ---------------------------------------------------------------------------
     TRANSFORMAR EM DOCUMENTOS
     --------------------------------------------------------------------------- */

  async function extrairDocumentos(lista, avisarProgresso) {
    const documentos = [];

    for (let indice = 0; indice < lista.length; indice += 1) {
      const item = lista[indice];
      const arquivo = item.arquivo;
      const posicao = indice + 1;
      const tipo = detectarTipo(arquivo);

      try {
        if (tipo === "texto") {
          if (arquivo.size > LIMITE_TEXTO) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, await arquivo.text()));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "pdf") {
          if (arquivo.size > LIMITE_PDF) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          const r = await extrairDePdf(arquivo, avisarProgresso, item.caminho);
          const doc = montarDocumento(arquivo, item.caminho, tipo, r.texto);
          doc.paginasImagens = r.paginasImagens;
          doc.numPaginas = r.numPaginas;
          doc.erro = r.erro;
          documentos.push(doc);
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "imagem") {
          if (arquivo.size > LIMITE_IMAGEM) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          const r = await extrairDeImagem(arquivo, avisarProgresso, item.caminho);
          const doc = montarDocumento(arquivo, item.caminho, tipo, r.texto);
          doc.dataUrl = r.dataUrl;
          doc.ocrOk = r.ocrOk;
          documentos.push(doc);
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "docx") {
          if (arquivo.size > LIMITE_OFFICE) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, await extrairDeDocx(arquivo)));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "office") {
          if (arquivo.size > LIMITE_OFFICE) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, await extrairDeZip(arquivo)));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "dia") {
          if (arquivo.size > LIMITE_OFFICE) { marcarIgnorado(avisarProgresso, posicao, lista.length, item.caminho); continue; }
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, await extrairDeDia(arquivo)));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else if (tipo === "rtf") {
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, await extrairDeRtf(arquivo)));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);

        } else {
          // "outro": aceito, entra na lista e como referência no PDF, sem texto.
          documentos.push(montarDocumento(arquivo, item.caminho, tipo, ""));
          marcarLido(avisarProgresso, posicao, lista.length, item.caminho);
        }
      } catch (erro) {
        // Mesmo com erro, guarda o arquivo como referência (nada é recusado).
        documentos.push(montarDocumento(arquivo, item.caminho, tipo, ""));
        if (avisarProgresso) avisarProgresso(posicao, lista.length, item.caminho, "erro");
      }
    }

    return documentos;
  }

  function marcarLido(avisarProgresso, posicao, total, caminho) {
    if (avisarProgresso) avisarProgresso(posicao, total, caminho, "lido");
  }
  function marcarIgnorado(avisarProgresso, posicao, total, caminho) {
    if (avisarProgresso) avisarProgresso(posicao, total, caminho, "ignorado");
  }

  function montarDocumento(arquivo, caminho, tipo, conteudo) {
    const texto = conteudo || "";
    return {
      nome: arquivo.name,
      caminho: caminho,
      extensao: pegarExtensao(arquivo.name),
      tipo: tipo,
      conteudo: texto,
      tamanho: arquivo.size,
      linhas: texto ? texto.split(/\r?\n/).length : 0,
      temTexto: texto.trim().length > 0,
      arquivo: arquivo
    };
  }

  /* ---------------------------------------------------------------------------
     API PÚBLICA
     --------------------------------------------------------------------------- */

  window.LeitorArquivos = {
    config: CONFIG,
    extensoesSuportadas: EXTENSOES_TEXTO,
    extensoesImagem: EXTENSOES_IMAGEM,
    pegarExtensao: pegarExtensao,
    ehArquivoTexto: ehArquivoTexto,
    ehArquivoAceito: ehArquivoAceito,
    detectarTipo: detectarTipo,
    lerDrop: lerDrop,
    extrairDocumentos: extrairDocumentos,
    diagnostico: function () { return Object.assign({}, diagnostico); }
  };
})();

/* =============================================================================
   PARTE NOVA: EXPLICADOR DE CONCEITOS (dicionário + motor de análise)
   Arquivo original: explicador-conceitos.js
   ============================================================================= */

/* =============================================================================
   explicador-conceitos.js
   -----------------------------------------------------------------------------
   Responsabilidade: ler o texto dos arquivos que o usuário arrastou e descobrir
   QUAIS conceitos aparecem ali, pra depois o gerador de PDF explicar cada um.

   A ideia é simples: existe um "dicionário de conceitos" (o GLOSSARIO) com
   palavras/expressões que identificam cada assunto. A gente varre o texto,
   conta quantas vezes cada conceito bate e ordena do mais citado pro menos
   citado. Assim o PDF fala primeiro do que realmente importa naquele material.

   Feito no padrão BR: comentário explicando e nome de variável em português. 🇧🇷☕
   ============================================================================= */

(function () {
  "use strict";

  /* ===========================================================================
     DICIONÁRIO DE CONCEITOS
     ---------------------------------------------------------------------------
     Cada conceito tem:
       id        -> identificador único (usado pra não duplicar)
       titulo    -> nome que aparece no PDF
       tema      -> Banco de Dados / TypeScript / POO
       padroes   -> expressões (regex) que denunciam o conceito no texto
       oQueE     -> explicação curta e clara
       naPratica -> como isso aparece na vida real / no código
       pegadinha -> o erro clássico que professor cobra em prova
       exemplo   -> trecho de código ou comando (opcional)
     ======================================================================== */

  const GLOSSARIO = [
    /* =======================================================================
       🗄️ BANCO DE DADOS
       ==================================================================== */
    {
      id: "dado-informacao",
      titulo: "Dado x Informação",
      tema: "Banco de Dados",
      padroes: ["\\bdados?\\b", "\\binformaç(ão|ões)\\b", "fato bruto", "valor adicional"],
      oQueE:
        "Dado é a matéria-prima: um fato bruto, sem tratamento. Informação é o dado depois de passar por um processo de transformação, ganhando significado e valor adicional.",
      naPratica:
        "Numa tabela, cada linha é dado. Quando você faz um SELECT, soma, agrupa e apresenta aquilo num relatório, virou informação.",
      pegadinha:
        "Prova adora trocar as bolas e dizer que dado é o resultado final. Resultado final já é informação. Fato bruto = dado.",
    },
    {
      id: "elsl",
      titulo: "ELSL — Entrada Lixo, Saída Lixo",
      tema: "Banco de Dados",
      padroes: ["\\belsl\\b", "lixo entra", "entrada lixo", "lixo.{0,12}saída"],
      oQueE:
        "Princípio de qualidade: se o dado de entrada for ruim, o resultado do processamento também será ruim. Não existe mágica no meio do caminho.",
      naPratica:
        "Cadastro com CPF errado, data no formato errado ou campo obrigatório vazio vai gerar relatório errado. A qualidade começa na entrada.",
      pegadinha:
        "Cair na tentação de achar que um bom sistema corrige entrada ruim automaticamente. Ele não corrige: ele propaga o erro.",
    },
    {
      id: "mer",
      titulo: "MER — Modelo Entidade-Relacionamento",
      tema: "Banco de Dados",
      padroes: ["\\bmer\\b", "entidade.?relacionamento", "\\bentidades?\\b", "\\brelacionamentos?\\b"],
      oQueE:
        "É o modelo que representa a realidade como entidades (coisas) ligadas por relacionamentos. Vira o diagrama lógico antes de virar tabela.",
      naPratica:
        "Cliente e Pedido são entidades; 'um cliente faz vários pedidos' é o relacionamento com cardinalidade 1:N.",
      pegadinha:
        "Confundir entidade com tabela. Entidade é conceito do mundo real; a tabela é a implementação física dela no banco.",
    },
    {
      id: "niveis-modelagem",
      titulo: "Modelo Conceitual, Lógico e Físico",
      tema: "Banco de Dados",
      padroes: ["conceitual", "\\blógico\\b", "\\bfísico\\b", "modelo de dados"],
      oQueE:
        "São três níveis de projeto: conceitual (independente de banco), lógico (já com tabelas, chaves e tipos) e físico (o SQL real, com índices e detalhes do SGBD).",
      naPratica:
        "MER/der é o conceitual, o modelo relacional normalizado é o lógico, e o CREATE TABLE com índices é o físico.",
      pegadinha:
        "Prova pergunta qual nível é independente de tecnologia: é o CONCEITUAL. Lógico e físico já dependem das escolhas de implementação.",
    },
    {
      id: "chave-primaria",
      titulo: "Chave Primária (PK)",
      tema: "Banco de Dados",
      padroes: ["chave prim[aá]ria", "primary key", "\\bpk\\b"],
      oQueE:
        "Coluna (ou conjunto de colunas) que identifica cada linha de forma única. Não pode repetir e não pode ser nula.",
      naPratica:
        "Em Cliente(id, nome), o id é a PK: dois clientes podem ter o mesmo nome, mas nunca o mesmo id.",
      pegadinha:
        "PK identifica; quem LIGA tabelas é a chave estrangeira (FK). Trocar os dois papéis é o erro mais clássico da disciplina.",
    },
    {
      id: "chave-estrangeira",
      titulo: "Chave Estrangeira (FK)",
      tema: "Banco de Dados",
      padroes: ["chave estrangeira", "foreign key", "\\bfk\\b", "referência entre tabelas"],
      oQueE:
        "Coluna que aponta pra chave primária de outra tabela. É ela que garante a integridade referencial do relacionamento.",
      naPratica:
        "Em Pedido(id, cliente_id), o cliente_id é FK que aponta pra Cliente(id). Isso impede pedido de cliente que não existe.",
      pegadinha:
        "FK pode repetir e pode ser nula (quando o relacionamento é opcional). Quem não repete e não é nula é a PK.",
    },
    {
      id: "1fn",
      titulo: "Primeira Forma Normal (1FN)",
      tema: "Banco de Dados",
      padroes: ["\\b1fn\\b", "primeira forma normal", "multivalorado", "grupo[s]? de repeti"],
      oQueE:
        "Toda tabela tem que ter valores atômicos: nada de listas dentro de um campo, nada de grupos que se repetem.",
      naPratica:
        "Errado: Cliente(id, telefones) guardando '1199..., 1188...' no mesmo campo. Certo: separar telefone em outra tabela.",
      pegadinha:
        "Achar que 1FN é sobre chave primária. Não é: é sobre atomicidade dos valores.",
    },
    {
      id: "2fn",
      titulo: "Segunda Forma Normal (2FN)",
      tema: "Banco de Dados",
      padroes: ["\\b2fn\\b", "segunda forma normal", "dependência funcional (completa|total|parcial)"],
      oQueE:
        "A tabela está na 2FN quando está na 1FN e todo atributo não-chave depende da chave primária INTEIRA, não de parte dela.",
      naPratica:
        "Só faz diferença quando a PK é composta. Em PedidoItem(pedido_id, produto_id, nome_produto), o nome_produto depende só de produto_id — sai daí.",
      pegadinha:
        "Se a chave primária é simples (uma coluna só), a 2FN é atendida automaticamente. Prova cobra isso.",
    },
    {
      id: "3fn",
      titulo: "Terceira Forma Normal (3FN)",
      tema: "Banco de Dados",
      padroes: ["\\b3fn\\b", "terceira forma normal", "dependência transitiva"],
      oQueE:
        "A tabela está na 3FN quando está na 2FN e nenhum atributo não-chave depende de outro atributo não-chave (dependência transitiva).",
      naPratica:
        "Em Aluno(matricula, nome, curso_id, nome_curso), o nome_curso depende de curso_id, não da matrícula. O nome do curso vai pra tabela Curso.",
      pegadinha:
        "Regra de bolso: 1FN elimina repetição, 2FN elimina dependência parcial, 3FN elimina dependência transitiva. Não inverta.",
    },
    {
      id: "ddl",
      titulo: "DDL — Definição de Dados",
      tema: "Banco de Dados",
      padroes: ["\\bddl\\b", "create\\s+table", "alter\\s+table", "drop\\s+table", "definição de dados"],
      oQueE:
        "É a parte do SQL que mexe na ESTRUTURA: criar, alterar e apagar objetos do banco.",
      naPratica:
        "CREATE TABLE, ALTER TABLE, DROP TABLE e CREATE INDEX são DDL. Depois de rodar, vários SGBDs dão um COMMIT automático.",
      pegadinha:
        "INSERT/UPDATE/DELETE não são DDL, são DML. As prova trocam essas siglas de propósito.",
      exemplo: "CREATE TABLE aluno (id INT PRIMARY KEY, nome VARCHAR(80));",
    },
    {
      id: "dml",
      titulo: "DML — Manipulação de Dados",
      tema: "Banco de Dados",
      padroes: ["\\bdml\\b", "insert into", "\\bupdate\\s+[a-z_]+\\s+set\\b", "delete from", "manipulação de dados"],
      oQueE:
        "É a parte do SQL que mexe nos DADOS: inserir, atualizar, apagar e consultar linhas.",
      naPratica:
        "INSERT, UPDATE, DELETE e SELECT (em muitos padrões) formam a DML — o dia a dia de quem usa o banco.",
      pegadinha:
        "Alguns autores separam o SELECT numa tal de DQL. A maioria das provas trata SELECT como parte da DML.",
    },
    {
      id: "dcl-tcl",
      titulo: "DCL e TCL",
      tema: "Banco de Dados",
      padroes: ["\\bdcl\\b", "\\btcl\\b", "\\bgrant\\b", "\\brevoke\\b", "\\bcommit\\b", "\\brollback\\b", "\\bbegin\\s+transaction\\b", "\\bbegin\\s*;"],
      oQueE:
        "DCL cuida de PERMISSÃO (GRANT/REVOKE). TCL cuida de TRANSAÇÃO (BEGIN, COMMIT, ROLLBACK, SAVEPOINT).",
      naPratica:
        "GRANT SELECT ON aluno TO joao dá permissão; COMMIT confirma uma transação; ROLLBACK desfaz o que ainda não foi confirmado.",
      pegadinha:
        "Juntar permissão com transação numa sigla só. São grupos diferentes: DCL mexe em quem pode o quê; TCL controla o 'tudo ou nada'.",
    },
    {
      id: "select",
      titulo: "SELECT — Consulta",
      tema: "Banco de Dados",
      padroes: ["\\bselect\\b.{0,90}\\bfrom\\b", "\\bselect\\s+\\*", "consulta sql"],
      oQueE:
        "Comando que LÊ dados. É a operação mais usada e a que mais combina cláusulas (WHERE, GROUP BY, HAVING, ORDER BY).",
      naPratica:
        "SELECT nome FROM aluno WHERE idade > 18 ORDER BY nome; — filtra, ordena e devolve só o que interessa.",
      pegadinha:
        "Ordem de execução não é a ordem em que se escreve: o WHERE roda antes do GROUP BY, e o HAVING roda depois.",
    },
    {
      id: "join",
      titulo: "JOIN — Junção de Tabelas",
      tema: "Banco de Dados",
      padroes: ["\\b(inner|left|right|full|cross)\\s+join\\b", "\\bjoin\\b\\s+[A-Za-z_]+\\s+on\\b", "\\bjunção\\b"],
      oQueE:
        "Junta linhas de duas ou mais tabelas usando uma condição (normalmente PK = FK).",
      naPratica:
        "SELECT p.id, c.nome FROM pedido p JOIN cliente c ON p.cliente_id = c.id traz o pedido com o nome do cliente.",
      pegadinha:
        "Esquecer a condição ON vira produto cartesiano (cada linha de uma tabela cruzada com todas da outra). O resultado explode.",
      exemplo: "SELECT * FROM pedido p INNER JOIN cliente c ON p.cliente_id = c.id;",
    },
    {
      id: "inner-left",
      titulo: "INNER JOIN x LEFT JOIN",
      tema: "Banco de Dados",
      padroes: ["inner join", "left join", "outer join", "\\binterseção\\b"],
      oQueE:
        "INNER JOIN devolve só quem casa nas DUAS tabelas. LEFT JOIN mantém todas as linhas da tabela da esquerda e preenche com NULL onde não há par.",
      naPratica:
        "LEFT JOIN é aquele 'quero todos os clientes, mesmo os que nunca compraram' — os sem pedido vêm com NULL nas colunas do pedido.",
      pegadinha:
        "Inverter a explicação é erro clássico. INNER = interseção; LEFT = tudo da esquerda.",
    },
    {
      id: "group-having",
      titulo: "GROUP BY e HAVING",
      tema: "Banco de Dados",
      padroes: ["group\\s+by", "\\bhaving\\b\\s+\\w", "\\bagrupa(mento|r)\\b"],
      oQueE:
        "GROUP BY junta linhas iguais pra calcular totais (COUNT, SUM, AVG). HAVING filtra esses grupos DEPOIS de agrupados.",
      naPratica:
        "SELECT curso, COUNT(*) FROM aluno GROUP BY curso HAVING COUNT(*) > 10 mostra só os cursos com mais de 10 alunos.",
      pegadinha:
        "WHERE filtra LINHA (antes do agrupamento); HAVING filtra GRUPO (depois). Usar WHERE com COUNT(*) não funciona.",
    },
    {
      id: "acid",
      titulo: "Transações e ACID",
      tema: "Banco de Dados",
      padroes: ["transaç(ão|ões)", "\\batomici\\w*\\b", "\\bconsistência\\b", "\\bisolamento\\b", "\\bdurabilidade\\b"],
      oQueE:
        "Transação é um conjunto de operações que roda como 'tudo ou nada'. ACID são as quatro garantias: Atomicidade, Consistência, Isolamento e Durabilidade.",
      naPratica:
        "Transferência bancária: debita de uma conta e credita na outra; se uma falhar, o ROLLBACK devolve tudo ao estado anterior.",
      pegadinha:
        "Confundir as letras do ACID. A de atomicidade é o 'tudo ou nada'; a de durabilidade é 'depois do COMMIT, não se perde, nem cai a luz'.",
    },
    {
      id: "indice",
      titulo: "Índices",
      tema: "Banco de Dados",
      padroes: ["\\bíndices?\\b", "create\\s+(unique\\s+)?index", "\\bindex\\s*\\("],
      oQueE:
        "Estrutura extra (parecida com o índice de um livro) que acelera a busca por uma coluna, ao custo de espaço e de escrita mais lenta.",
      naPratica:
        "CREATE INDEX idx_nome ON aluno(nome); deixa a busca por nome rápida. Em coluna de PK o banco já cria índice sozinho.",
      pegadinha:
        "Índice não deixa a consulta 'correta', só mais rápida. E índice demais atrapalha INSERT/UPDATE, porque precisa ser atualizado junto.",
    },
    {
      id: "view",
      titulo: "Views",
      tema: "Banco de Dados",
      padroes: ["create\\s+(or\\s+replace\\s+)?view", "\\bviews?\\b\\s+virtual", "tabela virtual"],
      oQueE:
        "View é uma consulta salva com nome, que se comporta como uma tabela virtual. Não guarda os dados, só o SELECT.",
      naPratica:
        "CREATE VIEW alunos_ativos AS SELECT * FROM aluno WHERE ativo = true; aí você consulta 'alunos_ativos' como se fosse tabela.",
      pegadinha:
        "View não armazena dados. Se a tabela base muda, a view reflete na hora. Quem armazena resultado é uma tabela materializada.",
    },
    {
      id: "procedure-trigger",
      titulo: "Stored Procedure e Trigger",
      tema: "Banco de Dados",
      padroes: ["create\\s+(or\\s+replace\\s+)?procedure", "create\\s+(or\\s+replace\\s+)?trigger", "stored procedure", "\\bdisparador\\b"],
      oQueE:
        "Procedure é um bloco de comandos salvo no banco que você chama quando quer. Trigger é um bloco que dispara SOZINHO em resposta a um evento.",
      naPratica:
        "Uma trigger AFTER INSERT em PedidoItem pode atualizar o estoque automaticamente. A procedure de fechamento você chama no botão 'Finalizar'.",
      pegadinha:
        "Procedure você chama; trigger o banco dispara. Trocar quem faz o quê é o erro que a prova espera.",
    },

    /* =======================================================================
       🔷 TYPESCRIPT
       ==================================================================== */
    {
      id: "tipagem-estatica",
      titulo: "Tipagem Estática",
      tema: "TypeScript",
      padroes: ["tipagem estática", "\\btyped\\b", "checagem de tipo", "verifica\\w* os tipos", "type checking"],
      oQueE:
        "Os tipos são verificados na hora de compilar, antes de rodar. Isso pega erro cedo, em vez de estourar no meio da execução.",
      naPratica:
        "Se você declarar uma variável como number e tentar atribuir um texto, o compilador reclama e nem gera o JavaScript.",
      pegadinha:
        "Dizer que TypeScript 'roda' no navegador. Ele é compilado (transpilado) para JavaScript, que é quem roda de verdade.",
    },
    {
      id: "inferencia",
      titulo: "Inferência de Tipo",
      tema: "TypeScript",
      padroes: ["inferência", "\\binferir\\b", "inferido automaticamente", "\\binference\\b"],
      oQueE:
        "O TypeScript descobre o tipo sozinho quando dá pra deduzir do valor atribuído, sem você escrever nada.",
      naPratica:
        "let idade = 20; // o TS já entende que é number. Só precisa anotar quando não der pra deduzir.",
      pegadinha:
        "Achar que precisa anotar tipo em tudo. Anotação é pra quando a inferência não resolve (parâmetro de função, por exemplo).",
    },
    {
      id: "any",
      titulo: "any",
      tema: "TypeScript",
      padroes: [":\\s*any\\b", "\\bas\\s+any\\b", "<\\s*any\\s*[>,]"],
      oQueE:
        "any desliga a checagem de tipo daquela variável. Aceita qualquer coisa e não reclama de nada.",
      naPratica:
        "Serve como saída de emergência numa migração de JS pra TS, mas vai espalhando insegurança pelo código.",
      pegadinha:
        "any é o contrário de 'tipagem estática'. Usar any demais é basicamente voltar a programar em JavaScript sem rede de proteção.",
    },
    {
      id: "unknown",
      titulo: "unknown",
      tema: "TypeScript",
      padroes: [":\\s*unknown\\b", "\\bunknown\\b\\s*[,;)\\]>]", "tipo unknown"],
      oQueE:
        "Parecido com any, mas seguro: você pode guardar qualquer valor, porém só usa depois de checar/estreitar o tipo.",
      naPratica:
        "Ideal pra valor vindo de API ou JSON: você é obrigado a validar antes de usar, em vez de confiar cegamente.",
      pegadinha:
        "A diferença que a prova quer: any deixa usar direto; unknown obriga a checar o tipo antes. unknown é o any com cinto de segurança.",
    },
    {
      id: "never-void",
      titulo: "never e void",
      tema: "TypeScript",
      padroes: [":\\s*never\\b", ":\\s*void\\b", "\\bvoid\\b\\s*[;,)]", "\\bnever\\b\\s*[,;)\\]>]", "retorna void"],
      oQueE:
        "void é o retorno de função que não devolve valor. never é o tipo de função que NUNCA retorna (lança erro ou fica em loop infinito).",
      naPratica:
        "function log(msg: string): void {} retorna nada. function falhar(): never { throw new Error('x'); } nunca chega ao fim.",
      pegadinha:
        "never não é 'nenhum tipo' igual ao vazio. É o tipo impossível: nenhum valor pertence a ele.",
    },
    {
      id: "union-intersection",
      titulo: "Union e Intersection Types",
      tema: "TypeScript",
      padroes: ["union type", "intersection type", "\\bunion\\b", "\\bintersection\\b", "[A-Za-z]\\s*\\|\\s*[A-Za-z]"],
      oQueE:
        "Union (A | B) aceita um tipo OU outro. Intersection (A & B) exige as características dos DOIS ao mesmo tempo.",
      naPratica:
        "type Id = string | number; aceita os dois. type PessoaFisica = Usuario & Documentos; junta as duas estruturas.",
      pegadinha:
        "Confundir | com & é o prato do dia. Barra vertical = ou; E comercial = e.",
    },
    {
      id: "type-alias",
      titulo: "Type Alias",
      tema: "TypeScript",
      padroes: ["type alias", "^\\s*type\\s+[A-Z]", "\\btype\\s+\\w+\\s*="],
      oQueE:
        "type cria um apelido pra um tipo. Serve pra dar nome a unions, tuplas, objetos e tipos complexos.",
      naPratica:
        "type Moeda = 'BRL' | 'USD' | 'EUR'; deixa o código legível e evita repetir a união toda hora.",
      pegadinha:
        "Type alias não pode ser reaberto/estendido depois. Quem aceita declaração mesclada (merging) é a interface.",
    },
    {
      id: "interface",
      titulo: "Interface",
      tema: "TypeScript",
      padroes: ["\\binterface\\s+[A-Z][A-Za-z0-9_]*", "\\bimplements\\s+[A-Z]"],
      oQueE:
        "Descreve o formato de um objeto: quais propriedades e métodos ele precisa ter. É um contrato de estrutura.",
      naPratica:
        "interface Usuario { id: number; nome: string; } garante que todo usuário do sistema tenha id e nome.",
      pegadinha:
        "Interface descreve forma de OBJETO. Pra apelidar um union ou uma tupla, o caminho é o type alias.",
    },
    {
      id: "type-vs-interface",
      titulo: "type x interface",
      tema: "TypeScript",
      padroes: ["type .{0,12}interface", "interface .{0,12}type", "diferença entre type e interface"],
      oQueE:
        "Os dois descrevem formato de objeto. interface pode ser estendida e mesclada (declaration merging); type é mais flexível pra unions, tuplas e tipos condicionais.",
      naPratica:
        "Pra contrato de objeto que vai crescer, interface. Pra apelido de união/condicional, type.",
      pegadinha:
        "A diferença é mais de uso do que de sintaxe. Não existe uma 'certa' absoluta — depende do cenário.",
    },
    {
      id: "generics",
      titulo: "Generics",
      tema: "TypeScript",
      padroes: ["\\bgenerics?\\b", "<\\s*T\\s*>", "<\\s*T[A-Z]?\\s*[,>]"],
      oQueE:
        "Generics deixam a função, classe ou tipo trabalhar com um tipo que só é definido na hora do uso, mantendo a segurança de tipos.",
      naPratica:
        "function primeiro<T>(lista: T[]): T { return lista[0]; } funciona pra number, string e o que vier, sem virar any.",
      pegadinha:
        "Generic não é any disfarçado. A diferença é que o generic mantém a relação entre entrada e saída.",
      exemplo: "function identidade<T>(valor: T): T { return valor; }",
    },
    {
      id: "enum",
      titulo: "Enum",
      tema: "TypeScript",
      padroes: ["\\benum\\b"],
      oQueE:
        "Enum cria um conjunto nomeado de valores constantes, deixando o código mais legível do que números soltos.",
      naPratica:
        "enum Status { Ativo, Inativo, Bloqueado } — aí você escreve Status.Ativo em vez de 0.",
      pegadinha:
        "Enum numérico é um objeto de verdade no JavaScript gerado. Pra algo mais leve, hoje se usa muito union de string.",
    },
    {
      id: "tuplas",
      titulo: "Tuplas",
      tema: "TypeScript",
      padroes: ["\\btuplas?\\b", "\\btuple\\b", "\\[\\s*string\\s*,\\s*number\\s*\\]"],
      oQueE:
        "É um array de tamanho e tipos fixos, com posição importando. Diferente do array comum, onde tudo é do mesmo tipo.",
      naPratica:
        "let par: [string, number] = ['Ana', 30]; — primeiro é string, segundo é number, e nessa ordem.",
      pegadinha:
        "Array aceita tamanho variável; tupla tem tamanho e tipos fixos por posição.",
    },
    {
      id: "opcional-nullish",
      titulo: "Opcional (?) e Nullish (??)",
      tema: "TypeScript",
      padroes: ["parâmetro opcional", "propriedade opcional", "\\?\\?", "nullish", "\\bundefined\\b"],
      oQueE:
        "O ? marca propriedade/parâmetro como opcional (pode ser undefined). O ?? devolve o lado direito só quando o esquerdo é null ou undefined.",
      naPratica:
        "nome?: string;  e  const tamanho = valor ?? 0; — se valor for null/undefined, usa 0.",
      pegadinha:
        "?? não é igual a ||. O || também troca valores 'falsos' como 0 e '' — o que costuma ser um bug silencioso.",
    },
    {
      id: "optional-chaining",
      titulo: "Optional Chaining (?.)",
      tema: "TypeScript",
      padroes: ["\\?\\.", "optional chaining", "encadeamento opcional"],
      oQueE:
        "Acessa propriedade de forma segura: se o objeto for null/undefined, para e devolve undefined em vez de dar erro.",
      naPratica:
        "usuario?.endereco?.cidade — se faltar usuário ou endereço, não quebra o programa.",
      pegadinha:
        "Ele evita o erro, mas não te diz que o dado faltou. Muitas vezes é melhor checar do que só silenciar.",
    },
    {
      id: "utility-types",
      titulo: "Utility Types (Partial, Pick, Omit, Readonly, Record)",
      tema: "TypeScript",
      padroes: ["partial<", "pick<", "omit<", "readonly<", "record<", "utility types?", "tipos utilitários"],
      oQueE:
        "São tipos prontos que transformam outros tipos: Partial deixa tudo opcional; Pick escolhe campos; Omit remove campos; Readonly trava alteração; Record cria mapa chave→valor.",
      naPratica:
        "type Rascunho = Partial<Usuario>; pra edição parcial. type Resumo = Pick<Usuario, 'id' | 'nome'>; só o que a tela precisa.",
      pegadinha:
        "Pick você diz o que FICA; Omit você diz o que SAI. Inverter os dois derruba muita gente.",
    },
    {
      id: "keyof-typeof",
      titulo: "keyof e typeof",
      tema: "TypeScript",
      padroes: ["\\bkeyof\\b", "\\btypeof\\b"],
      oQueE:
        "keyof gera um union com as chaves (nomes de propriedade) de um tipo. typeof pega o tipo de um valor que já existe.",
      naPratica:
        "type Campo = keyof Usuario; // 'id' | 'nome' ...  e  const config = {x: 1}; type C = typeof config;",
      pegadinha:
        "typeof do TypeScript NÃO é o typeof do JavaScript. No TS ele atua em tempo de tipo; no JS devolve string ('number', 'object').",
    },
    {
      id: "conditional-mapped",
      titulo: "Conditional Types e Mapped Types",
      tema: "TypeScript",
      padroes: ["conditional type", "mapped type", "extends\\s*\\?", "tipo condicional", "tipos mapeados"],
      oQueE:
        "Conditional type é um 'if' de tipos (T extends U ? A : B). Mapped type percorre as chaves de um tipo e constrói um novo, parecido com um map de objeto.",
      naPratica:
        "type SomenteString<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] } deixa só as propriedades de texto.",
      pegadinha:
        "São assuntos de nível avançado: se aparecerem, normalmente valem a questão mais difícil da prova. Confundir os dois é comum.",
    },
    {
      id: "transpilacao",
      titulo: "Compilação / Transpilação e tsconfig",
      tema: "TypeScript",
      padroes: ["\\btsc\\b", "tsconfig", "transpila", "compila\\w* para javascript", "\\bES\\d+\\b"],
      oQueE:
        "O compilador (tsc) lê seu .ts, checa os tipos e gera .js. O tsconfig.json é o arquivo que diz como compilar.",
      naPratica:
        "No tsconfig, 'strict: true' liga a checagem rigorosa; 'target' define pra qual versão de JavaScript vai sair.",
      pegadinha:
        "O tsc checa tipo e gera JS, mas NÃO roda o programa. Quem executa é o Node ou o navegador.",
    },

    /* =======================================================================
       🧩 PROGRAMAÇÃO ORIENTADA A OBJETOS
       ==================================================================== */
    {
      id: "classe-objeto",
      titulo: "Classe e Objeto",
      tema: "POO",
      padroes: ["\\bclass\\s+[A-Z][A-Za-z0-9_]*\\s*(\\{|extends|implements)", "\\bclasse\\b", "\\bobjeto\\b", "\\binstâncias?\\b", "\\binstanciar\\b"],
      oQueE:
        "Classe é o molde (a definição de atributos e métodos). Objeto é a instância criada a partir desse molde, com valores próprios.",
      naPratica:
        "class Pessoa { nome: string } — 'Pessoa' é a classe; new Pessoa() com nome 'Ana' é o objeto.",
      pegadinha:
        "Falar que classe 'é' o objeto. Classe é o molde; objeto é o que foi construído com ele.",
    },
    {
      id: "construtor",
      titulo: "Construtor",
      tema: "POO",
      padroes: ["\\bconstructor\\s*\\(", "\\bconstrutor\\b", "método construtor"],
      oQueE:
        "Método especial que roda automaticamente na criação do objeto, servindo pra inicializar os atributos.",
      naPratica:
        "constructor(private nome: string) {} — ao dar new, o nome já entra preenchido.",
      pegadinha:
        "Construtor não tem retorno (nem void na maioria das linguagens) e não é chamado manualmente; quem chama é o new.",
    },
    {
      id: "encapsulamento",
      titulo: "Encapsulamento",
      tema: "POO",
      padroes: ["encapsulamento", "\\b(private|public|protected)\\s+[A-Za-z_]", "modificador\\w* de acesso", "getters?"],
      oQueE:
        "Esconder o estado interno do objeto e só permitir acesso por métodos controlados, protegendo a integridade dos dados.",
      naPratica:
        "Atributo private saldo só muda por depositar()/sacar(), que validam as regras antes de mexer no valor.",
      pegadinha:
        "Encapsulamento não é só 'colocar private'. É garantir que o objeto nunca fique num estado inválido.",
    },
    {
      id: "heranca",
      titulo: "Herança",
      tema: "POO",
      padroes: ["herança", "\\bextends\\b", "\\bherda\\b", "superclasse", "\\bsubclasse\\b"],
      oQueE:
        "Uma classe filha herda atributos e métodos da classe mãe, reaproveitando código e criando uma relação 'é um'.",
      naPratica:
        "class Cachorro extends Animal — Cachorro é um Animal e já ganha os comportamentos comuns de Animal.",
      pegadinha:
        "Herança representa 'É UM'. Se a relação for 'TEM UM', o certo é composição, não herança. Herança demais cria acoplamento.",
    },
    {
      id: "polimorfismo",
      titulo: "Polimorfismo",
      tema: "POO",
      padroes: ["polimorfismo", "\\boverride\\b", "sobrescrev", "sobrescrita", "\\bsubtipos?\\b"],
      oQueE:
        "Mesma chamada, comportamentos diferentes. O objeto decide qual implementação rodar em tempo de execução.",
      naPratica:
        "Animal tem emitirSom(); Cachorro late e Gato mia. Chamar emitirSom() funciona igual pra qualquer Animal.",
      pegadinha:
        "Polimorfismo de subtipo (sobrescrita) é diferente de sobrecarga (mesmo nome, parâmetros diferentes). Prova adora misturar.",
    },
    {
      id: "abstracao",
      titulo: "Abstração e Classe Abstrata",
      tema: "POO",
      padroes: ["abstraç(ão|ões)", "\\babstract\\b", "classe abstrata", "\\bcontrato\\b"],
      oQueE:
        "Abstrair é destacar o essencial e esconder o detalhe. Classe abstrata é uma base que NÃO pode ser instanciada e pode ter métodos só assinados.",
      naPratica:
        "abstract class Forma { abstract area(): number; } — cada forma concreta é obrigada a implementar area().",
      pegadinha:
        "Classe abstrata não pode virar objeto direto (new Forma() dá erro). Ela existe pra ser base de outras.",
    },
    {
      id: "interface-poo",
      titulo: "Interface (na POO)",
      tema: "POO",
      padroes: ["\\bimplements\\s+[A-Z][A-Za-z0-9_]*", "\\binterface\\s+[A-Z][A-Za-z0-9_]*", "conceito de interface"],
      oQueE:
        "Interface é um contrato puro: só diz O QUE deve existir, sem implementar. A classe que assina se compromete a cumprir tudo.",
      naPratica:
        "class ContaCorrente implements Pagavel { pagar() { /* ... */ } } — o 'implements' obriga a implementar pagar().",
      pegadinha:
        "Classe abstrata pode ter código pronto e estado; interface normalmente é só contrato. Uma classe pode implementar várias interfaces, mas herdar de uma só classe.",
    },
    {
      id: "composicao",
      titulo: "Composição x Herança",
      tema: "POO",
      padroes: ["composiç(ão|ões)", "\\btem um\\b", "\\bprefira composição\\b", "\\bhas-a\\b"],
      oQueE:
        "Composição é montar um objeto usando outros objetos como peças ('tem um'). Costuma ser mais flexível que herdar.",
      naPratica:
        "Em vez de Carro herdar Motor, o Carro TEM um Motor guardado como atributo. Trocar o motor depois fica fácil.",
      pegadinha:
        "Regra de ouro repetida em prova: 'prefira composição à herança'. Se a relação é 'tem um', composição.",
    },
    {
      id: "static",
      titulo: "Membros Estáticos",
      tema: "POO",
      padroes: ["\\bstatic\\s+(class|void|int|final|public|private|readonly|[A-Z])", "membro estático", "método estático"],
      oQueE:
        "Membros static pertencem à CLASSE, não ao objeto. Existem uma vez só e são acessados pelo nome da classe.",
      naPratica:
        "class Matematica { static PI = 3.14; } — usa Matematica.PI, sem precisar criar objeto.",
      pegadinha:
        "Método estático não acessa atributo de instância (não tem 'this' do objeto). Tentar isso é erro.",
    },
    {
      id: "solid",
      titulo: "Princípios SOLID",
      tema: "POO",
      padroes: ["\\bsolid\\b", "responsabilidade única", "aberto.?fechado", "substituição de liskov", "segregação de interface", "inversão de dependência"],
      oQueE:
        "Cinco princípios pra código orientado a objetos mais limpo: S (responsabilidade única), O (aberto/fechado), L (Liskov), I (segregação de interfaces), D (inversão de dependência).",
      naPratica:
        "Uma classe que só faz uma coisa (S), que cresce por extensão sem alterar o que já existe (O), sem quebrar subtipos (L), com interfaces enxutas (I) e dependendo de abstrações e não de implementações (D).",
      pegadinha:
        "Confundir as letras. Decore pela ordem: Single, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.",
    },
    {
      id: "coesao-acoplamento",
      titulo: "Coesão e Acoplamento",
      tema: "POO",
      padroes: ["coes(ão|ões)", "acoplamento", "\\bmodularidade\\b"],
      oQueE:
        "Coesão é o quanto as partes de um módulo pertencem ao mesmo assunto (quanto maior, melhor). Acoplamento é o quanto módulos dependem uns dos outros (quanto menor, melhor).",
      naPratica:
        "Uma classe que só cuida de cliente tem alta coesão. Se ela depende de banco, e-mail e tela ao mesmo tempo, está muito acoplada.",
      pegadinha:
        "O saudável é ALTA coesão e BAIXO acoplamento. Trocar os dois é erro clássico.",
    },
    {
      id: "sobrecarga",
      titulo: "Sobrecarga x Sobrescrita",
      tema: "POO",
      padroes: ["sobrecarga", "\\boverload\\b", "\\boverrid\\w*\\b", "mesmo nome.{0,20}parâmetros"],
      oQueE:
        "Sobrecarga: mesmo método, parâmetros diferentes, na MESMA classe. Sobrescrita: a filha redefine o método da mãe, mesma assinatura.",
      naPratica:
        "Somar(int, int) e Somar(double, double) é sobrecarga. A filha reescrever emitirSom() é sobrescrita (override).",
      pegadinha:
        "Sobrecarga é resolvida pela assinatura; sobrescrita depende da herança e do polimorfismo. Não são sinônimos.",
    }
  ];

  /* ---------------------------------------------------------------------------
     FUNÇÕES DE ANÁLISE
     --------------------------------------------------------------------------- */

  // Deixa o texto todo minúsculo e sem acento? Não: mantemos acento porque os
  // padrões usam acento. Só padronizamos as quebras de linha e espaços.
  function normalizar(texto) {
    return String(texto || "").replace(/\r/g, "");
  }

  // Junta o conteúdo de todos os documentos num texto só, pra varrer rápido.
  function juntarConteudos(documentos) {
    return documentos
      .map(function (documento) {
        return documento.conteudo || "";
      })
      .join("\n");
  }

  // Conta quantas vezes um padrão aparece no texto.
  function contarOcorrencias(texto, padrao) {
    try {
      const expressao = new RegExp(padrao, "gi");
      const achados = texto.match(expressao);
      return achados ? achados.length : 0;
    } catch (erro) {
      // Se o padrão estiver malformado, não deixa a análise inteira cair.
      return 0;
    }
  }

  // Procura uma linha real do material que fala daquele conceito,
  // pra citar no PDF como "onde isso apareceu".
  function acharTrecho(documentos, padroes) {
    for (let i = 0; i < documentos.length; i += 1) {
      const linhas = normalizar(documentos[i].conteudo).split("\n");
      for (let j = 0; j < linhas.length; j += 1) {
        const linha = linhas[j].trim();
        if (linha.length < 8 || linha.length > 160) continue;
        for (let k = 0; k < padroes.length; k += 1) {
          try {
            const expressao = new RegExp(padroes[k], "i");
            if (expressao.test(linha)) {
              return { arquivo: documentos[i].caminho || documentos[i].nome, linha: linha };
            }
          } catch (erro) { /* ignora padrão ruim */ }
        }
      }
    }
    return null;
  }

  /*
     analisar()
     Entrada: lista de documentos { nome, caminho, conteudo, ... }
     Saída:   {
                totalDocumentos, totalLinhas, temas: {...},
                conceitos: [ { ...conceito, ocorrencias, trecho } ]
              }
  */
  function analisar(documentos, opcoes) {
    const config = opcoes || {};
    const maximoConceitos = config.maximoConceitos || 24;
    const temasPermitidos = config.temas || ["Banco de Dados", "TypeScript", "POO", "Geral"];

    const textoCompleto = normalizar(juntarConteudos(documentos));

    const encontrados = GLOSSARIO.filter(function (conceito) {
      return temasPermitidos.indexOf(conceito.tema) !== -1;
    })
      .map(function (conceito) {
        let ocorrencias = 0;
        conceito.padroes.forEach(function (padrao) {
          ocorrencias += contarOcorrencias(textoCompleto, padrao);
        });
        return {
          id: conceito.id,
          titulo: conceito.titulo,
          tema: conceito.tema,
          oQueE: conceito.oQueE,
          naPratica: conceito.naPratica,
          pegadinha: conceito.pegadinha,
          exemplo: conceito.exemplo || "",
          ocorrencias: ocorrencias
        };
      })
      .filter(function (conceito) {
        return conceito.ocorrencias > 0;
      })
      .sort(function (a, b) {
        return b.ocorrencias - a.ocorrencias;
      })
      .slice(0, maximoConceitos);

    // Anexa o trecho real onde o conceito apareceu (se achou).
    encontrados.forEach(function (conceitoEncontrado) {
      const original = GLOSSARIO.filter(function (c) { return c.id === conceitoEncontrado.id; })[0];
      conceitoEncontrado.trecho = original ? acharTrecho(documentos, original.padroes) : null;
    });

    // Resumo por tema, pra mostrar no PDF e na tela.
    const temas = { "Banco de Dados": 0, "TypeScript": 0, "POO": 0 };
    encontrados.forEach(function (conceito) {
      if (temas[conceito.tema] === undefined) temas[conceito.tema] = 0;
      temas[conceito.tema] += 1;
    });

    const totalLinhas = documentos.reduce(function (soma, documento) {
      return soma + (documento.linhas || 0);
    }, 0);

    return {
      totalDocumentos: documentos.length,
      totalLinhas: totalLinhas,
      temas: temas,
      conceitos: encontrados
    };
  }

  /* ---------------------------------------------------------------------------
     API PÚBLICA
     --------------------------------------------------------------------------- */

  window.ExplicadorConceitos = {
    glossario: GLOSSARIO,
    analisar: analisar
  };
})();

/* =============================================================================
   PARTE NOVA: GERADOR DE PDF (capa, sumário e explicações)
   Arquivo original: gerador-pdf.js
   ============================================================================= */

/* =============================================================================
   gerador-pdf.js
   -----------------------------------------------------------------------------
   Responsabilidade: pegar o resultado da análise (explicador-conceitos.js) e
   montar um PDF bonito, explicando cada conceito que apareceu nos arquivos.

   Usa a biblioteca jsPDF (via CDN). Se ela não tiver sido carregada, a gente
   avisa o usuário em vez de estourar um erro feio.

   Feito no padrão BR: capa, sumário, um bloco por conceito e rodapé com número
   de página. Comentário explicando e nome de variável em português. 🇧🇷☕
   ============================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     CONFIGURAÇÃO DE LAYOUT (em milímetros — jsPDF trabalha em mm por padrão)
     --------------------------------------------------------------------------- */
  const PAGINA = {
    largura: 210,
    altura: 297,
    margem: 16
  };

  const AREA = {
    largura: PAGINA.largura - PAGINA.margem * 2,
    esquerda: PAGINA.margem,
    direita: PAGINA.largura - PAGINA.margem,
    topo: 18,
    fundo: PAGINA.altura - 18
  };

  // Uma cor por matéria, só pra dar identidade visual.
  const CORES_TEMA = {
    "Banco de Dados": { principal: [37, 99, 235], claro: [219, 234, 254] },
    "TypeScript": { principal: [14, 165, 233], claro: [224, 242, 254] },
    "POO": { principal: [124, 58, 237], claro: [237, 233, 254] },
    "Geral": { principal: [71, 85, 105], claro: [226, 232, 240] }
  };

  const COR_TEXTO = [30, 41, 59];
  const COR_TEXTO_SUAVE = [100, 116, 139];
  const COR_LINHA = [226, 232, 240];

  /* ---------------------------------------------------------------------------
     FUNÇÕES AUXILIARES DE DESENHO
     --------------------------------------------------------------------------- */

  function pegarCorTema(tema) {
    return CORES_TEMA[tema] || CORES_TEMA["Geral"];
  }

  // Devolve a fonte jsPDF a partir da API UMD.
  function obterConstrutorJsPdf() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;
    return null;
  }

  /*
     Criador de escrita com cursor.
     Guarda o "y" atual e, quando o texto passa do rodapé, cria página nova.
     Isso evita ficar repetindo a lógica de quebra de página em cada bloco.
  */
  function criarEscritor(doc) {
    let y = AREA.topo;

    function garantirEspaco(alturaNecessaria) {
      if (y + alturaNecessaria > AREA.fundo) {
        doc.addPage();
        y = AREA.topo;
      }
    }

    function linhasDe(texto, largura, tamanhoFonte) {
      doc.setFontSize(tamanhoFonte);
      return doc.splitTextToSize(String(texto || ""), largura);
    }

    return {
      pegarY: function () { return y; },
      definirY: function (novoY) { y = novoY; },
      pular: function (altura) { y += altura; },

      // Título grande com barrinha colorida do lado.
      escreverTituloSecao: function (texto, cor) {
        garantirEspaco(16);
        doc.setFillColor(cor[0], cor[1], cor[2]);
        doc.rect(AREA.esquerda, y - 4, 3, 9, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(cor[0], cor[1], cor[2]);
        doc.text(String(texto), AREA.esquerda + 6, y + 3);
        y += 14;
      },

      // Subtítulo pequeno (ex.: "O que é").
      escreverRotulo: function (texto, cor) {
        garantirEspaco(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(cor[0], cor[1], cor[2]);
        doc.text(String(texto).toUpperCase(), AREA.esquerda, y);
        y += 5;
      },

      // Parágrafo comum com quebra de linha.
      escreverParagrafo: function (texto, tamanhoFonte, corTexto) {
        const tamanho = tamanhoFonte || 10;
        const linhas = linhasDe(texto, AREA.largura, tamanho);
        const alturaLinha = tamanho * 0.52;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(tamanho);
        doc.setTextColor(
          (corTexto || COR_TEXTO)[0],
          (corTexto || COR_TEXTO)[1],
          (corTexto || COR_TEXTO)[2]
        );

        linhas.forEach(function (linha) {
          garantirEspaco(alturaLinha + 1);
          doc.text(linha, AREA.esquerda, y);
          y += alturaLinha;
        });
        y += 2;
      },

      // Caixinha com fundo claro (usada na "pegadinha" e no trecho citado).
      escreverCaixa: function (texto, corFundo, corBorda, corTexto, comMono) {
        const tamanho = 9.5;
        const linhas = linhasDe(texto, AREA.largura - 10, tamanho);
        const alturaLinha = tamanho * 0.52;
        const alturaTotal = linhas.length * alturaLinha + 8;

        garantirEspaco(alturaTotal + 4);

        doc.setFillColor(corFundo[0], corFundo[1], corFundo[2]);
        doc.setDrawColor(corBorda[0], corBorda[1], corBorda[2]);
        doc.roundedRect(AREA.esquerda, y - 4, AREA.largura, alturaTotal, 2, 2, "FD");

        doc.setFont(comMono ? "courier" : "helvetica", "normal");
        doc.setFontSize(tamanho);
        doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);

        let posicaoY = y + 1;
        linhas.forEach(function (linha) {
          doc.text(linha, AREA.esquerda + 5, posicaoY);
          posicaoY += alturaLinha;
        });

        y += alturaTotal + 3;
      },

      // Linha divisória fininha.
      escreverLinha: function () {
        garantirEspaco(6);
        doc.setDrawColor(COR_LINHA[0], COR_LINHA[1], COR_LINHA[2]);
        doc.setLineWidth(0.3);
        doc.line(AREA.esquerda, y, AREA.direita, y);
        y += 6;
      },

      novaPagina: function () {
        doc.addPage();
        y = AREA.topo;
      }
    };
  }

  /* ---------------------------------------------------------------------------
     BLOCOS DO PDF
     --------------------------------------------------------------------------- */

  // CAPA
  function desenharCapa(doc, escritor, analise, metadados) {
    const info = metadados || {};
    const cor = CORES_TEMA["Banco de Dados"];

    // Faixa colorida do topo
    doc.setFillColor(cor.principal[0], cor.principal[1], cor.principal[2]);
    doc.rect(0, 0, PAGINA.largura, 70, "F");

    doc.setFillColor(56, 189, 248);
    doc.rect(0, 70, PAGINA.largura, 3, "F");

    // Etiqueta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("GERADOR DE EXPLICAÇÃO DE CONCEITOS", PAGINA.largura / 2, 26, { align: "center" });

    // Título
    doc.setFontSize(26);
    doc.text("Explicando o que você", PAGINA.largura / 2, 45, { align: "center" });
    doc.text("acabou de arrastar", PAGINA.largura / 2, 56, { align: "center" });

    escritor.definirY(92);

    escritor.escreverParagrafo(
      "Este PDF foi montado automaticamente a partir dos arquivos que você arrastou. " +
        "Ele varre o conteúdo, identifica os conceitos que aparecem e explica cada um com " +
        "três perguntas: o que é, como aparece na prática e qual é a pegadinha de prova.",
      11
    );

    escritor.pular(4);

    // Bloco de resumo (nome do material, data, números)
    const contagens = analise.contagens || {};
    const linhasResumo = [
      ["Material analisado", info.nomePasta || "Arquivos arrastados"],
      ["Data da geração", info.data || new Date().toLocaleString("pt-BR")],
      ["Arquivos lidos", String(analise.totalDocumentos)],
      ["PDFs lidos", String(contagens.pdf || 0)],
      ["Imagens lidas", String(contagens.imagem || 0)],
      ["Total de linhas analisadas", String(analise.totalLinhas)],
      ["Conceitos encontrados", String(analise.conceitos.length)]
    ];

    linhasResumo.forEach(function (linha) {
      escritor.definirY(escritor.pegarY());
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(COR_TEXTO_SUAVE[0], COR_TEXTO_SUAVE[1], COR_TEXTO_SUAVE[2]);
      doc.text(linha[0], AREA.esquerda, escritor.pegarY());

      doc.setFont("helvetica", "normal");
      doc.setTextColor(COR_TEXTO[0], COR_TEXTO[1], COR_TEXTO[2]);
      doc.text(linha[1], AREA.direita, escritor.pegarY(), { align: "right" });

      escritor.pular(7);
    });

    escritor.pular(6);

    // Distribuição por tema
    escritor.escreverRotulo("Distribuição por matéria", cor.principal);
    const temas = analise.temas || {};
    Object.keys(temas).forEach(function (tema) {
      if (temas[tema] <= 0) return;
      const corDoTema = pegarCorTema(tema);
      escritor.definirY(escritor.pegarY());
      doc.setFillColor(corDoTema.principal[0], corDoTema.principal[1], corDoTema.principal[2]);
      doc.circle(AREA.esquerda + 2, escritor.pegarY() - 1, 1.6, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(COR_TEXTO[0], COR_TEXTO[1], COR_TEXTO[2]);
      doc.text(tema + " — " + temas[tema] + " conceito(s)", AREA.esquerda + 7, escritor.pegarY());
      escritor.pular(7);
    });

    escritor.novaPagina();
  }

  // SUMÁRIO
  function desenharSumario(doc, escritor, analise) {
    const cor = CORES_TEMA["Banco de Dados"];
    escritor.escreverTituloSecao("Sumário dos conceitos", cor.principal);
    escritor.escreverParagrafo(
      "Os conceitos estão na ordem de relevância: primeiro os que mais aparecem no seu material.",
      9.5,
      COR_TEXTO_SUAVE
    );
    escritor.pular(2);

    analise.conceitos.forEach(function (conceito, indice) {
      escritor.definirY(escritor.pegarY());
      const corDoTema = pegarCorTema(conceito.tema);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(COR_TEXTO[0], COR_TEXTO[1], COR_TEXTO[2]);
      doc.text(String(indice + 1).padStart(2, "0") + ". " + conceito.titulo, AREA.esquerda, escritor.pegarY());

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(corDoTema.principal[0], corDoTema.principal[1], corDoTema.principal[2]);
      doc.text(
        conceito.tema + "  •  " + conceito.ocorrencias + " ocorrência(s)",
        AREA.direita,
        escritor.pegarY(),
        { align: "right" }
      );

      escritor.pular(7);
    });

    escritor.novaPagina();
  }

  // UM CONCEITO
  function desenharConceito(escritor, conceito, indice) {
    const cor = pegarCorTema(conceito.tema);
    escritor.escreverTituloSecao(String(indice + 1).padStart(2, "0") + " — " + conceito.titulo, cor.principal);

    escritor.escreverRotulo("O que é", cor.principal);
    escritor.escreverParagrafo(conceito.oQueE, 10.5, COR_TEXTO);

    escritor.escreverRotulo("Na prática", cor.principal);
    escritor.escreverParagrafo(conceito.naPratica, 10.5, COR_TEXTO);

    if (conceito.exemplo) {
      escritor.escreverRotulo("Exemplo", cor.principal);
      escritor.escreverCaixa(conceito.exemplo, [241, 245, 249], COR_LINHA, [51, 65, 85], true);
    }

    escritor.escreverRotulo("Pegadinha de prova", cor.principal);
    escritor.escreverCaixa(
      conceito.pegadinha,
      cor.claro,
      cor.principal,
      [30, 41, 59],
      false
    );

    if (conceito.trecho && conceito.trecho.linha) {
      escritor.escreverRotulo("Onde isso apareceu no seu material", cor.principal);
      escritor.escreverCaixa(
        conceito.trecho.arquivo + ":\n" + conceito.trecho.linha,
        [248, 250, 252],
        COR_LINHA,
        COR_TEXTO_SUAVE,
        true
      );
    }

    escritor.escreverLinha();
  }

  // RODAPÉ COM NÚMERO DE PÁGINA
  function desenharRodapes(doc, info) {
    const totalPaginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
      doc.setPage(pagina);
      doc.setDrawColor(COR_LINHA[0], COR_LINHA[1], COR_LINHA[2]);
      doc.setLineWidth(0.3);
      doc.line(AREA.esquerda, PAGINA.altura - 12, AREA.direita, PAGINA.altura - 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(COR_TEXTO_SUAVE[0], COR_TEXTO_SUAVE[1], COR_TEXTO_SUAVE[2]);
      doc.text(info.rodape || "Gerado automaticamente pelo Gerador de PDF", AREA.esquerda, PAGINA.altura - 8);
      doc.text("Página " + pagina + " de " + totalPaginas, AREA.direita, PAGINA.altura - 8, { align: "right" });
    }
  }

  /* ---------------------------------------------------------------------------
     ANEXOS (PDFs e imagens originais, embutidos no PDF final)
     --------------------------------------------------------------------------- */

  function formatoDaImagem(dataUrl) {
    return String(dataUrl || "").indexOf("data:image/png") === 0 ? "PNG" : "JPEG";
  }

  // Encaixa a imagem dentro da área, mantendo a proporção.
  function adicionarImagemAjustada(doc, dataUrl, x, y, larguraMax, alturaMax) {
    if (!dataUrl) return;
    let props;
    try {
      props = doc.getImageProperties(dataUrl);
    } catch (erro) {
      return;
    }
    const escala = Math.min(larguraMax / props.width, alturaMax / props.height);
    const largura = props.width * escala;
    const altura = props.height * escala;
    doc.addImage(dataUrl, formatoDaImagem(dataUrl), x + (larguraMax - largura) / 2, y, largura, altura);
  }

  function desenharAnexos(doc, escritor, analise) {
    const anexos = (analise && analise.anexos) || [];
    if (!anexos.length) return;

    const cor = CORES_TEMA["Banco de Dados"];
    escritor.novaPagina();
    escritor.escreverTituloSecao("Materiais originais (anexos)", cor.principal);
    escritor.escreverParagrafo(
      "Aqui estão os PDFs e imagens que você arrastou, embutidos na íntegra.",
      9.5,
      COR_TEXTO_SUAVE
    );

    const larguraMax = AREA.largura;
    const alturaMax = AREA.fundo - AREA.topo - 14;

    anexos.forEach(function (anexo) {
      const imagens = anexo.tipo === "pdf" ? (anexo.paginasImagens || []) : [anexo.dataUrl];
      imagens.forEach(function (dataUrl, indice) {
        if (!dataUrl) return;
        escritor.novaPagina();
        const rotulo = anexo.tipo === "pdf"
          ? anexo.nome + " — página " + (indice + 1)
          : anexo.nome;
        escritor.escreverRotulo(rotulo, cor.principal);
        adicionarImagemAjustada(doc, dataUrl, AREA.esquerda, escritor.pegarY() + 2, larguraMax, alturaMax);
        escritor.pular(alturaMax + 4);
      });
    });
  }

  /* ---------------------------------------------------------------------------
     LISTA DE ARQUIVOS ANALISADOS (aparece em todo PDF)
     --------------------------------------------------------------------------- */

  const ROTULO_TIPO = {
    texto: "texto", pdf: "PDF", imagem: "imagem",
    docx: "Word (.docx)", office: "Office", dia: "Dia", rtf: "RTF", outro: "arquivo"
  };

  function pesoTamanho(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function desenharListaArquivos(doc, escritor, analise) {
    const arquivos = (analise && analise.arquivos) || [];
    if (!arquivos.length) return;

    const cor = CORES_TEMA["Banco de Dados"];
    escritor.escreverTituloSecao("Arquivos analisados (" + arquivos.length + ")", cor.principal);
    escritor.escreverParagrafo(
      "Tudo que você arrastou entrou aqui: nome, tipo, tamanho e se deu pra ler o texto.",
      9.5,
      COR_TEXTO_SUAVE
    );

    arquivos.forEach(function (arquivo) {
      const rotulo = (ROTULO_TIPO[arquivo.tipo] || arquivo.tipo || "?") +
        " • " + pesoTamanho(arquivo.tamanho) +
        (arquivo.temTexto ? " • texto lido" : " • sem texto");
      escritor.escreverParagrafo((arquivo.caminho || arquivo.nome) + "  (" + rotulo + ")", 8.5, COR_TEXTO);
    });
  }

  /* ---------------------------------------------------------------------------
     FUNÇÃO PRINCIPAL
     --------------------------------------------------------------------------- */

  /*
     gerarPdf()
     Parametros:
       analise    -> resultado de ExplicadorConceitos.analisar()
       metadados  -> { nomePasta, data, rodape }
     Devolve o objeto jsPDF já montado (dá pra .save() ou .output()).
  */
  function gerarPdf(analise, metadados) {
    const Construtor = obterConstrutorJsPdf();
    if (!Construtor) {
      throw new Error(
        "A biblioteca jsPDF não foi carregada. Adicione o <script> do jsPDF antes de gerar o PDF."
      );
    }

    const temConceitos = analise && analise.conceitos && analise.conceitos.length > 0;
    const temAnexos = analise && analise.anexos && analise.anexos.length > 0;
    const temArquivos = analise && analise.arquivos && analise.arquivos.length > 0;

    if (!temConceitos && !temAnexos && !temArquivos) {
      throw new Error("Nada pra gerar: nenhum arquivo chegou pra análise.");
    }

    const doc = new Construtor({ unit: "mm", format: "a4", orientation: "portrait" });
    const escritor = criarEscritor(doc);
    const info = metadados || {};

    desenharCapa(doc, escritor, analise, info);

    if (temConceitos) {
      desenharSumario(doc, escritor, analise);
      analise.conceitos.forEach(function (conceito, indice) {
        desenharConceito(escritor, conceito, indice);
      });
    } else {
      escritor.escreverTituloSecao("Nenhum conceito reconhecido", CORES_TEMA["Banco de Dados"].principal);
      escritor.escreverParagrafo(
        "Li os arquivos, mas não reconheci conceitos de BD/TS/POO neles. Mesmo assim, deixei os materiais originais anexados logo abaixo.",
        10
      );
    }

    desenharListaArquivos(doc, escritor, analise);
    desenharAnexos(doc, escritor, analise);

    desenharRodapes(doc, info);

    return doc;
  }

  // Monta e já baixa o arquivo.
  function baixarPdf(analise, metadados) {
    const info = metadados || {};
    const doc = gerarPdf(analise, info);

    const nomeBase = (info.nomePasta || "conceitos")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const data = new Date().toISOString().slice(0, 10);
    doc.save(nomeBase + "-conceitos-" + data + ".pdf");
    return doc;
  }

  /* ---------------------------------------------------------------------------
     API PÚBLICA
     --------------------------------------------------------------------------- */

  window.GeradorPdf = {
    gerarPdf: gerarPdf,
    baixarPdf: baixarPdf,
    temJsPdf: function () { return !!(window.jspdf && window.jspdf.jsPDF); }
  };
})();

/* =============================================================================
   PARTE NOVA: INICIADOR (liga a tela ao gerador de PDF)
   Arquivo original: iniciar-gerador-pdf.js
   ============================================================================= */

/* =============================================================================
   iniciar-gerador-pdf.js
   -----------------------------------------------------------------------------
   Responsabilidade: amarrar tudo. É a cola entre o HTML da seção, o leitor de
   arquivos, o explicador de conceitos e o gerador de PDF.

   Fluxo:
     1) usuário arrasta arquivo/pasta (ou escolhe pelo botão)
     2) leitor-arquivos.js lê o conteúdo
     3) mostramos a lista do que foi lido
     4) ao clicar em "Gerar PDF", explicador-conceitos.js acha os conceitos
     5) gerador-pdf.js monta e baixa o PDF

   Feito no padrão BR: comentário explicando e nome de variável em português. 🇧🇷☕
   ============================================================================= */

(function () {
  "use strict";

  // Guarda os documentos lidos na última dropada.
  let documentosLidos = [];

  // Quais arquivos o usuário deixou marcados (true = entra no PDF).
  let selecionados = [];

  function pegar(id) {
    return document.getElementById(id);
  }

  // Nome bonitinho de cada tipo de arquivo.
  const ROTULO_TIPO = {
    texto: "texto", pdf: "PDF", imagem: "imagem",
    docx: "Word", office: "Office", dia: "Dia", rtf: "RTF", outro: "arquivo"
  };

  function iniciar() {
    const dropzone = pegar("dropzonePdf");
    const inputArquivos = pegar("inputArquivosPdf");
    const inputPasta = pegar("inputPastaPdf");
    const botaoEscolherPasta = pegar("btnEscolherPasta");
    const listaArquivos = pegar("listaArquivosPdf");
    const controles = pegar("controlesPdf");
    const botaoGerar = pegar("btnGerarPdf");
    const botaoLimpar = pegar("btnLimparPdf");
    const progresso = pegar("progressoPdf");
    const barraProgresso = pegar("progressoBarraPdf");
    const status = pegar("statusPdf");
    const previa = pegar("previaConceitosPdf");

    // Se a seção não estiver na página, não faz nada (evita erro no console).
    if (!dropzone) return;

    /* -------------------------------------------------------------------------
       FUNÇÕES DE TELA
       ---------------------------------------------------------------------- */

    function escreverStatus(mensagem, tipo) {
      if (!status) return;
      status.textContent = mensagem || "";
      status.className = "status-pdf" + (tipo ? " " + tipo : "");
    }

    function mostrarProgresso(mostrar) {
      if (!progresso) return;
      progresso.classList.toggle("ativo", !!mostrar);
      if (!mostrar && barraProgresso) barraProgresso.style.width = "0%";
    }

    function definirProgresso(porcentagem) {
      if (!barraProgresso) return;
      const valor = Math.max(0, Math.min(100, Math.round(porcentagem)));
      barraProgresso.style.width = valor + "%";
    }

    function escaparHtml(texto) {
      return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    // Monta a lista do que foi lido, com checkbox em cada arquivo.
    // O usuário decide exatamente o que entra no PDF.
    function renderizarLista(documentos) {
      if (!listaArquivos) return;

      if (!documentos.length) {
        listaArquivos.innerHTML =
          '<div class="lista-vazia">Nenhum arquivo carregado ainda. Arrasta algo aí em cima. 👆</div>';
        return;
      }

      const totalLinhas = documentos.reduce(function (soma, doc) { return soma + (doc.linhas || 0); }, 0);
      const semTexto = documentos.filter(function (d) { return !d.temTexto; }).length;

      let html = "";
      html += '<div class="lista-arquivos-topo">';
      html += "  <strong>" + documentos.length + " arquivo(s) lido(s)</strong>";
      html += "  <small>" + totalLinhas.toLocaleString("pt-BR") + " linhas • " + semTexto + " sem texto</small>";
      html += "</div>";
      html += '<div class="lista-arquivos-acoes">';
      html += '  <button type="button" class="btn-mini" id="btnMarcarTodos">Marcar todos</button>';
      html += '  <button type="button" class="btn-mini" id="btnDesmarcarTodos">Desmarcar todos</button>';
      html += "</div>";
      html += "<ul>";

      documentos.forEach(function (doc, indice) {
        const marcado = selecionados[indice] !== false;
        const etiqueta = (ROTULO_TIPO[doc.tipo] || (doc.extensao || "?").toUpperCase()) +
          (doc.temTexto ? " • " + (doc.linhas || 0) + " linhas" : " • sem texto");
        html +=
          '<li class="' + (doc.temTexto ? "" : "arquivo-ignorado") + '">' +
          '<label class="arquivo-linha"><input type="checkbox" class="arquivo-check" data-indice="' +
          indice + '"' + (marcado ? " checked" : "") + ' />' +
          '<span class="arquivo-caminho">' + escaparHtml(doc.caminho || doc.nome) + "</span></label>" +
          '<span class="arquivo-tag">' + escaparHtml(etiqueta) + "</span></li>";
      });

      html += "</ul>";
      listaArquivos.innerHTML = html;

      // Liga os checkboxes de cada arquivo
      listaArquivos.querySelectorAll(".arquivo-check").forEach(function (caixa) {
        caixa.addEventListener("change", function () {
          const indice = Number(caixa.getAttribute("data-indice"));
          selecionados[indice] = caixa.checked;
          atualizarBotoes();
        });
      });

      const marcar = pegar("btnMarcarTodos");
      const desmarcar = pegar("btnDesmarcarTodos");
      if (marcar) marcar.addEventListener("click", function () { definirSelecao(true); });
      if (desmarcar) desmarcar.addEventListener("click", function () { definirSelecao(false); });
    }

    // Marca/desmarca tudo de uma vez.
    function definirSelecao(valor) {
      selecionados = documentosLidos.map(function () { return valor; });
      renderizarLista(documentosLidos);
      atualizarBotoes();
    }

    // Só os arquivos que o usuário deixou marcados.
    function documentosSelecionados() {
      return documentosLidos.filter(function (d, i) { return selecionados[i] !== false; });
    }

    // Só anexa os originais (PDF/imagem) se o usuário quiser.
    function anexarOriginais() {
      const caixa = pegar("pdfAnexar");
      return !caixa || caixa.checked;
    }

    // Aplica a opção "incluir subpastas" no leitor antes de ler.
    function aplicarOpcoesDeLeitura() {
      const caixa = pegar("pdfIncluirSubpastas");
      if (window.LeitorArquivos && window.LeitorArquivos.config) {
        window.LeitorArquivos.config.incluirSubpastas = !!(caixa && caixa.checked);
      }
    }

    function atualizarBotoes() {
      const quantidade = documentosSelecionados().length;
      if (botaoGerar) botaoGerar.disabled = quantidade === 0;
      if (botaoLimpar) botaoLimpar.disabled = documentosLidos.length === 0;
    }

    function pegarTemasSelecionados() {
      const temas = [];
      ["bd", "ts", "poo"].forEach(function (sigla) {
        const caixa = pegar("tema-" + sigla);
        if (!caixa || !caixa.checked) return;
        if (sigla === "bd") temas.push("Banco de Dados");
        if (sigla === "ts") temas.push("TypeScript");
        if (sigla === "poo") temas.push("POO");
      });
      return temas.length ? temas : ["Banco de Dados", "TypeScript", "POO"];
    }

    /* -------------------------------------------------------------------------
       PROCESSAR OS ARQUIVOS
       ---------------------------------------------------------------------- */

    function processarDocumentos(documentos, origem) {
      documentosLidos = documentos;
      selecionados = documentos.map(function () { return true; });
      renderizarLista(documentos);
      atualizarBotoes();

      if (!documentos.length) {
        escreverStatus("Não veio arquivo nenhum na leitura. Tenta de novo.", "erro");
        return;
      }

      const c = contarTipos(documentos);
      escreverStatus(
        "Prontos: " + documentos.length + " arquivo(s) (" +
          c.texto + " texto, " + c.pdf + " PDF, " + c.imagem + " imagem, " +
          (c.docx + c.office) + " office, " + c.dia + " dia, " + c.outro + " outros). " +
          "Agora clica em “Gerar PDF”. 🚀",
        "ok"
      );
    }

    // Monta uma mensagem que explica POR QUE não achou arquivos.
    function explicarDropVazio() {
      let d = { itens: 0, comHandle: 0, comEntrada: 0, arquivosSoltos: 0, estrategiaUsada: "nenhuma" };
      try {
        if (window.LeitorArquivos && window.LeitorArquivos.diagnostico) {
          d = window.LeitorArquivos.diagnostico();
        }
      } catch (erro) { /* sem diagnóstico: usa o padrão */ }

      let pista = "";
      if (d.itens === 0) {
        pista = "O navegador não entregou nenhum item. Se você arrastou de dentro de um ZIP, do OneDrive/GDrive ou de uma pasta de rede, o navegador não consegue ler — use o botão “escolher uma pasta”.";
      } else if (d.comHandle === 0 && d.comEntrada === 0) {
        pista = "O navegador não expôs a pasta pelo arrastar. Use o botão “escolher uma pasta”, que funciona em todos os navegadores.";
      } else {
        pista = "A pasta foi vista, mas os arquivos de dentro não puderam ser lidos. Tente copiar a pasta pra Área de Trabalho (disco local) e arrastar de novo, ou use o botão “escolher uma pasta”.";
      }

      return (
        "Não consegui ler os arquivos da dropada " +
        "(itens: " + d.itens + ", handles: " + d.comHandle + ", entries: " + d.comEntrada + ", soltos: " + d.arquivosSoltos + "). " +
        pista
      );
    }

    // Roda quando vem da dropada (arrasta e solta).
    function tratarDrop(evento) {
      evento.preventDefault();
      dropzone.classList.remove("arrastando");

      const transferencia = evento.dataTransfer;
      if (!transferencia) return;

      aplicarOpcoesDeLeitura();

      escreverStatus("Lendo o que você arrastou...");
      mostrarProgresso(true);
      definirProgresso(8);

      window.LeitorArquivos
        .lerDrop(transferencia, function (quantidade) {
          definirProgresso(8 + Math.min(quantidade / 10, 30));
          escreverStatus("Encontrados " + quantidade + " arquivo(s) até agora...");
        })
        .then(function (lista) {
          if (!lista.length) {
            mostrarProgresso(false);
            escreverStatus(explicarDropVazio(), "erro");
            return null;
          }

          definirProgresso(40);
          escreverStatus("Lendo " + lista.length + " arquivo(s)... (PDF e OCR podem demorar)");

          return window.LeitorArquivos.extrairDocumentos(lista, function (posicao, total, caminho, situacao) {
            definirProgresso(40 + (posicao / total) * 55);
            if (situacao === "pdf") escreverStatus("Lendo PDF: " + caminho);
            else if (situacao === "ocr") escreverStatus("Lendo imagem (OCR): " + caminho);
            else if (situacao === "lido") escreverStatus("Lido: " + caminho);
          });
        })
        .then(function (documentos) {
          if (!documentos) return;
          mostrarProgresso(false);
          processarDocumentos(documentos, "seu material");
        })
        .catch(function (erro) {
          mostrarProgresso(false);
          escreverStatus("Deu ruim na leitura: " + erro.message, "erro");
        });
    }

    // Roda quando vem do input de arquivos/pasta (botão).
    function tratarListaDeArquivos(arquivos) {
      const lista = Array.prototype.slice.call(arquivos).map(function (arquivo) {
        return { arquivo: arquivo, caminho: arquivo.webkitRelativePath || arquivo.name };
      });

      aplicarOpcoesDeLeitura();

      escreverStatus("Lendo os arquivos escolhidos...");
      mostrarProgresso(true);
      definirProgresso(20);

      window.LeitorArquivos
        .extrairDocumentos(lista, function (posicao, total) {
          definirProgresso(20 + (posicao / total) * 70);
        })
        .then(function (documentos) {
          mostrarProgresso(false);
          processarDocumentos(documentos, "seleção");
        })
        .catch(function (erro) {
          mostrarProgresso(false);
          escreverStatus("Deu ruim na leitura: " + erro.message, "erro");
        });
    }

    /* -------------------------------------------------------------------------
       GERAR O PDF
       ---------------------------------------------------------------------- */

    function gerarPdfAgora() {
      const marcados = documentosSelecionados();

      if (!documentosLidos.length) {
        escreverStatus("Primeiro arrasta algum material aí em cima. 🙂", "erro");
        return;
      }

      if (!marcados.length) {
        escreverStatus("Marque pelo menos um arquivo na lista pra ele entrar no PDF.", "erro");
        return;
      }

      if (!window.GeradorPdf.temJsPdf()) {
        escreverStatus(
          "A biblioteca jsPDF não carregou. Confere a internet e o <script> do jsPDF no HTML.",
          "erro"
        );
        return;
      }

      escreverStatus("Analisando os conceitos e montando o PDF...");
      mostrarProgresso(true);
      definirProgresso(40);

      try {
        const analise = window.ExplicadorConceitos.analisar(marcados, {
          temas: pegarTemasSelecionados(),
          maximoConceitos: 30
        });

        // Só entram os arquivos marcados. Anexo de original é opcional.
        analise.anexos = anexarOriginais() ? montarAnexos(marcados) : [];
        analise.contagens = contarTipos(marcados);
        analise.arquivos = montarListaDeArquivos(marcados);

        definirProgresso(70);

        if (!analise.arquivos.length) {
          mostrarProgresso(false);
          if (previa) previa.innerHTML = "";
          escreverStatus("Nada pra gerar: nenhum arquivo na análise.", "erro");
          return;
        }

        renderizarPrevia(analise);

        const nomePasta = montarNomeDoMaterial(marcados);

        window.GeradorPdf.baixarPdf(analise, {
          nomePasta: nomePasta,
          data: new Date().toLocaleString("pt-BR"),
          rodape: "Gerado pelo Quiz de Prova • " + (analise.conceitos.length + " conceitos explicados")
        });

        definirProgresso(100);
        setTimeout(function () { mostrarProgresso(false); }, 800);

        escreverStatus(
          "PDF gerado! " + analise.arquivos.length + " arquivo(s), " +
            analise.conceitos.length + " conceito(s) e " + analise.anexos.length +
            " anexo(s) de imagem. Baixou na pasta de downloads. ✅",
          "ok"
        );
      } catch (erro) {
        mostrarProgresso(false);
        escreverStatus(erro.message, "erro");
      }
    }

    // Conta quantos arquivos de cada tipo vieram.
    function contarTipos(documentos) {
      const contagem = { texto: 0, pdf: 0, imagem: 0, docx: 0, office: 0, dia: 0, rtf: 0, outro: 0 };
      documentos.forEach(function (d) {
        if (contagem[d.tipo] !== undefined) contagem[d.tipo] += 1;
      });
      return contagem;
    }

    // Lista enxuta de todos os arquivos, pra aparecer no PDF final.
    function montarListaDeArquivos(documentos) {
      return documentos.map(function (d) {
        return {
          nome: d.nome,
          caminho: d.caminho,
          tipo: d.tipo,
          tamanho: d.tamanho,
          temTexto: d.temTexto
        };
      });
    }

    // Junta PDFs e imagens pra virar anexo no PDF final.
    function montarAnexos(documentos) {
      const anexos = [];
      documentos.forEach(function (d) {
        if (d.tipo === "pdf" && d.paginasImagens && d.paginasImagens.length) {
          anexos.push({ tipo: "pdf", nome: d.caminho || d.nome, paginasImagens: d.paginasImagens });
        } else if (d.tipo === "imagem" && d.dataUrl) {
          anexos.push({ tipo: "imagem", nome: d.caminho || d.nome, dataUrl: d.dataUrl });
        }
      });
      return anexos;
    }

    // Tenta achar um nome bom pro arquivo: nome da pasta de origem ou do 1º arquivo.
    function montarNomeDoMaterial(documentos) {
      if (!documentos.length) return "material";
      const caminho = documentos[0].caminho || documentos[0].nome;
      if (caminho.indexOf("/") !== -1) return caminho.split("/")[0];
      return documentos[0].nome.replace(/\.[^.]+$/, "");
    }

    // Cartõezinhos mostrando o que foi achado antes de baixar.
    function renderizarPrevia(analise) {
      if (!previa) return;
      let html = "";
      analise.conceitos.slice(0, 12).forEach(function (conceito) {
        html +=
          '<div class="previa-item" data-tema="' +
          escaparHtml(conceito.tema) +
          '"><strong>' +
          escaparHtml(conceito.titulo) +
          "</strong><small>" +
          escaparHtml(conceito.tema) +
          " • " +
          conceito.ocorrencias +
          " ocorrência(s)</small></div>";
      });
      previa.innerHTML = html;
    }

    /* -------------------------------------------------------------------------
       EVENTOS
       ---------------------------------------------------------------------- */

    ["dragenter", "dragover"].forEach(function (nomeEvento) {
      dropzone.addEventListener(nomeEvento, function (evento) {
        evento.preventDefault();
        evento.stopPropagation();
        dropzone.classList.add("arrastando");
      });
    });

    ["dragleave", "dragend"].forEach(function (nomeEvento) {
      dropzone.addEventListener(nomeEvento, function (evento) {
        evento.preventDefault();
        evento.stopPropagation();
        dropzone.classList.remove("arrastando");
      });
    });

    dropzone.addEventListener("drop", tratarDrop);

    // Clique abre a janela de escolher arquivos
    dropzone.addEventListener("click", function () {
      if (inputArquivos) inputArquivos.click();
    });

    if (inputArquivos) {
      inputArquivos.addEventListener("change", function (evento) {
        if (evento.target.files && evento.target.files.length) {
          tratarListaDeArquivos(evento.target.files);
        }
        evento.target.value = "";
      });
    }

    if (botaoEscolherPasta && inputPasta) {
      botaoEscolherPasta.addEventListener("click", function (evento) {
        evento.stopPropagation();
        inputPasta.click();
      });
      inputPasta.addEventListener("change", function (evento) {
        if (evento.target.files && evento.target.files.length) {
          tratarListaDeArquivos(evento.target.files);
        }
        evento.target.value = "";
      });
    }

    if (botaoGerar) botaoGerar.addEventListener("click", gerarPdfAgora);

    if (botaoLimpar) {
      botaoLimpar.addEventListener("click", function () {
        documentosLidos = [];
        selecionados = [];
        renderizarLista([]);
        if (previa) previa.innerHTML = "";
        atualizarBotoes();
        escreverStatus("Tudo limpo. Arrasta outro material quando quiser. 🧹");
      });
    }

    // Estado inicial
    renderizarLista([]);
    atualizarBotoes();
  }

  // Espera o DOM ficar pronto.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
