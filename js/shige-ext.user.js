// ==UserScript==
// @name         shige-ext-js
// @namespace    http://tampermonkey.net/
// @version      0.2.9.2
// @description  shi.timeic.top ext
// @author       Timeic
// @license      GPL-3.0 License
// @run-at       document-body
// @match        https://shi.timeic.top/*
// ==/UserScript==

(function () {
    'use strict';
    if (location.search === '') {
        $('body > #main').prepend((localStorage.private === 'true' ? `<a href="/?id=65061" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light us" title="私人文件"><div class="under-img"><i class="fa fa-folder"></i></div><div class="under-text"><p><span class="under-title">私人文件</span></p><p class="under-info">类型：目录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ...</p></div></div></a>` : '')).find('.under.us').animate({ opacity: '1' })
    }
})()