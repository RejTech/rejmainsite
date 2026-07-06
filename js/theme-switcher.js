class ThemeSwitcher {
    constructor() {
        this.DAY_START = 6;
        this.NIGHT_START = 18;
        this.AUTO_MODE_KEY = 'rms_auto_dark_mode';
        this.MANUAL_MODE_KEY = 'rms_manual_dark_mode';
        this.THEME_KEY = 'rms_current_theme';
        this.autoModeEnabled = true;
        this.darkModeEnabled = false;
        this.timer = null;
        this.init();
    }

    init() {
        this.loadSettings();
        this.applyTheme();
        this.setupAutoCheck();
        this.setupEventListeners();
    }

    loadSettings() {
        const autoMode = localStorage.getItem(this.AUTO_MODE_KEY);
        const manualMode = localStorage.getItem(this.MANUAL_MODE_KEY);
        const savedTheme = localStorage.getItem(this.THEME_KEY);

        if (autoMode !== null) {
            this.autoModeEnabled = autoMode === 'true';
        }

        if (manualMode !== null) {
            this.darkModeEnabled = manualMode === 'true';
        } else if (savedTheme !== null) {
            this.darkModeEnabled = savedTheme === 'dark';
        } else {
            this.darkModeEnabled = this.shouldBeDark();
        }
    }

    getMinutesSinceMidnight() {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    shouldBeDark() {
        const minutes = this.getMinutesSinceMidnight();
        const dayStartMinutes = this.DAY_START * 60;
        const nightStartMinutes = this.NIGHT_START * 60;

        if (dayStartMinutes < nightStartMinutes) {
            return minutes >= nightStartMinutes || minutes < dayStartMinutes;
        } else {
            return minutes >= nightStartMinutes && minutes < dayStartMinutes;
        }
    }

    applyTheme() {
        if (this.darkModeEnabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem(this.THEME_KEY, this.darkModeEnabled ? 'dark' : 'light');
        this.updateToggleText();
    }

    toggleDarkMode() {
        this.darkModeEnabled = !this.darkModeEnabled;
        localStorage.setItem(this.MANUAL_MODE_KEY, this.darkModeEnabled.toString());
        this.applyTheme();
    }

    toggleAutoMode() {
        this.autoModeEnabled = !this.autoModeEnabled;
        localStorage.setItem(this.AUTO_MODE_KEY, this.autoModeEnabled.toString());

        if (this.autoModeEnabled) {
            this.darkModeEnabled = this.shouldBeDark();
            localStorage.removeItem(this.MANUAL_MODE_KEY);
            this.applyTheme();
            this.setupAutoCheck();
        } else {
            this.stopAutoCheck();
        }

        this.updateToggleText();
    }

    setupAutoCheck() {
        this.stopAutoCheck();
        if (this.autoModeEnabled) {
            this.timer = setInterval(() => {
                const shouldBeDark = this.shouldBeDark();
                if (shouldBeDark !== this.darkModeEnabled) {
                    this.darkModeEnabled = shouldBeDark;
                    localStorage.removeItem(this.MANUAL_MODE_KEY);
                    this.applyTheme();
                }
            }, 60000);
        }
    }

    stopAutoCheck() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateToggleText() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        const autoToggleBtn = document.getElementById('auto-theme-toggle-btn');
        const isEnglish = window.location.pathname.includes('/en/') || window.location.pathname === '/en';

        const lang = isEnglish ? {
            light: 'Light',
            dark: 'Dark',
            auto: 'Auto Switch',
            manual: 'Manual Switch'
        } : {
            light: '浅色',
            dark: '深色',
            auto: '自动切换',
            manual: '手动切换'
        };

        if (toggleBtn) {
            toggleBtn.textContent = this.darkModeEnabled ? lang.light : lang.dark;
        }

        if (autoToggleBtn) {
            autoToggleBtn.textContent = this.autoModeEnabled ? lang.auto : lang.manual;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle-btn')) {
                e.preventDefault();
                this.toggleDarkMode();
            }
            if (e.target.closest('#auto-theme-toggle-btn')) {
                e.preventDefault();
                this.toggleAutoMode();
            }
        });
    }

    getStatus() {
        return {
            autoModeEnabled: this.autoModeEnabled,
            darkModeEnabled: this.darkModeEnabled,
            shouldBeDark: this.shouldBeDark(),
            currentTimeMinutes: this.getMinutesSinceMidnight()
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});