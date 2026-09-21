# Painel de imersão

Um painel para conduzir uma imersão de planejamento: um encontro de alguns dias em que um grupo precisa sair **com decisões**, não só com conversa.

Funciona abrindo o `index.html` no navegador. Não tem servidor, não tem banco, não tem dependência. O que cada pessoa marca fica salvo no próprio navegador, e o grupo consolida exportando e importando um arquivo.

---

## A lógica por trás

O painel existe para resolver um problema específico: **imersões que produzem muita conversa e pouca decisão.** Cada parte dele foi desenhada contra esse risco.

**1. Toda decisão tem uma pergunta de fechamento.**
Uma decisão não é um tema ("vamos falar de prioridades"). É uma pergunta que, respondida, encerra o assunto ("qual frente sai da imersão como prioridade, com dono e meta?"). Se a pergunta ainda não tem resposta, a decisão não está fechada, por mais que o grupo tenha conversado.

**2. Fechar significa ter dono, prazo e próximo passo.**
Cada decisão carrega quatro campos: status, dono, prazo e o próximo passo concreto. A barra de progresso no topo conta só as fechadas. Ela é o placar da imersão.

**3. Uma decisão é a âncora.**
Uma das decisões destrava as outras. Ela fica marcada e deve ser a primeira da pauta.

**4. Ideias paradas precisam de destino, não de lembrança.**
Toda organização acumula iniciativas que perderam força. A aba de ideias obriga a decidir de propósito o que fazer com cada uma: **ressuscitar, fundir com outra, ou arquivar**. "Perdeu força" é hipótese, não veredicto. E arquivar também é decisão, porque libera atenção.

**5. O que é citado e não decidido vai para o parking lot.**
Em toda imersão aparecem assuntos bons na hora errada. O parking lot existe para que eles não morram na conversa sem tomar tempo da pauta. Não é lista de tarefas: é memória.

**6. Cada bloco da agenda diz com o que o grupo sai dele.**
No cronograma, todo bloco tem um objetivo e um campo "sai daqui com". Bloco sem saída definida vira bloco de conversa.

**7. A síntese vem antes.**
Antes da imersão, alguém lê os materiais juntos e escreve o que eles dizem em conjunto e nenhum diz sozinho: a tese, os padrões que se repetem, as decisões de maior alavancagem, o que sacrificar. Isso aterrissa o grupo no mesmo diagnóstico.

**8. Referência é teto, não piso.**
Material de apoio tem lugar, mas a imersão deve ser quase toda saída. Um painel cheio de referências e sem decisões é o sintoma que ele existe para evitar.

**O teste de sucesso:** sair com poucas linhas, cada uma com dono e data. Sair com muitas ideias e nenhuma linha é o sinal de que não funcionou.

---

## Como usar

### 1. Preparar

Edite **apenas o `dados.js`**. Ele já vem com um exemplo completo, comentado. Troque o conteúdo e mantenha a estrutura.

| Bloco em `dados.js` | O que vai nele |
|---|---|
| `config` | Nome da imersão, textos do cabeçalho e rodapé, chave de armazenamento, cor |
| `participantes` | Quem pode ser dono de uma decisão |
| `grupos` | O menu: quais abas aparecem, em que ordem e com que nome |
| `decisoes` | As decisões a fechar, cada uma com a pergunta de fechamento |
| `cronograma` | A agenda, bloco a bloco |
| `ideias` | As iniciativas paradas, para triagem |
| `parking` | Assuntos citados e não endereçados |
| `fechamento` | O retrato do fim: o que saiu, o que ficou aberto, compromissos por pessoa |
| `sintese` | A leitura cruzada feita antes da imersão |
| `referencias` | Material de apoio |

Duas regras que evitam dor de cabeça:

- **Troque `chaveArmazenamento` a cada imersão.** Ela separa o que foi marcado numa imersão do que foi marcado em outra, no mesmo navegador.
- **Não renomeie ids depois que a imersão começou.** O que foi marcado fica atrelado ao id. Adicionar itens novos é sempre seguro.

### 2. Abrir

Duplo clique no `index.html`. Para publicar num endereço, veja abaixo.

Cada aba tem link direto: `index.html?aba=decisoes` abre direto nas decisões. Útil para mandar no chat durante o encontro.

### 3. Durante a imersão

O painel é projetado na tela e alguém marca conforme o grupo decide. Os dados ficam no navegador de quem está marcando.

### 4. Consolidar e registrar

No menu **Dados**:

- **Exportar (.json)** salva tudo o que foi marcado. Sirva para guardar ou para passar o estado para outra pessoa.
- **Importar (.json)** carrega um arquivo exportado.
- **Exportar resumo (.txt)** gera um texto corrido com as decisões (status, dono, prazo, próximo passo) e a triagem das ideias. É a base da ata.

**Limpar tudo**, no rodapé, zera o que foi marcado neste navegador. Pede confirmação.

---

## Aplicar a sua marca

A identidade visual inteira sai dos tokens no topo de `estilo.css`. Para trocar a cor principal, mude `--acento`, ou use `config.corAcento` em `dados.js` sem mexer no CSS. O fundo em rede, a barra de progresso e as abas ativas acompanham.

A fonte vem do Google Fonts (Inter e DM Mono). Para usar outra, troque o link no `index.html` e as variáveis `--sans` e `--mono`.

---

## Publicar

Como são arquivos estáticos, qualquer hospedagem estática serve. O caminho mais curto, se o repositório estiver no GitHub:

**Settings → Pages → Branch `main` → pasta `/ (root)` → Save.**

O endereço aparece em seguida. O painel já traz `noindex`, então não aparece em buscador, mas **quem tiver o link consegue abrir**. Se o conteúdo for sensível, publique com senha ou mantenha local.

---

## Ligar um assistente de IA

O painel expõe um gancho para um assistente embutido levar a pessoa até um card:

```js
window.ASSISTENTE_NAV.goto("d1");   // abre a aba de decisões e destaca a decisão d1
window.ASSISTENTE_NAV.goto("i3");   // abre a aba de ideias e destaca a ideia i3
```

Ids que começam com `d` são decisões; com `i`, ideias.

---

## Estrutura

```
index.html   a casca da página
estilo.css   o visual, com os tokens de marca no topo
motor.js     estado, navegação, abas, exportação. Não precisa editar
dados.js     todo o conteúdo. É o único arquivo a editar
```
