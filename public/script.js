const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

async function verificarSeJaEstaLogado() {
    try {
        const resposta = await fetch('/api/status');

        if (!resposta.ok) {
            throw new Error('Erro ao verificar sessão');
        }

        const dados = await resposta.json();

        if (dados.logado) {
            window.location.href = 'dashboard.html';
        }
    } catch (erro) {
        console.error('Erro ao verificar login:', erro);
    }
}

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (usuario === '' || senha === '') {
        mensagem.textContent = 'Preencha usuário e senha.';
        return;
    }

    try {
        const resposta = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.mensagem;
            return;
        }

        mensagem.textContent = dados.mensagem;

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 700);

    } catch (erro) {
        console.error('Erro no login:', erro);
        mensagem.textContent = 'Erro ao conectar com o servidor.';
    }
});

verificarSeJaEstaLogado();
