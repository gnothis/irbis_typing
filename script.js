const screens = {
menu: document.getElementById('main-menu'),
game: document.getElementById('game-screen'),
result: document.getElementById('result-screen'),
intro: document.getElementById('intro-screen')
};
const btnStart = document.getElementById('btn-start');
const btnLangContainer = document.getElementById('btn-lang-container');
const btnLevelContainer = document.getElementById('btn-level-container');
const valLang = document.getElementById('val-lang');
const valLevel = document.getElementById('val-level');
const backBtn = document.getElementById('back-btn');
const keyboardArea = document.getElementById('keyboard-area');
const mistakeCountEl = document.getElementById('mistake-count');
const maxErrorsEl = document.getElementById('max-errors');
const charsDoneEl = document.getElementById('chars-done');
const charsTotalEl = document.getElementById('chars-total');
const cpmDisplay = document.getElementById('cpm-display');
const levelBadge = document.getElementById('level-badge');
const playerEl = document.getElementById('player');
const enemyEl = document.getElementById('enemy');
const sceneEl = document.getElementById('scene');
const backgroundEl = document.getElementById('background');
const vignetteEl = document.getElementById('vignette');
const introTitle = document.getElementById('intro-title');
const introDesc = document.getElementById('intro-desc');
const introLetters = document.getElementById('intro-letters');
const introKeyboardArea = document.getElementById('intro-keyboard-area');
let introActive = false;
const resultTitle = document.getElementById('result-title');
const resultMistakes = document.getElementById('result-mistakes');
const resultCpm = document.getElementById('result-cpm');
const resultStars = document.getElementById('result-stars');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const CHARS_PER_LEVEL = 60;
const MAX_ERROR_PERCENT = 10;
const MAX_ERRORS = Math.floor(CHARS_PER_LEVEL * MAX_ERROR_PERCENT / 100);
const AGE_PRESETS = [
{ label: '6–7 лет',   enemySpeed: 0.05, errorPct: 15, seqLen: 30 },
{ label: '7–8 лет',   enemySpeed: 0.10, errorPct: 12, seqLen: 40 },
{ label: '9–10 лет',  enemySpeed: 0.20, errorPct: 10, seqLen: 50 },
{ label: '11–12 лет', enemySpeed: 0.35, errorPct: 10, seqLen: 60 },
{ label: '13–14 лет', enemySpeed: 0.50, errorPct: 8,  seqLen: 70 },
{ label: '15+ лет',   enemySpeed: 0.70, errorPct: 6,  seqLen: 80 },
];
let currentAgeIdx = 1;
function getPreset() {
return AGE_PRESETS[currentAgeIdx];
}
const GAME_MODES = [
{ id: 'letters', label: 'Буквы' },
{ id: 'words',   label: 'Слова' },
{ id: 'texts',   label: 'Маленький принц' }
];
let currentModeIdx = 0;
let currentMode = 'letters';
let currentLang = 'ru';
let currentLevelId = 1;
let levelPassCount = 0;
let sequence = "";
let currentIndex = 0;
let mistakes = 0;
let isPlaying = false;
let gameLoop = null;
const BASE_PLAYER_X = 220;
const MAX_PLAYER_X = 255;
const MIN_ENEMY_X = 15;
const START_ENEMY_X = 20;
const CATCH_DISTANCE = 75;
let playerX = BASE_PLAYER_X;
let enemyX = START_ENEMY_X;
let startTime = null;
let correctChars = 0;
let cpmInterval = null;
function getSavedTheme() {
try {
const saved = localStorage.getItem('irbis_theme');
if (saved === 'dark' || saved === 'light') return saved;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
return 'light';
}
} catch (e) {}
return 'dark';
}
let currentTheme = getSavedTheme();
function applyTheme(theme) {
currentTheme = (theme === 'light') ? 'light' : 'dark';
try {
localStorage.setItem('irbis_theme', currentTheme);
} catch (e) {}
document.body.classList.remove('theme-dark', 'theme-light');
document.body.classList.add('theme-' + currentTheme);
const metaTheme = document.querySelector('meta[name="theme-color"]');
if (metaTheme) {
metaTheme.setAttribute('content', currentTheme === 'light' ? '#eaf1fb' : '#0a1128');
}
const valTheme = document.getElementById('val-theme');
if (valTheme) {
valTheme.textContent = currentTheme === 'light' ? 'Светлая ☀️' : 'Тёмная 🌙';
}
const gameThemeBtn = document.getElementById('game-theme-btn');
if (gameThemeBtn) {
gameThemeBtn.textContent = currentTheme === 'light' ? '☀️' : '🌙';
gameThemeBtn.title = currentTheme === 'light' ? 'Тема: Светлая (кликните для тёмной)' : 'Тема: Тёмная (кликните для светлой)';
}
}
function toggleTheme() {
applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}
const KB_SIZES = [
{ id: 'large', label: 'Большая 🔍', short: 'L' },
{ id: 'xl', label: 'Огромная 🔎', short: 'XL' },
{ id: 'normal', label: 'Компактная 📱', short: 'M' }
];
function getSavedKbSize() {
try {
const saved = localStorage.getItem('irbis_kb_size');
if (KB_SIZES.some(s => s.id === saved)) return saved;
} catch (e) {}
return 'large';
}
let currentKbSize = getSavedKbSize();
function applyKbSize(sizeId) {
if (!KB_SIZES.some(s => s.id === sizeId)) sizeId = 'large';
currentKbSize = sizeId;
try {
localStorage.setItem('irbis_kb_size', currentKbSize);
} catch (e) {}
document.body.classList.remove('kb-size-normal', 'kb-size-large', 'kb-size-xl');
document.body.classList.add('kb-size-' + currentKbSize);
const sizeObj = KB_SIZES.find(s => s.id === currentKbSize) || KB_SIZES[0];
const valKbSize = document.getElementById('val-kb-size');
if (valKbSize) {
valKbSize.textContent = sizeObj.label;
}
const gameKbBtn = document.getElementById('game-kb-size-btn');
if (gameKbBtn) {
gameKbBtn.textContent = `⌨️ ${sizeObj.short}`;
gameKbBtn.title = `Размер клавиатуры: ${sizeObj.label} (кликните для смены)`;
}
}
function cycleKbSize() {
const idx = KB_SIZES.findIndex(s => s.id === currentKbSize);
const nextIdx = (idx + 1) % KB_SIZES.length;
applyKbSize(KB_SIZES[nextIdx].id);
}
function init() {
applyTheme(currentTheme);
applyKbSize(currentKbSize);
btnStart.addEventListener('click', () => {
if (currentMode === 'letters') {
showIntroScreen();
} else {
startGame();
}
});
const btnModeContainer = document.getElementById('btn-mode-container');
const valMode = document.getElementById('val-mode');
const btnLevelContainer = document.getElementById('btn-level-container');
btnModeContainer.addEventListener('click', () => {
currentModeIdx = (currentModeIdx + 1) % GAME_MODES.length;
currentMode = GAME_MODES[currentModeIdx].id;
valMode.textContent = GAME_MODES[currentModeIdx].label;
levelPassCount = 0;
if (currentMode === 'letters') {
btnLevelContainer.style.display = '';
} else {
btnLevelContainer.style.display = 'none';
}
});
btnLangContainer.addEventListener('click', () => {
currentLang = currentLang === 'ru' ? 'en' : 'ru';
valLang.textContent = currentLang === 'ru' ? 'Русская' : 'English';
currentLevelId = 1;
levelPassCount = 0;
valLevel.textContent = currentLevelId;
});
const btnAgeContainer = document.getElementById('btn-age-container');
const valAge = document.getElementById('val-age');
btnAgeContainer.addEventListener('click', () => {
currentAgeIdx = (currentAgeIdx + 1) % AGE_PRESETS.length;
valAge.textContent = AGE_PRESETS[currentAgeIdx].label;
});
const btnOsContainer = document.getElementById('btn-os-container');
const valOs = document.getElementById('val-os');
const updateOsDisplay = () => {
if (valOs) valOs.textContent = currentOS === 'mac' ? 'macOS 🍎' : 'Windows 🪟';
};
updateOsDisplay();
if (btnOsContainer) {
btnOsContainer.addEventListener('click', () => {
setOS(currentOS === 'mac' ? 'windows' : 'mac');
updateOsDisplay();
});
}
const btnThemeContainer = document.getElementById('btn-theme-container');
const gameThemeBtn = document.getElementById('game-theme-btn');
if (btnThemeContainer) btnThemeContainer.addEventListener('click', toggleTheme);
if (gameThemeBtn) gameThemeBtn.addEventListener('click', toggleTheme);
const btnKbSizeContainer = document.getElementById('btn-kb-size-container');
const gameKbSizeBtn = document.getElementById('game-kb-size-btn');
if (btnKbSizeContainer) btnKbSizeContainer.addEventListener('click', cycleKbSize);
if (gameKbSizeBtn) gameKbSizeBtn.addEventListener('click', cycleKbSize);
const levelGridScreen = document.getElementById('level-grid-screen');
const levelGrid = document.getElementById('level-grid');
const closeGridBtn = document.getElementById('close-grid-btn');
btnLevelContainer.addEventListener('click', () => {
showScreen('menu');
levelGridScreen.classList.remove('hidden');
renderLevelGrid();
});
closeGridBtn.addEventListener('click', () => {
levelGridScreen.classList.add('hidden');
});
function renderLevelGrid() {
levelGrid.innerHTML = '';
const seq = CHAR_SEQUENCES[currentLang];
const totalLevels = Math.max(1, seq.length - 1);
for (let i = 1; i <= totalLevels; i++) {
const cell = document.createElement('div');
cell.className = 'grid-cell';
if (i === currentLevelId) cell.classList.add('active');
if (i === 1) {
cell.textContent = seq.slice(0, 2).join('');
} else {
const char = seq[i];
cell.textContent = char === ' ' ? '␣' : char;
}
cell.addEventListener('click', () => {
currentLevelId = i;
levelPassCount = 0;
valLevel.textContent = currentLevelId;
levelGridScreen.classList.add('hidden');
});
levelGrid.appendChild(cell);
}
}
backBtn.addEventListener('click', showMenu);
nextLevelBtn.addEventListener('click', () => {
if (currentMode === 'letters') {
const totalLevels = CHAR_SEQUENCES[currentLang].length;
if (currentLevelId <= totalLevels) {
showIntroScreen();
} else {
showMenu();
}
} else if (currentMode === 'texts') {
currentLevelId++;
startGame();
} else {
startGame();
}
});
restartBtn.addEventListener('click', () => startGame());
menuBtn.addEventListener('click', showMenu);
const btnReference = document.getElementById('btn-reference');
const refScreen = document.getElementById('reference-screen');
const closeRefBtn = document.getElementById('close-ref-btn');
const refContent = document.getElementById('ref-content');
btnReference.addEventListener('click', () => {
refScreen.classList.remove('hidden');
renderReference();
});
closeRefBtn.addEventListener('click', () => {
refScreen.classList.add('hidden');
});
document.addEventListener('keydown', handleKeydown);
}
const FINGER_HOMES = {
'finger-lp': 'KeyA',
'finger-lr': 'KeyS',
'finger-lm': 'KeyD',
'finger-li': 'KeyF',
'finger-ri': 'KeyJ',
'finger-rm': 'KeyK',
'finger-rr': 'KeyL',
'finger-rp': 'Semicolon',
'finger-th': 'Space'
};
function getFingerClassForCode(code, lang) {
const layout = KEYBOARDS[lang];
for (const row of layout) {
for (const k of row) {
if (k.code === code) {
const classes = (k.class || '').split(' ');
for (const c of classes) {
if (c.startsWith('finger-')) return c;
}
}
}
}
return null;
}
let introKeyListener = null;
function renderReference() {
const refContent = document.getElementById('ref-content');
const lang = currentLang;
const isMac = currentOS === 'mac';
const kb = (text) => `<span class="key-badge">${text}</span>`;
let html = '';
html += `<div class="ref-section">
<h4>⌨️ Служебные клавиши (${isMac ? 'Apple Mac 🍎' : 'Windows ПК 🪟'})</h4>
<table class="ref-table">
<tr><td>${kb(isMac ? 'Shift ⇧' : 'Shift')}</td><td>Зажми + буква = ЗАГЛАВНАЯ буква. Зажми + цифра = спецсимвол</td></tr>
<tr><td>${kb(isMac ? 'Caps Lock ⇪' : 'Caps Lock')}</td><td>Включает/выключает режим заглавных букв</td></tr>
<tr><td>${kb(isMac ? 'Tab ⇥' : 'Tab')}</td><td>Отступ (табуляция) — сдвигает текст вправо</td></tr>
<tr><td>${kb(isMac ? 'Return ⏎' : 'Enter')}</td><td>Перенос строки / подтверждение действия</td></tr>
<tr><td>${kb(isMac ? 'Delete ⌫' : 'Backspace')}</td><td>Удалить символ слева от курсора</td></tr>
<tr><td>${kb('Пробел')}</td><td>Вставить пробел — нажимай большим пальцем</td></tr>
${isMac ? `
<tr><td>${kb('Command ⌘')}</td><td>Главная командная клавиша Mac для действий (сохранить, скопировать)</td></tr>
<tr><td>${kb('Option ⌥')}</td><td>Клавиша альтернативных символов (Alt на Mac)</td></tr>
<tr><td>${kb('Control ⌃')}</td><td>Служебная клавиша Control на Mac</td></tr>
` : `
<tr><td>${kb('Ctrl')}</td><td>Главная управляющая клавиша для комбинаций</td></tr>
<tr><td>${kb('Alt')}</td><td>Альтернативная клавиша для комбинаций</td></tr>
<tr><td>${kb('Win ⊞')}</td><td>Клавиша меню Пуск</td></tr>
`}
</table>
</div>`;
html += `<div class="ref-section">
<h4>🔢 Shift + цифры (${lang === 'ru' ? (isMac ? 'русская Mac' : 'русская ПК') : 'английская'} раскладка)</h4>
<table class="ref-table">`;
let shiftNums;
if (lang === 'ru') {
if (isMac) {
shiftNums = [
['1','!'],['2','"'],['3','№'],['4',';'],['5','%'],
['6',', (запятая)'],['7','. (точка)'],['8',';'],['9','('],['0',')']
];
} else {
shiftNums = [
['1','!'],['2','"'],['3','№'],['4',';'],['5','%'],
['6',':'],['7','?'],['8','*'],['9','('],['0',')']
];
}
} else {
shiftNums = [
['1','!'],['2','@'],['3','#'],['4','$'],['5','%'],
['6','^'],['7','&'],['8','*'],['9','('],['0',')']
];
}
for (const [num, sym] of shiftNums) {
html += `<tr><td>${kb('Shift')} + ${kb(num)}</td><td style="font-size:1.2rem; font-weight:bold; color:#d35400;">${sym}</td></tr>`;
}
html += `</table></div>`;
html += `<div class="ref-section">
<h4>✏️ Знаки препинания и Shift</h4>
<table class="ref-table">`;
let shiftOther;
if (lang === 'ru') {
if (isMac) {
shiftOther = [
['Shift + 6', ', (запятая на Mac)'],
['Shift + 7', '. (точка на Mac)'],
['Shift + /', '? (вопросительный знак)'],
['Shift + -', '_ (подчёркивание)'],
['Shift + =', '+ (плюс)']
];
} else {
shiftOther = [
['/ (без Shift)', '. (точка на ПК)'],
['Shift + /', ', (запятая на ПК)'],
['Shift + 7', '? (вопросительный знак)'],
['Shift + -', '_ (подчёркивание)'],
['Shift + =', '+ (плюс)']
];
}
} else {
shiftOther = [
['Shift + -', '_'],
['Shift + =', '+'],
['Shift + `', '~'],
['Shift + [', '{'],
['Shift + ]', '}'],
['Shift + \\', '|'],
['Shift + ;', ':'],
['Shift + \'', '"'],
['Shift + ,', '<'],
['Shift + .', '>'],
['Shift + /', '?']
];
}
for (const [combo, result] of shiftOther) {
html += `<tr><td>${kb(combo)}</td><td style="font-size:1.2rem; font-weight:bold; color:#d35400;">${result}</td></tr>`;
}
html += `</table></div>`;
const cmdKey = isMac ? '⌘ Cmd' : 'Ctrl';
html += `<div class="ref-section">
<h4>🚀 Полезные комбинации (${isMac ? 'macOS' : 'Windows'})</h4>
<table class="ref-table">
<tr><td>${kb(cmdKey)} + ${kb('C')}</td><td>Копировать выделенное</td></tr>
<tr><td>${kb(cmdKey)} + ${kb('V')}</td><td>Вставить</td></tr>
<tr><td>${kb(cmdKey)} + ${kb('X')}</td><td>Вырезать</td></tr>
<tr><td>${kb(cmdKey)} + ${kb('Z')}</td><td>Отменить действие</td></tr>
<tr><td>${kb(cmdKey)} + ${kb('A')}</td><td>Выделить всё</td></tr>
<tr><td>${kb(cmdKey)} + ${kb('S')}</td><td>Сохранить</td></tr>
<tr><td>${kb(isMac ? '⌘ Cmd' : 'Alt')} + ${kb('Tab')}</td><td>Переключить окно</td></tr>
<tr><td>${kb(isMac ? 'Ctrl / 🌐' : 'Alt + Shift')}</td><td>Переключить язык ввода</td></tr>
</table>
</div>`;
refContent.innerHTML = html;
}
function showScreen(screenName) {
Object.values(screens).forEach(s => s.classList.add('hidden'));
document.getElementById('level-grid-screen')?.classList.add('hidden');
document.getElementById('reference-screen')?.classList.add('hidden');
screens[screenName].classList.remove('hidden');
}
function showMenu() {
isPlaying = false;
introActive = false;
stopGameLoop();
stopCpmTimer();
showScreen('menu');
}
function getElementOffsetRelativeTo(el, parent) {
let left = 0;
let top = 0;
let curr = el;
while (curr && curr !== parent) {
left += curr.offsetLeft;
top += curr.offsetTop;
curr = curr.offsetParent;
}
return {
left,
top,
width: el.offsetWidth,
height: el.offsetHeight
};
}
function showIntroScreen() {
if (document.activeElement) document.activeElement.blur();
if (introKeyListener) {
document.removeEventListener('keydown', introKeyListener);
introKeyListener = null;
}
introActive = true;
isPlaying = false;
stopGameLoop();
stopCpmTimer();
showScreen('intro');
renderKeyboard(currentLang, introKeyboardArea);
const levelData = getLevelData(currentLang, currentLevelId);
let newChars = [];
const practicePrompt = document.getElementById('practice-prompt');
const startHint = document.getElementById('start-hint-text');
const homeKeyCodes = ['KeyA','KeyS','KeyD','KeyF','KeyJ','KeyK','KeyL','Semicolon'];
if (currentLevelId === 1) {
introTitle.textContent = "🖐️ Поставьте руки на клавиатуру";
introDesc.textContent = currentLang === 'ru'
? "Указательные пальцы на А и О (с пупырышками)"
: "Index fingers on F and J (with bumps)";
newChars = levelData.newChars;
homeKeyCodes.concat(['Space']).forEach(code => {
const keyEl = introKeyboardArea.querySelector(`[data-code="${code}"]`);
if (keyEl) keyEl.classList.add('orange-block');
});
practicePrompt.style.display = 'none';
startHint.style.display = '';
screens.intro.onclick = () => { if (introActive) startGame(); };
} else {
introTitle.textContent = "✨ Новые буквы";
introDesc.textContent = "Посмотрите, какими пальцами нажимать";
newChars = levelData.newChars;
const newChar = newChars[newChars.length - 1];
const targetCode = findCodeForChar(newChar, currentLang);
const isHomeRow = targetCode && homeKeyCodes.includes(targetCode);
if (!isHomeRow && targetCode) {
const fingerClass = getFingerClassForCode(targetCode, currentLang);
const homeCode = fingerClass ? FINGER_HOMES[fingerClass] : null;
if (homeCode && homeCode !== targetCode) {
const homeKeyEl = introKeyboardArea.querySelector(`[data-code="${homeCode}"]`);
const targetKeyEl = introKeyboardArea.querySelector(`[data-code="${targetCode}"]`);
if (homeKeyEl) homeKeyEl.classList.add('home-glow');
if (targetKeyEl) targetKeyEl.classList.add('target-glow');
introKeyboardArea.querySelectorAll('.finger-slider').forEach(el => el.remove());
const startFingerSlider = () => {
if (!introActive || !homeKeyEl || !targetKeyEl) return;
introKeyboardArea.querySelectorAll('.finger-slider').forEach(el => el.remove());
introKeyboardArea.style.position = 'relative';
const homePos = getElementOffsetRelativeTo(homeKeyEl, introKeyboardArea);
const targetPos = getElementOffsetRelativeTo(targetKeyEl, introKeyboardArea);
const fingerColors = {
'finger-lp': 'var(--finger-left-pinky)',
'finger-lr': 'var(--finger-left-ring)',
'finger-lm': 'var(--finger-left-middle)',
'finger-li': 'var(--finger-left-index)',
'finger-ri': 'var(--finger-right-index)',
'finger-rm': 'var(--finger-right-middle)',
'finger-rr': 'var(--finger-right-ring)',
'finger-rp': 'var(--finger-right-pinky)',
'finger-th': 'var(--finger-thumb)'
};
const rectColor = fingerColors[fingerClass] || '#e67e22';
const sliderW = homePos.width + 6;
const sliderH = homePos.height + 6;
const sX = Math.round(homePos.left + (homePos.width - sliderW) / 2);
const sY = Math.round(homePos.top + (homePos.height - sliderH) / 2);
const eX = Math.round(targetPos.left + (targetPos.width - sliderW) / 2);
const eY = Math.round(targetPos.top + (targetPos.height - sliderH) / 2);
const slider = document.createElement('div');
slider.className = 'finger-slider';
slider.style.cssText = `
position: absolute;
top: 0;
left: 0;
width: ${sliderW}px;
height: ${sliderH}px;
transform: translate(${sX}px, ${sY}px);
background: ${rectColor};
opacity: 0.55;
border: 3px solid #fff;
border-radius: 8px;
z-index: 50;
pointer-events: none;
box-shadow: 0 0 20px rgba(255,255,255,0.4);
`;
introKeyboardArea.appendChild(slider);
slider.animate([
{ transform: `translate(${sX}px, ${sY}px) scale(1)`, opacity: 0.55 },
{ transform: `translate(${sX}px, ${sY}px) scale(0.92)`, opacity: 0.75, offset: 0.1 },
{ transform: `translate(${eX}px, ${eY}px) scale(1)`, opacity: 0.55, offset: 0.45 },
{ transform: `translate(${eX}px, ${eY}px) scale(0.92)`, opacity: 0.75, offset: 0.58 },
{ transform: `translate(${sX}px, ${sY}px) scale(1)`, opacity: 0.55 }
], {
duration: 2000,
iterations: Infinity,
easing: 'ease-in-out'
});
const fingerNames = {
'finger-lp': 'левый мизинец',
'finger-lr': 'левый безымянный',
'finger-lm': 'левый средний',
'finger-li': 'левый указательный',
'finger-ri': 'правый указательный',
'finger-rm': 'правый средний',
'finger-rr': 'правый безымянный',
'finger-rp': 'правый мизинец',
'finger-th': 'большой палец'
};
const fingerName = fingerNames[fingerClass] || 'палец';
introDesc.textContent = `Палец: ${fingerName}`;
};
requestAnimationFrame(() => {
requestAnimationFrame(startFingerSlider);
});
const homeLabel = homeKeyEl ? homeKeyEl.querySelector('.main-label')?.textContent : '?';
practicePrompt.style.display = 'block';
practicePrompt.innerHTML = `🟢 <b>${homeLabel}</b> → 🔴 <b>${newChar}</b> — нажмите клавишу <b style="font-size:1.5rem">${newChar}</b> чтобы продолжить`;
startHint.style.display = 'none';
screens.intro.onclick = null;
introKeyListener = (e) => {
if (!introActive) return;
const typed = e.key;
if (typed === newChar || (newChar === ' ' && e.code === 'Space')) {
e.preventDefault();
document.removeEventListener('keydown', introKeyListener);
introKeyListener = null;
startGame();
}
};
document.addEventListener('keydown', introKeyListener);
} else {
for (const ch of newChars) {
let code = findCodeForChar(ch, currentLang);
if (code) {
const keyEl = introKeyboardArea.querySelector(`[data-code="${code}"]`);
if (keyEl) keyEl.classList.add('orange-block');
}
}
practicePrompt.style.display = 'none';
startHint.style.display = '';
screens.intro.onclick = () => { if (introActive) startGame(); };
}
} else {
for (const ch of newChars) {
let code = findCodeForChar(ch, currentLang);
if (code) {
const keyEl = introKeyboardArea.querySelector(`[data-code="${code}"]`);
if (keyEl) keyEl.classList.add('orange-block');
}
}
practicePrompt.style.display = 'none';
startHint.style.display = '';
screens.intro.onclick = () => { if (introActive) startGame(); };
}
}
introLetters.textContent = newChars.join('  ');
const shiftHintsEl = document.getElementById('shift-hints');
shiftHintsEl.innerHTML = '';
shiftHintsEl.style.display = 'none';
const hints = [];
for (const ch of newChars) {
const hint = getShiftHint(ch, currentLang);
if (hint) hints.push(hint);
}
if (hints.length > 0) {
shiftHintsEl.style.display = 'block';
const title = document.createElement('p');
title.style.cssText = 'font-weight: bold; margin-bottom: 6px; font-size: 1.05rem;';
title.textContent = '💡 Памятка:';
shiftHintsEl.appendChild(title);
for (const h of hints) {
const card = document.createElement('div');
card.className = 'shift-hint-card';
card.innerHTML = `
<span class="key-badge">${h.mod}</span>
<span class="hint-plus">+</span>
<span class="key-badge">${h.base}</span>
<span class="hint-plus">=</span>
<span class="hint-result">${h.result}</span>
`;
shiftHintsEl.appendChild(card);
}
}
}
function getShiftHint(char, lang) {
if (char >= 'А' && char <= 'Я' || char === 'Ё') {
return { mod: 'Shift', base: char.toLowerCase(), result: char };
}
if (char >= 'A' && char <= 'Z') {
return { mod: 'Shift', base: char.toLowerCase(), result: char };
}
if (lang === 'ru') {
if (currentOS === 'mac') {
const shiftMapRuMac = {
'!': { base: '1', result: '!' },
'"': { base: '2', result: '"' },
'№': { base: '3', result: '№' },
';': { base: '8', result: ';' },
'%': { base: '5', result: '%' },
':': { base: '6', result: ':' },
',': { base: '6', result: ',' },
'.': { base: '7', result: '.' },
'?': { base: '/', result: '?' },
'(': { base: '9', result: '(' },
')': { base: '0', result: ')' },
'_': { base: '-', result: '_' },
'+': { base: '=', result: '+' },
};
if (shiftMapRuMac[char]) return { mod: 'Shift', base: shiftMapRuMac[char].base, result: shiftMapRuMac[char].result };
} else {
const shiftMapRuWin = {
'!': { base: '1', result: '!' },
'"': { base: '2', result: '"' },
'№': { base: '3', result: '№' },
';': { base: '4', result: ';' },
'%': { base: '5', result: '%' },
':': { base: '6', result: ':' },
'?': { base: '7', result: '?' },
'*': { base: '8', result: '*' },
'(': { base: '9', result: '(' },
')': { base: '0', result: ')' },
'_': { base: '-', result: '_' },
'+': { base: '=', result: '+' },
',': { base: '.', result: ',' },
'/': { base: '.', result: '/' },
};
if (shiftMapRuWin[char]) return { mod: 'Shift', base: shiftMapRuWin[char].base, result: shiftMapRuWin[char].result };
}
}
const shiftMapEn = {
'!': { base: '1', result: '!' },
'@': { base: '2', result: '@' },
'#': { base: '3', result: '#' },
'$': { base: '4', result: '$' },
'%': { base: '5', result: '%' },
'^': { base: '6', result: '^' },
'&': { base: '7', result: '&' },
'*': { base: '8', result: '*' },
'(': { base: '9', result: '(' },
')': { base: '0', result: ')' },
'_': { base: '-', result: '_' },
'+': { base: '=', result: '+' },
'~': { base: '`', result: '~' },
'{': { base: '[', result: '{' },
'}': { base: ']', result: '}' },
'|': { base: '\\', result: '|' },
':': { base: ';', result: ':' },
'"': { base: "'", result: '"' },
'<': { base: ',', result: '<' },
'>': { base: '.', result: '>' },
'?': { base: '/', result: '?' },
};
if (shiftMapEn[char]) {
return { mod: 'Shift', base: shiftMapEn[char].base, result: shiftMapEn[char].result };
}
return null;
}
function findCodeForChar(char, lang) {
const layout = KEYBOARDS[lang];
for (let r = 0; r < layout.length; r++) {
for (let k = 0; k < layout[r].length; k++) {
const keyData = layout[r][k];
if (keyData.key === char || (char === ' ' && keyData.code === 'Space')) {
return keyData.code;
}
}
}
for (let r = 0; r < layout.length; r++) {
for (let k = 0; k < layout[r].length; k++) {
const keyData = layout[r][k];
if (keyData.sub === char) {
return keyData.code;
}
}
}
return null;
}
function startGame() {
introActive = false;
currentIndex = 0;
mistakes = 0;
correctChars = 0;
mistakeCountEl.textContent = '0';
playerEl.classList.remove('irbis-jump', 'irbis-scared');
const preset = getPreset();
const seqLen = preset.seqLen;
let levelData = getLevelData(currentLang, currentLevelId);
let effectiveSeqLen = seqLen;
if (currentMode === 'letters') {
sequence = generateSequence(levelData.chars, seqLen, 'letters');
levelBadge.textContent = `Уровень ${currentLevelId}` + (levelPassCount > 0 ? ` (${levelPassCount + 1}/2)` : '');
} else if (currentMode === 'words') {
sequence = generateSequence(levelData.chars, seqLen, 'words');
effectiveSeqLen = sequence.length;
levelBadge.textContent = `Режим: Слова`;
} else if (currentMode === 'texts') {
const textsList = LITTLE_PRINCE_TEXTS[currentLang] || LITTLE_PRINCE_TEXTS.ru;
const textIdx = Math.max(0, currentLevelId - 1);
sequence = generateSequence(levelData.chars, seqLen, 'texts', textIdx);
effectiveSeqLen = sequence.length;
const quoteNum = (textIdx % textsList.length) + 1;
levelBadge.textContent = `Маленький принц (${quoteNum}/${textsList.length})`;
}
const maxErrors = Math.floor(effectiveSeqLen * preset.errorPct / 100);
charsTotalEl.textContent = effectiveSeqLen;
maxErrorsEl.textContent = maxErrors;
const biomes = [
{ bg: 'url("img/forest.jpeg")', enemyClass: 'enemy-anim-tornado' },
{ bg: 'url("img/ice.jpeg")',    enemyClass: 'enemy-anim-ice' },
{ bg: 'url("img/lava.jpeg")',   enemyClass: 'enemy-anim-fire' },
{ bg: 'url("img/stone.jpeg")',  enemyClass: 'enemy-anim-stone' }
];
const currentBiome = biomes[Math.max(0, currentLevelId - 1) % biomes.length];
sceneEl.style.backgroundImage = currentBiome.bg;
sceneEl.style.backgroundRepeat = 'no-repeat';
sceneEl.style.backgroundSize = 'cover';
sceneEl.style.backgroundPosition = 'center bottom';
enemyEl.className = 'character ' + currentBiome.enemyClass;
enemyEl.style.backgroundImage = '';
playerX = BASE_PLAYER_X;
enemyX = START_ENEMY_X;
updatePositions();
showScreen('game');
renderKeyboard(currentLang, keyboardArea);
renderText();
renderSceneLetters();
highlightCurrentKey();
updateCharsDone();
isPlaying = true;
startGameLoop();
startCpmTimer();
}
function updateCharsDone() {
charsDoneEl.textContent = currentIndex;
const preset = getPreset();
const effectiveSeqLen = sequence ? sequence.length : preset.seqLen;
const maxErrors = Math.floor(effectiveSeqLen * preset.errorPct / 100);
if (mistakes > maxErrors) {
mistakeCountEl.style.color = '#e74c3c';
} else {
mistakeCountEl.style.color = '#f1c40f';
}
}
function renderText() {
}
const sceneLettersEl = document.getElementById('scene-letters');
const LETTER_SPACING = 36;
const LETTER_START_OFFSET = 175;
function getVisibleLetterCount() {
const sceneWidth = sceneEl.clientWidth || 900;
const availableWidth = sceneWidth - (playerX + LETTER_START_OFFSET) - 30;
return Math.max(4, Math.min(8, Math.floor(availableWidth / LETTER_SPACING)));
}
function renderSceneLetters() {
sceneLettersEl.innerHTML = '';
const visibleCount = getVisibleLetterCount();
const endIdx = Math.min(sequence.length, currentIndex + visibleCount);
for (let i = currentIndex; i < endIdx; i++) {
const el = document.createElement('div');
el.className = 'scene-letter';
el.setAttribute('data-scene-idx', i);
el.textContent = sequence[i] === ' ' ? '␣' : sequence[i];
if (i === currentIndex) {
el.classList.add('letter-current');
}
const offset = i - currentIndex;
el.style.left = (playerX + LETTER_START_OFFSET + offset * LETTER_SPACING) + 'px';
sceneLettersEl.appendChild(el);
}
}
function updateSceneLetters() {
const letters = sceneLettersEl.querySelectorAll('.scene-letter');
letters.forEach(el => {
const idx = parseInt(el.getAttribute('data-scene-idx'));
if (idx < currentIndex) {
if (!el.classList.contains('letter-gone')) {
el.classList.add('letter-gone');
setTimeout(() => el.remove(), 250);
}
} else {
const offset = idx - currentIndex;
el.style.left = (playerX + LETTER_START_OFFSET + offset * LETTER_SPACING) + 'px';
el.classList.remove('letter-current');
if (idx === currentIndex) {
el.classList.add('letter-current');
}
}
});
}
function highlightCurrentKey() {
if (currentIndex < sequence.length) {
highlightKey(sequence[currentIndex], currentLang);
} else {
highlightKey(null, currentLang);
}
}
function updatePositions() {
playerEl.style.left = playerX + 'px';
enemyEl.style.left = enemyX + 'px';
const distance = playerX - enemyX;
if (distance < 140 && vignetteEl) {
const intensity = Math.max(0, 1 - (distance / 140));
vignetteEl.style.boxShadow = `inset 0 0 ${100 * intensity}px rgba(0,0,0, ${0.8 * intensity})`;
} else if (vignetteEl) {
vignetteEl.style.boxShadow = `inset 0 0 0px rgba(0,0,0,0)`;
}
}
function startCpmTimer() {
stopCpmTimer();
startTime = Date.now();
correctChars = 0;
cpmInterval = setInterval(updateCpm, 1000);
}
function stopCpmTimer() {
if (cpmInterval) {
clearInterval(cpmInterval);
cpmInterval = null;
}
}
function updateCpm() {
if (!startTime || correctChars === 0) {
cpmDisplay.textContent = '0 зн/мин';
return;
}
const elapsedMin = (Date.now() - startTime) / 60000;
if (elapsedMin > 0) {
const cpm = Math.round(correctChars / elapsedMin);
cpmDisplay.textContent = `${cpm} зн/мин`;
}
}
function getCurrentCpm() {
if (!startTime || correctChars === 0) return 0;
const elapsedMin = (Date.now() - startTime) / 60000;
return elapsedMin > 0 ? Math.round(correctChars / elapsedMin) : 0;
}
function handleKeydown(e) {
if (e.key === 'Enter') {
e.preventDefault();
if (!screens.menu.classList.contains('hidden')) {
const gridScreen = document.getElementById('level-grid-screen');
if (gridScreen && !gridScreen.classList.contains('hidden')) {
gridScreen.classList.add('hidden');
} else {
if (currentMode === 'letters') {
showIntroScreen();
} else {
startGame();
}
}
return;
}
if (introActive) {
if (introKeyListener) return;
startGame();
return;
}
if (!screens.result.classList.contains('hidden')) {
if (nextLevelBtn.style.display !== 'none') {
if (currentMode === 'letters') {
const totalLevels = CHAR_SEQUENCES[currentLang].length;
if (currentLevelId <= totalLevels) {
showIntroScreen();
} else {
showMenu();
}
} else if (currentMode === 'texts') {
currentLevelId++;
startGame();
} else {
startGame();
}
} else {
startGame();
}
return;
}
}
if (!isPlaying) return;
if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
e.preventDefault();
}
if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
return;
}
const targetChar = sequence[currentIndex];
const typedChar = e.key;
let isCorrect = (targetChar === ' ' && e.code === 'Space') || typedChar === targetChar;
if (!isCorrect && (targetChar === '—' || targetChar === '–') && typedChar === '-') {
isCorrect = true;
}
if (!isCorrect && (targetChar === '«' || targetChar === '»' || targetChar === '“' || targetChar === '”') && (typedChar === '"' || typedChar === "'")) {
isCorrect = true;
}
if (isCorrect) {
currentIndex++;
correctChars++;
const playerForward = Math.max(0, Math.min(3.5, MAX_PLAYER_X - playerX));
playerX += playerForward;
const enemyPushback = 8 - playerForward;
enemyX = Math.max(MIN_ENEMY_X, enemyX - enemyPushback);
playerEl.classList.remove('irbis-jump');
void playerEl.offsetWidth;
playerEl.classList.add('irbis-jump');
setTimeout(() => playerEl.classList.remove('irbis-jump'), 350);
updateCharsDone();
updatePositions();
if (currentIndex >= sequence.length) {
levelComplete();
} else {
renderSceneLetters();
highlightCurrentKey();
}
} else {
mistakes++;
mistakeCountEl.textContent = mistakes;
updateCharsDone();
playerEl.classList.remove('irbis-scared');
void playerEl.offsetWidth;
playerEl.classList.add('irbis-scared');
setTimeout(() => playerEl.classList.remove('irbis-scared'), 350);
sceneEl.classList.add('typing-error');
setTimeout(() => sceneEl.classList.remove('typing-error'), 300);
enemyX += 15;
updatePositions();
updateSceneLetters();
if (enemyX + CATCH_DISTANCE >= playerX) {
enemyX = playerX - 10;
updatePositions();
gameOverCaught();
return;
}
}
}
function startGameLoop() {
if (gameLoop) clearInterval(gameLoop);
const preset = getPreset();
gameLoop = setInterval(() => {
if (!isPlaying) return;
enemyX += preset.enemySpeed;
if (playerX > BASE_PLAYER_X) {
playerX = Math.max(BASE_PLAYER_X, playerX - 0.2);
}
if (enemyX + CATCH_DISTANCE >= playerX) {
enemyX = playerX - 10;
updatePositions();
gameOverCaught();
return;
}
updatePositions();
updateSceneLetters();
}, 50);
}
function gameOverCaught() {
isPlaying = false;
stopGameLoop();
updateCpm();
playerEl.classList.remove('irbis-jump');
playerEl.classList.add('irbis-scared');
const cpm = getCurrentCpm();
resultMistakes.textContent = mistakes;
resultCpm.textContent = cpm;
resultStars.textContent = '🐾';
const encouragingPhrases = [
"🐾 Ирбис устал! Давай передохнём и попробуем ещё разок?",
"🐾 Почти получилось! В следующий раз ты точно обгонишь ветерок!",
"🐾 Отличная попытка! Пальчики размялись, давай ещё раз!",
"🐾 Не сдавайся! Каждая попытка делает тебя быстрее!"
];
const phrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
resultTitle.textContent = phrase;
resultTitle.style.color = "#d35400";
resultTitle.style.fontSize = "1.8rem";
nextLevelBtn.style.display = 'none';
setTimeout(() => {
showScreen('result');
}, 400);
}
function stopGameLoop() {
if (gameLoop) {
clearInterval(gameLoop);
gameLoop = null;
}
}
function levelComplete() {
isPlaying = false;
stopGameLoop();
updateCpm();
const preset = getPreset();
const seqLen = sequence ? sequence.length : preset.seqLen;
const maxErrors = Math.floor(seqLen * preset.errorPct / 100);
const passed = mistakes <= maxErrors;
const totalLevels = Math.max(1, CHAR_SEQUENCES[currentLang].length - 1);
if (passed) {
if (currentMode === 'letters') {
levelPassCount++;
const requiredPasses = (mistakes === 0 && levelPassCount >= 2) ? 2 : 3;
if (levelPassCount >= requiredPasses) {
levelPassCount = 0;
currentLevelId++;
valLevel.textContent = currentLevelId;
if (currentLevelId > totalLevels) {
resultMistakes.textContent = mistakes;
resultCpm.textContent = getCurrentCpm();
resultStars.textContent = '🏆⭐⭐⭐';
resultTitle.textContent = "🎉 Поздравляем! Все уровни пройдены!";
resultTitle.style.color = "#27ae60";
nextLevelBtn.style.display = 'none';
showScreen('result');
return;
}
showIntroScreen();
} else {
startGame();
}
} else {
const cpm = getCurrentCpm();
resultMistakes.textContent = mistakes;
resultCpm.textContent = cpm;
let stars = mistakes === 0 ? '⭐⭐⭐' : (mistakes <= Math.floor(maxErrors / 2) ? '⭐⭐' : '⭐');
resultStars.textContent = stars;
resultTitle.textContent = currentMode === 'texts'
? "✨ Цитата пройдена!"
: "🌟 Отличная тренировка слов!";
resultTitle.style.color = "#27ae60";
nextLevelBtn.textContent = currentMode === 'texts' ? 'Следующий текст →' : 'Новые слова →';
nextLevelBtn.style.display = '';
showScreen('result');
}
} else {
const accuracy = Math.max(0, Math.round(((seqLen - mistakes) / seqLen) * 100));
resultMistakes.textContent = mistakes;
resultCpm.textContent = getCurrentCpm();
resultStars.textContent = '🐾';
resultTitle.textContent = `🐾 Чуть-чуть не хватило (${accuracy}%)! Давай закрепим этот уровень!`;
resultTitle.style.color = "#d35400";
resultTitle.style.fontSize = "1.8rem";
nextLevelBtn.style.display = 'none';
showScreen('result');
}
}
window.addEventListener('resize', () => {
if (isPlaying) {
renderSceneLetters();
} else if (introActive) {
showIntroScreen();
}
});
init();