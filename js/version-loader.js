// 版本号加载器
class VersionLoader {
    async loadVersion() {
        try {
            // 确定当前路径
            const currentPath = window.location.pathname;
            const isEnglish = currentPath.includes('/en/') || currentPath === '/en';
            
            // 构建正确的版本号模板路径
            let versionPath = 'components/version.html';
            if (isEnglish) {
                versionPath = '../components/version.html';
            }
            
            // 加载版本号模板
            const response = await fetch(versionPath);
            if (!response.ok) {
                throw new Error(`Failed to load version: ${response.status}`);
            }
            const template = await response.text();

            // 查找所有需要插入版本号的元素
            const versionContainers = document.querySelectorAll('.version-container');
            versionContainers.forEach(container => {
                container.innerHTML = template;
            });
        } catch (error) {
            console.error('Error loading version:', error);
        }
    }
}

// 当DOM加载完成后加载版本号
document.addEventListener('DOMContentLoaded', () => {
    const versionLoader = new VersionLoader();
    versionLoader.loadVersion();
});