/*
 * ESPERANÇA VIVA - SCRIPTS (ENTREGA IV - COMPLETA)
 *
 * Estrutura Modular:
 * 1. Módulo de Máscaras
 * 2. Módulo de Validação Avançada
 * 3. Módulo de Templating (Projetos)
 * 4. Módulo de Navegação (Menu Hambúrguer + SPA)
 * 5. Módulo de Acessibilidade (Modo Escuro) (NOVO)
 * 6. Inicializador
 */

// --- 1. MÓDULO DE MÁSCARAS ---
const Mascaras = {
    cpf(v) {
        v.value = v.value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    telefone(v) {
        v.value = v.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
    },
    cep(v) {
        v.value = v.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})$/, '$1-$2');
    }
};

// --- 2. MÓDULO DE VALIDAÇÃO AVANÇADA ---
const Validacao = {
    setErro(inputId, mensagem) {
        const input = document.getElementById(inputId);
        const erroEl = document.getElementById(`error-${inputId}`);
        if (!input || !erroEl) return; // Proteção
        
        if (mensagem) {
            erroEl.textContent = mensagem;
            erroEl.classList.add('ativo');
            input.classList.add('invalido');
        } else {
            erroEl.textContent = '';
            erroEl.classList.remove('ativo');
            input.classList.remove('invalido');
        }
    },
    validarNome(input) {
        if (!input.value.trim() || input.value.trim().indexOf(' ') === -1) {
            this.setErro(input.id, 'Por favor, insira seu nome completo (nome e sobrenome).');
            return false;
        }
        this.setErro(input.id, null);
        return true;
    },
    validarCPF(input) {
        if (!input.value.trim() || input.value.length !== 14) {
            this.setErro(input.id, 'CPF deve ter 11 dígitos.');
            return false;
        }
        this.setErro(input.id, null);
        return true;
    },
    validarEmail(input) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!input.value.trim() || !regex.test(input.value)) {
            this.setErro(input.id, 'Formato de e-mail inválido.');
            return false;
        }
        this.setErro(input.id, null);
        return true;
    },
    validarCampoGenerico(input) {
        if (!input.value.trim()) {
            this.setErro(input.id, 'Este campo é obrigatório.');
            return false;
        }
        this.setErro(input.id, null);
        return true;
    },
    initForm(container) {
        const form = container.querySelector('#form-cadastro');
        if (!form) return;

        const campos = {
            nome: (input) => this.validarNome(input),
            email: (input) => this.validarEmail(input),
            cpf: (input) => this.validarCPF(input),
            telefone: (input) => this.validarCampoGenerico(input),
            data: (input) => this.validarCampoGenerico(input),
            cep: (input) => this.validarCampoGenerico(input),
            endereco: (input) => this.validarCampoGenerico(input),
            cidade: (input) => this.validarCampoGenerico(input),
            estado: (input) => this.validarCampoGenerico(input),
        };

        for (const [id, func] of Object.entries(campos)) {
            const input = form.querySelector(`#${id}`);
            if(input) {
                input.addEventListener('blur', () => func(input));
            }
        }
        
        form.querySelector('#cpf')?.addEventListener('input', (e) => Mascaras.cpf(e.target));
        form.querySelector('#telefone')?.addEventListener('input', (e) => Mascaras.telefone(e.target));
        form.querySelector('#cep')?.addEventListener('input', (e) => Mascaras.cep(e.target));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const mensagem = container.querySelector('#mensagem');
            mensagem.innerHTML = '';
            mensagem.className = '';

            let formValido = true;
            for (const [id, func] of Object.entries(campos)) {
                const input = form.querySelector(`#${id}`);
                if (input && !func(input)) {
                    formValido = false;
                }
            }
            if (!form.querySelector('input[name="tipo"]:checked')) {
                formValido = false;
                // Poderia adicionar uma mensagem de erro para o radio button aqui
            }

            if (formValido) {
                mensagem.textContent = 'Cadastro enviado com sucesso (simulado). Obrigado!';
                mensagem.classList.add('alert', 'alert-sucesso');
                form.reset();
                for (const id of Object.keys(campos)) {
                    this.setErro(id, null);
                }
            } else {
                mensagem.textContent = 'Por favor, corrija os erros destacados no formulário.';
                mensagem.classList.add('alert', 'alert-erro');
            }
        });
    }
};

