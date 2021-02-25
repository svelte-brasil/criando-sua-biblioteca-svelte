[![Criando uma biblioteca Svelte](logo.png)](https://andrelmlins.gitbook.io/criando-sua-biblioteca-svelte/)

No dia a dia utilizamos várias bibliotecas para Svelte ou Javascript com o objetivo de facilitar nosso trabalho. Bibliotecas de componentes, datas, rotas, gerenciamento de estados, entre outras, são comuns na criação de aplicações. Mas você já parou para pensar em tudo que necessita para criar bibliotecas?

Se você chegou até aqui é porque tem interesse em aprender como desenvolver essas bibliotecas. Aqui vamos entender de forma manual como configurar e desenvolver uma biblioteca.

A biblioteca que iremos criar será um componente que estiliza uma mensagem de erro em requisições dentro de uma aplicação. Ele terá como propriedade um código de erro e uma descrição. Ao seguir esse tutorial já pode mudar as referências de nome para sua biblioteca.

> 🔷 **Svelte agora tem suporte para typescript**: para migrar sua biblioteca para typescript acesso o [link](TYPESCRIPT.md)

<em>Nota: essa biblioteca irá funcionar também no sapper, porém, a mesma tem que ser instalada como `devDependency`, leia sobre isso neste [link](https://github.com/sveltejs/sapper-template#using-external-components)</em>

## 1. Primeiro vamos criar a pasta e inicializar um projeto através do yarn

Nosso primeiro passo é iniciar um projeto através do yarn e criar algumas pastas, você pode mudar o nome da pasta para o de sua biblioteca.

```bash
mkdir svelte-error-screen
cd svelte-error-screen
mkdir src
mkdir public
mkdir doc
yarn init
```

## 2. Agora vamos instalar o svelte

O objetivo aqui é desenvolver biblioteca para Svelte, então vamos instalar sua base de bibliotecas.

```
yarn add -D svelte
```

## 3. Está na hora de criarmos as configurações

Vamos inserir as configurações básicas para inicialização e contrução da nossa biblioteca. O [Rollup](https://rollupjs.org/) é o gerador de bundle padrão do svelte, vamos usar isto tanto para iniciar uma aplicação com nossa biblioteca, como também para fazer a transpilação de nossa bibliteca.

### Instalando as bibliotecas Rollup

Nessa etapa iremos instalar as dependências do rollup que servirão para iniciar uma aplicação e construir a biblioteca.

```
yarn add -D rollup rollup-plugin-commonjs rollup-plugin-livereload rollup-plugin-node-resolve rollup-plugin-svelte rollup-plugin-terser rollup-plugin-css-only sirv-cli
```

### Agora vamos inserir as configuração do rollup

Primeiro crie o arquivo `rollup.config.js`, esse é o arquivo de configuração do rollup.

Agora vamos colocar a configuração abaixo, você deve reparar que existem múltipas configurações que irão servir para: iniciar a aplicação, construir a aplicação e também construir a biblioteca. Veja abaixo a configuração:

```js
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "doc/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
    },
    plugins: [
      svelte({ dev: !production }),
      css({ output: "bundle.css" }),
      resolve({
        browser: true,
        dedupe: (importee) =>
          importee === "svelte" || importee.startsWith("svelte/"),
      }),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/ErrorScreen.svelte",
    output: { file: pkg.main, format: "umd", name: "ErrorScreen" },
    plugins: [svelte({ emitCss: false }), resolve(), commonjs()],
  },
  {
    input: "src/ErrorScreen.svelte",
    output: { file: pkg.module, format: "es" },
    external: ["svelte/internal"],
    plugins: [svelte({ emitCss: false }), commonjs()],
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
```

## 4. Vamos agora criar nossos scripts e ajustar o package.json

Para criar os scripts, vá no arquivo `package.json` e insira o seguinte código:

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "sirv public"
  }
}
```

Perceba que no build todo o conteúdo será transpilado para uma pasta chamada dist, para que outra lib ao utilizar seu módulo consiga utilizar na raiz modifique as propriedades `main` e `module`.

```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs"
}
```

Outra configuração importante é indicar o seu componente Svelte original. Essa configuração irá permitir que o plugin do rollup `rollup-plugin-svelte` utilize seu arquivo de origem na hora de criar o build de uma aplicação, trazendo uma maior performance. Logo, adicione a seguinte configuração ao seu `package.json`.

```json
{
  "svelte": "src/lib/ErrorScreen.svelte"
}
```

Além disso nosso projeto tem várias configurações que não serão necessárias no pacote final da nossa biblioteca. Para diminuir o tamanho do pacote e só colocar o que é essencial, utilize a propriedade `files` para informar quais arquivos são necessários para nossa biblioteca.

```json
{
  "files": ["dist", "src/lib/ErrorScreen.svelte"]
}
```

## 5. Já podemos iniciar nosso componente que se tornará uma biblioteca

Agora que já temos um ambiente configurado, podemos iniciar o desenvolvimento da nossa biblioteca svelte.

### Crie o arquivo `src/lib/ErrorScreen.svelte` e coloque o seguinte código

```html
<script>
  export let error;
  export let description;
