/**
 * @name TokenCopier
 * @author Rio
 * @description ينسخ توكن حسابك عند الضغط على Ctrl+Shift+T
 * @version 1.0.0
 */

module.exports = class TokenCopier {
    start() {
        this.listener = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.copyToken();
            }
        };
        document.addEventListener('keydown', this.listener);
        BdApi.showToast("TokenCopier: جاهز! اضغط Ctrl+Shift+T", {type: "info"});
    }

    stop() {
        document.removeEventListener('keydown', this.listener);
    }

    copyToken() {
        try {
            let token;
            try {
                token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.getToken!==undefined).exports.getToken();
            } catch(e) {
                token = null;
            }
            if (!token) {
                BdApi.showToast("لم أستطع العثور على التوكن", {type: "error"});
                return;
            }
            if (BdApi.clipboard && BdApi.clipboard.copy) {
                BdApi.clipboard.copy(token);
            } else {
                navigator.clipboard.writeText(token);
            }
            BdApi.showToast("تم نسخ التوكن!", {type: "success"});
        } catch(err) {
            BdApi.showToast("خطأ: " + err.message, {type: "error"});
        }
    }
};
