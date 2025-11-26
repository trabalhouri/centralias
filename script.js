document.addEventListener('DOMContentLoaded', () => {
    
    const themeSwitch = document.getElementById('theme-switch');
    const searchBar = document.getElementById('search-bar');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    const btnInicio = document.getElementById('btn-inicio');
    const btnCatalogo = document.getElementById('btn-catalogo');
    const btnBiblioteca = document.getElementById('btn-biblioteca');
    const btnPrompt = document.getElementById('btn-prompt');
    const btnSobre = document.getElementById('btn-sobre');
    
    const paginaInicio = document.getElementById('pagina-inicio');
    const paginaCatalogo = document.getElementById('pagina-catalogo');
    const paginaBiblioteca = document.getElementById('pagina-biblioteca');
    const paginaPrompt = document.getElementById('pagina-prompt');
    const paginaSobre = document.getElementById('pagina-sobre');

    const allCategoryTitles = document.querySelectorAll('.categoria-titulo');
    const allCards = document.querySelectorAll('.ferramenta-card');
    const allCategories = document.querySelectorAll('.categoria');

    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc-full');
    const modalPricing = document.getElementById('modal-pricing');
    const modalFeatures = document.getElementById('modal-features');
    const modalVisitBtn = document.getElementById('modal-visit-btn');

    const btnRecommend = document.getElementById('btn-recommend');


    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    function resetNavigation() {
        const navs = [btnInicio, btnCatalogo, btnBiblioteca, btnPrompt, btnSobre];
        const pages = [paginaInicio, paginaCatalogo, paginaBiblioteca, paginaPrompt, paginaSobre];
        navs.forEach(btn => btn && btn.classList.remove('active'));
        pages.forEach(page => page && page.classList.add('hidden'));
    }

    function activatePage(btn, page) {
        if(btn && page) {
            resetNavigation();
            btn.classList.add('active');
            page.classList.remove('hidden');
        }
    }

    if(btnInicio) btnInicio.addEventListener('click', () => activatePage(btnInicio, paginaInicio));
    if(btnCatalogo) btnCatalogo.addEventListener('click', () => activatePage(btnCatalogo, paginaCatalogo));
    if(btnBiblioteca) btnBiblioteca.addEventListener('click', () => activatePage(btnBiblioteca, paginaBiblioteca));
    if(btnPrompt) btnPrompt.addEventListener('click', () => activatePage(btnPrompt, paginaPrompt));
    if(btnSobre) btnSobre.addEventListener('click', () => activatePage(btnSobre, paginaSobre));


    allCategoryTitles.forEach(title => {
        title.addEventListener('click', () => {
            title.parentElement.classList.toggle('active');
        });
    });

    let currentFilter = 'all'; 

    function filterCards() {
        const searchTerm = searchBar.value.toLowerCase();
        
        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const details = card.dataset.details ? card.dataset.details.toLowerCase() : '';
            const pricing = card.dataset.pricing ? card.dataset.pricing.toLowerCase() : '';
            
            const cardText = title + description + details;
            const matchesSearch = cardText.includes(searchTerm);
            
            let matchesFilter = (currentFilter === 'all') ? true : 
                                (currentFilter === 'grátis') ? (pricing.includes('grátis') || pricing.includes('open') || pricing.includes('free')) :
                                (currentFilter === 'freemium') ? pricing.includes('freemium') :
                                (pricing.includes('pago') || pricing.includes('incluso'));

            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        allCategories.forEach(category => {
            const visibleCards = category.querySelectorAll('.ferramenta-card:not(.hidden)').length;
            if (searchTerm.length === 0 && currentFilter === 'all') {
                category.classList.remove('hidden');
            } else if (visibleCards > 0) {
                category.classList.remove('hidden');
                category.classList.add('active');
            } else {
                category.classList.add('hidden');
            }
        });
    }

    if(searchBar) {
        searchBar.addEventListener('input', filterCards);
        searchBar.addEventListener('search', filterCards);
    }

    filterButtons.forEach(btn => {
        if (btn.id === 'btn-recommend') return;
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterCards();
        });
    });
    
    const searchBarLibrary = document.getElementById('search-library');
    const allPromptCards = document.querySelectorAll('.prompt-card');

    if(searchBarLibrary) {
        searchBarLibrary.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            allPromptCards.forEach(card => {
                if(card.innerText.toLowerCase().includes(term)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    const btnGenerate = document.getElementById('btn-generate-prompt');
    const resultTextarea = document.getElementById('prompt-result');
    const copyPromptBtn = document.querySelector('.copy-prompt-btn');
    const inPersona = document.getElementById('p-persona');
    const inTask = document.getElementById('p-task');
    const inTopic = document.getElementById('p-topic');
    const inContext = document.getElementById('p-context');
    const inAudience = document.getElementById('p-audience');
    const inTone = document.getElementById('p-tone');
    const inFormat = document.getElementById('p-format');

    if(btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            if (inTopic.value.trim() === '') {
                alert('Preencha o Tópico Principal.');
                inTopic.focus();
                return;
            }
            let promptParts = [];
            if (inPersona.value) promptParts.push(`Aja como ${inPersona.value}.`);
            if (inContext.value.trim()) promptParts.push(`CONTEXTO: ${inContext.value.trim()}`);
            let coreInstruction = `Sua tarefa é ${inTask.value} "${inTopic.value}"`;
            if (inAudience.value.trim()) coreInstruction += `, focado no público-alvo: ${inAudience.value.trim()}`;
            promptParts.push(coreInstruction + ".");
            if (inTone.value) promptParts.push(`Mantenha um tom ${inTone.value}.`);
            if (inFormat.value) promptParts.push(`ENTREGA: Formato de ${inFormat.value}.`);
            promptParts.push("Certifique-se de que a resposta seja completa e precisa.");

            resultTextarea.value = promptParts.join('\n\n');
            resultTextarea.style.borderColor = '#27ae60';
            setTimeout(() => { resultTextarea.style.borderColor = 'var(--h3-color)'; }, 500);
        });
    }

    if(copyPromptBtn) {
        copyPromptBtn.addEventListener('click', () => {
            if (!resultTextarea.value) return;
            navigator.clipboard.writeText(resultTextarea.value);
            const originalText = copyPromptBtn.innerText;
            copyPromptBtn.innerText = 'Copiado!';
            setTimeout(() => copyPromptBtn.innerText = originalText, 2000);
        });
    }

    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.closest('.prompt-card').querySelector('.prompt-content').innerText;
            navigator.clipboard.writeText(text);
            const originalText = btn.innerText;
            btn.innerText = '✅ Copiado!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    });

    function openModal(card) {
        const nome = card.getAttribute('data-nome');
        const details = card.getAttribute('data-details') || "Sem detalhes.";
        const pricing = card.getAttribute('data-pricing') || "Sob consulta";
        const features = card.getAttribute('data-features') || "Geral";
        
        const linkOriginal = card.querySelector('.btn-visitar').getAttribute('href');

        modalTitle.textContent = nome;
        modalDesc.textContent = details;
        modalPricing.textContent = pricing;
        modalFeatures.textContent = features;

        if(modalVisitBtn) {
            modalVisitBtn.href = linkOriginal;
        }

        modalOverlay.classList.remove('hidden');
    }

    const detailButtons = document.querySelectorAll('.btn-detalhes');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.ferramenta-card');
            openModal(card);
        });
    });

    if(closeModalBtn) closeModalBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
    if(modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.add('hidden'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modalOverlay.classList.add('hidden'); });

    if (btnRecommend) {
        btnRecommend.addEventListener('click', () => {
            if (allCards.length === 0) return alert("Nenhuma ferramenta encontrada.");
            
            const originalText = btnRecommend.innerHTML;
            btnRecommend.innerHTML = "🔄 Sorteando...";

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * allCards.length);
                const randomCard = allCards[randomIndex];
                
                openModal(randomCard);
                modalTitle.textContent = "✨ Sugestão: " + randomCard.getAttribute('data-nome');
                btnRecommend.innerHTML = originalText;
            }, 400); 
        });
    }

});