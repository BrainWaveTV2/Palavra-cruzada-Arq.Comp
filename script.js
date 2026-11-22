// Lista de palavras do jogo.
// lin e col = onde a palavra começa (começando do 0); dir: H = horizontal, V = vertical
var palavras = [
  { num: 1, resposta: "CACHE", dica: "Memória pequena e muito rápida, entre o processador e a memória principal.", dir: "V", lin: 0, col: 7 },
  { num: 2, resposta: "QUADCORE", dica: "Processador com quatro núcleos de processamento no mesmo chip.", dir: "V", lin: 0, col: 9 },
  { num: 3, resposta: "MEMORIADEMASSA", dica: "Guarda arquivos e programas de forma permanente, como o HD ou o SSD.", dir: "V", lin: 0, col: 12 },
  { num: 4, resposta: "DATABUS", dica: "Via de mão dupla por onde trafegam as informações entre processador, memória e periféricos.", dir: "H", lin: 1, col: 4 },
  { num: 4, resposta: "DUALCORE", dica: "Processador com dois núcleos de processamento no mesmo chip.", dir: "V", lin: 1, col: 4 },
  { num: 5, resposta: "CPU", dica: "Processador: o cérebro do computador, que executa as instruções dos programas.", dir: "H", lin: 2, col: 2 },
  { num: 6, resposta: "ROM", dica: "Memória que só permite leitura e mantém o conteúdo mesmo sem energia.", dir: "H", lin: 3, col: 11 },
  { num: 7, resposta: "ADDRESSBUS", dica: "Via de sentido único que informa a posição da memória a ser lida ou escrita.", dir: "V", lin: 3, col: 15 },
  { num: 8, resposta: "ULA", dica: "Parte do processador que faz as contas e as operações lógicas.", dir: "H", lin: 4, col: 3 },
  { num: 9, resposta: "DMA", dica: "Recurso que deixa periféricos trocar informações com a RAM sem passar pelo processador.", dir: "V", lin: 5, col: 0 },
  { num: 10, resposta: "UC", dica: "Parte do processador que coordena e dirige o trabalho dos outros componentes.", dir: "V", lin: 5, col: 2 },
  { num: 11, resposta: "MICROCONTROLADOR", dica: "Chip único com processador, memória e portas de entrada e saída, usado em sistemas embarcados.", dir: "H", lin: 6, col: 0 },
  { num: 12, resposta: "EEPROM", dica: "Memória não volátil regravável, que apaga e grava um byte de cada vez.", dir: "H", lin: 8, col: 3 },
  { num: 13, resposta: "RAM", dica: "Memória principal temporária: perde todo o conteúdo quando o computador é desligado.", dir: "H", lin: 9, col: 10 },
  { num: 14, resposta: "REGISTRADORES", dica: "Pequenas e velocíssimas áreas dentro do processador, que guardam valores em uso imediato.", dir: "H", lin: 11, col: 0 },
  { num: 15, resposta: "FLASH", dica: "Memória não volátil regravável em blocos, usada em pen drives e cartões SD.", dir: "H", lin: 13, col: 10 },
];

var LINHAS = 14;
var COLUNAS = 16;

// ---------- Pegando os elementos da página ----------
var tabuleiro = document.getElementById("tabuleiro");
var listaH = document.getElementById("listaH");
var listaV = document.getElementById("listaV");
var contador = document.getElementById("contador");
var mensagem = document.getElementById("mensagem");

// matriz que guarda os inputs de cada casa (vazia = sem casa)
var casas = [];

