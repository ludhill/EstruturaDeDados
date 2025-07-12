---

## 🐶 Petshop Manager

Sistema web desenvolvido para gerenciamento de produtos e usuários de um Petshop, utilizando **TypeScript** com **HashTable personalizada**, interface interativa e **persistência em LocalStorage** com objetivo de sanar atividade do curso de 
estrutura de dados no curso superior em sistemas para interenet do campus 
ifrn-parnamirim.

---

### 📌 Funcionalidades

- 🔐 Modal com abas de Login e Criação de Usuário
- 🧑‍🤝‍🧑 Cadastro, edição e exclusão de usuários
- 📦 Cadastro, edição, exclusão e listagem de produtos
- 🔎 Busca interativa para produtos e usuários
- 🆔 Geração automática e incremental de IDs
- 💾 Armazenamento local (LocalStorage)
- ✅ Validações de entrada para segurança e consistência

---

### 🛠️ Requisitos Técnicos

| Recurso | Necessário? | Observações |
|--------|-------------|-------------|
| Visual Studio Code | ✅ | Recomendado como editor |
| Node.js + npm | ✅ | Para compilar TypeScript |
| Extensão TypeScript | ✅ | Já incluída no Node |
| Extensão Live Server | ✅ | Executa interface no navegador |
| TypeScript compilado via `tsc` | ✅ | Gera o arquivo `app.js` |
| Nenhuma dependência externa | ✅ | Projeto 100% client-side |

---

### 🚀 Como rodar o projeto localmente

#### 1. Clone ou baixe o projeto

```
git clone https://github.com/seuusuario/petshop-app
```

#### 2. Instale o TypeScript globalmente (se necessário)

```bash
npm install -g typescript
```

#### 3. Gere o arquivo `app.js` a partir de `app.ts`

```bash
tsc --watch
```

Isso cria (e atualiza automaticamente) `app.js` na mesma pasta, conforme você modifica o código TypeScript.

#### 4. Execute com Live Server

- Clique com botão direito no `index.html` → **"Open with Live Server"**
- O navegador abrirá o sistema e tudo estará funcional

---

### 📂 Estrutura de Arquivos

```
petshop-app/
├── index.html          # Interface HTML principal
├── styles.css          # Estilo visual da aplicação
├── app.ts              # Lógica escrita em TypeScript
├── app.js              # Código compilado (gerado automaticamente)
├── tsconfig.json       # Configuração do compilador TypeScript
└── README.md           # Documentação do projeto
```

---

### 🧪 Requisitos Avaliativos Atendidos

| Critério | Pontuação Máxima | Situação |
|---------|------------------|----------|
| Uso correto de HashTable personalizada    | 15 pts    | ✅ |
| Interface funcional (HTML + TypeScript)   | 10 pts    | ✅ |
| Operações CRUD completas                  | 10 pts    | ✅ |
| Organização, clareza e criatividade       | 5 pts     | ✅ |

---

### 🎓 Observações finais

Esse projeto foi pensado para atender a todos os requisitos do trabalho de **Estrutura de Dados aplicada ao desenvolvimento web** com TypeScript. Inclui:

- Estrutura central baseada em HashTable
- Interface limpa e interativa
- Validação de dados e controle de entrada
- Funcionalidades extras como geração de ID e buscas dinâmicas
- Código modular, comentado e  bem estruturado

---
