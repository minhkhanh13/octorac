(function () {
    'use strict';

    // 1. BẢNG MÁP MÃ ID VỚI DOMAIN
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

    // GIẢ LẬP CLICK THỰC TẾ
    function deepClick(el) {
        if (!el) return;
        ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click'].forEach(evt => {
            el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
        });
    }

    // A. XỬ LÝ TẠI LINKHUONGDAN.ONLINE
    if (host.includes('linkhuongdan.online')) {
        if (href.includes('?qq=complete')) return;

        const pathMatches = window.location.pathname.match(/\/([0-9a-zA-Z-]+)\/?$/);
        if (pathMatches && pathMatches[1]) {
            const pageId = pathMatches[1];
            const targetDomain = REDIRECT_CONFIG[pageId];

            if (targetDomain) {
                GM_setValue('TASK_PAGE_ID', pageId);
                GM_setValue('TASK_TARGET_DOMAIN', targetDomain);
                GM_setValue('TASK_STATE', 'SEARCH_GOOGLE');

                console.log('[Task] Đã tìm thấy ID:', pageId, '-> Chuyển Google:', targetDomain);
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(targetDomain)}`;
            }
        }
        return;
    }

    // B. XỬ LÝ TẠI GOOGLE SEARCH
    if (host.includes('google.com')) {
        if (GM_getValue('TASK_STATE') === 'SEARCH_GOOGLE') {
            const targetDomain = GM_getValue('TASK_TARGET_DOMAIN');
            const links = Array.from(document.querySelectorAll('#rso a[href]'));
            
            const matchLink = links.find(a => a.href.toLowerCase().includes(targetDomain.toLowerCase()));

            if (matchLink) {
                GM_setValue('TASK_STATE', 'ON_TARGET');
                console.log('[Task] Đã bấm link Google:', matchLink.href);
                window.location.href = matchLink.href;
            }
        }
        return;
    }

    // C. XỬ LÝ TẠI TRANG ĐÍCH (MỞ NÚT VÀ ĐẾM NỔI/NGẦM)
    if (GM_getValue('TASK_STATE') === 'ON_TARGET') {
        const targetDomain = GM_getValue('TASK_TARGET_DOMAIN', '');
        
        if (targetDomain && !host.includes(targetDomain.replace('https://', '').replace('http://', ''))) {
            return;
        }

        // Tự động cuộn xuống trang để nạp thẻ chứa nút
        let scrollCount = 0;
        const scrollInterval = setInterval(() => {
            window.scrollBy(0, 400);
            scrollCount++;
            if (scrollCount > 10) clearInterval(scrollInterval);
        }, 300);

        const checkAndClick = setInterval(() => {
            // Nhận diện thẻ chứa trafficvip / svg-btn / data-q
            let btn = document.querySelector('[data-q][data-qq]') || 
                        document.querySelector('svg-btn') || 
                        document.querySelector('.footer-text div[class*="q-"]');

            if (!btn) {
                btn = Array.from(document.querySelectorAll('button, a, div, span')).find(el => {
                    const txt = (el.innerText || '').toLowerCase();
                    return (txt.includes('lấy mã') || txt.includes('get code') || txt.includes('nhận mã')) && el.offsetHeight > 0;
                });
            }

            if (btn) {
                clearInterval(checkAndClick);
                clearInterval(scrollInterval);
                
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    deepClick(btn);
                    const subBtn = btn.querySelector('svg-btn') || btn.parentElement;
                    if (subBtn) deepClick(subBtn);

                    console.log('[Task] Đã bấm nút! Đang đếm ngược 60 giây...');

                    // Đếm thời gian thực (Hoạt động cả khi ẩn Tab)
                    const endTime = Date.now() + 61000;
                    const bgTimer = setInterval(() => {
                        if (Date.now() >= endTime) {
                            clearInterval(bgTimer);
                            const pageId = GM_getValue('TASK_PAGE_ID');
                            
                            GM_deleteValue('TASK_STATE');
                            GM_deleteValue('TASK_TARGET_DOMAIN');
                            GM_deleteValue('TASK_PAGE_ID');

                            console.log('[Task] Hoàn tất! Quay về linkhuongdan...');
                            window.location.href = `https://linkhuongdan.online/${pageId}/?qq=complete`;
                        }
                    }, 500);
                }, 1000);
            }
        }, 800);
    }
})();
