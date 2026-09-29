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
