// Configuração do Aplicativo & Elementos DOM
const urlParams = new URLSearchParams(window.location.search);
const compressedCode = urlParams.get('c');
const isViewMode = compressedCode !== null;

let obtainedSprites = [];
let masteredSprites = [];

if (isViewMode) {
    document.body.classList.add('viewing-shared-collection');
    if (typeof baseSprites !== 'undefined') {
        const decoded = decompressCollection(baseSprites, compressedCode);
        obtainedSprites = decoded.obtained;
        masteredSprites = decoded.mastered;
    }
    document.getElementById('viewModeBanner').style.display = 'block';
} else {
    obtainedSprites = JSON.parse(localStorage.getItem('fn_obtained_sprites')) || [];
    masteredSprites = JSON.parse(localStorage.getItem('fn_mastered_sprites')) || [];
}

const spriteGrid = document.getElementById('spriteGrid');
const searchInput = document.getElementById('search');
const themeFilter = document.getElementById('theme-filter');
const unreleasedSwitch = document.getElementById('unreleased-switch');
const lowFidelitySwitch = document.getElementById('low-fidelity-switch');
const shareBtn = document.getElementById('shareBtn');
const imageBtn = document.getElementById('imageBtn');
const missingImageBtn = document.getElementById('missingImageBtn');
const unmasteredImageBtn = document.getElementById('unmasteredImageBtn');
const masteredImageBtn = document.getElementById('masteredImageBtn');

// Novos Switches
const hideMasteredSwitch = document.getElementById('hide-mastered-switch');
const groupThemeSwitch = document.getElementById('group-theme-switch');

const liveRatio = document.getElementById('live-counter-ratio');
const liveBarFill = document.getElementById('live-counter-bar');
const masteryRatio = document.getElementById('mastery-counter-ratio');
const masteryBarFill = document.getElementById('mastery-counter-bar');

// RESTAURAR ÚLTIMOS ESTADOS SALVOS DO LOCAL STORAGE
if (!isViewMode) {
    searchInput.value = localStorage.getItem('fn_state_search') || '';
    themeFilter.value = localStorage.getItem('fn_state_theme') || 'all';
    unreleasedSwitch.checked = localStorage.getItem('fn_state_unreleased') === 'true';
    lowFidelitySwitch.checked = localStorage.getItem('fn_state_low_fidelity') === 'true';
    hideMasteredSwitch.checked = localStorage.getItem('fn_state_hide_mastered') === 'true';
	if (localStorage.getItem('fn_state_group_theme') === null) {
		groupThemeSwitch.checked = true;
	} else {
		groupThemeSwitch.checked = localStorage.getItem('fn_state_group_theme') === 'true';
	}
    
    if (lowFidelitySwitch.checked) document.body.classList.add('low-fidelity');
}

let currentStatusFilter = localStorage.getItem('fn_state_status_filter') || 'all'; 

const toggleAll = document.getElementById('toggle-all');
const toggleOwned = document.getElementById('toggle-owned');
const toggleUnowned = document.getElementById('toggle-unowned');

function setStatusFilter(filterValue, activeButton) {
    if (isViewMode) return;
    currentStatusFilter = filterValue;
    localStorage.setItem('fn_state_status_filter', filterValue);
    [toggleAll, toggleOwned, toggleUnowned].forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
    renderGrid();
}

// Definir classe active no carregamento inicial
if (currentStatusFilter === 'all') toggleAll.classList.add('active');
else if (currentStatusFilter === 'obtained') toggleOwned.classList.add('active');
else if (currentStatusFilter === 'missing') toggleUnowned.classList.add('active');

// Ocultar Cartão do Criador para a Sessão
const creatorCard = document.querySelector('.creator-card');
const closeCreatorBtn = document.getElementById('closeCreatorBtn');

if (sessionStorage.getItem('hide_creator_card') === 'true' && creatorCard) {
    creatorCard.style.display = 'none';
}

if (closeCreatorBtn && creatorCard) {
    closeCreatorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        creatorCard.style.display = 'none';
        sessionStorage.setItem('hide_creator_card', 'true');
    });
}