</script>

<div>
  <h2>{error}</h2>
  <h4>{description}</h4>
</div>

<style>
  div {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30%;
    box-sizing: border-box;
    text-align: center;
    background-color: #eaeaea;
    font-family: arial;
  }
  h2 {
    font-size: 80pt;
    font-weight: 700;
    margin: 0;
  }
  h4 {
    font-size: 30pt;
    font-weight: 100;
    margin: 0;
  }
</style>
```

## 6. Vamos agora montar a área que iremos visualizar o nosso componente funcionando

É muito importante podermos testar a nossa biblioteca e visualizar o resultado do nosso componente, vamos a seguir trabalhar nessa etapa.

Vamos criar a base em svelte para testar nosso componente e configurar a pasta public onde um projeto svelte é construído.

### Crie os arquivos base para iniciar uma aplicação svelte

Primeiro vamos criar o nosso arquivo `doc/main.js`:

```js
import App from "./App.svelte";

const app = new App({
  target: document.body,
});

export default app;
```

Agora vamos criar nosso arquivo svelte `doc/App.svelte`, onde iremos visualizar nosso componente da biblioteca.

```html
<script>
  import SvelteErrorScreen from "../src/index.svelte";
</script>

<main>
  <SvelteErrorScreen
    error="{500}"
    description="Ocorreu um problema no servidor"
  />
</main>

<style>
  main {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
```

### Crie o arquivo `public/index.html`

Para iniciarmos a aplicação através do rollup precisamos de um arquivo base de html, para isso iremos criar o arquivo
`index.html` e colocar o seguinte conteúdo:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Svelte Error Screen</title>
    <style>
      html,
      body,
      #root {
        height: 100%;
        margin: 0;
        font-family: "Roboto", sans-serif;
      }
    </style>
    <link rel="stylesheet" href="/build/bundle.css" />
    <script defer src="/build/bundle.js"></script>
  </head>
  <body></body>
</html>
```

## Agora sim, vamos ver o componente da nossa biblioteca

Execute o comando abaixo na raiz do projeto.

```bash
yarn dev
```

Acesse `http://localhost:5000/` e verá seu componente.

[comment]: <> (Colocar exemplo de uma aplicação)

## 7. Vamos agora testar a transpilação

Rode o comando abaixo na raiz do projeto.

```bash
yarn build
```

No diretório `dist` que está na raiz do seu projeto, você verá seu componente transpilado.

## 8. Hora de publicar

Você já deve está muito feliz por ver seu componente funcionando e querendo usar em seu projeto. Então vamos agora publicar este componente, essa é a etapa mais simples. Rode o seguinte comando:

```bash
npm login
npm publish
```

É possível que o componente já exista com esse nome, caso isso aconteça mude o nome do seu componente no arquivo `package.json`. Lembre que é possível colocar um escopo, utilizando a seguinte nomenclatura:

```
@[ESCOPO]/[NOME_PROJETO]
```

## 9. Estrutura de Arquivos

Caso tenha dúvida sobre a estrutura de arquivos geradas após o tutorial, acesse esse [link](ESTRUTURA.md).
