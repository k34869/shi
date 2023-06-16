(function (global) {
    if ('ontouchstart' in window) {
        document.body.addEventListener('touchstart', showEffect, false);
    }
    document.body.addEventListener('mousedown', showEffect, false);
    var TouchHandler = {
        touches: 0,
        allowEvent: function (e) {
            var allow = true;
            if (e.type === 'touchstart') {
                TouchHandler.touches += 1; //push
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                setTimeout(function () {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                allow = false;
            }
            return allow;
        },
        touchup: function (e) {
            TouchHandler.allowEvent(e);
        }
    };
    var Effect = {
        // Effect delay
        duration: 750,
        show: function (e, element) {
            // Disable right click
            if (e.button === 2) {
                return false;
            }
            var el = element || this;
            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);
            // Get click coordinate and element witdh
            var pos = offset(el);
            var relativeY = e.pageY - pos.top;
            var relativeX = e.pageX - pos.left;
            var scale = 'scale(' + el.clientWidth / 100 * 10 + ')';
            // Support for touch devices
            if ('touches' in e) {
                relativeY = e.touches[0].pageY - pos.top;
                relativeX = e.touches[0].pageX - pos.left;
            }
            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);
            // Set ripple position
            var rippleStyle = {
                'top': relativeY + 'px',
                'left': relativeX + 'px'
            };
            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');
            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale;
            rippleStyle['-moz-transform'] = scale;
            rippleStyle['-ms-transform'] = scale;
            rippleStyle['-o-transform'] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity = '1';
            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
            ripple.setAttribute('style', convertStyle(rippleStyle));
        },
        hide: function (e) {
            TouchHandler.touchup(e);
            var el = this;
            var width = el.clientWidth * 1.4;
            // Get first ripple
            var ripple = null;
            var ripples = el.getElementsByClassName('waves-ripple');
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }
            var relativeX = ripple.getAttribute('data-x');
            var relativeY = ripple.getAttribute('data-y');
            var scale = ripple.getAttribute('data-scale');
            // Get delay beetween mousedown and mouse leave
            var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
            var delay = 350 - diff;
            if (delay < 0) {
                delay = 0;
            }
            // Fade out ripple after delay
            setTimeout(function () {
                var style = {
                    'top': relativeY + 'px',
                    'left': relativeX + 'px',
                    'opacity': '0',
                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                    '-webkit-transform': scale,
                    '-moz-transform': scale,
                    '-ms-transform': scale,
                    '-o-transform': scale,
                    'transform': scale
                };
                ripple.setAttribute('style', convertStyle(style));
                setTimeout(function () {
                    try {
                        el.removeChild(ripple);
                    } catch (e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        }
    }
    function showEffect(e) {
        var element = getWavesEffectElement(e);
        if (element !== null) {
            Effect.show(e, element);
            if ('ontouchstart' in window) {
                element.addEventListener('touchend', Effect.hide, false);
                element.addEventListener('touchcancel', Effect.hide, false);
            }
            element.addEventListener('mouseup', Effect.hide, false);
            element.addEventListener('mouseleave', Effect.hide, false);
            element.addEventListener('dragend', Effect.hide, false);
        }
    };
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }
        var element = null;
        var target = e.target || e.srcElement;
        while (target.parentNode !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
                element = target;
                break;
            }
            target = target.parentNode;
        }
        return element;
    }
    function offset(elem) {
        var docElem,
            win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;
        docElem = doc.documentElement;
        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }
    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    function convertStyle(obj) {
        var style = '';
        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += a + ':' + obj[a] + ';';
            }
        }
        return style;
    }
    class Main {
        static theme = {
            dayColor: `
                :root {
                    --body-bg-color: #fef3eb;
                    --top-bg-color: #f3f3f3;
                    --top-box-shadow: .1px .2px 5px grey;
                    --top-title-color: #999;
                    --search-input-color: #555;
                    --route-a-color: #858585;
                    --route-a-hover-color: rgb(23, 23, 23);
                    --main-search-null-dscr-color: #999;
                    --under-box-shadow: 0 0 15px 0 rgb(144 164 174 / 40%);
                    --under-bg-color: #fff;
                    --under-bg-hover-color: #fff;
                    --under-link-color: #414141;
                    --bottom-bg-color: linear-gradient(125deg,#faa792,#fdb5ff,#2980b9,#c2ff8c);
                    --bottom-line-color: #383838;
                    --bottom-line-a-color: #845588;
                }
            `,
            nightColor: `
                :root {
                    --body-bg-color: #1f1c20;
                    --top-bg-color: #1f1c20;
                    --top-box-shadow: 0.1px 0.2px 5px #353136;
                    --top-title-color: #999;
                    --search-input-color: #fff;
                    --route-a-color: #fff;
                    --route-a-hover-color: #999;
                    --main-search-null-dscr-color: #fff;
                    --under-box-shadow: 0 0 15px 0 #353136;
                    --under-bg-color: #25252557;
                    --under-bg-hover-color: rgba(0,0,0,0.2);
                    --under-link-color: #fff;
                    --bottom-bg-color: linear-gradient(125deg,#11100d,#201a1a,#0f1b1f,#1f1c20);
                    --bottom-line-color: grey;
                    --bottom-line-a-color: #999;
                }
            `
        }
        static showPageButtons(page) {
            let buttons = '';
            const url = location.href.replace(/&page=[0-9\-]+/g, '')
            for (let i = 0; i < page.length; i++) {
                buttons += `<a href="${url + '&page=' + page[i][1]}" onclick="MAIN.loding()"><div class="page-item waves-effect waves-red ${main.parameter.page === page[i][1] ? 'bg' : ''}">${page[i][0]}</div></a>`
            }
            main.element.$page.append(`
                <p class="page-line">📃分页</p>
                <div class="page-nav">
                    ${buttons}
                </div>
            `)
        }
        static flag = true
        get theme() {
            return localStorage.themeColor;
        }
        set theme(value) {
            if (value === 'dayColor' || value === 'nightColor') {
                $(document.head).append(`<style>
                    ${Main.theme[value]}
                </style>`);
                localStorage.setItem('themeColor', value);
                return value;
            }
            throw Error("The value can only be 'dayColor' or 'nightColor'");
        }
        get fontSize() {
            return localStorage.fontSize;
        }
        set fontSize(value) {
            $(document.documentElement).css('font-size', value)
            localStorage.fontSize = value
        }
        constructor() {
            this.theme = localStorage.themeColor === undefined ? 'dayColor' : localStorage.themeColor;
            // URL 参数
            let parObj = {};
            let vars = window.location.search.substring(1).split('&');
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split('=');
                parObj[pair[0]] = pair[1];
            }
            vars = null; // 解除 vars 的引用，释放内存
            this.parameter = parObj;
            this.element = {
                $searchInput: $('#searchInput'),
                $mainLayout: $('#main'),
                $bottomLayout: $('body > .bottom-layout'),
                $tip: $('body > .tip'),
                $btns: $('body > .btns'),
                $page: $('body > .page')
            }
            this.element.$btns.on('click', (e) => {
                e.stopPropagation();
                switch (true) {
                    case $(e.target).hasClass('angle'):
                        this.menuEC();
                        break;
                    case $(e.target).hasClass('to-top'):
                        $('html, body').animate({
                            scrollTop: 0
                        });
                        break;
                    case $(e.target).hasClass('font-increase'):
                        this.fontER(true);
                        break;
                    case $(e.target).hasClass('font-reduction'):
                        this.fontER(false);
                        break;
                    case $(e.target).hasClass('theme-toggle'):
                        if (localStorage.themeColor === 'dayColor') {
                            this.tip('黑色主题');
                            this.theme = 'nightColor';
                        } else {
                            this.tip('白色主题');
                            this.theme = 'dayColor';
                        }
                        break;
                }
            })
            this.element.$searchInput.focus(function () {
                $(this).on('keyup', (e) => {
                    if (e.keyCode == 13) {
                        if (this.value === '') {
                            main.tip('🐦‍请输入内容...')
                            return
                        }
                        main.loding()
                        if (main.parameter.id === undefined) {
                            location.href = location.href + '?id=alls&s=' + this.value
                            return
                        }
                        location.href = location.href.replace(/&s=.+/g, '') + '&s=' + this.value
                    }
                })
            })
        }
        tip(text, reload) {
            if (text === undefined || text === '') {
                return
            }
            this.element.$tip
                .text(text)
                .css('top', '0')
            setTimeout(() => {
                this.element.$tip
                    .css('top', '')
                if (reload === 1) {
                    location.reload()
                }
            }, 1000)
        }
        fontER(stat) {
            const rootFontSize = document.documentElement.style.fontSize === '' ? '17px' : document.documentElement.style.fontSize
            const fontSize = stat ? parseInt(rootFontSize) + 1 : parseInt(rootFontSize) - 1
            if (fontSize < 6 || fontSize > 28) {
                this.tip(stat ? '已经最大了!' : '已经最小了!')
                return
            }
            this.fontSize = fontSize + 'px'
        }
        menuEC() {
            switch (true) {
                case Main.flag === true:
                    this.element.$btns.find('.any').addClass('move');
                    Main.flag = false;
                    this.element.$btns.find('.angle .fa').css('transform', 'rotateZ(180deg)');
                    document.body.onclick = (e) => {
                        this.element.$btns.find('.any').removeClass('move');
                        Main.flag = true;
                        this.element.$btns.find('.angle .fa').css('transform', '');
                        document.body.onclick = null;
                    }
                    break;
                default:
                    this.element.$btns.find('.any').removeClass('move');
                    Main.flag = true;
                    this.element.$btns.find('.angle .fa').css('transform', '');
                    break;
            }
        }
        toFav() {
            const targetEle = main.element.$mainLayout.find('.addFav .fa');
            switch (true) {
                case targetEle.hasClass('fa-star-o'):
                    this.favorites[this.id] = {
                        name: decodeURI(this.parameter.name),
                        parent: decodeURI(this.parameter.parent),
                        url: location.href
                    }
                    localStorage.favorites = JSON.stringify(this.favorites);
                    main.element.$mainLayout.find('.addFav .fa').removeClass('fa-star-o').addClass('fa-star');
                    Main.audio.play();
                    this.tip(`⭐️已收藏`);
                    break;
                default:
                    delete this.favorites[this.id];
                    localStorage.favorites = JSON.stringify(this.favorites);
                    main.element.$mainLayout.find('.addFav .fa').removeClass('fa-star').addClass('fa-star-o');
                    break;
            }
        }
        loding() {
            $(document.body).addClass('null');
            this.element.$mainLayout.addClass('show').removeClass('box').children('.loding').remove().prevObject.append('<div class="canvasBox loding"><div class="spinnerFourBox"></div></div>')
        }
    }

    const main = new Main();

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            $(document.body).removeClass('null');
            main.element.$mainLayout.addClass('box').removeClass('show').children('.loding').remove()
        }
    });
    if (main.parameter.id === 'alls') {
        // 全局搜索
        const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
        document.title = `诗歌 - ${result}`;
        $.getJSON(`/data/files.json`, (data) => {
            main.element.$searchInput[0].value = result
            let flag = 0;
            for (let i = 0; i < data.data.length; i++) {
                for (let j = 0; j < data.data[i].files.length; j++) {
                    if (data.data[i].files[j].name.indexOf(result) !== -1) {
                        const values = data.data[i].files[j].name.split(result)
                        const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                        main.element.$mainLayout.append(`<a href="/?id=${data.data[i].id}&parent=${data.data[i].name}&name=${data.data[i].files[j].name}&path=${data.data[i].files[j].path}" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light u${i}" title="${data.data[i].files[j].name}"><div class="under-img"><i class="fa fa-file-text"></i></div><div class="under-text"><p><span class="under-title">${underTitle}</span></p><p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${data.data[i].name}</p></div></div></a>`).find(`.under.u${i}`).animate({ opacity: '1' })
                        flag++
                    } else {
                        continue
                    }
                }
            }
            main.element.$mainLayout.addClass('box').children('.loding').remove()
            if (flag === 0) {
                // 搜索为空
                main.element.$mainLayout.append(`<div class="main-search-null"><img class="main-img-null" src="/images/null.png"><p class="main-search-null-dscr">搜索为空</p></div>`);
            }
        })
    } else if (main.parameter.id === 'favorites') {
        // 我的收藏
        document.title = '诗歌 - 我的收藏'
        $('.route p').append(`<span class="rep">/</span><a href="/?id=favorites" onclick="MAIN.loding()">我的收藏</a>`);
        main.favorites = localStorage.favorites === undefined ? {} : JSON.parse(localStorage.favorites)
        if (main.parameter.s === undefined) {
            main.parameter.page = main.parameter.page === undefined ? 1 : main.parameter.page
            const inPage = 32 * Number(main.parameter.page)
            let init = inPage - 32
            main.element.$mainLayout.addClass('box').children('.loding').remove()
            for (let i in main.favorites) {
                if (init === inPage) {
                    break
                }
                main.element.$mainLayout.prepend(`<a href="${main.favorites[i].url}" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light u${i}" title="${main.favorites[i].name}"><div class="under-img"><i class="fa fa-file-text"></i></div><div class="under-text"><p><span class="under-title">${main.favorites[i].name}</span></p><p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${main.favorites[i].parent}</p></div></div></a>`).find(`.under.u${i}`).animate({ opacity: '1' })
                init++
            }
        } else {
            // 搜索 - 我的收藏
            const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
            main.element.$searchInput[0].value = result
            let flag = 0;
            main.element.$mainLayout.addClass('box').children('.loding').remove()
            for (let i in main.favorites) {
                if (main.favorites[i].name.indexOf(result) !== -1) {
                    const values = main.favorites[i].name.split(result)
                    const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                    main.element.$mainLayout.prepend(`<a href="${main.favorites[i].url}" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light u${i}" title="${main.favorites[i].name}"><div class="under-img"><i class="fa fa-file-text"></i></div><div class="under-text"><p><span class="under-title">${underTitle}</span></p><p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${main.favorites[i].parent}</p></div></div></a>`).find(`.under.u${i}`).animate({ opacity: '1' })
                    flag++
                } else {
                    continue
                }
            }
            if (flag === 0) {
                // 搜索为空
                main.element.$mainLayout.append(`<div class="main-search-null"><img class="main-img-null" src="/images/null.png"><p class="main-search-null-dscr">搜索为空</p></div>`);
            }
        }
    } else if (main.parameter.id === undefined) {
        // 根目录 - Home
        $.getJSON('/data/root.json', (data) => {
            main.element.$mainLayout.addClass('box').children('.loding').remove()
            for (let i = 0; i < data.root.length; i++) {
                main.element.$mainLayout.append(`<a href="/?id=${data.root[i].id}" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light u${i}" title="${data.root[i].name}"><div class="under-img"><i class="fa fa-folder"></i></div><div class="under-text"><p><span class="under-title">${data.root[i].name}</span></p><p class="under-info">类型：目录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.root[i].length}</p></div></div></a>`).find(`.under.u${i}`).animate({ opacity: '1' })
            }
            main.element.$mainLayout.append(`<a href="https://logos-rhema.space/sg/index.htm" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light us" title="2020诗歌总汇"><div class="under-img"><i class="fa fa-file-text"></i></div><div class="under-text"><p><span class="under-title">2020诗歌总汇</span></p><p class="under-info">类型：MD文件</p></div></div></a>`).find('.under.us').animate({ opacity: '1' })
        })
    } else {
        // 二级目录内容
        if (main.parameter.name === undefined && main.parameter.path === undefined) {
            $.getJSON(`/data/${main.parameter.id}.json`, (data) => {
                document.title = `${data.name}`
                $('.route p').append(`<span class="rep">/</span><a href="/?id=${main.parameter.id}" onclick="MAIN.loding()">${data.name}</a>`)
                if (main.parameter.s === undefined || main.parameter.s === '') {
                    main.parameter.page = main.parameter.page === undefined ? data.page : main.parameter.page
                    const inPage = main.parameter.page.split('-')
                    main.element.$mainLayout.addClass('box').children('.loding').remove()
                    for (let i = inPage[0]; i < data.files.length; i++) {
                        if (i === Number(inPage[1])) {
                            break
                        }
                        main.element.$mainLayout.append(`<a href="/?id=${main.parameter.id}&parent=${data.name}&name=${data.files[i].name}&path=${data.files[i].path}" onclick="MAIN.loding()" class="under-link">
                                <div class="under waves-effect waves-light u${i}" title="${data.files[i].name}">
                                    <div class="under-img"><i class="fa fa-file-text"></i></div>
                                    <div class="under-text">
                                        <p><span class="under-title">${data.files[i].name}</span></p>
                                        <p class="under-info">类型：MD文件</p>
                                    </div>
                                </div>
                            </a>`).find(`.under.u${i}`).animate({ opacity: '1' })
                    }
                    // 分页
                    if (main.parameter.id === '00001') {
                        Main.showPageButtons([['1~50', '0-50'], ['51~100', '50-100'], ['101~150', '100-150'], ['151~200', '150-200'], ['201~250', '200-250'], ['251~300', '250-300'], ['301~350', '300-350'], ['351~400', '350-400'], ['401~450', '400-450'], ['451~500', '450-500'], ['501~550', '500-550'], ['551~600', '550-600'], ['601~650', '600-650'], ['651~700', '650-700'], ['701~786', '700-786']])
                    } else if (main.parameter.id === '00002') {
                        Main.showPageButtons([['赞美的话 1~37', '0-37'], ['灵与生命 101~150', '37-87'], ['享受基督 201~258', '87-145'], ['爱慕耶稣 301~349', '145-194'], ['追求与长进 401~470', '194-264'], ['教会的异象 501~543', '264-307'], ['建造与合一 601~629', '307-336'], ['教会的生活 701~762', '336-398'], ['事奉与福音 801~880', '398-478'], ['盼望与预备 901~930 神新约的经纶 1001~1005', '478-513']])
                    } else if (main.parameter.id === '00003') {
                        Main.showPageButtons([['1~50', '0-50'], ['51-100', '50-100'], ['101~150', '100-152'], ['151~180', '152-183']])
                    } else if (main.parameter.id === '00004') {
                        Main.showPageButtons([['新路实行 1~39', '0-39'], ['福音喜信 40~73', '39-72'], ['生命与灵 74~109', '72-108'], ['召会生活 110~130', '108-129'], ['新耶路撒冷专辑 131~142', '129-140'], ['新诗歌 143~167', '140-164']])
                    }
                } else {
                    // 搜索 - 二级目录
                    const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
                    main.element.$searchInput[0].value = result
                    let flag = 0;
                    main.element.$mainLayout.addClass('box').children('.loding').remove()
                    for (let i = 0; i < data.files.length; i++) {
                        if (data.files[i].name.indexOf(result) !== -1) {
                            const values = data.files[i].name.split(result)
                            const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                            main.element.$mainLayout.append(`<a href="/?id=${main.parameter.id}&parent=${data.name}&name=${data.files[i].name}&path=${data.files[i].path}" onclick="MAIN.loding()" class="under-link"><div class="under waves-effect waves-light u${i}" title="${data.files[i].name}"><div class="under-img"><i class="fa fa-file-text"></i></div><div class="under-text"><p><span class="under-title">${underTitle}</span></p><p class="under-info">类型：MD文件</p></div></div></a>`).find(`.under.u${i}`).animate({ opacity: '1' })
                            flag++
                        } else {
                            continue
                        }
                    }
                    if (flag === 0) {
                        // 搜索为空
                        main.element.$mainLayout.append(`<div class="main-search-null"><img class="main-img-null" src="/images/null.png"><p class="main-search-null-dscr">搜索为空</p></div>`);
                    }
                }
            })
        } else {
            // 加载文件内容
            $.ajax({
                type: 'GET',
                url: `${main.parameter.path}`,
                success(data) {
                    document.title = `${decodeURI(main.parameter.parent)} - ${decodeURI(main.parameter.name)}`
                    $('.route p').append(`<span class="rep">/</span><a href="/?id=${main.parameter.id}" onclick="MAIN.loding()">${decodeURI(main.parameter.parent)}</a><span class="rep">/</span><a href="/?id=${main.parameter.id}&parent=${main.parameter.parent}&name=${main.parameter.name}&path=${main.parameter.path}" onclick="MAIN.loding()">${decodeURI(main.parameter.name)}</a>`)
                    main.element.$mainLayout.addClass('box').html(`<div class="addFav"><i class="fa fa-star-o"></i></div><div class="br">${marked.parse(data)}</div>`).find('.br').animate({ opacity: '1' })
                    new Viewer(main.element.$mainLayout[0], { toolbar: false })
                    main.element.$searchInput
                        .attr('onfocus', 'this.blur()')
                        .css('opacity', '0.4')
                    Main.audio = new Audio('/data/dS.mp3')
                    main.favorites = localStorage.favorites === undefined ? {} : JSON.parse(localStorage.favorites)
                    if (main.favorites[main.id] !== undefined) {
                        main.element.$mainLayout
                            .find('.addFav .fa')
                            .removeClass('fa-star-o')
                            .addClass('fa-star')
                    }
                    main.element.$mainLayout.find('.addFav').on('click', () => {
                        main.toFav()
                    })
                }
            })
        }
    }
    main.fontSize = localStorage.fontSize === undefined ? '17px' : localStorage.fontSize
    global.MAIN = main;
})(window)