toggleAll.addEventListener('click', () => setStatusFilter('all', toggleAll));
toggleOwned.addEventListener('click', () => setStatusFilter('obtained', toggleOwned));
toggleUnowned.addEventListener('click', () => setStatusFilter('missing', toggleUnowned));

// EVENT LISTENERS DE PERSISTÊNCIA
searchInput.addEventListener('input', () => {
    localStorage.setItem('fn_state_search', searchInput.value);
    renderGrid();
});
themeFilter.addEventListener('change', () => {
    localStorage.setItem('fn_state_theme', themeFilter.value);
    renderGrid();
});
unreleasedSwitch.addEventListener('change', () => {
    localStorage.setItem('fn_state_unreleased', unreleasedSwitch.checked);
    renderGrid();
});
hideMasteredSwitch.addEventListener('change', () => {
    localStorage.setItem('fn_state_hide_mastered', hideMasteredSwitch.checked);
    renderGrid();
});
groupThemeSwitch.addEventListener('change', () => {
    localStorage.setItem('fn_state_group_theme', groupThemeSwitch.checked);
    renderGrid();
});
lowFidelitySwitch.addEventListener('change', () => {
    localStorage.setItem('fn_state_low_fidelity', lowFidelitySwitch.checked);
    if (lowFidelitySwitch.checked) {
        document.body.classList.add('low-fidelity');
    } else {
        document.body.classList.remove('low-fidelity');
    }
});

function updateCollectionCounter() {
    if (typeof baseSprites === 'undefined') return;
    const totalReleased = baseSprites.filter(sprite => !sprite.unreleased).length;
    const collectedReleased = baseSprites.filter(sprite => !sprite.unreleased && obtainedSprites.includes(sprite.id)).length;
    const masteredReleased = baseSprites.filter(sprite => !sprite.unreleased && masteredSprites.includes(sprite.id)).length;
    
    liveRatio.textContent = `${collectedReleased} / ${totalReleased}`;
    const collectionPercentage = totalReleased > 0 ? (collectedReleased / totalReleased) * 100 : 0;
    liveBarFill.style.width = `${collectionPercentage}%`;

    masteryRatio.textContent = `${masteredReleased} / ${totalReleased}`;
    const masteryPercentage = totalReleased > 0 ? (masteredReleased / totalReleased) * 100 : 0;
    masteryBarFill.style.width = `${masteryPercentage}%`;
}

function adjustCardFontSizes() {
    document.querySelectorAll('.card-title-footer span').forEach(span => {
        const parent = span.parentElement;
        let currentSize = 16.95;
        span.style.fontSize = currentSize + 'px';
        
        while ((span.scrollWidth > parent.clientWidth) && currentSize > 6) {
            currentSize -= 0.5;
            span.style.fontSize = currentSize + 'px';
        }
    });
}

function buildCardHTML(sprite, isObtained, isMastered) {
    const itemRarity = sprite.rarity || 'Rare';
    const unreleasedBadge = sprite.unreleased ? `<div class="status-badge unreleased">NÃO LANÇADO</div>` : '';
    
    let badgeHTML = '';
    let renderedCrownHTML = '';
    
    if (isMastered) {
        badgeHTML = `<div class="status-badge mastered-badge">DOMINADO</div>`;
        renderedCrownHTML = `<div class="rendered-head-crown">👑</div>`; 
    } else if (isObtained) {
        badgeHTML = `<div class="status-badge collected">Coletado</div>`;
    }

    let crownHTML = '';
    if (isObtained && !isMastered) {
        crownHTML = `<div class="crown-action-icon" title="Dominar este elemento">👑</div>`;
    }

    const displayRarityText = itemRarity === 'Mythic' ? 'MÍTICO' : itemRarity.toUpperCase();
    const rarityBadge = `<div class="fortnite-rarity-tag">${displayRarityText}</div>`;
    const inferredImagePath = `sprites/${sprite.id}.png`;

    return `
        ${unreleasedBadge}
        ${badgeHTML}
        ${crownHTML}
        <div class="card-inner-display">
            ${renderedCrownHTML}
            <img src="${inferredImagePath}" class="sprite-img" alt="${sprite.name}" onerror="this.src='https://placehold.co/150?text=Arquivo+Ausente'">
            ${rarityBadge}
        </div>
        <div class="card-title-footer"><span>${sprite.name}</span></div>
    `;
}

