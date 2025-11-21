// c:\Users\Admin\Desktop\Base de conhecimento\script.js
// Pega os elementos da tela
const form = document.getElementById('form-despesa');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const dataInput = document.getElementById('data');
const listaDespesasEl = document.getElementById('lista-despesas');
const rendaInput = document.getElementById('renda-mensal');
const totalDespesasEl = document.getElementById('total-despesas');
const resumoMensagemEl = document.getElementById('resumo-mensagem');

// Array para guardar as despesas na memória
let minhas_despesas = [];

// Função para renderizar as despesas na tela
function mostraDespesas() {
    // Limpa a lista atual
    listaDespesasEl.innerHTML = '';

    let total = 0;

    if (minhas_despesas.length === 0) {
        listaDespesasEl.innerHTML = '<p class="nenhum-resultado">Nenhuma despesa cadastrada.</p>';
    } else {
        minhas_despesas.forEach(despesa => {
        const despesaEl = document.createElement('article');
        despesaEl.classList.add('card'); // Reutilizando a classe 'card' para estilização

        const valorFormatado = parseFloat(despesa.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const dataFormatada = new Date(despesa.data + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        despesaEl.innerHTML = `
            <div class="info-despesa">
                <h2>${despesa.descricao}</h2>
                <p><strong>Valor:</strong> ${valorFormatado} </p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
            </div>
            <button class="botao-excluir" id="delete-${despesa.id}">Excluir</button>
        `;
        listaDespesasEl.appendChild(despesaEl);
        total += parseFloat(despesa.valor);
        });
    }

    // Adiciona a função de deletar em cada botao
    minhas_despesas.forEach(despesa => {
        const botaoDeletar = document.getElementById(`delete-${despesa.id}`);
        if (botaoDeletar) { // checa se o botao existe antes de add o click
            botaoDeletar.addEventListener('click', () => deleteDespesa(despesa.id));
        }
    });

    // Atualiza o total e a mensagem de resumo
    totalDespesasEl.textContent = total.toFixed(2).replace('.', ',');
    updateResumo(total);
};

const atualizarResumoMensagem = (total) => {
    const rendaMensal = parseFloat(rendaInput.value);

    // Só exibe a mensagem se a renda for um número válido e maior que zero
    if (!rendaMensal || rendaMensal <= 0) {
        resumoMensagemEl.textContent = "Preencha sua renda para ver a análise.";
        resumoMensagemEl.style.color = "var(--tertiary-color)";
        return;
    }

    const porcentagemGasta = (total / rendaMensal) * 100;

    if (porcentagemGasta > 85) {
        resumoMensagemEl.textContent = `Atenção! Você já gastou ${porcentagemGasta.toFixed(0)}% da sua renda. É hora de rever as prioridades.`;
        resumoMensagemEl.style.color = "#e53e3e"; // Vermelho
    } else if (porcentagemGasta >= 50) {
        resumoMensagemEl.textContent = `Cuidado. Seus gastos (${porcentagemGasta.toFixed(0)}%) estão se aproximando do limite.`;
        resumoMensagemEl.style.color = "var(--warning-color)"; // Laranja
    } else if (total > 0) {
        resumoMensagemEl.textContent = `Ótimo controle! Você gastou apenas ${porcentagemGasta.toFixed(0)}% da sua renda. Continue assim!`;
        resumoMensagemEl.style.color = "#48bb78"; // Verde
    } else {
        resumoMensagemEl.textContent = "Você ainda não tem gastos este mês.";
        resumoMensagemEl.style.color = "var(--secondary-color)";
    }
};

// Função para adicionar uma nova despesa - chamada pelo form
const adicionarDespesa = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const novaDespesa = {
        id: Date.now(), // ID único baseado no timestamp
        descricao: descricaoInput.value,
        valor: valorInput.value,
        data: dataInput.value,
    };

    minhas_despesas.push(novaDespesa);
    mostraDespesas();

    form.reset(); // Limpa o formulário
};

// Função para deletar uma despesa
function deleteDespesa(id) {
    // Filtra o array, mantendo apenas as despesas que NÃO têm o id que queremos excluir
    minhas_despesas = minhas_despesas.filter(d => d.id !== id);
    // Re-renderiza a lista
    mostraDespesas();
}

// Adiciona o listener para o envio do formulário
form.addEventListener('submit', adicionarDespesa);

// Adiciona um listener para o campo de renda, para atualizar a mensagem sempre que ele for alterado
rendaInput.addEventListener('input', () => mostraDespesas());

// Renderiza a mensagem inicial ao carregar a página
document.addEventListener('DOMContentLoaded', mostraDespesas);

// Renomeei a função pra ficar mais claro
const updateResumo = atualizarResumoMensagem;