// ---------- 1. Montar o tabuleiro ----------
function montarTabuleiro() {
  // cria a matriz vazia
  for (var l = 0; l < LINHAS; l++) {
    casas[l] = [];
    for (var c = 0; c < COLUNAS; c++) {
      casas[l][c] = null;
    }
  }

  // define quantas colunas a grade tem
  tabuleiro.style.gridTemplateColumns = "repeat(" + COLUNAS + ", 34px)";

  // cria os inputs só nas casas que fazem parte de alguma palavra
  for (var i = 0; i < palavras.length; i++) {
    var p = palavras[i];
    for (var j = 0; j < p.resposta.length; j++) {
      var lin = p.lin;
      var col = p.col;
      if (p.dir == "H") {
        col = col + j;
      } else {
        lin = lin + j;
      }
      if (casas[lin][col] == null) {
        var input = document.createElement("input");
        input.maxLength = 1;
        input.addEventListener("input", limparLetra);
        casas[lin][col] = input;
      }
    }
  }

  // coloca tudo na tela, linha por linha
  for (var l = 0; l < LINHAS; l++) {
    for (var c = 0; c < COLUNAS; c++) {
      var div = document.createElement("div");
      div.className = "celula";

      if (casas[l][c] != null) {
        div.appendChild(casas[l][c]);

        // escreve o número da pista na casa onde a palavra começa
        for (var i = 0; i < palavras.length; i++) {
          if (palavras[i].lin == l && palavras[i].col == c) {
            var numero = document.createElement("span");
            numero.textContent = palavras[i].num;
            div.appendChild(numero);
            break;
          }
        }
      }
      tabuleiro.appendChild(div);
    }
  }
}

// aceita só letras e deixa maiúscula
function limparLetra(evento) {
  var valor = evento.target.value.toUpperCase();
  evento.target.value = valor.replace(/[^A-Z]/g, "");
}

// ---------- 2. Montar as listas de pistas ----------
function montarPistas() {
  for (var i = 0; i < palavras.length; i++) {
    var p = palavras[i];
    var li = document.createElement("li");
    li.textContent = p.num + ". " + p.dica;
    p.elementoPista = li; // guarda para pintar depois

    if (p.dir == "H") {
      listaH.appendChild(li);
    } else {
      listaV.appendChild(li);
    }
  }
}

// ---------- 3. Botão Conferir ----------
function conferir() {
  var acertos = 0;

  // primeiro limpa as cores antigas
  limparCores();

  for (var i = 0; i < palavras.length; i++) {
    var p = palavras[i];
    var digitado = "";
    var inputs = [];

    // junta as letras digitadas nas casas da palavra
    for (var j = 0; j < p.resposta.length; j++) {
      var lin = p.lin;
      var col = p.col;
      if (p.dir == "H") {
        col = col + j;
      } else {
        lin = lin + j;
      }
      digitado = digitado + casas[lin][col].value;
      inputs.push(casas[lin][col]);
    }

    if (digitado == p.resposta) {
      acertos++;
      p.elementoPista.className = "certa";
      for (var k = 0; k < inputs.length; k++) {
        inputs[k].className = "certa";
      }
    } else {
      p.elementoPista.className = "errada";
      for (var k = 0; k < inputs.length; k++) {
        // não pinta de vermelho uma casa que já está certa em outra palavra
        if (inputs[k].className != "certa") {
          inputs[k].className = "errada";
        }
      }
    }
  }

  contador.textContent = acertos + " de " + palavras.length + " palavras";

  if (acertos == palavras.length) {
    mensagem.textContent = "Parabéns! Você acertou todas as palavras!";
  } else {
    mensagem.textContent = "";
  }
}

// ---------- 4. Botão Reiniciar ----------
function reiniciar() {
  for (var l = 0; l < LINHAS; l++) {
    for (var c = 0; c < COLUNAS; c++) {
      if (casas[l][c] != null) {
        casas[l][c].value = "";
      }
    }
  }
  limparCores();
  contador.textContent = "0 de " + palavras.length + " palavras";
  mensagem.textContent = "";
}

// tira as cores de certo/errado
function limparCores() {
  for (var l = 0; l < LINHAS; l++) {
    for (var c = 0; c < COLUNAS; c++) {
      if (casas[l][c] != null) {
        casas[l][c].className = "";
      }
    }
  }
  for (var i = 0; i < palavras.length; i++) {
    palavras[i].elementoPista.className = "";
  }
}

// ---------- Começando o jogo ----------
montarTabuleiro();
montarPistas();
document.getElementById("btnConferir").addEventListener("click", conferir);
document.getElementById("btnReiniciar").addEventListener("click", reiniciar);