function sortAndGroupSprites(itemsArray) {
    const themeOrder = ["Basic", "Gold", "Candy", "Galaxy", "Gem", "Holofoil", "Rift"];
    return [...itemsArray].sort((a, b) => {
        let themeA = a.sprite ? a.sprite.theme : a.theme;
        let themeB = b.sprite ? b.sprite.theme : b.theme;
        return themeOrder.indexOf(themeA) - themeOrder.indexOf(themeB);
    });
}

function renderGrid() {
    spriteGrid.innerHTML = '';
    if (typeof baseSprites === 'undefined') return;

    updateCollectionCounter();

    const searchQuery = searchInput.value.toLowerCase();
    const selectedTheme = themeFilter.value;
    const showUnreleased = unreleasedSwitch.checked;
    const hideMastered = hideMasteredSwitch.checked;
    const groupByThemeSetting = groupThemeSwitch.checked;

    let itemsToRender = [];
    
    // Lógica independente de renderização da grade mapeada
    baseSprites.forEach(sprite => {
        if (hideMastered && masteredSprites.includes(sprite.id)) return;
        const matchesSearch = sprite.name.toLowerCase().includes(searchQuery);
        const matchesTheme = selectedTheme === 'all' || sprite.theme === selectedTheme;
        if (matchesSearch && matchesTheme) {
            itemsToRender.push({ sprite: sprite, isBase: false, variants: [] });
        }
    });

    if (groupByThemeSetting) {
        itemsToRender = sortAndGroupSprites(itemsToRender);
    }

    itemsToRender.forEach(item => {
        const sprite = item.sprite;
        const isObtained = obtainedSprites.includes(sprite.id);
        const isMastered = masteredSprites.includes(sprite.id);
        
        if (isViewMode && (!isObtained || sprite.unreleased)) return;
        if (!isViewMode && !showUnreleased && sprite.unreleased) return;

        let matchesStatus = true;
        if (!isViewMode) {
            if (currentStatusFilter === 'obtained') matchesStatus = isObtained;
            if (currentStatusFilter === 'missing') matchesStatus = !isObtained;
        }
        if (!matchesStatus) return;

        const card = document.createElement('div');
        card.dataset.id = sprite.id;
        
        const itemRarity = sprite.rarity || 'Rare';
        const itemTheme = sprite.theme || 'Basic';
        let masteryClass = isMastered ? ' mastered' : '';
        card.className = `sprite-card rarity-${itemRarity} theme-${itemTheme} ${isObtained ? 'obtained' : ''}${masteryClass}`;
        card.innerHTML = buildCardHTML(sprite, isObtained, isMastered);

        if (!isViewMode && isObtained && !isMastered) {
            const crownIcon = card.querySelector('.crown-action-icon');
            if (crownIcon) {
                crownIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleMastery(sprite.id);
                });
            }
        }

        if (!isViewMode) {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                toggleObtained(sprite.id, card);
            });
        }
        spriteGrid.appendChild(card);
    });
    adjustCardFontSizes();
}

function toggleObtained(id, cardElement) {
    if (obtainedSprites.includes(id)) {
        obtainedSprites = obtainedSprites.filter(item => item !== id);
        masteredSprites = masteredSprites.filter(item => item !== id);
    } else {
        obtainedSprites.push(id);
    }
    localStorage.setItem('fn_obtained_sprites', JSON.stringify(obtainedSprites));
    localStorage.setItem('fn_mastered_sprites', JSON.stringify(masteredSprites));
    renderGrid();
}

function toggleMastery(id) {
    if (!obtainedSprites.includes(id)) return;
    if (!masteredSprites.includes(id)) {
        masteredSprites.push(id);
    } else {
        masteredSprites = masteredSprites.filter(item => item !== id);
    }
    localStorage.setItem('fn_mastered_sprites', JSON.stringify(masteredSprites));
    renderGrid();
}

