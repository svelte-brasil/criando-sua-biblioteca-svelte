# Criando sua biblioteca Svelte

## Primeiro vamos criar a pasta e inicializar um projeto através do yarn

Nosso primeiro passo é iniciar um projeto através do yarn e criar algumas pastas, você pode mudar o nome da pasta para o de sua biblioteca.

```bash
mkdir svelte-error-screen
cd svelte-error-screen
mkdir src
mkdir public
yarn init
```

Dentro da pasta `src` crie também outras duas pastas.

```bash
cd src
mkdir dev
mkdir lib
cd ../
```

## Agora vamos instalar o svelte

O objetivo aqui é desenvolver biblioteca para Svelte, então vamos instalar sua base de bibliotecas.

```
yarn add svelte
```

## Já podemos iniciar nosso componente que se tornará uma biblioteca

Nessa fase iremos de fato criar a nossa biblioteca svelte.

### Crie o arquivo `src/lib/index.svelte` e coloque o seguinte código

```html
<script>
  export let error;
  export let description;
</script>

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

<div>
  <h2>{error}</h2>
  <h4>{description}</h4>
</div>
```

## Vamos agora montar a área que iremos visualizar o nosso componente funcionando

É muito importante podermos testar a nossa biblioteca e visualizar o resultado do nosso componente, vamos a seguir trabalhar nessa etapa.

Vamos criar a base em svelte para testar nosso componente e configurar a pasta public onde um projeto svelte é construído.

### Crie os arquivos base para iniciar uma aplicação svelte

Primeiro vamos criar o nosso arquivo `main.js`:

```js
import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "world"
  }
});

export default app;
```

Agora vamos criar nosso arquivo svelte, onde iremos visualizar nosso componente da biblioteca.

```html
<script>
  import SvelteErrorScreen from "../lib/index.svelte";
</script>

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

<main>
  <SvelteErrorScreen
    error="{500}"
    description="Ocorreu um problema no servidor"
  />
</main>
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

## Está na hora de criarmos as configurações

Se tudo deu certo até aqui, agora vamos colocar as configurações iniciais. O [Rollup](https://rollupjs.org/) é gerador de bundle padrão do svelte, vamos usar ele tanto para iniciar uma aplicação com nossa biblioteca e criar um bundle dela, como também será utilizado para fazer a trasnpilação de nossa bibliteca.

### Instalando as bibliotecas Rollup

Nessa etapa iremos instalar as dependências do rollup que servirão para iniciar uma aplicação e construir a biblioteca.

```
yarn add -D rollup rollup-plugin-commonjs rollup-plugin-livereload rollup-plugin-node-resolve rollup-plugin-svelte rollup-plugin-terser sirv-cli
```

### Agora vamos inserir a configuração do rollup

Primeiro crie o arquivo `rollup.config.js`, esse é o arquivo de configuração do rollup.

Agora vamos colocar a seguinte configuração, você pode reparar que existem múltipas configurações, que irão servir para iniciar a aplicação, construir a aplicação e também construir a biblioteca. Veja abaixo a configuração:

```js
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/dev/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js"
    },
    plugins: [
      svelte({
        dev: !production,
        css: css => {
          css.write("public/build/bundle.css");
        }
      }),
      resolve({
        browser: true,
        dedupe: importee =>
          importee === "svelte" || importee.startsWith("svelte/")
      }),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: "src/lib/index.svelte",
    output: { file: pkg.main, format: "umd", name: "ErrorScreen" },
    plugins: [svelte(), resolve(), commonjs()]
  },
  {
    input: "src/lib/index.svelte",
    output: { file: pkg.module, format: "es" },
    external: ["svelte/internal"],
    plugins: [svelte(), commonjs()]
  }
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    }
  };
}
```

A segunda configuração possui o nome da biblioteca no atributo `output`, pode ficar a vontade para mudar esse nome.

## Já estamos chegando ao fim, vamos agora criar nossos scripts e ajustar o package.json

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

## Agora sim, vamos ver o componente da nossa biblioteca

Rode o comando abaixo na raiz do projeto.

```bash
yarn dev
```

Acesse `http://localhost:5000/` e verá seu componente.

[comment]: <> (Colocar exemplo de uma aplicação)

## Vamos agora testar a transpilação

Rode o comando abaixo na raiz do projeto.

```bash
yarn build
```

No diretório `dist` que está na raiz do seu projeto, você verá seu componente transpilado.

## Hora de publicar

Você já deve ta muito feliz por ver seu componente funcionando e querendo usar em seu projeto. Então vamos agora publicar esse componente, e essa é a etapa mais simples. Rode o seguinte comando:

```bash
npm login
npm publish
```

É possível que o componente já exista com esse nome, caso isso aconteça mude o nome do seu componente no arquivo `package.json`. Lembre que é possível colocar um escopo, utilizando a seguinte nomenclatura:

```
@[ESCOPO]/[NOME_PROJETO]
```

## Estrutura de Arquivos

Caso tenha dúvida sobre a estrutura de arquivos geradas após o tutorial, acesse esse [link](ESTRUTURA.md).
