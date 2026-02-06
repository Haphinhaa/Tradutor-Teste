const inputTexto = document.querySelector(".input-texto");
const resultado = document.querySelector(".tradução");
const origem = document.querySelector(".idioma-origem");
const destino = document.querySelector(".idioma-destino");
const btnMicrofone = document.getElementById("btn-microfone");

// 1. Tradução
async function traduzir() {
    const texto = inputTexto.value.trim();
    if (texto === "") return;

    resultado.innerText = "Traduzindo...";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${origem.value}|${destino.value}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        resultado.innerText = dados.responseData.translatedText;
    } catch (erro) {
        resultado.innerText = "Erro na tradução.";
    }
}

// 2. Reconhecimento de Voz (Entrada)
function ouvirMicrofone() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert("Navegador não suportado.");

    const reconhecimento = new Recognition();
    reconhecimento.lang = origem.value;

    reconhecimento.onstart = () => btnMicrofone.style.backgroundColor = "#ff4b4b";
    reconhecimento.onresult = (event) => {
        inputTexto.value = event.results[0][0].transcript;
        btnMicrofone.style.backgroundColor = "#ffffff1a";
        traduzir();
    };
    reconhecimento.onerror = () => btnMicrofone.style.backgroundColor = "#ffffff1a";
    reconhecimento.start();
}

// 3. Síntese de Voz (Saída/Leitura)
function falarTexto() {
    const textoParaFalar = resultado.innerText;
    if (textoParaFalar === "A tradução aparecerá aqui" || textoParaFalar === "Traduzindo...") return;

    const mensagem = new SpeechSynthesisUtterance(textoParaFalar);
    mensagem.lang = destino.value; // Define o idioma da voz baseado no destino
    window.speechSynthesis.speak(mensagem);
}

// 4. Copiar Texto
function copiarTexto() {
    const texto = resultado.innerText;
    if (texto === "A tradução aparecerá aqui") return;

    navigator.clipboard.writeText(texto).then(() => {
        const original = resultado.innerText;
        resultado.innerText = "Copiado!";
        setTimeout(() => resultado.innerText = original, 1200);
    });
}