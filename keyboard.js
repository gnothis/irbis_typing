function detectOS() {
try {
const saved = localStorage.getItem('irbis_os');
if (saved === 'mac' || saved === 'windows') return saved;
const userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
const platform = (typeof navigator !== 'undefined' ? (navigator.userAgentData?.platform || navigator.platform) : '') || '';
if (/Macintosh|MacIntel|MacPPC|Mac68K|macOS/i.test(platform) || /Mac OS X|macOS/i.test(userAgent)) {
return 'mac';
}
} catch (e) {}
return 'windows';
}
let currentOS = detectOS();
function setOS(os) {
if (os === 'mac' || os === 'windows') {
currentOS = os;
try {
localStorage.setItem('irbis_os', os);
} catch (e) {}
}
}
const KEYBOARDS_BY_OS = {
windows: {
en: [
[
{ key: '`', sub: '~', class: 'finger-lp', code: 'Backquote' },
{ key: '1', sub: '!', class: 'finger-lp', code: 'Digit1' },
{ key: '2', sub: '@', class: 'finger-lr', code: 'Digit2' },
{ key: '3', sub: '#', class: 'finger-lm', code: 'Digit3' },
{ key: '4', sub: '$', class: 'finger-li', code: 'Digit4' },
{ key: '5', sub: '%', class: 'finger-li', code: 'Digit5' },
{ key: '6', sub: '^', class: 'finger-ri', code: 'Digit6' },
{ key: '7', sub: '&', class: 'finger-ri', code: 'Digit7' },
{ key: '8', sub: '*', class: 'finger-rm', code: 'Digit8' },
{ key: '9', sub: '(', class: 'finger-rr', code: 'Digit9' },
{ key: '0', sub: ')', class: 'finger-rp', code: 'Digit0' },
{ key: '-', sub: '_', class: 'finger-rp', code: 'Minus' },
{ key: '=', sub: '+', class: 'finger-rp', code: 'Equal' },
{ key: 'Backspace', class: 'w-20', code: 'Backspace' }
],
[
{ key: 'Tab', class: 'w-15', code: 'Tab' },
{ key: 'q', class: 'finger-lp', code: 'KeyQ' },
{ key: 'w', class: 'finger-lr', code: 'KeyW' },
{ key: 'e', class: 'finger-lm', code: 'KeyE' },
{ key: 'r', class: 'finger-li', code: 'KeyR' },
{ key: 't', class: 'finger-li', code: 'KeyT' },
{ key: 'y', class: 'finger-ri', code: 'KeyY' },
{ key: 'u', class: 'finger-ri', code: 'KeyU' },
{ key: 'i', class: 'finger-rm', code: 'KeyI' },
{ key: 'o', class: 'finger-rr', code: 'KeyO' },
{ key: 'p', class: 'finger-rp', code: 'KeyP' },
{ key: '[', sub: '{', class: 'finger-rp', code: 'BracketLeft' },
{ key: ']', sub: '}', class: 'finger-rp', code: 'BracketRight' },
{ key: '\\', sub: '|', class: 'finger-rp w-15', code: 'Backslash' }
],
[
{ key: 'Caps Lock', class: 'w-175', code: 'CapsLock' },
{ key: 'a', class: 'finger-lp', code: 'KeyA' },
{ key: 's', class: 'finger-lr', code: 'KeyS' },
{ key: 'd', class: 'finger-lm', code: 'KeyD' },
{ key: 'f', class: 'finger-li', code: 'KeyF' },
{ key: 'g', class: 'finger-li', code: 'KeyG' },
{ key: 'h', class: 'finger-ri', code: 'KeyH' },
{ key: 'j', class: 'finger-ri', code: 'KeyJ' },
{ key: 'k', class: 'finger-rm', code: 'KeyK' },
{ key: 'l', class: 'finger-rr', code: 'KeyL' },
{ key: ';', sub: ':', class: 'finger-rp', code: 'Semicolon' },
{ key: "'", sub: '"', class: 'finger-rp', code: 'Quote' },
{ key: 'Enter', class: 'w-225', code: 'Enter' }
],
[
{ key: 'Shift', class: 'w-225', code: 'ShiftLeft' },
{ key: 'z', class: 'finger-lp', code: 'KeyZ' },
{ key: 'x', class: 'finger-lr', code: 'KeyX' },
{ key: 'c', class: 'finger-lm', code: 'KeyC' },
{ key: 'v', class: 'finger-li', code: 'KeyV' },
{ key: 'b', class: 'finger-li', code: 'KeyB' },
{ key: 'n', class: 'finger-ri', code: 'KeyN' },
{ key: 'm', class: 'finger-rm', code: 'KeyM' },
{ key: ',', sub: '<', class: 'finger-rm', code: 'Comma' },
{ key: '.', sub: '>', class: 'finger-rr', code: 'Period' },
{ key: '/', sub: '?', class: 'finger-rp', code: 'Slash' },
{ key: 'Shift', class: 'w-275', code: 'ShiftRight' }
],
[
{ key: 'Ctrl', class: 'w-15', code: 'ControlLeft' },
{ key: 'Win', class: 'w-15', code: 'MetaLeft' },
{ key: 'Alt', class: 'w-15', code: 'AltLeft' },
{ key: ' ', class: 'spacebar finger-th', code: 'Space' },
{ key: 'Alt', class: 'w-15', code: 'AltRight' },
{ key: 'Win', class: 'w-15', code: 'MetaRight' },
{ key: 'Menu', class: 'w-15', code: 'ContextMenu' },
{ key: 'Ctrl', class: 'w-15', code: 'ControlRight' }
]
],
ru: [
[
{ key: 'ё', sub: 'Ё', class: 'finger-lp', code: 'Backquote' },
{ key: '1', sub: '!', class: 'finger-lp', code: 'Digit1' },
{ key: '2', sub: '"', class: 'finger-lr', code: 'Digit2' },
{ key: '3', sub: '№', class: 'finger-lm', code: 'Digit3' },
{ key: '4', sub: ';', class: 'finger-li', code: 'Digit4' },
{ key: '5', sub: '%', class: 'finger-li', code: 'Digit5' },
{ key: '6', sub: ':', class: 'finger-ri', code: 'Digit6' },
{ key: '7', sub: '?', class: 'finger-ri', code: 'Digit7' },
{ key: '8', sub: '*', class: 'finger-rm', code: 'Digit8' },
{ key: '9', sub: '(', class: 'finger-rr', code: 'Digit9' },
{ key: '0', sub: ')', class: 'finger-rp', code: 'Digit0' },
{ key: '-', sub: '_', class: 'finger-rp', code: 'Minus' },
{ key: '=', sub: '+', class: 'finger-rp', code: 'Equal' },
{ key: 'Backspace', class: 'w-20', code: 'Backspace' }
],
[
{ key: 'Tab', class: 'w-15', code: 'Tab' },
{ key: 'й', class: 'finger-lp', code: 'KeyQ' },
{ key: 'ц', class: 'finger-lr', code: 'KeyW' },
{ key: 'у', class: 'finger-lm', code: 'KeyE' },
{ key: 'к', class: 'finger-li', code: 'KeyR' },
{ key: 'е', class: 'finger-li', code: 'KeyT' },
{ key: 'н', class: 'finger-ri', code: 'KeyY' },
{ key: 'г', class: 'finger-ri', code: 'KeyU' },
{ key: 'ш', class: 'finger-rm', code: 'KeyI' },
{ key: 'щ', class: 'finger-rr', code: 'KeyO' },
{ key: 'з', class: 'finger-rp', code: 'KeyP' },
{ key: 'х', sub: '', class: 'finger-rp', code: 'BracketLeft' },
{ key: 'ъ', sub: '', class: 'finger-rp', code: 'BracketRight' },
{ key: '\\', sub: '/', class: 'finger-rp w-15', code: 'Backslash' }
],
[
{ key: 'Caps Lock', class: 'w-175', code: 'CapsLock' },
{ key: 'ф', class: 'finger-lp', code: 'KeyA' },
{ key: 'ы', class: 'finger-lr', code: 'KeyS' },
{ key: 'в', class: 'finger-lm', code: 'KeyD' },
{ key: 'а', class: 'finger-li', code: 'KeyF' },
{ key: 'п', class: 'finger-li', code: 'KeyG' },
{ key: 'р', class: 'finger-ri', code: 'KeyH' },
{ key: 'о', class: 'finger-ri', code: 'KeyJ' },
{ key: 'л', class: 'finger-rm', code: 'KeyK' },
{ key: 'д', class: 'finger-rr', code: 'KeyL' },
{ key: 'ж', sub: '', class: 'finger-rp', code: 'Semicolon' },
{ key: 'э', sub: '', class: 'finger-rp', code: 'Quote' },
{ key: 'Enter', class: 'w-225', code: 'Enter' }
],
[
{ key: 'Shift', class: 'w-225', code: 'ShiftLeft' },
{ key: 'я', class: 'finger-lp', code: 'KeyZ' },
{ key: 'ч', class: 'finger-lr', code: 'KeyX' },
{ key: 'с', class: 'finger-lm', code: 'KeyC' },
{ key: 'м', class: 'finger-li', code: 'KeyV' },
{ key: 'и', class: 'finger-li', code: 'KeyB' },
{ key: 'т', class: 'finger-ri', code: 'KeyN' },
{ key: 'ь', class: 'finger-rm', code: 'KeyM' },
{ key: 'б', sub: '', class: 'finger-rm', code: 'Comma' },
{ key: 'ю', sub: '', class: 'finger-rr', code: 'Period' },
{ key: '.', sub: ',', class: 'finger-rp', code: 'Slash' },
{ key: 'Shift', class: 'w-275', code: 'ShiftRight' }
],
[
{ key: 'Ctrl', class: 'w-15', code: 'ControlLeft' },
{ key: 'Win', class: 'w-15', code: 'MetaLeft' },
{ key: 'Alt', class: 'w-15', code: 'AltLeft' },
{ key: ' ', class: 'spacebar finger-th', code: 'Space' },
{ key: 'Alt', class: 'w-15', code: 'AltRight' },
{ key: 'Win', class: 'w-15', code: 'MetaRight' },
{ key: 'Menu', class: 'w-15', code: 'ContextMenu' },
{ key: 'Ctrl', class: 'w-15', code: 'ControlRight' }
]
]
},
mac: {
en: [
[
{ key: '`', sub: '~', class: 'finger-lp', code: 'Backquote' },
{ key: '1', sub: '!', class: 'finger-lp', code: 'Digit1' },
{ key: '2', sub: '@', class: 'finger-lr', code: 'Digit2' },
{ key: '3', sub: '#', class: 'finger-lm', code: 'Digit3' },
{ key: '4', sub: '$', class: 'finger-li', code: 'Digit4' },
{ key: '5', sub: '%', class: 'finger-li', code: 'Digit5' },
{ key: '6', sub: '^', class: 'finger-ri', code: 'Digit6' },
{ key: '7', sub: '&', class: 'finger-ri', code: 'Digit7' },
{ key: '8', sub: '*', class: 'finger-rm', code: 'Digit8' },
{ key: '9', sub: '(', class: 'finger-rr', code: 'Digit9' },
{ key: '0', sub: ')', class: 'finger-rp', code: 'Digit0' },
{ key: '-', sub: '_', class: 'finger-rp', code: 'Minus' },
{ key: '=', sub: '+', class: 'finger-rp', code: 'Equal' },
{ key: 'delete ⌫', class: 'w-20 font-sm', code: 'Backspace' }
],
[
{ key: 'tab ⇥', class: 'w-15 font-sm', code: 'Tab' },
{ key: 'q', class: 'finger-lp', code: 'KeyQ' },
{ key: 'w', class: 'finger-lr', code: 'KeyW' },
{ key: 'e', class: 'finger-lm', code: 'KeyE' },
{ key: 'r', class: 'finger-li', code: 'KeyR' },
{ key: 't', class: 'finger-li', code: 'KeyT' },
{ key: 'y', class: 'finger-ri', code: 'KeyY' },
{ key: 'u', class: 'finger-ri', code: 'KeyU' },
{ key: 'i', class: 'finger-rm', code: 'KeyI' },
{ key: 'o', class: 'finger-rr', code: 'KeyO' },
{ key: 'p', class: 'finger-rp', code: 'KeyP' },
{ key: '[', sub: '{', class: 'finger-rp', code: 'BracketLeft' },
{ key: ']', sub: '}', class: 'finger-rp', code: 'BracketRight' },
{ key: '\\', sub: '|', class: 'finger-rp w-15', code: 'Backslash' }
],
[
{ key: 'caps lock ⇪', class: 'w-175 font-sm', code: 'CapsLock' },
{ key: 'a', class: 'finger-lp', code: 'KeyA' },
{ key: 's', class: 'finger-lr', code: 'KeyS' },
{ key: 'd', class: 'finger-lm', code: 'KeyD' },
{ key: 'f', class: 'finger-li', code: 'KeyF' },
{ key: 'g', class: 'finger-li', code: 'KeyG' },
{ key: 'h', class: 'finger-ri', code: 'KeyH' },
{ key: 'j', class: 'finger-ri', code: 'KeyJ' },
{ key: 'k', class: 'finger-rm', code: 'KeyK' },
{ key: 'l', class: 'finger-rr', code: 'KeyL' },
{ key: ';', sub: ':', class: 'finger-rp', code: 'Semicolon' },
{ key: "'", sub: '"', class: 'finger-rp', code: 'Quote' },
{ key: 'return ⏎', class: 'w-225 font-sm', code: 'Enter' }
],
[
{ key: 'shift ⇧', class: 'w-225 font-sm', code: 'ShiftLeft' },
{ key: 'z', class: 'finger-lp', code: 'KeyZ' },
{ key: 'x', class: 'finger-lr', code: 'KeyX' },
{ key: 'c', class: 'finger-lm', code: 'KeyC' },
{ key: 'v', class: 'finger-li', code: 'KeyV' },
{ key: 'b', class: 'finger-li', code: 'KeyB' },
{ key: 'n', class: 'finger-ri', code: 'KeyN' },
{ key: 'm', class: 'finger-rm', code: 'KeyM' },
{ key: ',', sub: '<', class: 'finger-rm', code: 'Comma' },
{ key: '.', sub: '>', class: 'finger-rr', code: 'Period' },
{ key: '/', sub: '?', class: 'finger-rp', code: 'Slash' },
{ key: 'shift ⇧', class: 'w-275 font-sm', code: 'ShiftRight' }
],
[
{ key: 'control ⌃', class: 'w-15 font-sm', code: 'ControlLeft' },
{ key: 'option ⌥', class: 'w-15 font-sm', code: 'AltLeft' },
{ key: 'command ⌘', class: 'w-15 font-sm', code: 'MetaLeft' },
{ key: ' ', class: 'spacebar finger-th', code: 'Space' },
{ key: 'command ⌘', class: 'w-15 font-sm', code: 'MetaRight' },
{ key: 'option ⌥', class: 'w-15 font-sm', code: 'AltRight' },
{ key: 'control ⌃', class: 'w-15 font-sm', code: 'ControlRight' }
]
],
ru: [
[
{ key: 'ё', sub: 'Ё', class: 'finger-lp', code: 'Backquote' },
{ key: '1', sub: '!', class: 'finger-lp', code: 'Digit1' },
{ key: '2', sub: '"', class: 'finger-lr', code: 'Digit2' },
{ key: '3', sub: '№', class: 'finger-lm', code: 'Digit3' },
{ key: '4', sub: ';', class: 'finger-li', code: 'Digit4' },
{ key: '5', sub: '%', class: 'finger-li', code: 'Digit5' },
{ key: '6', sub: ',', class: 'finger-ri', code: 'Digit6' },
{ key: '7', sub: '.', class: 'finger-ri', code: 'Digit7' },
{ key: '8', sub: ';', class: 'finger-rm', code: 'Digit8' },
{ key: '9', sub: '(', class: 'finger-rr', code: 'Digit9' },
{ key: '0', sub: ')', class: 'finger-rp', code: 'Digit0' },
{ key: '-', sub: '_', class: 'finger-rp', code: 'Minus' },
{ key: '=', sub: '+', class: 'finger-rp', code: 'Equal' },
{ key: 'delete ⌫', class: 'w-20 font-sm', code: 'Backspace' }
],
[
{ key: 'tab ⇥', class: 'w-15 font-sm', code: 'Tab' },
{ key: 'й', class: 'finger-lp', code: 'KeyQ' },
{ key: 'ц', class: 'finger-lr', code: 'KeyW' },
{ key: 'у', class: 'finger-lm', code: 'KeyE' },
{ key: 'к', class: 'finger-li', code: 'KeyR' },
{ key: 'е', class: 'finger-li', code: 'KeyT' },
{ key: 'н', class: 'finger-ri', code: 'KeyY' },
{ key: 'г', class: 'finger-ri', code: 'KeyU' },
{ key: 'ш', class: 'finger-rm', code: 'KeyI' },
{ key: 'щ', class: 'finger-rr', code: 'KeyO' },
{ key: 'з', class: 'finger-rp', code: 'KeyP' },
{ key: 'х', sub: '', class: 'finger-rp', code: 'BracketLeft' },
{ key: 'ъ', sub: '', class: 'finger-rp', code: 'BracketRight' },
{ key: '\\', sub: '|', class: 'finger-rp w-15', code: 'Backslash' }
],
[
{ key: 'caps lock ⇪', class: 'w-175 font-sm', code: 'CapsLock' },
{ key: 'ф', class: 'finger-lp', code: 'KeyA' },
{ key: 'ы', class: 'finger-lr', code: 'KeyS' },
{ key: 'в', class: 'finger-lm', code: 'KeyD' },
{ key: 'а', class: 'finger-li', code: 'KeyF' },
{ key: 'п', class: 'finger-li', code: 'KeyG' },
{ key: 'р', class: 'finger-ri', code: 'KeyH' },
{ key: 'о', class: 'finger-ri', code: 'KeyJ' },
{ key: 'л', class: 'finger-rm', code: 'KeyK' },
{ key: 'д', class: 'finger-rr', code: 'KeyL' },
{ key: 'ж', sub: '', class: 'finger-rp', code: 'Semicolon' },
{ key: 'э', sub: '', class: 'finger-rp', code: 'Quote' },
{ key: 'return ⏎', class: 'w-225 font-sm', code: 'Enter' }
],
[
{ key: 'shift ⇧', class: 'w-225 font-sm', code: 'ShiftLeft' },
{ key: 'я', class: 'finger-lp', code: 'KeyZ' },
{ key: 'ч', class: 'finger-lr', code: 'KeyX' },
{ key: 'с', class: 'finger-lm', code: 'KeyC' },
{ key: 'м', class: 'finger-li', code: 'KeyV' },
{ key: 'и', class: 'finger-li', code: 'KeyB' },
{ key: 'т', class: 'finger-ri', code: 'KeyN' },
{ key: 'ь', class: 'finger-rm', code: 'KeyM' },
{ key: 'б', sub: '', class: 'finger-rm', code: 'Comma' },
{ key: 'ю', sub: '', class: 'finger-rr', code: 'Period' },
{ key: '/', sub: '?', class: 'finger-rp', code: 'Slash' },
{ key: 'shift ⇧', class: 'w-275 font-sm', code: 'ShiftRight' }
],
[
{ key: 'control ⌃', class: 'w-15 font-sm', code: 'ControlLeft' },
{ key: 'option ⌥', class: 'w-15 font-sm', code: 'AltLeft' },
{ key: 'command ⌘', class: 'w-15 font-sm', code: 'MetaLeft' },
{ key: ' ', class: 'spacebar finger-th', code: 'Space' },
{ key: 'command ⌘', class: 'w-15 font-sm', code: 'MetaRight' },
{ key: 'option ⌥', class: 'w-15 font-sm', code: 'AltRight' },
{ key: 'control ⌃', class: 'w-15 font-sm', code: 'ControlRight' }
]
]
}
};
const KEYBOARDS = {
get en() {
return (KEYBOARDS_BY_OS[currentOS] || KEYBOARDS_BY_OS.windows).en;
},
get ru() {
return (KEYBOARDS_BY_OS[currentOS] || KEYBOARDS_BY_OS.windows).ru;
},
windows: KEYBOARDS_BY_OS.windows,
mac: KEYBOARDS_BY_OS.mac
};
function renderKeyboard(lang, container) {
container.innerHTML = '';
const layout = KEYBOARDS[lang];
layout.forEach(row => {
const rowDiv = document.createElement('div');
rowDiv.className = 'kb-row';
row.forEach(keyData => {
const keyDiv = document.createElement('div');
keyDiv.className = `kb-key ${keyData.class || ''}`;
keyDiv.setAttribute('data-code', keyData.code);
keyDiv.id = `key-${keyData.code}`;
const mainLabel = document.createElement('span');
mainLabel.className = 'main-label';
mainLabel.textContent = keyData.key;
keyDiv.appendChild(mainLabel);
if (keyData.sub) {
const subLabel = document.createElement('span');
subLabel.className = 'sub-label';
subLabel.textContent = keyData.sub;
keyDiv.appendChild(subLabel);
}
rowDiv.appendChild(keyDiv);
});
container.appendChild(rowDiv);
});
}
function highlightKey(char, lang) {
document.querySelectorAll('.kb-key').forEach(el => el.classList.remove('active'));
if (!char) return;
let targetCode = null;
const layout = KEYBOARDS[lang];
for (let r = 0; r < layout.length; r++) {
for (let k = 0; k < layout[r].length; k++) {
const keyData = layout[r][k];
if (keyData.key === char || (char === ' ' && keyData.code === 'Space')) {
targetCode = keyData.code;
break;
}
}
if (targetCode) break;
}
if (!targetCode) {
for (let r = 0; r < layout.length; r++) {
for (let k = 0; k < layout[r].length; k++) {
const keyData = layout[r][k];
if (keyData.sub === char) {
targetCode = keyData.code;
break;
}
}
if (targetCode) break;
}
}
if (targetCode) {
document.querySelectorAll(`.kb-key[data-code="${targetCode}"]`).forEach(el => {
el.classList.add('active');
});
}
}