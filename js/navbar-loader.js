// 导航栏加载器
class NavbarLoader {
    constructor() {
        this.navbars = {
            'zh': {
                siteName: '锐机综合站',
                homeText: '主页',
                communityText: '社交媒体账号',
                videosText: '视频',
                liveText: '直播',
                aboutText: '关于RMS锐机主站',
                fileStationText: '锐机文件站',
                classSiteText: '锐机班级站',
                languageText: 'Switch to English',
                themeComponentText: '主题组件',
                autoModeText: '自动切换',
                themeToggleText: '深色'
            },
            'en': {
                siteName: 'Rej Comprehensive Site',
                homeText: 'Home',
                communityText: 'Social Media',
                videosText: 'Videos',
                liveText: 'Live',
                aboutText: 'About RMS',
                fileStationText: 'Rej File Station',
                classSiteText: 'Rej Class Site',
                languageText: '切换至中文',
                themeComponentText: 'Theme',
                autoModeText: 'Auto Switch',
                themeToggleText: 'Dark'
            }
        };
    }

    async loadNavbar() {
        console.log('NavbarLoader: Starting to load navbar');
        const currentPath = window.location.pathname;
        console.log('NavbarLoader: Current path:', currentPath);
        
        // 确定当前语言
        const isEnglish = currentPath.includes('/en/') || currentPath === '/en';
        console.log('NavbarLoader: Is English:', isEnglish);
        const language = isEnglish ? 'en' : 'zh';
        const logoUrl = isEnglish ? '../files/images/rms-logo.svg' : 'files/images/rms-logo.svg';
        console.log('NavbarLoader: Logo URL:', logoUrl);

        try {
            // 构建正确的navbar.html路径
            let navbarPath = 'components/navbar.html';
            if (isEnglish) {
                // 对于英文页面，需要向上一级目录
                navbarPath = '../components/navbar.html';
            }
            console.log('NavbarLoader: Navbar template path:', navbarPath);
            
            // 加载导航栏模板
            const response = await fetch(navbarPath);
            console.log('NavbarLoader: Fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.status}`);
            }
            const template = await response.text();
            console.log('NavbarLoader: Template loaded successfully');

            // 确定当前页面
            let currentPage = 'home';
            if (currentPath.includes('community')) {
                currentPage = 'community';
            } else if (currentPath.includes('videos')) {
                currentPage = 'videos';
            } else if (currentPath.includes('live')) {
                currentPage = 'live';
            } else if (currentPath.includes('about')) {
                currentPage = 'about';
            } else if (currentPath.includes('changelogview')) {
                currentPage = 'changelog';
            } else if (currentPath.includes('licenseview')) {
                currentPage = 'license';
            } else if (currentPath.includes('ad')) {
                currentPage = 'ad';
            }
            console.log('NavbarLoader: Current page:', currentPage);

            // 构建URLs
            const urls = {
                homeUrl: isEnglish ? 'index.html' : 'index.html',
                communityUrl: isEnglish ? 'community.html' : 'community.html',
                videosUrl: isEnglish ? 'videos.html' : 'videos.html',
                liveUrl: isEnglish ? 'live.html' : 'live.html',
                aboutUrl: isEnglish ? 'about.html' : 'about.html',
                languageUrl: isEnglish ? '../index.html' : 'en/index.html'
            };
            console.log('NavbarLoader: URLs:', urls);

            // 构建active状态
            const activeStates = {
                homeActive: currentPage === 'home' ? 'active' : '',
                communityActive: currentPage === 'community' ? 'active' : '',
                videosActive: currentPage === 'videos' ? 'active' : '',
                liveActive: currentPage === 'live' ? 'active' : '',
                aboutActive: currentPage === 'about' ? 'active' : ''
            };
            console.log('NavbarLoader: Active states:', activeStates);

            // 合并数据
            const data = {
                ...this.navbars[language],
                ...urls,
                ...activeStates,
                logoUrl: logoUrl
            };
            console.log('NavbarLoader: Data:', data);

            // 渲染模板
            let renderedNavbar = template;
            for (const [key, value] of Object.entries(data)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                renderedNavbar = renderedNavbar.replace(regex, value);
            }
            console.log('NavbarLoader: Template rendered successfully');

            // 插入导航栏
            const navbarContainer = document.getElementById('navbar-container');
            console.log('NavbarLoader: Navbar container found:', !!navbarContainer);
            if (navbarContainer) {
                navbarContainer.innerHTML = renderedNavbar;
                console.log('NavbarLoader: Navbar inserted into container');
                
                // 设置 sticky 样式
                const navbar = navbarContainer.querySelector('nav');
                if (navbar) {
                    navbar.style.position = 'fixed';
                    navbar.style.top = '10px';
                    navbar.style.zIndex = '1030';
                    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
                    navbar.style.webkitBackdropFilter = 'blur(20px) saturate(180%)';
                    navbar.style.background = 'rgba(255, 255, 255, 0.6)';
                    navbar.style.borderRadius = '50px';
                    navbar.style.margin = '10px auto';
                    navbar.style.maxWidth = '98%';
                    navbar.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(255, 255, 255, 0.3)';
                    console.log('NavbarLoader: Sticky styles applied');
                }
            }

            // 初始化Bootstrap导航栏
            if (window.bootstrap) {
                const navbarTogglers = document.querySelectorAll('.navbar-toggler');
                navbarTogglers.forEach(toggler => {
                    new bootstrap.Collapse(toggler.getAttribute('data-bs-target'), { toggle: false });
                });
                console.log('NavbarLoader: Bootstrap navbar initialized');
            } else {
                console.log('NavbarLoader: Bootstrap not available');
            }

            if (window.themeSwitcher) {
                window.themeSwitcher.updateToggleText();
                console.log('NavbarLoader: Theme toggle icons updated');
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
}

// 当DOM加载完成后加载导航栏
document.addEventListener('DOMContentLoaded', () => {
    const navbarLoader = new NavbarLoader();
    navbarLoader.loadNavbar();
});