// --- 3. MÓDULO DE TEMPLATING (PROJETOS) ---
const Templating = {
    projetosData: [
        { id: 'proj-educar', img: 'imagens/projeto1.jpg', alt: 'Crianças estudando', titulo: 'Educar para o Futuro', desc: 'Projeto de reforço escolar para crianças em situação de vulnerabilidade.', tags: [{ texto: 'Educação', classe: 'badge-primario' }, { texto: 'Voluntariado', classe: '' }] },
        { id: 'proj-verde', img: 'imagens/voluntariado.jpg', alt: 'Plantio de árvores', titulo: 'Verde Vida', desc: 'Ações ambientais com práticas de reflorestamento e mutirões de limpeza.', tags: [{ texto: 'Meio Ambiente', classe: 'badge-secundario' }, { texto: 'Voluntariado', classe: '' }] },
        { id: 'proj-saude', img: 'imagens/equipe.jpg', alt: 'Equipe de saúde', titulo: 'Saúde Comunitária', desc: 'Atendimentos médicos e odontológicos básicos para a comunidade local.', tags: [{ texto: 'Saúde', classe: 'badge-primario' }, { texto: 'Doações', classe: '' }] }
    ],
    criarCard(projeto) {
        const tagsHtml = projeto.tags.map(tag => 
            `<span class="badge ${tag.classe}">${tag.texto}</span>`
        ).join(' ');
        return `
        <article class="col-md-6 col-lg-4 col-span-12" aria-labelledby="${projeto.id}">
            <div class="card">
                <img src="${projeto.img}" alt="${projeto.alt}" class="card-imagem" />
                <div class="card-corpo">
                    <h3 id="${projeto.id}">${projeto.titulo}</h3>
                    <p>${projeto.desc}</p>
                    ${tagsHtml}
                </div>
                <div class="card-rodape">
                    <a class="nav-link btn" href="cadastro.html">Quero Ajudar</a>
                </div>
            </div>
        </article>
        `;
    },
    initProjetos(container) {
        const containerProjetos = container.querySelector('#projetos-container');
        if (!containerProjetos) return; 

        let htmlProjetos = '';
        for (const projeto of this.projetosData) {
            htmlProjetos += this.criarCard(projeto);
        }
        containerProjetos.innerHTML = htmlProjetos;
    }
};

// --- 4. MÓDULO DE NAVEGAÇÃO (Menu Hambúrguer + SPA) ---
const Navegacao = {
    initMenuHamburger() {
        const btnHamburger = document.querySelector('.btn-hamburger');
        const navMobile = document.getElementById('nav-mobile');

        if (btnHamburger && navMobile) {
            btnHamburger.addEventListener('click', () => {
                const estaAtivo = navMobile.classList.toggle('ativo');
                btnHamburger.setAttribute('aria-expanded', estaAtivo);
                btnHamburger.setAttribute('aria-label', estaAtivo ? 'Fechar menu' : 'Abrir menu');
            });
        }
    },
    atualizarLinksAtivos(caminho) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.href.endsWith(caminho)) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    },
    async carregarPagina(url) {
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Falha ao carregar página');
            
            const textoHtml = await resposta.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(textoHtml, 'text/html');
            const novoConteudo = doc.getElementById('main-content').innerHTML;
            const novoTitulo = doc.querySelector('title').textContent;

            document.getElementById('main-content').innerHTML = novoConteudo;
            document.title = novoTitulo;

            this.atualizarLinksAtivos(url.substring(url.lastIndexOf('/') + 1) || 'index.html');
            
            document.getElementById('nav-mobile')?.classList.remove('ativo');
            document.querySelector('.btn-hamburger')?.setAttribute('aria-expanded', 'false');

            // Re-inicializa os scripts da página
            App.initPagina(document.getElementById('main-content'));

        } catch (erro) {
            console.error('Erro na SPA:', erro);
            window.location.href = url; // Fallback para refresh normal
        }
    },
    initSPA() {
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a.nav-link');
            if (link && !link.href.includes('#')) { // Ignora links de âncora
                e.preventDefault(); 
                if (link.href === window.location.href) return; 
                history.pushState(null, '', link.href);
                this.carregarPagina(link.href);
            }
        });
        window.addEventListener('popstate', () => {
            this.carregarPagina(window.location.href);
        });
    }
};

// --- 5. MÓDULO DE ACESSIBILIDADE (MODO ESCURO) (NOVO) ---
const Acessibilidade = {
    initModoEscuro() {
        const btn = document.getElementById('theme-toggle');
        const body = document.body;
        
        if (!btn) return; // Se não achar o botão, não faz nada

        // Verifica a preferência salva no localStorage
        const pref = localStorage.getItem('theme');
        if (pref === 'dark') {
            body.setAttribute('data-theme', 'dark');
            btn.innerHTML = '☀️'; // Sol
            btn.setAttribute('aria-label', 'Ativar modo claro');
        }

        // Adiciona o listener de clique
        btn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                // Mudar para Claro
                body.removeAttribute('data-theme');
                localStorage.removeItem('theme');
                btn.innerHTML = '🌙'; // Lua
                btn.setAttribute('aria-label', 'Ativar modo escuro');
            } else {
                // Mudar para Escuro
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                btn.innerHTML = '☀️'; // Sol
                btn.setAttribute('aria-label', 'Ativar modo claro');
            }
        });
    }
};

// --- 6. INICIALIZADOR ---
const App = {
    // Inicializa scripts da página ATUAL
    initPagina(container) {
        Templating.initProjetos(container);
        Validacao.initForm(container);
    },
    // Inicializa scripts GLOBAIS (só rodam 1 vez)
    initGlobal() {
        Navegacao.initMenuHamburger();
        Navegacao.initSPA();
        Acessibilidade.initModoEscuro(); // <-- ADICIONADO
    }
};

// --- Ponto de Entrada ---
document.addEventListener('DOMContentLoaded', () => {
    App.initGlobal(); // Inicia scripts globais (Menu, SPA, Modo Escuro)
    App.initPagina(document); // Inicia scripts da página inicial
});
