(function () {
    'use strict';

    // 1. BẢNG CẤU HÌNH MAP ID
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

    // 2. GIAO DIỆN POPUP UI (VẼ BẢNG ĐIỀU KHIỂN)
    function createPopupUI() {
        if (document.getElementById('task-pro-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'task-pro-popup';
        popup.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999999; width: 330px; background: #0f172a; color: #f8fafc; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.8); font-family: system-ui, -apple-system, sans-serif; border: 1px solid #334155; overflow: hidden;">
                <div style="background: #1e293b; padding: 10px 14px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 13px; color: #38bdf8;">⚡ Pro Task Engine v18</span>
                    <div>
                        <button id="pop-btn-reset" style="background: #ef4444; color: #fff; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-right: 4px; font-weight: 600;">Reset</button>
                        <button id="pop-btn-reload" style="background: #475569; color: #fff; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">🔄</button>
                    </div>
                </div>

                <div style="padding: 12px;">
                    <div style="background: #1e293b; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 10px; border: 1px solid #334155;">
                        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">THỜI GIAN ĐẾM NGƯỢC</div>
                        <div id="pop-timer" style="font-size: 26px; font-weight: 800; color: #f59e0b; font-family: monospace; margin-top: 2px;">-- Giây</div>
                    </div>

                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 10px; color: #94a3b8; font-weight: 600;">TRẠNG THÁI:</div>
                        <div id="pop-status" style="font-size: 12px; font-weight: 600; color: #e2e8f0; margin-top: 2px;">Đang khởi tạo...</div>
                    </div>

                    <div id="pop-log" style="background: #020617; border-radius: 6px; padding: 8px; font-size: 11px; color: #34d399; font-family: monospace; height: 65px; overflow-y: auto; border: 1px solid #1e293b; line-height: 1.4;">
                        > Đã kết nối script từ GitHub...
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('pop-btn-reload').onclick = () => window.location.reload();
        document.getElementById('pop-btn-reset').onclick = () => {
            GM_deleteValue('TASK_STATE');
            GM_deleteValue('TASK_TARGET_DOMAIN');
            GM_deleteValue('TASK_PAGE_ID');
            alert('Đã dọn dẹp bộ nhớ tạm! Trang sẽ tải lại.');
            window.location.reload();
        };
    }

    function updateStatus(text) {
        createPopupUI();
        const st = document.getElementById('pop-status');
        if (st) st.innerText = text;
        addLog(text);
    }

    function updateTimer(text) {
        createPopupUI();
        const tm = document.getElementById('pop-timer');
        if (tm) tm.innerText = text;
    }

    function addLog(msg) {
        createPopupUI();
        const log = document.getElementById('pop-log');
        if (log) {
            log.innerHTML += `<br>> ${msg}`;
            log.scrollTop = log.scrollHeight;
        }
    }

    // NATIVE CLICK GIẢ LẬP
    function deepClick(el) {
        if (!el) return;
        ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click'].forEach(evt => {
            el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
        });
    }

    // 3. LUỒNG XỬ LÝ CHÍNH
    function run() {
        const host = window.location.hostname;
        const href = window.location.href;

        // A. LINKHUONGDAN.ONLINE
        if (host.includes('linkhuongdan.online')) {
            if (href.includes('?qq=complete')) {
                updateStatus('Nhiệm vụ hoàn thành!');
                updateTimer('0 Giây');
                return;
            }

            const pathMatches = window.location.pathname.match(/\/([0-9a-zA-Z-]+)\/?$/);
            if (pathMatches && pathMatches[1]) {
                const pageId = pathMatches[1];
                const targetDomain = REDIRECT_CONFIG[pageId];

                if (targetDomain) {
                    GM_setValue('TASK_PAGE_ID', pageId);
                    GM_setValue('TASK_TARGET_DOMAIN', targetDomain);
                    GM_setValue('TASK_STATE', 'SEARCH_GOOGLE');

                    updateStatus(`Nhận diện ID: ${pageId}`);
                    addLog(`Chuyển Google tìm: ${targetDomain}`);

                    setTimeout(() => {
                        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(targetDomain)}`;
                    }, 1000);
                } else {
                    updateStatus(`⚠️ Mã ${pageId} chưa map domain.`);
                }
            }
            return;
        }

        // B. GOOGLE SEARCH
        if (host.includes('google.com')) {
            if (GM_getValue('TASK_STATE') === 'SEARCH_GOOGLE') {
                const targetDomain = GM_getValue('TASK_TARGET_DOMAIN');
                updateStatus(`Tìm trang: ${targetDomain}`);

                const links = Array.from(document.querySelectorAll('#rso a[href]'));
                const matchLink = links.find(a => a.href.toLowerCase().includes(targetDomain.toLowerCase()));

                if (matchLink) {
                    GM_setValue('TASK_STATE', 'ON_TARGET');
                    addLog(`Thấy link! Đang bấm sang trang...`);
                    setTimeout(() => {
                        window.location.href = matchLink.href;
                    }, 800);
                } else {
                    addLog('Đang quét kết quả Google...');
                }
            }
            return;
        }

        // C. TRANG ĐÍCH (KÍCH HOẠT NÚT VÀ ĐẾM NGẦM/NỔI)
        if (GM_getValue('TASK_STATE') === 'ON_TARGET') {
            const targetDomain = GM_getValue('TASK_TARGET_DOMAIN', '');

            if (targetDomain && !host.includes(targetDomain.replace('https://', '').replace('http://', ''))) {
                return;
            }

            updateStatus('Đang tìm nút lấy mã...');

            let scrollCount = 0;
            const scrollInterval = setInterval(() => {
                window.scrollBy(0, 400);
                scrollCount++;
                if (scrollCount > 10) clearInterval(scrollInterval);
            }, 300);

            const checkAndClick = setInterval(() => {
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

                    updateStatus('Đã thấy nút! Đang bấm...');
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    setTimeout(() => {
                        deepClick(btn);
                        const subBtn = btn.querySelector('svg-btn') || btn.parentElement;
                        if (subBtn) deepClick(subBtn);

                        updateStatus('Đã bấm xong! Đang đếm ngược...');

                        // Đếm thời gian thực
                        const endTime = Date.now() + 61000;
                        const bgTimer = setInterval(() => {
                            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
                            updateTimer(`${remaining} Giây`);

                            if (remaining <= 0) {
                                clearInterval(bgTimer);
                                const pageId = GM_getValue('TASK_PAGE_ID');

                                GM_deleteValue('TASK_STATE');
                                GM_deleteValue('TASK_TARGET_DOMAIN');
                                GM_deleteValue('TASK_PAGE_ID');

                                updateStatus('Hoàn thành! Đang chuyển hướng...');
                                window.location.href = `https://linkhuongdan.online/${pageId}/?qq=complete`;
                            }
                        }, 500);
                    }, 1000);
                }
            }, 800);
        }
    }

    setTimeout(run, 1000);
})();
