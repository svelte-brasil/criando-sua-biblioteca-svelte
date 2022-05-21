# Migrando sua biblioteca Svelte para Svelte com typescript

O svelte agora tem um suporte documentado para typescript e se você não quer ficar de fora, criamos um fluxo de migração para sua biblioteca Svelte com typescript.

Caso você tenha seguido o tutorial para javascirpt, a migração será muito simples. Porém também sera possível entender o que é preciso migrar caso você tenha sua própria organização.

## 1. Vamos instalar as dependências necessárias

Para utilizar svelte com typescript é necessário instalar algumas novas dependências que para a transpilação do typescript e geração de suas declarações. Rode o comando abaixo e instale estas novas dependências.

```sh
yarn add -D @rollup/plugin-typescript svelte-preprocess tslib svelte-dts @tsconfig/svelte svelte-transpile-typescript typescript
```

## 2. Agora precisamos fazer ajustes na configuração do rollup

Toda a base de configuração para construção do nosso projeto é através do rollup, e ele também é fundamental para utilizarmos o typescript com svelte.

Vamos então fazer as seguintes alterações nas nossas configurações do rollup.

```js
// ...
import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";
import svelteDts from "svelte-dts";

// ...

export default [
  {
    // ...
    plugins: [
      svelte({
        dev: !production,
        css: (css) => css.write("bundle.css"),
        preprocess: autoPreprocess(),
      }),
      // ...
      typescript({ sourceMap: !production }),
      // ...
    ],
  },
  {
    // ...
    plugins: [
      svelte({ emitCss: false, preprocess: autoPreprocess() }),
      typescript({ sourceMap: !production }),
      // ...
    ],
  },
  {
    // ...
    plugins: [
      svelteDts({ output: pkg.types }),
      svelte({ emitCss: false, preprocess: autoPreprocess() }),
      typescript({ sourceMap: !production }),
      // ...
    ],
  },
];
```

Neste código só consta as alterações necessárias baseadas na configuração do rollup para uma biblioteca svelte com javascript. Caso seu projeto não siga a configuração do outro tutorial, sugerimos que você faça um comparativo entre as configurações e veja o que é necessário para seu projeto.

## 3. Ajustes no `package.json`

Basicamente será necessário fazer 2 ajustes no package.json para realizar a transpilação do typescript de um componente svelte e informar o nosso arquivo com declarações typescript.

### Transpilação do typescript no svelte

Ao utilizar bibliotecas externas com svelte, o mesmo procura pelo atributo `svelte` do `package.json` para realizar contruções mais precisas. No outro tutorial nós fazemos essa configuração colocando a referência para o nosso componente Svelte puro.

Porém, caso nosso componente seja escrito em typescript, as aplicações iriam ser obrigadas a utilizar typescript, pois as mesmas não teriam as configurações necessárias para transpilar o componente puro.

Para que nosso componente escrito em typescript tenha suporte para javascript, vamos precisar transpilar o componente utilizando a biblioteca [svelte-transpile-typescript](https://github.com/andrelmlins/svelte-transpile-typescript). Faça as seguintes alterações no `package.json`:

```json
{
  // ...
  "svelte": "dist/FacebookLogin.svelte",
  // ...
  "scripts": {
    // ...
    "build": "rollup -c && svelte-transpile-typescript -i src/lib/ErrorScreen.svelte -o dist/ErrorScreen.svelte"
  }
  // ...
}
```

Remova também o `src/lib/ErrorScreen.svelte` do atributo `files`.

```json
{
  // ...
  "files": ["dist", "README.md"]
  // ...
}
```

### Declarações do typescript

Porém ao fazer somente esse procedimento acima você está perdendo todo o poder dado pelo typescript, e projetos typescript não poderão usufluir das vantagens. Para que isso não aconteça vamos gerar as declarações de typescript da nossa biblioteca.

Já foi instalado o pacote `svelte-dts` e configurado no rollup para gerar as declarações da biblioteca svelte, este pacote vai cuidar de todo esse contexto. A única configuração necessária que iremos fazer é modificar o `package.json` inserindo o atributo `types`. Veja abaixo.

```json
{
  // ...
  "types": "dist/index.d.ts"
  // ...
}
```

## 4. Vamos agora modificar nosso componente para typescript

Na nossa biblioteca de exemplo vamos só precisar alterar o conteúdo da tag `script`, identificando que seu conteúdo é typescript e colocando os tipos nas propriedades.

```svelte
<!-- ... -->

<script lang="ts">
  export let error: number | undefined;
  export let description: string | undefined;
</script>

<!-- ... -->
```

## 5. Agora é só ajustar a área de testes

Essa é a parte mais simples, precisamos renomear o arquivo `doc/main.js` para `doc/main.ts`. Use o seguinte comando:

```bash
mv ./doc/main.js ./doc/main.ts
```

E se sentir interesse, pode editar o exemplo de `doc/App.svelte` para typescript.

## 6. E por último vamos testar

Execute o comando abaixo na raiz do projeto.

```bash
yarn dev
```

Acesse `http://localhost:5000/` e verá seu componente. Após isso, execute o comando abaixo na raiz do projeto.

```bash
yarn build
```

No diretório `dist` que está na raiz do seu projeto, você verá seu componente transpilado.

## 7. Agora é só publicar

Publique está nova versão da biblioteca e teste em outros projetos, caso tenha dúvida de como publicar acesse o tutorial inicial.
