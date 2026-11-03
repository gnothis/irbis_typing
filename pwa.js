(function() {
let deferredPrompt = null;
const installBtn = document.getElementById('pwa-install-btn');
const isStandalone = window.matchMedia('(display-mode: standalone)').matches
|| window.matchMedia('(display-mode: fullscreen)').matches
|| window.navigator.standalone === true;
if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('./sw.js')
.then((registration) => {
console.log('✅ ServiceWorker registered with scope:', registration.scope);
})
.catch((error) => {
console.warn('⚠️ ServiceWorker registration failed:', error);
});
});
}
if (!isStandalone && installBtn) {
window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
deferredPrompt = e;
installBtn.style.display = 'flex';
installBtn.style.animation = 'fadeIn 0.4s ease';
});
installBtn.addEventListener('click', async () => {
if (!deferredPrompt) return;
deferredPrompt.prompt();
const { outcome } = await deferredPrompt.userChoice;
console.log('PWA installation choice:', outcome);
if (outcome === 'accepted') {
installBtn.style.display = 'none';
}
deferredPrompt = null;
});
window.addEventListener('appinstalled', () => {
console.log('🎉 Irbis Typing was installed successfully');
installBtn.style.display = 'none';
deferredPrompt = null;
});
} else if (installBtn) {
installBtn.style.display = 'none';
}
})();