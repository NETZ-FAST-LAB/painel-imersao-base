/* Painel de imersão: motor.
   Não precisa editar este arquivo para usar o painel. Todo o conteúdo vem de
   dados.js (window.PAINEL). Aqui ficam o estado, a navegação, as views e a
   exportação. */
(function () {
  "use strict";
  const P = window.PAINEL;
  if (!P) { document.body.innerHTML = "<p style='padding:40px;color:#fff'>dados.js não carregou.</p>"; return; }

  const CFG = P.config || {};
  const PARTICIPANTES = P.participantes || ["—"];
  const DECISOES = P.decisoes || [];
  const IDEIAS = (P.ideias && P.ideias.itens) || [];
  const KEY = CFG.chaveArmazenamento || "painel-imersao-v1";

  // Vocabulário fixo das interações. Mudar aqui muda para todo o painel.
  const STATUS_DEC = [
    { id: "aberta",    label: "Em aberto",   cor: "#6b7280" },
    { id: "andamento", label: "Discutindo",  cor: "var(--ambar)" },
    { id: "fechada",   label: "Fechada",     cor: "var(--acento)" },
    { id: "parking",   label: "Parking lot", cor: "var(--roxo)" },
  ];
  const TRIAGEM = [
    { id: "ressuscitar", label: "Ressuscitar", cor: "var(--acento)" },
    { id: "fundir",      label: "Fundir",      cor: "var(--azul)" },
    { id: "arquivar",    label: "Arquivar",    cor: "#6b7280" },
  ];
  const POT_COR = { alto: "var(--acento)", medio: "var(--ambar)", baixo: "#6b7280" };

  // Views disponíveis. Os grupos do menu (em dados.js) referenciam estes ids.
  const VIEWS = {
    fechamento: viewFechamento,
    cronograma: viewCronograma,
    decisoes:   viewDecisoes,
    parking:    viewParking,
    sintese:    viewSintese,
    ideias:     viewIdeias,
    pesquisas:  viewPesquisas,
    referencias:viewReferencias,
  };
  const GRUPOS = (P.grupos || []).map(g => ({ ...g, abas: g.abas.filter(a => VIEWS[a.id]) }))
                                 .filter(g => g.abas.length);
  const TODAS_ABAS = GRUPOS.flatMap(g => g.abas);

  // ============================== ESTADO ==============================
  function estadoPadrao() {
    const dec = {}, ideia = {};
    DECISOES.forEach(d => dec[d.id] = { status: "aberta", dono: "—", prazo: "", nota: "" });
    IDEIAS.forEach(i => ideia[i.id] = { triagem: "" });
    return { dec, ideia, expandido: {} };
  }
  // Mescla defensiva: se os dados ganharem ou perderem itens, o estado salvo não quebra.
  function mesclar(salvo) {
    const base = estadoPadrao();
    return {
      dec:       { ...base.dec,   ...((salvo && salvo.dec) || {}) },
      ideia:     { ...base.ideia, ...((salvo && salvo.ideia) || {}) },
      expandido: (salvo && salvo.expandido) || {},
    };
  }
  function carregar() {
    try { const raw = localStorage.getItem(KEY); if (raw) return mesclar(JSON.parse(raw)); } catch (e) {}
    return estadoPadrao();
  }
  function salvar() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); el("saveState").textContent = "salvo"; } catch (e) {}
    renderProgresso();
  }
  window.addEventListener("beforeunload", () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} });

  let state = carregar();
  let abaAtual = (TODAS_ABAS[0] || {}).id;
  let grupoAtual = (GRUPOS[0] || {}).id;

  // ============================== HELPERS ==============================
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function grupoDe(aba) { const g = GRUPOS.find(g => g.abas.some(a => a.id === aba)); return g ? g.id : (GRUPOS[0] || {}).id; }
  function lista(arr, fn) { return (arr || []).map(fn).join(""); }

  // ============================== CABEÇALHO ==============================
  function renderCabecalho() {
    document.title = CFG.nome || "Painel de imersão";
    el("kicker").innerHTML = esc(CFG.kicker || "Imersão") +
      (CFG.confidencial ? `<span class="selo" title="Documento interno. Não compartilhar fora da equipe.">🔒 INTERNO</span>` : "");
    // o último termo do nome ganha a cor de acento
    const partes = String(CFG.nome || "Imersão").split(" ");
    const ultimo = partes.pop();
    el("titulo").innerHTML = (partes.length ? esc(partes.join(" ")) + " " : "") + `<span>${esc(ultimo)}</span>`;
    el("subtitulo").textContent = CFG.subtitulo || "";
    el("rodape").textContent = CFG.rodape || "";
    if (CFG.corAcento) document.documentElement.style.setProperty("--acento", CFG.corAcento);
  }

  function renderProgresso() {
    const total = DECISOES.length;
    const fechadas = DECISOES.filter(d => state.dec[d.id] && state.dec[d.id].status === "fechada").length;
    el("progText").textContent = total ? `${fechadas} de ${total} decisões fechadas` : "sem decisões cadastradas";
    el("progFill").style.width = total ? Math.round(fechadas / total * 100) + "%" : "0";
  }

  // ============================== MENU ==============================
  function renderAbas() {
    const g = GRUPOS.find(x => x.id === grupoAtual) || GRUPOS[0];
    const grupos = lista(GRUPOS, x => `<button class="${x.id === grupoAtual ? "active" : ""}" data-grupo="${esc(x.id)}">${esc(x.label)}</button>`);
    const abas = lista(g.abas, a => `<button class="${a.id === abaAtual ? "active" : ""}" data-aba="${esc(a.id)}">${esc(a.label)}</button>`);
    el("tabs").innerHTML = `<div class="tab-groups">${grupos}</div><div class="tab-subs">${abas}</div>`;
  }
  function irParaAba(id) {
    if (!VIEWS[id] || !TODAS_ABAS.some(a => a.id === id)) return;
    abaAtual = id; grupoAtual = grupoDe(id);
    renderAbas(); renderMain();
    try { history.replaceState(null, "", location.pathname + "?aba=" + encodeURIComponent(id)); } catch (e) {}
  }
  function irParaGrupo(id) {
    const g = GRUPOS.find(x => x.id === id); if (!g) return;
    grupoAtual = id;
    if (!g.abas.some(a => a.id === abaAtual)) abaAtual = g.abas[0].id;
    renderAbas(); renderMain();
  }
  function renderMain() { el("main").innerHTML = (VIEWS[abaAtual] || (() => ""))(); }

  // ============================== VIEWS ==============================
  function intro(txt) { return txt ? `<p class="tab-intro">${esc(txt)}</p>` : ""; }

  function viewDecisoes() {
    if (!DECISOES.length) return `<p class="vazio">Nenhuma decisão cadastrada em dados.js.</p>`;
    return intro(P.decisoesIntro) + `<div class="grid">` + DECISOES.map((d, i) => {
      const s = state.dec[d.id];
      const aberto = state.expandido[d.id];
      const st = STATUS_DEC.find(x => x.id === (s.status || "aberta")) || STATUS_DEC[0];
      const destaque = cor => `border-color:${cor};color:${cor};background:color-mix(in srgb,${cor} 12%,transparent)`;
      return `<article id="${esc(d.id)}" class="card ${d.ancora ? "ancora" : ""}">
        <div class="card-top">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          ${d.ancora ? `<span class="ancora-tag">âncora</span>` : ""}
          <span class="status-dot" style="background:${st.cor}" title="${esc(st.label)}"></span>
        </div>
        <h3>${esc(d.titulo)}</h3>
        <p class="card-resumo">${esc(d.resumo)}</p>
        <div class="pergunta"><span class="pergunta-label">Fechamento</span>${esc(d.pergunta)}</div>
        ${aberto && d.aFechar ? `<ul class="checklist">${lista(d.aFechar, x => `<li><span class="mk">▸</span> ${esc(x)}</li>`)}</ul>` : ""}
        ${d.aFechar && d.aFechar.length ? `<button class="expand-btn" data-expandir="${esc(d.id)}">${aberto ? "menos" : "o que fechar"}</button>` : ""}
        <div class="controls">
          <div class="control-row"><label class="control-label">Status</label><div class="chip-row">
            ${lista(STATUS_DEC, x => `<button class="chip" style="${s.status === x.id ? destaque(x.cor) : ""}" data-dec="${esc(d.id)}" data-campo="status" data-valor="${x.id}">${x.label}</button>`)}
          </div></div>
          <div class="control-row"><label class="control-label">Dono</label><div class="chip-row">
            ${lista(PARTICIPANTES, p => `<button class="chip" style="${s.dono === p ? destaque("var(--acento)") : ""}" data-dec="${esc(d.id)}" data-campo="dono" data-valor="${esc(p)}">${esc(p)}</button>`)}
          </div></div>
          <div class="control-row"><label class="control-label">Prazo</label>
            <input class="txt" type="text" placeholder="ex: até 15/10" value="${esc(s.prazo)}" data-dec="${esc(d.id)}" data-campo="prazo">
          </div>
          <textarea rows="2" placeholder="Próximo passo concreto, ou o que ficou decidido" data-dec="${esc(d.id)}" data-campo="nota">${esc(s.nota)}</textarea>
        </div>
      </article>`;
    }).join("") + `</div>`;
  }

  function viewIdeias() {
    if (!IDEIAS.length) return `<p class="vazio">Nenhuma ideia cadastrada em dados.js.</p>`;
    return intro(P.ideias.intro) + `<div class="grid-ideias">` + IDEIAS.map(it => {
      const s = state.ideia[it.id];
      const tri = TRIAGEM.find(t => t.id === s.triagem);
      const pc = POT_COR[it.potencial] || "#6b7280";
      return `<article id="${esc(it.id)}" class="ideia-card" style="border-left-color:${tri ? tri.cor : "#2a2f3a"}">
        <div class="ideia-head">
          <h4 class="ideia-nome">${esc(it.nome)}</h4>
          ${it.potencial ? `<span class="pot-badge" style="color:${pc};border-color:${pc}">${esc(it.potencial)}</span>` : ""}
        </div>
        ${it.fonte ? `<div class="ideia-fonte">${esc(it.fonte)}</div>` : ""}
        <p class="ideia-desc">${esc(it.desc)}</p>
        <div class="chip-row">
          ${lista(TRIAGEM, t => `<button class="chip" style="${s.triagem === t.id ? `border-color:${t.cor};color:${t.cor}` : ""}" data-ideia="${esc(it.id)}" data-valor="${t.id}">${t.label}</button>`)}
        </div>
      </article>`;
    }).join("") + `</div>`;
  }

  function viewCronograma() {
    const C = P.cronograma || {};
    const tags = C.tags || {};
    let h = intro(C.intro);
    h += `<div class="crono-botoes"><button data-crono="1">Expandir tudo</button><button data-crono="0">Recolher tudo</button></div>`;
    h += `<div style="display:flex;flex-direction:column;gap:7px">`;
    let dia = "";
    (C.blocos || []).forEach((b, i) => {
      const t = tags[b.tag] || { cor: "var(--dim)", label: b.tag || "" };
      if (b.dia !== dia) { dia = b.dia; h += `<div class="crono-dia">${esc(b.dia)}</div>`; }
      h += `<details id="crono-${i}" class="crono-item" style="border-left:3px solid ${t.cor}">
        <summary>
          <span class="crono-chev">▸</span>
          <span class="crono-turno">${esc(b.turno)}</span>
          <span class="crono-bloco">${esc(b.bloco)}</span>
          ${t.label ? `<span class="crono-tag" style="color:${t.cor};border-color:${t.cor}">${esc(t.label)}</span>` : ""}
          ${b.status ? `<span class="crono-status">· ${esc(b.status)}</span>` : ""}
        </summary>
        <div class="crono-body">
          ${b.objetivo ? `<div class="crono-obj">${esc(b.objetivo)}</div>` : ""}
          ${b.pauta && b.pauta.length ? `<div class="crono-plabel">Pauta</div><ul class="crono-pauta">${lista(b.pauta, p => `<li>${esc(p)}</li>`)}</ul>` : ""}
          ${b.saida ? `<div class="crono-saida"><span>Sai daqui com</span>${esc(b.saida)}</div>` : ""}
          ${b.nota ? `<div class="crono-nota">${esc(b.nota)}</div>` : ""}
          ${b.links && b.links.length ? `<div style="margin-top:11px;display:flex;gap:8px;flex-wrap:wrap">${lista(b.links, l =>
            l.aba ? `<a class="link-aba" data-aba="${esc(l.aba)}">${esc(l.label)}</a>`
                  : `<a class="link-aba" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)}</div>` : ""}
        </div>
      </details>`;
    });
    h += `</div>`;
    if (C.fios && C.fios.length) {
      h += `<section class="fios"><div class="fios-titulo">${esc(C.fiosTitulo || "Os fios que a imersão precisa amarrar")}</div>
        <ol>${lista(C.fios, f => `<li>${esc(f)}</li>`)}</ol></section>`;
    }
    return h;
  }

  function viewParking() {
    const K = P.parking || {};
    return intro(K.intro) + `<div class="cartoes">` + lista(K.itens, p =>
      `<section class="cartao">
        <div class="cartao-titulo">${esc(p.titulo)}${p.status ? ` <span class="pilula" style="color:var(--ambar);border-color:var(--ambar)">${esc(p.status)}</span>` : ""}</div>
        <div class="cartao-texto">${esc(p.texto)}</div>
        <div class="cartao-rodape">
          ${p.categoria ? `<span class="pilula" style="color:var(--roxo);border-color:var(--roxo)">${esc(p.categoria)}</span>` : ""}
          ${p.origem ? `<span class="meta">citado em: ${esc(p.origem)}</span>` : ""}
        </div>
      </section>`) + `</div>`;
  }

  function viewFechamento() {
    const F = P.fechamento || {};
    const card = (titulo, cor, texto, extra) =>
      `<section class="cartao" style="border-left-color:${cor}">
        <div class="cartao-titulo">${esc(titulo)}${extra || ""}</div>
        <div class="cartao-texto">${esc(texto)}</div></section>`;
    let h = F.titulo ? `<h2 class="tese-titulo">${esc(F.titulo)}</h2>` : "";
    h += intro(F.intro);
    if (F.conquistas && F.conquistas.length) {
      h += `<div class="sec-label">O que saiu decidido</div><div class="cartoes">` +
        lista(F.conquistas, c => card(c.titulo, c.cor || "var(--acento)", c.texto,
          c.estado ? ` <span class="pilula" style="color:${c.cor || "var(--acento)"};border-color:${c.cor || "var(--acento)"}">${esc(c.estado)}</span>` : "")) + `</div>`;
    }
    if (F.falta && F.falta.length) {
      h += `<div class="sec-label">O que ficou em aberto</div><div class="cartoes">` +
        lista(F.falta, c => card(c.titulo, "var(--coral)", c.texto)) + `</div>`;
    }
    if (F.compromissos && F.compromissos.length) {
      h += `<div class="sec-label">Compromissos, por pessoa</div><div class="cartoes">` +
        lista(F.compromissos, c => card(c.pessoa, c.cor || "var(--azul)", c.texto)) + `</div>`;
    }
    if (F.proximos && F.proximos.length) {
      h += `<div class="sec-label">Próximos passos</div><section class="fios"><ol>${lista(F.proximos, x => `<li>${esc(x)}</li>`)}</ol></section>`;
    }
    return h;
  }

  function viewSintese() {
    const S = P.sintese || {};
    let h = S.titulo ? `<h2 class="tese-titulo">${esc(S.titulo)}</h2>` : "";
    h += lista(S.tese, p => `<p class="tese-p">${esc(p)}</p>`);
    if (S.padroes && S.padroes.length) {
      h += `<div class="sec-label">Padrões que se repetem</div><div class="cartoes">` +
        lista(S.padroes, p => `<section class="cartao" style="border-left-color:var(--ambar)"><div class="cartao-titulo">${esc(p.titulo)}</div><div class="cartao-texto">${esc(p.texto)}</div></section>`) + `</div>`;
    }
    if (S.alavancas && S.alavancas.length) {
      h += `<div class="sec-label">As decisões de maior alavancagem</div><div class="cartoes">` +
        lista(S.alavancas, p => `<section class="cartao" style="border-left-color:var(--acento)"><div class="cartao-titulo">${esc(p.titulo)}</div>
          <div class="cartao-texto">${esc(p.texto)}</div>
          ${p.pronto ? `<div class="crono-saida" style="margin-top:10px"><span>Pronto quando</span>${esc(p.pronto)}</div>` : ""}</section>`) + `</div>`;
    }
    if (S.sacrificio) {
      h += `<div class="sec-label">O que sacrificar</div><div class="sacrificio">
        ${S.sacrificio.parar ? `<section class="cartao" style="border-left-color:var(--coral)"><div class="cartao-titulo">Para de vez</div><ul>${lista(S.sacrificio.parar, x => `<li>${esc(x)}</li>`)}</ul></section>` : ""}
        ${S.sacrificio.hibernar ? `<section class="cartao" style="border-left-color:var(--roxo)"><div class="cartao-titulo">Hiberna com data</div><ul>${lista(S.sacrificio.hibernar, x => `<li>${esc(x)}</li>`)}</ul></section>` : ""}
      </div>`;
    }
    if (S.ordem) h += `<div class="sec-label">A ordem</div><div class="ordem">${esc(S.ordem)}</div>`;
    return h;
  }

  // Pesquisa externa: tese, dados com fonte, frameworks e a pergunta que ela
  // devolve para o grupo. Dado com url foi conferido na fonte; sem url, buscar
  // pelo nome antes de citar.
  function viewPesquisas() {
    const Q = P.pesquisas || {};
    if (!(Q.itens || []).length) return `<p class="vazio">Nenhuma pesquisa cadastrada em dados.js.</p>`;
    return intro(Q.intro) + `<div class="pesq-grid">` + lista(Q.itens, (q, i) =>
      `<article class="pesq-card" id="${esc(q.id || "p" + (i + 1))}">
        <div class="pesq-top">
          <span class="pesq-n">${String(i + 1).padStart(2, "0")}</span>
          ${q.destaque ? `<span class="pesq-destaque">${esc(q.destaque)}</span>` : ""}
        </div>
        <h3 class="pesq-titulo">${esc(q.titulo)}</h3>
        ${q.pergunta ? `<div class="pesq-sub">${esc(q.pergunta)}</div>` : ""}
        ${q.tese ? `<p class="pesq-tese">${esc(q.tese)}</p>` : ""}
        ${q.dados && q.dados.length ? `<ul class="pesq-dados">${lista(q.dados, d =>
          `<li><span class="pesq-fonte">${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.fonte)} ↗</a>` : esc(d.fonte)}</span>${esc(d.texto)}</li>`)}</ul>` : ""}
        ${q.frameworks ? `<div class="pesq-fw"><span class="pesq-label">Frameworks</span>${esc(q.frameworks)}</div>` : ""}
        ${q.paraImersao ? `<div class="pesq-imersao"><span class="pesq-label">Para a imersão</span>${esc(q.paraImersao)}</div>` : ""}
      </article>`) + `</div>`;
  }

  function viewReferencias() {
    const R = P.referencias || {};
    return intro(R.intro) + `<div class="cartoes">` + lista(R.itens, r =>
      `<section class="cartao" style="border-left-color:var(--azul)">
        <div class="cartao-titulo">${esc(r.titulo)}</div>
        ${r.texto ? `<div class="cartao-texto">${esc(r.texto)}</div>` : ""}
        <div class="cartao-rodape">
          ${r.tipo ? `<span class="pilula" style="color:var(--azul);border-color:var(--azul)">${esc(r.tipo)}</span>` : ""}
          ${r.url ? `<a class="ref-link" href="${esc(r.url)}" target="_blank" rel="noopener">abrir →</a>` : ""}
        </div>
      </section>`) + `</div>`;
  }

  // ============================== INTERAÇÕES ==============================
  // Um único ouvinte por evento, delegado. As views só emitem atributos data-*.
  document.addEventListener("click", ev => {
    const t = ev.target.closest("[data-grupo],[data-aba],[data-dec][data-valor],[data-ideia],[data-expandir],[data-crono],[data-acao],.dd>button");
    if (!t) { fecharMenus(); return; }
    if (t.matches(".dd>button")) { ev.stopPropagation(); t.parentElement.classList.toggle("open"); return; }
    fecharMenus();
    if (t.dataset.grupo) return irParaGrupo(t.dataset.grupo);
    if (t.dataset.aba) { ev.preventDefault(); return irParaAba(t.dataset.aba); }
    if (t.dataset.dec) { state.dec[t.dataset.dec][t.dataset.campo] = t.dataset.valor; salvar(); return renderMain(); }
    if (t.dataset.ideia) {
      const s = state.ideia[t.dataset.ideia];
      s.triagem = s.triagem === t.dataset.valor ? "" : t.dataset.valor;   // clicar de novo desmarca
      salvar(); return renderMain();
    }
    if (t.dataset.expandir) { state.expandido[t.dataset.expandir] = !state.expandido[t.dataset.expandir]; salvar(); return renderMain(); }
    if (t.dataset.crono) return document.querySelectorAll("#main details.crono-item").forEach(d => d.open = t.dataset.crono === "1");
    if (t.dataset.acao === "exportar-json") return exportarJSON();
    if (t.dataset.acao === "importar-json") return el("importFile").click();
    if (t.dataset.acao === "exportar-resumo") return exportarResumo();
    if (t.dataset.acao === "limpar") return limparTudo();
  });
  // Campos de texto salvam enquanto a pessoa digita, sem re-renderizar (não perde o cursor).
  document.addEventListener("input", ev => {
    const t = ev.target;
    if (t.dataset && t.dataset.dec && t.dataset.campo) { state.dec[t.dataset.dec][t.dataset.campo] = t.value; salvar(); }
  });
  function fecharMenus() { document.querySelectorAll(".dd.open").forEach(d => d.classList.remove("open")); }

  // ============================== DADOS: EXPORTAR / IMPORTAR ==============================
  function slug() { return String(CFG.nome || "imersao").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function carimbo() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`; }
  function baixar(blob, nome) { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = nome; a.click(); URL.revokeObjectURL(url); }

  function exportarJSON() {
    baixar(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }), `${slug()}_${carimbo()}.json`);
  }
  function importarJSON(ev) {
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { state = mesclar(JSON.parse(r.result)); salvar(); renderMain(); alert("Importado."); }
      catch (e) { alert("Arquivo inválido. Use um .json exportado por este painel."); }
    };
    r.readAsText(f); ev.target.value = "";
  }
  // Resumo em texto corrido, pronto para colar na ata.
  function exportarResumo() {
    const linha = "-".repeat(52);
    let out = `${String(CFG.nome || "Imersão").toUpperCase()}: RESUMO\n`;
    out += `Gerado em ${new Date().toLocaleString("pt-BR")}\n${"=".repeat(52)}\n\nDECISÕES\n${linha}\n`;
    DECISOES.forEach((d, i) => {
      const s = state.dec[d.id];
      const st = (STATUS_DEC.find(x => x.id === (s.status || "aberta")) || STATUS_DEC[0]).label;
      out += `\n${String(i + 1).padStart(2, "0")}. ${d.titulo}${d.ancora ? " [ÂNCORA]" : ""}\n`;
      out += `    Status: ${st}  |  Dono: ${s.dono || "—"}  |  Prazo: ${s.prazo || "—"}\n`;
      if (s.nota) out += `    Próximo passo: ${s.nota}\n`;
    });
    if (IDEIAS.length) {
      out += `\n\nIDEIAS: TRIAGEM\n${linha}\n`;
      const g = { ressuscitar: [], fundir: [], arquivar: [], "": [] };
      IDEIAS.forEach(it => (g[state.ideia[it.id].triagem] || g[""]).push(it.nome));
      out += `\nRESSUSCITAR: ${g.ressuscitar.join("; ") || "—"}\nFUNDIR: ${g.fundir.join("; ") || "—"}\n`;
      out += `ARQUIVAR: ${g.arquivar.join("; ") || "—"}\nSEM DECISÃO: ${g[""].join("; ") || "—"}\n`;
    }
    baixar(new Blob([out], { type: "text/plain" }), `${slug()}_resumo_${carimbo()}.txt`);
  }
  function limparTudo() {
    if (!confirm("Apagar tudo o que foi marcado neste navegador? Exporte antes se quiser guardar.")) return;
    state = estadoPadrao(); salvar(); renderMain();
  }

  // ============================== FUNDO ==============================
  function desenharFundo() {
    const n = [[8,15],[22,8],[15,40],[35,22],[48,12],[30,55],[55,38],[70,20],[62,60],[82,45],[90,25],[78,72],[42,78],[18,68],[95,62],[58,85],[12,88],[88,88]];
    const l = [[0,1],[0,2],[1,3],[3,4],[2,5],[3,6],[4,7],[6,8],[7,9],[9,10],[8,11],[5,12],[2,13],[9,14],[12,15],[13,16],[11,17],[6,5],[7,8]];
    const cor = getComputedStyle(document.documentElement).getPropertyValue("--acento").trim() || "#7fe0c0";
    el("bg").innerHTML =
      l.map(([a, b]) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}" stroke="${cor}" stroke-width="0.08" opacity="0.13"/>`).join("") +
      n.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.4" fill="${cor}" opacity="0.28"/>`).join("");
  }

  // ============================== GANCHO PARA ASSISTENTE ==============================
  // Um assistente de IA embutido pode levar a pessoa até um card chamando
  // window.ASSISTENTE_NAV.goto("d1"). Ids começando com "d" são decisões, com "i" ideias.
  window.ASSISTENTE_NAV = {
    abaDe(id) { id = String(id || ""); if (/^d/.test(id)) return "decisoes"; if (/^i/.test(id)) return "ideias"; return null; },
    goto(id) {
      const aba = this.abaDe(id);
      if (aba && abaAtual !== aba) irParaAba(aba);
      (function tentar(n) {
        const alvo = document.getElementById(id);
        if (alvo) { alvo.scrollIntoView({ behavior: "smooth", block: "center" }); alvo.classList.remove("flash"); void alvo.offsetWidth; alvo.classList.add("flash"); return; }
        if (n > 0) setTimeout(() => tentar(n - 1), 70);
      })(8);
      return true;
    },
  };

  // ============================== INÍCIO ==============================
  el("importFile").addEventListener("change", importarJSON);
  renderCabecalho(); desenharFundo(); renderAbas(); renderMain(); renderProgresso();
  // deep-link: ?aba=<id> abre a aba direto
  try { const a = new URLSearchParams(location.search).get("aba"); if (a) irParaAba(a); } catch (e) {}
})();
