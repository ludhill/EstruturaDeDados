interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

interface ProdutoPetshop {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  quantidade: number;
  valor: number;
}

class HashTable<K extends string | number, V> {
  private table: { [key: string]: V } = {};

  set(key: K, value: V): void {
    this.table[String(key)] = value;
  }

  get(key: K): V | undefined {
    return this.table[String(key)];
  }

  has(key: K): boolean {
    return key.toString() in this.table;
  }

  delete(key: K): void {
    delete this.table[String(key)];
  }

  entries(): [string, V][] {
    return Object.entries(this.table);
  }

  values(): V[] {
    return Object.values(this.table);
  }
}

class PetshopApp {
  public usuarios = new HashTable<string, Usuario>();
  public produtos = new HashTable<string, ProdutoPetshop>();

  constructor() {
    this.carregarDados();
    this.configurarAbasLogin();
    this.configurarFormularios();
    this.configurarBusca();
  }

  private configurarAbasLogin(): void {
    const abaLogin = document.getElementById('btn-aba-login')!;
    const abaCriar = document.getElementById('btn-aba-criar')!;
    const formLogin = document.getElementById('form-login')!;
    const formCriar = document.getElementById('form-criar')!;

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

  private configurarFormularios(): void {
    // Login
    (document.getElementById('form-login') as HTMLFormElement).addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('login-email') as HTMLInputElement).value.toLowerCase();
      const senha = (document.getElementById('login-senha') as HTMLInputElement).value;

      const usuario = this.usuarios.get(email);
      if (usuario && usuario.senha === senha) {
        this.iniciarAplicacao();
      } else {
        alert('Email ou senha incorretos!');
      }
    });

    // Criar Conta
    (document.getElementById('form-criar') as HTMLFormElement).addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (document.getElementById('criar-nome') as HTMLInputElement).value.trim();
      const email = (document.getElementById('criar-email') as HTMLInputElement).value.toLowerCase();
      const senha = (document.getElementById('criar-senha') as HTMLInputElement).value;

      if (!/^[\w\s]{1,30}$/.test(nome)) {
        alert('Nome inválido.');
        return;
      }

      if (this.usuarios.has(email)) {
        alert('Email já cadastrado!');
        return;
      }

      const novoUsuario: Usuario = { id: email, nome, email, senha };
      this.usuarios.set(email, novoUsuario);
      this.salvarDados();
      alert('Usuário criado com sucesso!');
      document.getElementById('btn-aba-login')!.click();
    });

    //Cadastro de Produto
    (document.getElementById('produto-form') as HTMLFormElement).addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (document.getElementById('produto-nome') as HTMLInputElement).value.trim();
      const tipo = (document.getElementById('produto-tipo') as HTMLInputElement).value.trim();
      const descricao = (document.getElementById('produto-desc') as HTMLInputElement).value.trim();
      const quantidade = parseInt((document.getElementById('produto-quant') as HTMLInputElement).value);
      const valor = parseFloat((document.getElementById('produto-valor') as HTMLInputElement).value);

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
      (document.getElementById('produto-form') as HTMLFormElement).reset();
      this.renderizarProdutos();
    });
  }

  private configurarBusca(): void {
    (document.getElementById('busca-produto') as HTMLInputElement).addEventListener('input', (e) => {
      const termo = (e.target as HTMLInputElement).value.toLowerCase();
      const resultados = this.produtos.values().filter(prod =>
        prod.nome.toLowerCase().includes(termo) || prod.tipo.toLowerCase().includes(termo)
      );
      this.renderizarProdutos(resultados);
    });

    (document.getElementById('busca-usuario') as HTMLInputElement).addEventListener('input', (e) => {
      const termo = (e.target as HTMLInputElement).value.toLowerCase();
      const resultados = this.usuarios.values().filter(user =>
        user.nome.toLowerCase().includes(termo) || user.email.toLowerCase().includes(termo)
      );
      this.renderizarUsuarios(resultados);
    });
  }

  private gerarIdProduto(): string {
    let contador = parseInt(localStorage.getItem('contador_produto') || '0');
    contador++;
    localStorage.setItem('contador_produto', contador.toString());
    return `PROD-${contador}`;
  }

  private iniciarAplicacao(): void {
    (document.getElementById('login-modal') as HTMLDivElement).style.display = 'none';
    (document.getElementById('main-app') as HTMLDivElement).style.display = 'block';
    this.renderizarProdutos();
    this.renderizarUsuarios();
  }

  private renderizarProdutos(lista: ProdutoPetshop[] = this.produtos.values()): void {
    const div = document.getElementById('lista-produtos')!;
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

  private renderizarUsuarios(lista: Usuario[] = this.usuarios.values()): void {
    const div = document.getElementById('lista-usuarios')!;
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
  editarProduto(id: string): void {
    const prod = this.produtos.get(id)!;
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

  removerProduto(id: string): void {
    if (confirm('Deseja excluir este produto?')) {
      this.produtos.delete(id);
      this.salvarDados();
      this.renderizarProdutos();
    }
  }

  editarUsuario(id: string): void {
    const user = this.usuarios.get(id)!;
    const novaSenha = prompt(`Nova senha para ${user.nome}:`, user.senha);
    if (novaSenha) {
      user.senha = novaSenha;
      this.usuarios.set(id, user);
      this.salvarDados();
      this.renderizarUsuarios();
    }
  }

  removerUsuario(id: string): void {
    if (confirm('Deseja excluir este usuário?')) {
      this.usuarios.delete(id);
      this.salvarDados();
      this.renderizarUsuarios();
    }
  }

  private salvarDados(): void {
    const usuariosArray = this.usuarios.entries();
    const produtosArray = this.produtos.entries();
    localStorage.setItem('petshop_usuarios', JSON.stringify(usuariosArray));
    localStorage.setItem('petshop_produtos', JSON.stringify(produtosArray));
  }

  private carregarDados(): void {
    const usuarios = localStorage.getItem('petshop_usuarios');
    const produtos = localStorage.getItem('petshop_produtos');

    if (usuarios) {
      const arr: [string, Usuario][] = JSON.parse(usuarios);
      arr.forEach(([id, u]) => this.usuarios.set(id, u));
    }

    if (produtos) {
      const arr: [string, ProdutoPetshop][] = JSON.parse(produtos);
      arr.forEach(([id, p]) => this.produtos.set(id, p));
    }
  }
}

// Torna a aplicação acessível globalmente no navegador
(window as any).app = new PetshopApp();
