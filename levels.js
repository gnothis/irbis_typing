const CHAR_SEQUENCES = {
ru: [
'а','о','в','л','ы','д','ф','ж','п','р','к','г',
'е','н','м','ь','и','т','у','ш','с','ц','щ','ч',
'й','з','я','б','ю','х','э','ъ','.','5','6','7',
'4','8','3','9','2','0','1','-','ё','=','\\','А',
'О','В','Л','Ы','Д','Ф','Ж','П','Р','К','Г','Е',
'Н','М','Ь','И','Т','У','Ш','С','Ц','Щ','Ч','Й',
'З','Я','Б','Ю','Х','Э','Ъ',',','%',':','?',';',
'*','№','(','"',')','!','_','Ё','+','/'
],
en: [
'f','j','d','k','s','l','a',';','g','h','r','u',
'e','i','w','o','q','p','v','m','c',',','x','.',
'z','/','b','n','5','6','4','7','3','8','2','9',
'1','0','-','=','`','[',']','\\','\'','F','J','D',
'K','S','L','A',':','G','H','R','U','E','I','W',
'O','Q','P','V','M','C','<','X','>','Z','?','B',
'N','%','^','$','&','#','*','@','(','!',')','_',
'+','~','{','}','|','"'
]
};
function getLevelData(lang, levelId) {
const seq = CHAR_SEQUENCES[lang];
if (levelId < 1) levelId = 1;
if (levelId === 1) {
return {
id: 1,
chars: seq.slice(0, 2),
newChars: seq.slice(0, 2)
};
}
const charIndex = levelId;
const safeIndex = Math.min(charIndex, seq.length - 1);
return {
id: levelId,
chars: seq.slice(0, safeIndex + 1),
newChars: [seq[safeIndex]]
};
}
const WORD_LISTS = {
ru: [
'дом', 'лес', 'кот', 'сон', 'луч', 'мир', 'сад', 'сок', 'пар', 'шар',
'гора', 'река', 'небо', 'луна', 'снег', 'утро', 'лето', 'поле', 'зима', 'ветер',
'ирбис', 'песок', 'скала', 'птица', 'звезда', 'дорога', 'солнце', 'облако', 'цветок', 'планета',
'сказка', 'дружба', 'радость', 'секрет', 'прыжок', 'улыбка', 'взгляд', 'тропа', 'высота', 'пещера',
'ласковый', 'быстрый', 'смелый', 'добрый', 'красивый', 'золотой', 'мудрый', 'чистый', 'светлый', 'верный'
],
en: [
'cat', 'sun', 'sky', 'dog', 'run', 'fox', 'day', 'joy', 'sea', 'star',
'wind', 'snow', 'moon', 'tree', 'rock', 'path', 'hill', 'bird', 'lion', 'bear',
'irbis', 'river', 'cloud', 'magic', 'dream', 'light', 'forest', 'flower', 'friend', 'desert',
'little', 'prince', 'planet', 'secret', 'brave', 'silver', 'golden', 'gentle', 'wonder', 'spirit'
]
};
const LITTLE_PRINCE_TEXTS = {
ru: [
"Зорко одно лишь сердце. Самого главного глазами не увидишь.",
"Ты навсегда в ответе за всех, кого приручил. Ты в ответе за твою розу.",
"Все взрослые сначала были детьми, только мало кто из них об этом помнит.",
"Есть такое твердое правило: встал поутру, умылся, привел себя в порядок - и сразу же приведи в порядок свою планету.",
"Слова только мешают понимать друг друга.",
"Если любишь цветок, единственный, какого больше нет ни на одной из миллионов звезд, этого довольно: смотришь на небо и чувствуешь себя счастливым.",
"Тогда суди сам себя. Это самое трудное. Судить себя куда трудней, чем других.",
"Знаешь, отчего хороша пустыня? Где-то в ней скрываются родники.",
"Когда даешь себя приручить, потом случается и плакать.",
"У каждого человека свои звезды. Одним они указывают путь, для других это просто маленькие огоньки.",
"Себя судить куда трудней, чем других. Если ты сумеешь правильно судить себя, значит, ты поистине мудр.",
"Ночью, когда ты будешь смотреть на небо, моя звезда будет для тебя одной из тех, где я живу, где я смеюсь.",
"Люди забираются в скорые поезда, но они сами не понимают, чего они ищут.",
"Никогда не надо слушать, что говорят цветы. Надо просто смотреть на них и дышать их ароматом.",
"Если идти все прямо да прямо, далеко не уйдешь.",
"Твоя роза так дорога тебе потому, что ты отдавал ей всю свою душу.",
"Вот мой секрет, он очень прост: зорко одно лишь сердце.",
"Светильники надо беречь: порыв ветра может их погасить.",
"Вода бывает нужна и сердцу.",
"Хотел бы я знать, зачем звезды светятся. Наверно, затем, чтобы рано или поздно каждый мог вновь отыскать свою."
],
en: [
"It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
"You become responsible, forever, for what you have tamed. You are responsible for your rose.",
"All grown-ups were once children, although few of them remember it.",
"It is the time you have wasted for your rose that makes your rose so important.",
"Words are the source of misunderstandings.",
"What makes the desert beautiful is that somewhere it hides a well.",
"One runs the risk of crying a bit if one allows oneself to be tamed.",
"And now here is my secret, a very simple secret: It is only with the heart that one can see rightly.",
"The most beautiful things in the world cannot be seen or touched, they are felt with the heart.",
"No one is ever satisfied where he is.",
"I wonder whether the stars are set alight in heaven so that one day each one of us may find his own again.",
"Straight ahead of him, nobody can go very far.",
"You, you alone will have the stars as no one else has them."
]
};
function generateSequence(availableChars, length = 40, mode = 'letters', textIndex = 0) {
const lang = typeof currentLang !== 'undefined' ? currentLang : 'ru';
if (mode === 'words') {
const words = WORD_LISTS[lang] || WORD_LISTS.ru;
let result = [];
let curLen = 0;
while (curLen < length) {
const w = words[Math.floor(Math.random() * words.length)];
result.push(w);
curLen += w.length + 1;
}
return result.join(' ');
}
if (mode === 'texts') {
const texts = LITTLE_PRINCE_TEXTS[lang] || LITTLE_PRINCE_TEXTS.ru;
const validIdx = Math.max(0, parseInt(textIndex, 10) || 0);
const chosen = texts[validIdx % texts.length];
return chosen;
}
let seq = "";
const newChars = availableChars.slice(-2);
const oldChars = availableChars.slice(0, -2);
for (let i = 0; i < length; i++) {
if (i > 0 && i < length - 1 && seq[seq.length - 1] !== ' ' && Math.random() < 0.25) {
seq += ' ';
continue;
}
let pool = availableChars;
if (oldChars.length > 0 && Math.random() < 0.4) {
pool = newChars;
}
seq += pool[Math.floor(Math.random() * pool.length)];
}
return seq;
}