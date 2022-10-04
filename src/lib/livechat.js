/* eslint-disable */

export function enableLivechat(config) {
    const data = `
window.__lc = window.__lc || {};
  window.__lc.license = ${config.liveChatLicense};
  (function () {
    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
    lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
  })();`;
  window.eval(data);
}