shareBtn.addEventListener('click', () => {
    if (typeof baseSprites === 'undefined') return;
    const compressionCodeString = compressCollection(baseSprites, obtainedSprites, masteredSprites);
    const shareURL = `${window.location.origin}${window.location.pathname}?c=${compressionCodeString}`;
    navigator.clipboard.writeText(shareURL).then(() => { alert("Link de compartilhamento copiado!"); });
});

// ==========================================
// MOTOR DE EXPORTAÇÃO GRÁFICA ADAPTATIVA V3
// ==========================================
function exportCanvasImage(mode) {
    if (typeof baseSprites === 'undefined') return;
    
    let targetItems = [];
    let titleL1 = "RASTREADOR DE ELEMENTOS:";
    let titleL2 = "";
    let fallbackTitleText = "";
    let titleColor = "#39ff14"; 
    let fileName = "elementos-colecao";

    if (mode === 'collected') {
        targetItems = baseSprites.filter(s => obtainedSprites.includes(s.id));
        titleL2 = "MINHA COLEÇÃO";
        fallbackTitleText = "MINHA COLEÇÃO";
        if (targetItems.length === 0) { alert("Nenhum elemental coletado para exportação!"); return; }
    } else if (mode === 'missing') {
        targetItems = baseSprites.filter(s => !s.unreleased && !obtainedSprites.includes(s.id));
        titleL1 = "RASTREADOR DE ELEMENTOS:";
        titleL2 = "ESTOU PROCURANDO ESTES!";
        fallbackTitleText = "ELEMENTOS FALTANTES";
        titleColor = "#ff4757"; 
        fileName = "elementos-faltantes";
        if (targetItems.length === 0) { alert("Você não possui elementos faltantes!"); return; }
    } else if (mode === 'unmastered') {
        targetItems = baseSprites.filter(s => obtainedSprites.includes(s.id) && !masteredSprites.includes(s.id));
        titleL1 = "RASTREADOR DE ELEMENTOS:";
        titleL2 = "ELEMENTOS NÃO DOMINADOS";
        fallbackTitleText = "NÃO DOMINADOS";
        titleColor = "#00d2ff"; 
        fileName = "elementos-nao-dominados";
        if (targetItems.length === 0) { alert("Você não possui elementos não dominados!"); return; }
    } else if (mode === 'mastered') {
        targetItems = baseSprites.filter(s => obtainedSprites.includes(s.id) && masteredSprites.includes(s.id));
        titleL1 = "RASTREADOR DE ELEMENTOS:";
        titleL2 = "ELEMENTOS DOMINADOS";
        fallbackTitleText = "DOMINADOS";
        titleColor = "#ffd700"; 
        fileName = "elementos-dominados";
        if (targetItems.length === 0) { alert("Você não possui elementos dominados!"); return; }
    }

    if (groupThemeSwitch.checked) {
        targetItems = sortAndGroupSprites(targetItems);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const cardW = 160;
    const cardH = 200; 
    const padding = 15;
    const borderThickness = 8;
    const footerLinkHeight = 55; 
    
    const maxCols = 6;
    const cols = Math.min(maxCols, targetItems.length);
    const rows = Math.ceil(targetItems.length / cols);
    const innerWidth = cols * (cardW + padding) + padding;

    const renderBars = (mode === 'collected');
    const inlineBarsPossible = (cols >= 5);
    const ultraSmallStacked = (cols <= 2) && renderBars;
    
    let topBarHeight = 55; 
    if (renderBars) {
        if (ultraSmallStacked) topBarHeight = 135; 
        else if (!inlineBarsPossible) topBarHeight = 95; 
    }

    canvas.width = innerWidth + (borderThickness * 2);
    canvas.height = topBarHeight + (rows * (cardH + padding) + padding) + footerLinkHeight + (borderThickness * 2);
    
    const mascotImg = new Image();
    mascotImg.src = 'siteimages/staticsprite.png';
    
    mascotImg.onload = () => { processRenderChain(); };
    mascotImg.onerror = () => { processRenderChain(); };

    function processRenderChain() {
        ctx.fillStyle = titleColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0b0d13';
        ctx.fillRect(borderThickness, borderThickness, canvas.width - (borderThickness * 2), canvas.height - (borderThickness * 2));
        
        ctx.fillStyle = '#181c25';
        ctx.fillRect(borderThickness, borderThickness, canvas.width - (borderThickness * 2), topBarHeight);
        
        ctx.strokeStyle = titleColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(borderThickness, borderThickness + topBarHeight);
        ctx.lineTo(canvas.width - borderThickness, borderThickness + topBarHeight);
        ctx.stroke();

        let textLeftBoundary = borderThickness + padding;
        
        // Alinhamento vertical do logo (centralizado na top bar)
        if (mascotImg.complete && mascotImg.naturalWidth > 0) {
            let mascotY = borderThickness + (topBarHeight / 2) - 16;
            if (ultraSmallStacked) mascotY = borderThickness + 12; // Ajuste para tamanho muito pequeno
            ctx.drawImage(mascotImg, borderThickness + padding, mascotY, 32, 32);
            textLeftBoundary = borderThickness + padding + 42; // Atualiza a margem esquerda para o texto
        } else {
            textLeftBoundary = borderThickness + padding; // Margem padrão se o logo falhar
        }

        ctx.fillStyle = titleColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        let availableTextWidth = canvas.width - textLeftBoundary - borderThickness - padding;
        if (renderBars && inlineBarsPossible) availableTextWidth -= 260; // Desconta espaço das barras de progresso se renderizadas inline

        let fullCombinedText = `${titleL1} ${titleL2}`;
        if (mode === 'missing' && targetItems.length === 1) {
            fullCombinedText = "FALTANTE";
            fallbackTitleText = "FALTANTE";
        }

        let useFallback = false;
        ctx.font = 'italic 900 24px "Oswald", sans-serif';
        if (ctx.measureText(fullCombinedText).width > availableTextWidth) {
            if (ultraSmallStacked || inlineBarsPossible) {
                useFallback = true;
            }
        }

        if (ultraSmallStacked) {
            ctx.font = 'italic 900 20px "Oswald", sans-serif';
            ctx.fillText(fallbackTitleText, textLeftBoundary, borderThickness + 28);
        } else {
            let idealFontSize = 32; // Tamanho de fonte ideal
            let printText = useFallback ? fallbackTitleText : fullCombinedText;
            
            ctx.font = `italic 900 ${idealFontSize}px "Oswald", sans-serif`;
            // Reduz o tamanho da fonte até caber ou atingir o mínimo
            while (ctx.measureText(printText).width > availableTextWidth && idealFontSize > 12) {
                idealFontSize -= 1;
                ctx.font = `italic 900 ${idealFontSize}px "Oswald", sans-serif`;
            }
            
            let centerTextY = borderThickness + (topBarHeight / 2);
            if (renderBars && !inlineBarsPossible) {
                centerTextY = borderThickness + 30; // Ajuste de Y se as barras de progresso estiverem empilhadas abaixo do título
            }
            // Desenha o texto com alinhamento à esquerda começando após o logo
            ctx.fillText(printText, textLeftBoundary, centerTextY);
        }

        if (renderBars) {
            const totalReleased = baseSprites.filter(sprite => !sprite.unreleased).length;
            const colCount = baseSprites.filter(sprite => !sprite.unreleased && obtainedSprites.includes(sprite.id)).length;
            const masCount = baseSprites.filter(sprite => !sprite.unreleased && masteredSprites.includes(sprite.id)).length;

            let colPct = totalReleased > 0 ? (colCount / totalReleased) : 0;
            let masPct = totalReleased > 0 ? (masCount / totalReleased) : 0;

            if (inlineBarsPossible) {
                ctx.font = '900 12px "Oswald", sans-serif';
                let bWidth = 110;
                let rightEdge = canvas.width - borderThickness - padding;
                
                ctx.fillStyle = '#2ed573';
                ctx.fillText(`COLEÇÃO: ${colCount}/${totalReleased}`, rightEdge - (bWidth * 2) - 25, borderThickness + 16);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(rightEdge - (bWidth * 2) - 25, borderThickness + 31, bWidth, 12);
                ctx.strokeStyle = '#3b4253';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(rightEdge - (bWidth * 2) - 25, borderThickness + 31, bWidth, 12);
                ctx.fillStyle = '#2ed573';
                ctx.fillRect(rightEdge - (bWidth * 2) - 25, borderThickness + 32, (bWidth) * colPct, 10);

                ctx.fillStyle = '#ffd700';
                ctx.fillText(`DOMÍNIO: ${masCount}/${totalReleased}`, rightEdge - bWidth, borderThickness + 16);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(rightEdge - bWidth, borderThickness + 31, bWidth, 12);
                ctx.strokeRect(rightEdge - bWidth, borderThickness + 31, bWidth, 12);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(rightEdge - bWidth, borderThickness + 32, (bWidth) * masPct, 10);
            } else if (ultraSmallStacked) {
                ctx.font = '900 11px "Oswald", sans-serif';
                let fullBarW = canvas.width - (borderThickness * 2) - (padding * 2);
                
                let colY = borderThickness + 54;
                ctx.fillStyle = '#2ed573';
                ctx.fillText(`COLEÇÃO: ${colCount} / ${totalReleased}`, borderThickness + padding, colY);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(borderThickness + padding, colY + 10, fullBarW, 12);
                ctx.strokeStyle = '#3b4253';
                ctx.strokeRect(borderThickness + padding, colY + 10, fullBarW, 12);
                ctx.fillStyle = '#2ed573';
                ctx.fillRect(borderThickness + padding, colY + 11, fullBarW * colPct, 10);

                let masY = borderThickness + 94;
                ctx.fillStyle = '#ffd700';
                ctx.fillText(`DOMÍNIO: ${masCount} / ${totalReleased}`, borderThickness + padding, masY);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(borderThickness + padding, masY + 10, fullBarW, 12);
                ctx.strokeStyle = '#3b4253';
                ctx.strokeRect(borderThickness + padding, masY + 10, fullBarW, 12);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(borderThickness + padding, masY + 11, fullBarW * masPct, 10);
            } else {
                ctx.font = '900 12px "Oswald", sans-serif';
                let midY = borderThickness + 68;
                
                ctx.fillStyle = '#2ed573';
                ctx.fillText(`COLEÇÃO: ${colCount} / ${totalReleased}`, borderThickness + padding, midY);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(borderThickness + padding + 135, midY - 6, 85, 12);
                ctx.strokeStyle = '#3b4253';
                ctx.strokeRect(borderThickness + padding + 135, midY - 6, 85, 12);
                ctx.fillStyle = '#2ed573';
                ctx.fillRect(borderThickness + padding + 135, midY - 5, 85 * colPct, 10);

                ctx.fillStyle = '#ffd700';
                ctx.fillText(`DOMÍNIO: ${masCount} / ${totalReleased}`, borderThickness + padding + 240, midY);
                ctx.fillStyle = '#0e1117';
                ctx.fillRect(borderThickness + padding + 335, midY - 6, 85, 12);
                ctx.strokeRect(borderThickness + padding + 335, midY - 6, 85, 12);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(borderThickness + padding + 335, midY - 5, 85 * masPct, 10);
            }
        }
        
        let loadedCount = 0;
        targetItems.forEach((sprite, index) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = `sprites/${sprite.id}.png`;
            
            img.onload = () => {
                const r = index % cols;
                const c = Math.floor(index / cols);
                const x = borderThickness + padding + r * (cardW + padding);
                const y = borderThickness + topBarHeight + padding + c * (cardH + padding);
                
                const rarity = sprite.rarity || 'Rare';
                const theme = sprite.theme || 'Basic';
                const isMastered = masteredSprites.includes(sprite.id);
                const isLowFidelity = lowFidelitySwitch.checked;
                
                ctx.fillStyle = '#0f141d';
                ctx.fillRect(x, y, cardW, cardH);

                const innerH = cardH - 38; 
                
                if (isLowFidelity) {
                    if (rarity === 'Rare') ctx.fillStyle = '#005080';
                    else if (rarity === 'Epic') ctx.fillStyle = '#381055';
                    else if (rarity === 'Legendary') ctx.fillStyle = '#662200';
                    else if (rarity === 'Mythic') ctx.fillStyle = '#80601f';
                    else if (rarity === 'Special') {
                        if (theme === 'Basic') ctx.fillStyle = '#1f2f4d';
                        else if (theme === 'Gold') ctx.fillStyle = '#805d10';
                        else if (theme === 'Candy') ctx.fillStyle = '#801d4b';
                        else if (theme === 'Galaxy') ctx.fillStyle = '#2b1766';
                        else if (theme === 'Gem') ctx.fillStyle = '#166660';
                        else if (theme === 'Holofoil') ctx.fillStyle = '#28576b';
                        else if (theme === 'Rift') ctx.fillStyle = '#1b617a';
                    }
                    ctx.fillRect(x, y, cardW, innerH);
                } else {
                    let bgGrad = ctx.createLinearGradient(x, y, x, y + innerH);
                    if (rarity === 'Rare') { bgGrad.addColorStop(0, '#005080'); bgGrad.addColorStop(1, '#041022'); }
                    else if (rarity === 'Epic') { bgGrad.addColorStop(0, '#381055'); bgGrad.addColorStop(1, '#150320'); }
                    else if (rarity === 'Legendary') { bgGrad.addColorStop(0, '#662200'); bgGrad.addColorStop(1, '#200b00'); }
                    else if (rarity === 'Mythic') { bgGrad.addColorStop(0, '#80601f'); bgGrad.addColorStop(1, '#261b07'); }
                    else if (rarity === 'Special') {
                        if (theme === 'Basic') { bgGrad.addColorStop(0, '#1f2f4d'); bgGrad.addColorStop(1, '#070b12'); }
                        else if (theme === 'Gold') { bgGrad.addColorStop(0, '#805d10'); bgGrad.addColorStop(1, '#1a1300'); }
                        else if (theme === 'Candy') { bgGrad.addColorStop(0, '#801d4b'); bgGrad.addColorStop(1, '#1a040d'); }
                        else if (theme === 'Galaxy') { bgGrad.addColorStop(0, '#2b1766'); bgGrad.addColorStop(1, '#05020c'); }
                        else if (theme === 'Gem') { bgGrad.addColorStop(0, '#166660'); bgGrad.addColorStop(1, '#021211'); }
                        else if (theme === 'Holofoil') { bgGrad.addColorStop(0, '#28576b'); bgGrad.addColorStop(1, '#061117'); }
                        else if (theme === 'Rift') { bgGrad.addColorStop(0, '#1b617a'); bgGrad.addColorStop(1, '#031319'); }
                    }
                    ctx.fillStyle = bgGrad;
                    ctx.fillRect(x, y, cardW, innerH);

                    if (rarity === 'Special') {
                        let rainGrad = ctx.createLinearGradient(x, y, x + cardW, y + innerH);
                        rainGrad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
                        rainGrad.addColorStop(0.5, 'rgba(112, 161, 255, 0.35)');
                        rainGrad.addColorStop(1, 'rgba(57, 255, 20, 0.25)');
                        ctx.fillStyle = rainGrad;
                        ctx.fillRect(x, y, cardW, innerH);
                    }

                    let shineGrad = ctx.createLinearGradient(x, y, x, y + innerH);
                    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
                    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = shineGrad;
                    ctx.fillRect(x, y, cardW, innerH);
                }

                const maxImgDim = cardW * 0.82;
                let ratio = Math.min(maxImgDim / img.width, maxImgDim / img.height);
                let nw = img.width * ratio;
                let nh = img.height * ratio;
                ctx.drawImage(img, x + (cardW - nw) / 2, y + (innerH - nh) / 2, nw, nh);

                if (mode === 'collected' || mode === 'unmastered' || mode === 'mastered') {
                    if (isMastered) {
                        ctx.save();
                        ctx.fillStyle = '#ffd700';
                        ctx.font = '900 13px "Oswald", sans-serif'; 
                        ctx.shadowColor = 'rgba(0,0,0,0.8)';
                        ctx.shadowBlur = 3;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        ctx.fillText('DOMINADO', x + 6, y + 6);
                        ctx.restore();
                    } else {
                        ctx.save();
                        ctx.fillStyle = '#2ed573';
                        ctx.font = '900 13px "Oswald", sans-serif'; 
                        ctx.shadowColor = 'rgba(0,0,0,0.8)';
                        ctx.shadowBlur = 3;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        ctx.fillText('Coletado', x + 6, y + 6);
                        ctx.restore();
                    }
                }

                let tagColor = '#0082cc';
                let txtColor = '#ffffff';
                if (rarity === 'Epic') { tagColor = '#701dd9'; txtColor = '#ffffff'; }
                else if (rarity === 'Legendary') { tagColor = '#cc5200'; txtColor = '#ffffff'; }
                else if (rarity === 'Mythic') { tagColor = '#b38622'; txtColor = '#000000'; }
                else if (rarity === 'Special') { tagColor = '#00d2ff'; txtColor = '#ffffff'; }

                ctx.save();
                if (rarity === 'Special' && !isLowFidelity) {
                    let badgeGrad = ctx.createLinearGradient(x, y + innerH - 18, x + 75, y + innerH - 18);
                    badgeGrad.addColorStop(0, '#00d2ff'); badgeGrad.addColorStop(0.5, '#701dd9'); badgeGrad.addColorStop(1, '#39ff14');
                    ctx.fillStyle = badgeGrad;
                } else {
                    ctx.fillStyle = tagColor;
                }
                ctx.beginPath();
                ctx.moveTo(x, y + innerH - 18);
                ctx.lineTo(x + 70, y + innerH - 18);
                ctx.lineTo(x + 82, y + innerH);
                ctx.lineTo(x, y + innerH);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                ctx.fillStyle = txtColor;
                ctx.font = '900 13px "Oswald", sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle'; 
                ctx.fillText(rarity === 'Mythic' ? 'MÍTICO' : rarity.toUpperCase(), x + 6, y + innerH - 9);

                ctx.fillStyle = 'rgba(15, 20, 29, 0.9)';
                ctx.fillRect(x, y + innerH, cardW, 38);

                ctx.fillStyle = '#ffffff';
                let displayNameText = sprite.name.toUpperCase();
                
                let calculatedFontSize = 16.95; 
                ctx.font = `${calculatedFontSize}px "Oswald", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                while((ctx.measureText(displayNameText).width > (cardW - 8)) && calculatedFontSize > 6) {
                    calculatedFontSize -= 0.5;
                    ctx.font = `${calculatedFontSize}px "Oswald", sans-serif`;
                }
                ctx.fillText(displayNameText, x + (cardW / 2), y + innerH + 19);

                ctx.fillStyle = isMastered ? '#ffd700' : tagColor;
                ctx.fillRect(x, y + cardH - 4, cardW, 4);

                ctx.strokeStyle = isMastered ? '#ffd700' : '#1a2233';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, cardW, cardH);

                loadedCount++;
                if (loadedCount === targetItems.length) {
                    finalizeCanvas(canvas, footerLinkHeight, borderThickness, fileName);
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === targetItems.length) {
                    finalizeCanvas(canvas, footerLinkHeight, borderThickness, fileName);
                }
            };
        });
    }
}

function finalizeCanvas(canvas, footerLinkHeight, borderThickness, fileName) {
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0e1117';
    ctx.fillRect(borderThickness, canvas.height - footerLinkHeight - borderThickness, canvas.width - (borderThickness * 2), footerLinkHeight);
    
    ctx.fillStyle = '#ffffff';
    let cleanUrlString = "https://t.me/FortniteBrasil";
    let targetFontPix = 24;
    ctx.font = `bold ${targetFontPix}px "Oswald", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const maxWebWidth = canvas.width - (borderThickness * 2) - 30;
    while (ctx.measureText(cleanUrlString).width > maxWebWidth && targetFontPix > 8) {
        targetFontPix -= 1;
        ctx.font = `bold ${targetFontPix}px "Oswald", sans-serif`;
    }
    
    ctx.fillText(cleanUrlString, canvas.width / 2, canvas.height - borderThickness - (footerLinkHeight / 2));

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
}

imageBtn.addEventListener('click', () => exportCanvasImage('collected'));
missingImageBtn.addEventListener('click', () => exportCanvasImage('missing'));
unmasteredImageBtn.addEventListener('click', () => exportCanvasImage('unmastered'));
masteredImageBtn.addEventListener('click', () => exportCanvasImage('mastered'));

renderGrid();