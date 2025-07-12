"use strict";
class HashTable {
    constructor() {
        this.table = {};
    }
    set(key, value) {
        this.table[String(key)] = value;
    }
    get(key) {
        return this.table[String(key)];
    }
    has(key) {
        return key.toString() in this.table;
    }
    delete(key) {
        delete this.table[String(key)];
    }
    entries() {
        return Object.entries(this.table);
    }
    values() {
        return Object.values(this.table);
    }
}
class PetshopApp {
    constructor() {
        this.usuarios = new HashTable();
        this.produtos = new HashTable();
        this.carregarDados();
        this.configurarAbasLogin();
        this.configurarFormularios();
        this.configurarBusca();
    }
    configurarAbasLogin() {
        const abaLogin = document.getElementById('btn-aba-login');
        const abaCriar = document.getElementById('btn-aba-criar');
        const formLogin = document.getElementById('form-login');
        const formCriar = document.getElementById('form-criar');
        abaLogin.addEventListener('click', () => {
            abaLogin.classList.add('active');
            abaCriar.classList.remove('active');
            formLogin.classList.add('active');
            formCriar.classList.remove('active');
        });
        abaCriar.addEventListener('click', () => {
            abaCriar.classList.add('active');
            abaLogin.classList.remove('active');
            formCriar.classList.add('active');
            formLogin.classList.remove('active');
        });
    }
    configurarFormularios() {
        // Login
        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.toLowerCase();
            const senha = document.getElementById('login-senha').value;
            const usuario = this.usuarios.get(email);
            if (usuario && usuario.senha === senha) {
                this.iniciarAplicacao();
            }
            else {
                alert('Email ou senha incorretos!');
            }
        });
        // Criar Conta
        document.getElementById('form-criar').addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('criar-nome').value.trim();
            const email = document.getElementById('criar-email').value.toLowerCase();
            const senha = document.getElementById('criar-senha').value;
            if (!/^[\w\s]{1,30}$/.test(nome)) {
                alert('Nome inválido.');
                return;
            }
            if (this.usuarios.has(email)) {
                alert('Email já cadastrado!');
                return;
            }
            const novoUsuario = { id: email, nome, email, senha };
            this.usuarios.set(email, novoUsuario);
            this.salvarDados();
            alert('Usuário criado com sucesso!');
            document.getElementById('btn-aba-login').click();
        });
        //Cadastro de Produto
        document.getElementById('produto-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('produto-nome').value.trim();
            const tipo = document.getElementById('produto-tipo').value.trim();
            const descricao = document.getElementById('produto-desc').value.trim();
            const quantidade = parseInt(document.getElementById('produto-quant').value);
            const valor = parseFloat(document.getElementById('produto-valor').value);
            if (!/^[\w\s]{1,30}$/.test(nome)) {
                alert('Nome inválido!');
                return;
            }
            if (!/^[\w\s]{1,20}$/.test(tipo)) {
                alert('Tipo inválido!');
                return;
            }
            if (descricao.length > 100) {
                alert('Descrição muito longa!');
                return;
            }
            if (quantidade < 0 || quantidade > 10000 || isNaN(quantidade)) {
                alert('Quantidade fora do intervalo permitido!');
                return;
            }
            if (valor < 0.01 || valor > 9999.99 || isNaN(valor)) {
                alert('Valor fora do intervalo!');
                return;
            }
            const id = this.gerarIdProduto();
            this.produtos.set(id, { id, nome, tipo, descricao, quantidade, valor });
            this.salvarDados();
            document.getElementById('produto-form').reset();
            this.renderizarProdutos();
        });
    }
    configurarBusca() {
        document.getElementById('busca-produto').addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const resultados = this.produtos.values().filter(prod => prod.nome.toLowerCase().includes(termo) || prod.tipo.toLowerCase().includes(termo));
            this.renderizarProdutos(resultados);
        });
        document.getElementById('busca-usuario').addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const resultados = this.usuarios.values().filter(user => user.nome.toLowerCase().includes(termo) || user.email.toLowerCase().includes(termo));
            this.renderizarUsuarios(resultados);
        });
    }
    gerarIdProduto() {
        let contador = parseInt(localStorage.getItem('contador_produto') || '0');
        contador++;
        localStorage.setItem('contador_produto', contador.toString());
        return `PROD-${contador}`;
    }
    iniciarAplicacao() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.renderizarProdutos();
        this.renderizarUsuarios();
    }
    renderizarProdutos(lista = this.produtos.values()) {
        const div = document.getElementById('lista-produtos');
        div.innerHTML = '';
        lista.forEach(prod => {
            const item = document.createElement('div');
            item.className = 'linha';
            item.innerHTML = `
        <p><strong>ID:</strong> ${prod.id}</p>
        <p><strong>${prod.nome}</strong> [${prod.tipo}]</p>
        <p>${prod.descricao}</p>
        <p>Qtd: ${prod.quantidade} | Valor: R$${prod.valor.toFixed(2)}</p>
        <button onclick="app.editarProduto('${prod.id}')">Editar</button>
        <button onclick="app.removerProduto('${prod.id}')">Excluir</button>
      `;
            div.appendChild(item);
        });
    }
    renderizarUsuarios(lista = this.usuarios.values()) {
        const div = document.getElementById('lista-usuarios');
        div.innerHTML = '';
        lista.forEach(user => {
            const item = document.createElement('div');
            item.className = 'linha';
            item.innerHTML = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>${user.nome}</strong> (${user.email})</p>
        <button onclick="app.editarUsuario('${user.id}')">Editar Senha</button>
        <button onclick="app.removerUsuario('${user.id}')">Excluir</button>
      `;
            div.appendChild(item);
        });
    }
    editarProduto(id) {
        const prod = this.produtos.get(id);
        const novoNome = prompt('Novo nome:', prod.nome);
        const novoTipo = prompt('Novo tipo:', prod.tipo);
        const novaDesc = prompt('Nova descrição:', prod.descricao);
        const novaQtd = prompt('Nova quantidade:', prod.quantidade.toString());
        const novoValor = prompt('Novo valor:', prod.valor.toString());
        if (novoNome && novoTipo && novaDesc && novaQtd && novoValor) {
            prod.nome = novoNome.trim();
            prod.tipo = novoTipo.trim();
            prod.descricao = novaDesc.trim();
            prod.quantidade = parseInt(novaQtd);
            prod.valor = parseFloat(novoValor);
            this.produtos.set(id, prod);
            this.salvarDados();
            this.renderizarProdutos();
        }
    }
    removerProduto(id) {
        if (confirm('Deseja excluir este produto?')) {
            this.produtos.delete(id);
            this.salvarDados();
            this.renderizarProdutos();
        }
    }
    editarUsuario(id) {
        const user = this.usuarios.get(id);
        const novaSenha = prompt(`Nova senha para ${user.nome}:`, user.senha);
        if (novaSenha) {
            user.senha = novaSenha;
            this.usuarios.set(id, user);
            this.salvarDados();
            this.renderizarUsuarios();
        }
    }
    removerUsuario(id) {
        if (confirm('Deseja excluir este usuário?')) {
            this.usuarios.delete(id);
            this.salvarDados();
            this.renderizarUsuarios();
        }
    }
    salvarDados() {
        const usuariosArray = this.usuarios.entries();
        const produtosArray = this.produtos.entries();
        localStorage.setItem('petshop_usuarios', JSON.stringify(usuariosArray));
        localStorage.setItem('petshop_produtos', JSON.stringify(produtosArray));
    }
    carregarDados() {
        const usuarios = localStorage.getItem('petshop_usuarios');
        const produtos = localStorage.getItem('petshop_produtos');
        if (usuarios) {
            const arr = JSON.parse(usuarios);
            arr.forEach(([id, u]) => this.usuarios.set(id, u));
        }
        if (produtos) {
            const arr = JSON.parse(produtos);
            arr.forEach(([id, p]) => this.produtos.set(id, p));
        }
    }
}
// Torna a aplicação acessível globalmente no navegador
window.app = new PetshopApp();
