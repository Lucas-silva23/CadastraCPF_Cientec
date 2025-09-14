# 📝 CadastraCPF_Cientec

Ferramenta web para cadastro e pesquisa de cidadãos por CPF ou Nome. A aplicação usa Node.js, Express, SQLite e front-end em HTML, CSS e JavaScript.

## 📌 Funcionalidades

- Cadastro de cidadão com Nome e CPF.

- Pesquisa por CPF ou Nome, com opção de seleção via radio button.

- Validação de formato do CPF (máscara XXX.XXX.XXX-XX).

- Mensagens de sucesso ou erro exibidas de forma clara.

## 🛠 Pré-requisitos

- Node.js
- SQLite

## 📂 Estrutura do Projeto

``` 
CadastraCPF_Cientec/
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ script.js
│
├─ src/
│  ├─ controllers/
│  │  └─ CidadaoController.js
│  ├─ db/
│  │  ├─ db.js
│  │  └─ init.js
│  ├─ models/
│  │  └─ Cidadao.js
│  └─ utils/
│     └─ utils.js
│
├─ test/
│  └─ test.js
│
├─ server.js
├─ package-lock.json
└─ package.json
```
## 📥 Instalação

### 1. Instale o Node.js:

- Baixe e instale em: https://nodejs.org/

### 2. Instale o SQLite caso ainda não tenha:

- Baixe e instale em: https://www.sqlite.org/download.html

### 3. Clone o Repositório:

```
git clone https://github.com/Lucas-silva23/CadastraCPF_Cientec.git
cd CadastraCPF_Cientec/
```

### 4. Instale as dependências:

```
npm install  
```

## ⏯️ Executar Aplicação

### Para executar a aplicação rode o comando:

```
npm start
```

### Abra o navegador e entre na URL:

http://localhost:3000

#### Lista de CPFs válidos para teste (gerados pelo site `https://www.4devs.com.br/gerador_de_cpf`):

- 000.088.480-41
- 968.802.150-41
- 862.911.440-18
- 717.872.080-87

## 🪧 Rodar Teste Automatizado

### Para rodar o teste automatizado, inicie o server em um terminal:

```
npm start
```

### Depois, abra outro terminal e rode o comando:

```
node test.js
```