(function (global) {
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
        static showBottomInfo() {
            $('.bottom-layout').remove();
            $(document.body).append(`<div class="bottom-layout">
                <p class="bottom-line">
                    本站没有任何商业用途，本站部分资源来自互联网
                    <br>若本站的资源侵犯了您的权益，请一定告诉我，我会及时删除
                    <br>联系邮箱：1838576587@qq.com
                </p>
            </div>`);
        }
        static showPageButtons(page) {
            let buttons = '';
            const url = location.href.replace(/&page=[0-9\-]+/g, '')
            for (let i = 0; i < page.length; i++) {
                buttons += `<a href="${url + '&page=' + page[i][1]}"><div class="page-item ${main.parameter.page === page[i][1] ? 'bg' : ''}">${page[i][0]}</div></a>`
            }
            main.element.$mainLayout.append(`
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
            this.fontSize = localStorage.fontSize;
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
                $btns: $('body > .btns')
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
                    document.body.onclick = () => {
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
    }

    const main = new Main();
    if (main.parameter.id === 'alls') {
        $.getJSON(`/data/files.json`, (data) => {
            const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
            main.element.$searchInput[0].value = result
            let flag = 0;
            for (let i = 0; i < data.data.length; i++) {
                for (let j = 0; j < data.data[i].files.length; j++) {
                    if (data.data[i].files[j].name.indexOf(result) !== -1) {
                        const values = data.data[i].files[j].name.split(result)
                        const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                        main.element.$mainLayout.append(`<a href="/?id=${data.data[i].id}&parent=${data.data[i].name}&name=${data.data[i].files[j].name}&path=${data.data[i].files[j].path}" class="under-link">
                                <div class="under" title="${data.data[i].files[j].name}">
                                    <div class="under-img"><i class="fa fa-file-text"></i></div>
                                    <div class="under-text">
                                        <p><span class="under-title">${underTitle}</span></p>
                                        <p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${data.data[i].name}</p>
                                    </div>
                                </div>
                            </a>`)
                        flag++
                    } else {
                        continue
                    }
                }
            }
            main.element.$mainLayout.children('.loding').remove()
            if (flag === 0) {
                main.element.$mainLayout.append(`
                    <div class="main-search-null">
                        <img class="main-img-null" src="/images/null.png">
                        <p class="main-search-null-dscr">搜索为空</p>
                    </div>
                `);
            }
        })
    } else if (main.parameter.id === 'favorites') {
        $('.route p').append(`<span class="rep">/</span><a href="/?id=favorites">我的收藏</a>`);
        main.favorites = localStorage.favorites === undefined ? {} : JSON.parse(localStorage.favorites)
        if (main.parameter.s === undefined) {
            main.parameter.page = main.parameter.page === undefined ? 1 : main.parameter.page
            const inPage = 32 * Number(main.parameter.page)
            let init = inPage - 32
            main.element.$mainLayout.children('.loding').remove()
            for (i in main.favorites) {
                if (init === inPage) {
                    break
                }
                main.element.$mainLayout.append(`<a href="${main.favorites[i].url}" class="under-link">
                    <div class="under" title="${main.favorites[i].name}">
                        <div class="under-img"><i class="fa fa-file-text"></i></div>
                        <div class="under-text">
                            <p><span class="under-title">${main.favorites[i].name}</span></p>
                            <p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${main.favorites[i].parent}</p>
                        </div>
                    </div>
                </a>`)
                init++
            }
        } else {
            const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
            main.element.$searchInput[0].value = result
            let flag = 0;
            main.element.$mainLayout.children('.loding').remove()
            for (i in main.favorites) {
                if (main.favorites[i].name.indexOf(result) !== -1) {
                    const values = main.favorites[i].name.split(result)
                    const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                    main.element.$mainLayout.append(`<a href="${main.favorites[i].url}" class="under-link">
                        <div class="under" title="${main.favorites[i].name}">
                            <div class="under-img"><i class="fa fa-file-text"></i></div>
                            <div class="under-text">
                                <p><span class="under-title">${underTitle}</span></p>
                                <p class="under-info">类型：MD文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来自：${main.favorites[i].parent}</p>
                            </div>
                        </div>
                    </a>`)
                    flag++
                } else {
                    continue
                }
            }
            if (flag === 0) {
                main.element.$mainLayout.append(`
                    <div class="main-search-null">
                        <img class="main-img-null" src="/images/null.png">
                        <p class="main-search-null-dscr">搜索为空</p>
                    </div>
                `);
            }
        }
    } else if (main.parameter.id === undefined) {
        $.ajax({
            type: 'GET',
            url: '/data/root.json',
            success(data) {
                main.element.$mainLayout.children('.loding').remove()
                for (let i = 0; i < data.root.length; i++) {
                    main.element.$mainLayout.append(`<a href="/?id=${data.root[i].id}" class="under-link">
                        <div class="under" title="${data.root[i].name}">
                            <div class="under-img"><i class="fa fa-folder"></i></div>
                            <div class="under-text">
                                <p><span class="under-title">${data.root[i].name}</span></p>
                                <p class="under-info">类型：目录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.root[i].length}</p>
                            </div>
                        </div>
                    </a>`)
                }
                Main.showBottomInfo()
            }
        })
    } else {
        if (main.parameter.name === undefined && main.parameter.path === undefined) {
            $.getJSON(`/data/${main.parameter.id}.json`, (data) => {
                console.log(data);
                $('.route p').append(`<span class="rep">/</span><a href="/?id=${main.parameter.id}">${data.name}</a>`)
                if (main.parameter.s === undefined || main.parameter.s === '') {
                    main.parameter.page = main.parameter.page === undefined ? data.page : main.parameter.page
                    const inPage = main.parameter.page.split('-')
                    main.element.$mainLayout.children('.loding').remove()
                    for (let i = inPage[0]; i < data.files.length; i++) {
                        if (i === Number(inPage[1])) {
                            break
                        }
                        main.element.$mainLayout.append(`<a href="/?id=${main.parameter.id}&parent=${data.name}&name=${data.files[i].name}&path=${data.files[i].path}" class="under-link">
                                <div class="under" title="${data.files[i].name}">
                                    <div class="under-img"><i class="fa fa-file-text"></i></div>
                                    <div class="under-text">
                                        <p><span class="under-title">${data.files[i].name}</span></p>
                                        <p class="under-info">类型：MD文件</p>
                                    </div>
                                </div>
                            </a>`)
                    }
                    if (main.parameter.id === '00001') {
                        Main.showPageButtons([['1~50', '0-50'], ['51~100', '50-100'], ['101~150', '100-150'], ['151~200', '150-200'], ['201~250', '200-250'], ['251~300', '250-300'], ['301~350', '300-350'], ['351~400', '350-400'], ['401~450', '400-450'], ['451~500', '450-500'], ['501~550', '500-550'], ['551~600', '550-600'], ['601~650', '600-650'], ['651~700', '650-700'], ['701~786', '700-786']])
                    } else if (main.parameter.id === '00002') {
                        Main.showPageButtons([['赞美的话 1~37', '0-37'], ['灵与生命 101~150', '37-87'], ['享受基督 201~258', '87-145'], ['爱慕耶稣 301~349', '145-194'], ['追求与长进 401~470', '194-264'], ['教会的异象 501~543', '264-307'], ['建造与合一 601~629', '307-336'], ['教会的生活 701~762', '336-398'], ['事奉与福音 801~880', '398-478'], ['盼望与预备 901~930 神新约的经纶 1001~1005', '478-513']])
                    } else if (main.parameter.id === '00003') {
                        Main.showPageButtons([['1~50', '0-50'], ['51-100', '50-100'], ['101~150', '100-152'], ['151~180', '152-183']])
                    } else if (main.parameter.id === '00004') {
                        Main.showPageButtons([['新路实行 1~39', '0-39'], ['福音喜信 40~73', '39-72'], ['生命与灵 74~109', '72-108'], ['召会生活 110~130', '108-129'], ['新耶路撒冷专辑 131~142', '129-140'], ['新诗歌 143~167', '140-164']])
                    }
                    Main.showBottomInfo()
                } else {
                    const result = decodeURI(main.parameter.s).replace(/\+/g, ' ')
                    main.element.$searchInput[0].value = result
                    let flag = 0;
                    main.element.$mainLayout.children('.loding').remove()
                    for (let i = 0; i < data.files.length; i++) {
                        if (data.files[i].name.indexOf(result) !== -1) {
                            const values = data.files[i].name.split(result)
                            const underTitle = values.join('<b style="color: #e46d8f;">' + result + '</b>');
                            main.element.$mainLayout.append(`<a href="/?id=${main.parameter.id}&parent=${data.name}&name=${data.files[i].name}&path=${data.files[i].path}" class="under-link">
                                    <div class="under" title="${data.files[i].name}">
                                        <div class="under-img"><i class="fa fa-file-text"></i></div>
                                        <div class="under-text">
                                            <p><span class="under-title">${underTitle}</span></p>
                                            <p class="under-info">类型：MD文件</p>
                                        </div>
                                    </div>
                                </a>`)
                            flag++
                        } else {
                            continue
                        }
                    }
                    if (flag === 0) {
                        main.element.$mainLayout.append(`
                            <div class="main-search-null">
                                <img class="main-img-null" src="/images/null.png">
                                <p class="main-search-null-dscr">搜索为空</p>
                            </div>
                        `);
                    }
                }
            })
        } else {
            $.ajax({
                type: 'GET',
                url: `${main.parameter.path}`,
                success(data) {
                    $('.route p').append(`<span class="rep">/</span><a href="/?id=${main.parameter.id}">${decodeURI(main.parameter.parent)}</a><span class="rep">/</span><a href="/?id=${main.parameter.id}&parent=${main.parameter.parent}&name=${main.parameter.name}&path=${main.parameter.path}">${decodeURI(main.parameter.name)}</a>`)
                    main.element.$mainLayout.html(`<div class="addFav"><i class="fa fa-star-o"></i></div><div class="br">${marked.parse(data)}</div>`)
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
                    Main.showBottomInfo()
                }
            })
        }
    }

    global.MAIN = main;
})(window)