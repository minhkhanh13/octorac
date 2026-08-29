(function () {
    'use strict';

    // Bảng cấu hình Map ID
    const REDIRECT_CONFIG = {
        "210-2": "vokoo.io",
        "219-2": "lv88.name",
        "170-2": "00h19.com",
        "220-2": "bytesized.tv",
        "227-2": "jonan.cc",
        "188-2": "24hesports.com",
        "216-2": "motocascos.com.co",
        "17937-2": "24hesports.com",
        "222-3": "riobet-223.bet",
        "185-2": "789winsh.com",
        "223-3": "riobet-223.bet",
        "206-2": "hitclub8.jp.net",
        "200-2": "luck8.kitchen",
        "228-2": "espn-comactivate.us",
        "160-2": "hughesauto.us",
        "193-2": "qlaro.io",
        "208-2": "qlaro.io",
        "237-2": "bytesized.tv"
    };

    const host = window.location.hostname;
    const href = window.location.href;

    // 1. TRÊN LINKHUONGDAN.ONLINE: Tìm ID và chuyển sang Google
    if (host.includes('linkhuongdan.online')) {
        if (href.includes('?qq=complete')) return;

        const pathMatches = window.location.pathname.match(/\/([0-9a-zA-Z-]+)\/?$/);
        if (pathMatches && pathMatches[1]) {
            const pageId = pathMatches[1];
            const targetDomain = REDIRECT_CONFIG[pageId];

            if (targetDomain) {
                localStorage.setItem('TASK_PAGE_ID', pageId);
                localStorage.setItem('TASK_TARGET_DOMAIN', targetDomain);
                localStorage.setItem('TASK_STATE', 'SEARCH_GOOGLE');

                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(targetDomain)}`;
            }
        }
        return;
    }

    // 2. TRÊN GOOGLE: Tìm link chuẩn và bấm vào
    if (host.includes('google.com')) {
        if (localStorage.getItem('TASK_STATE') === 'SEARCH_GOOGLE') {
            const targetDomain = localStorage.getItem('TASK_TARGET_DOMAIN');
            const links = Array.from(document.querySelectorAll('#rso a[href]'));
            
            const matchLink = links.find(a => a.href.toLowerCase().includes(targetDomain.toLowerCase()));

            if (matchLink) {
                localStorage.setItem('TASK_STATE', 'ON_TARGET');
                window.location.href = matchLink.href;
            }
        }
        return;
    }

    // 3. TRÊN TRANG ĐÍCH: Bấm nút kích hoạt
    if (localStorage.getItem('TASK_STATE') === 'ON_TARGET') {
        const checkAndClick = setInterval(() => {
            // Tìm phần tử chứa nút theo cấu trúc trafficvip / svg-btn
            const btn = document.querySelector('[data-q][data-qq]') || 
                        document.querySelector('svg-btn') || 
                        document.querySelector('.footer-text div[class*="q-"]');

            if (btn) {
                clearInterval(checkAndClick);
                
                // Cuộn tới nút
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Bắn event Click giả lập trực tiếp
                ['mousedown', 'mouseup', 'click'].forEach(evt => {
                    btn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
                });

                // Chờ đếm ngược 60s rồi quay về hoàn thành
                const pageId = localStorage.getItem('TASK_PAGE_ID');
                setTimeout(() => {
                    localStorage.removeItem('TASK_STATE');
                    localStorage.removeItem('TASK_TARGET_DOMAIN');
                    localStorage.removeItem('TASK_PAGE_ID');
                    window.location.href = `https://linkhuongdan.online/${pageId}/?qq=complete`;
                }, 61000);
            }
        }, 1000);
    }
})();