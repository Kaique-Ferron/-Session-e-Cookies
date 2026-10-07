const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

const USUARIO_MOCKADO = {
    id: 1,
    nome: "Kaique",
    email: "kaique@gmail.com",
    usuario: "admin",
    senha: "12345"
};

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "canal-desvendando-codigo",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

function protegerRota(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Acesso negado. Faça login primeiro."
        });
    }

    next();
}

app.get('/api/publica', (req, res) => {
    res.json({
        mensagem: 'Essa rota é pública!!!',
        logado: !!req.session.usuario
    });
});

app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (
        usuario === USUARIO_MOCKADO.usuario &&
        senha === USUARIO_MOCKADO.senha
    ) {
        req.session.usuario = {
            id: USUARIO_MOCKADO.id,
            nome: USUARIO_MOCKADO.nome,
            email: USUARIO_MOCKADO.email
        };

        return res.json({
            mensagem: 'Login realizado com sucesso',
            usuario: req.session.usuario
        });
    }

    return res.status(401).json({
        mensagem: 'Usuário ou senha inválidos!'
    });
});

app.get('/api/protegida', protegerRota, (req, res) => {
    res.json({
        mensagem: 'Você acessou uma rota protegida usando session.',
        usuario: req.session.usuario
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        logado: !!req.session.usuario,
        usuario: req.session.usuario || null
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
