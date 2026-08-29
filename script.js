(function () {
    'use strict';

    console.log('[TaskEngine] 🚀 Script.js v22 đã được khởi chạy!');

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

    function injectStyle() {
        if (document.getElementById('task-pro-style')) return;
        const style = document.createElement('style');
        style.id = 'task-pro-style';
        style.innerHTML = `
            #task-pro-popup {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 2147483647 !important;
                width: 320px !important;
                background: #0f172a !important;
                color: #f8fafc !important;
                border-radius: 10px !important;
                box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important;
                font-family: Arial, sans-serif !important;
                border: 1px solid #334155 !important;
                overflow: hidden !important;
            }
            #task-pro-header {
                background: #1e293b;
                padding: 8px 12px;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #task-pro-title { font-weight: bold; font-size: 12px; color: #38bdf8; }
            .task-btn { background: #475569; color: #fff; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 11px; }
            .task-btn-danger { background: #ef4444; }
            #task-pro-body { padding: 10px; }
            #task-timer-box { background: #1e293b; border-radius: 6px; padding: 8px; text-align: center; margin-bottom: 8px; border: 1px solid #334155; }
            #task-timer-val { font-size: 22px; font-weight: bold; color: #f59e0b; font-family: monospace; }
            #task-log-box { background: #020617; border-radius: 4px; padding: 6px; font-size: 10px; color: #34d399; font-family: monospace; height: 55px; overflow-y: auto; border: 1px solid #1e293b; }
        `;
        document.head.appendChild(style);
    }

    function createPopupUI() {
        if (document.getElementById('task-pro-popup')) return;
        injectStyle();

        const popup = document.createElement('div');
        popup.id = 'task-pro-popup';
        popup.innerHTML = `
            <div id="task-pro-header">
                <span id="task-pro-title">⚡ Task Engine v22</span>
                <div>
                    <button id="pop-btn-reset" class="task-btn task-btn-danger">Reset</button>
                    <button id="pop-btn-reload" class="task-btn">🔄</button>
                </div>
            </div>
            <div id="task-pro-body">
                <div id="task-timer-box">
                    <div style="font-size: 9px; color: #94a3b8;">ĐẾM NGƯỢC</div>
                    <div id="task-timer-val">-- Giây</div>
                </div>
                <div style="margin-bottom: 6px;">
                    <div style="font-size: 9px; color: #94a3b8;">TRẠNG THÁI:</div>
                    <div id="task-status-val" style="font-size: 11px; font-weight: bold; color: #e2e8f0;">Đang khởi tạo...</div>
                </div>
                <div id="task-log-box">> Đã kết nối engine...</div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('pop-btn-reload').onclick = () => window.location.reload();
        document.getElementById('pop-btn-reset').onclick = () => {
            clearTaskMemory();
            alert('Đã dọn dẹp toàn bộ dữ liệu tạm!');
            window.location.reload();
        };
    }

    function clearTaskMemory() {
        GM_deleteValue('TASK_STATE');
        GM_deleteValue('TASK_TARGET_DOMAIN');
        GM_deleteValue('TASK_PAGE_ID');
    }

    function updateStatus(txt) {
        createPopupUI();
        const el = document.getElementById('task-status-val');
        if (el) el.innerText = txt;
        addLog(txt);
    }

    function updateTimer(txt) {
        createPopupUI();
        const el = document.getElementById('task-timer-val');
        if (el) el.innerText = txt;
    }

    function addLog(msg) {
        createPopupUI();
        const el = document.getElementById('task-log-box');
        if (el) {
            el.innerHTML += `<br>> ${msg}`;
            el.scrollTop = el.scrollHeight;
        }
    }

    function triggerCleanClick(element) {
        if (!element) return;
        try { element.click(); } catch (e) {}
        ['mousedown', 'mouseup', 'click'].forEach(evtName => {
            element.dispatchEvent(new MouseEvent(evtName, { bubbles: true, cancelable: true, view: window }));
        });
    }

    function main() {
        const host = window.location.hostname;
        const href = window.location.href;

        // A. TRÊN TRANG LINKHUONGDAN
        if (host.includes('linkhuongdan.online')) {
            // Kiểm tra xem có tham số hoàn tất không
            if (href.includes('qq=complete')) {
                updateStatus('Nhiệm vụ hoàn tất!');
                updateTimer('0 Giây');
                clearTaskMemory();
                return;
            }

            // Lấy ID bài viết từ URL chính xác
            const pathname = window.location.pathname;
            const pathMatches = pathname.match(/\/([0-9a-zA-Z-]+)\/?$/);

            if (pathMatches && pathMatches[1] && pathMatches[1] !== 'linkhuongdan.online') {
                const pageId = pathMatches[1];
                const targetDomain = REDIRECT_CONFIG[pageId];

                if (targetDomain) {
                    clearTaskMemory(); // Xóa sạch dữ liệu cũ trước khi bắt đầu nhiệm vụ mới
                    GM_setValue('TASK_PAGE_ID', pageId);
                    GM_setValue('TASK_TARGET_DOMAIN', targetDomain);
                    GM_setValue('TASK_STATE', 'SEARCH_GOOGLE');

                    updateStatus(`Nhận diện ID: ${pageId}`);
                    addLog(`Chuyển Google: ${targetDomain}`);

                    setTimeout(() => {
                        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(targetDomain)}`;
                    }, 1200);
                } else {
                    updateStatus(`Chưa map ID: ${pageId}`);
                }
            } else {
                updateStatus('Trang chủ / Chưa chọn task');
            }
            return;
        }

        // B. TRÊN GOOGLE SEARCH
        if (host.includes('google.com')) {
            if (GM_getValue('TASK_STATE') === 'SEARCH_GOOGLE') {
                const targetDomain = GM_getValue('TASK_TARGET_DOMAIN');
                if (!targetDomain) return;

                updateStatus(`Tìm web: ${targetDomain}`);

                const links = Array.from(document.querySelectorAll('#rso a[href]'));
                const matchLink = links.find(a => a.href.toLowerCase().includes(targetDomain.toLowerCase()));

                if (matchLink) {
                    GM_setValue('TASK_STATE', 'ON_TARGET');
                    addLog('Thấy link! Mở trang đích...');
                    setTimeout(() => { window.location.href = matchLink.href; }, 800);
                } else {
                    addLog('Đang tìm liên kết phù hợp...');
                }
            }
            return;
        }

        // C. TRÊN TRANG ĐÍCH
        if (GM_getValue('TASK_STATE') === 'ON_TARGET') {
            const targetDomain = GM_getValue('TASK_TARGET_DOMAIN', '');
            if (!targetDomain || !host.includes(targetDomain.replace('https://', '').replace('http://', ''))) {
                return;
            }

            updateStatus('Đang quét tìm nút lấy mã...');

            const checkInterval = setInterval(() => {
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
                    clearInterval(checkInterval);
                    updateStatus('Thấy nút! Đang bấm...');

                    setTimeout(() => {
                        triggerCleanClick(btn);
                        const subBtn = btn.querySelector('svg-btn') || btn.parentElement;
                        if (subBtn) triggerCleanClick(subBtn);

                        updateStatus('Đang đếm ngược...');
                        
                        const endTime = Date.now() + 61000;
                        const timer = setInterval(() => {
                            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
                            updateTimer(`${remaining} Giây`);

                            if (remaining <= 0) {
                                clearInterval(timer);
                                const pageId = GM_getValue('TASK_PAGE_ID');
                                clearTaskMemory();

                                updateStatus('Hoàn thành! Chuyển trang...');
                                window.location.href = `https://linkhuongdan.online/${pageId}/?qq=complete`;
                            }
                        }, 500);
                    }, 1000);
                }
            }, 800);
        }
    }

    setTimeout(main, 500);
})();
