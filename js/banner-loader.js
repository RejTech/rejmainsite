document.addEventListener('DOMContentLoaded', async () => {
    try {
        const isEnglish = window.location.pathname.includes('/en/');
        const cssPath = isEnglish ? '../css/banner.css' : 'css/banner.css';
        const jsonPath = isEnglish ? '../js/banner-data.json' : 'js/banner-data.json';
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
        
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        const bannerData = await response.json();
        
        const randomIndex = Math.floor(Math.random() * bannerData.length);
        const selectedBanner = bannerData[randomIndex];
        
        const titleKey = isEnglish ? 'en_title' : 'zh_title';
        const contentKey = isEnglish ? 'en_content' : 'zh_content';
        const buttonKey = isEnglish ? 'en_button' : 'zh_button';
        const buttonLink = selectedBanner.button_link || '#';
        
        const bannerHtml = `
            <div id="top-banner" class="top-banner">
                <div class="top-banner-content">
                    <div class="banner-title">${selectedBanner[titleKey]}</div>
                    <div class="banner-text">${selectedBanner[contentKey]}</div>
                    <a href="${buttonLink}" class="banner-btn btn btn-light btn-sm ms-3">${selectedBanner[buttonKey]}</a>
                </div>
                <div class="banner-countdown" id="banner-countdown">5s</div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = bannerHtml;
        const bannerElement = container.firstElementChild;
        if (bannerElement) {
            document.body.insertBefore(bannerElement, document.body.firstChild);
        } else {
            console.error('Failed to create banner element from HTML');
            return;
        }
        
        const banner = document.getElementById('top-banner');
        const countdown = document.getElementById('banner-countdown');
        
        if (!banner) {
            console.error('Banner container not found');
            return;
        }
        if (!countdown) {
            console.error('Countdown element not found');
            return;
        }
        
        let seconds = 5;
        
        const bannerTimer = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                if (countdown) {
                    countdown.textContent = seconds + 's';
                }
            } else {
                clearInterval(bannerTimer);
                if (banner) {
                    banner.classList.add('collapsed');
                }
                if (countdown) {
                    countdown.textContent = '';
                }
            }
        }, 1000);
    } catch (error) {
        console.error('Failed to load banner:', error);
    }
});