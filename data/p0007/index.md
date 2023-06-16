## 把握着每个今天

<div id="aplayer_main1"></div>

<div id="aplayer_main2"></div>

<script src="/js/dist-view.js"></script>

<button id="lodingShi" class="waves-effect waves-light">加载诗歌</button>

<script>
lodingShi.onclick = () => {
    $.ajax({
        type: 'GET',
        url: '/data/x0022/index.md',
        success(data) {
            $(lodingShi).remove()
            MAIN.element.$mainLayout.find('.br').append(marked.parse(data))
            MAIN.tip('✅加载完成')
            new Viewer(MAIN.element.$mainLayout.find('.br')[0], { toolbar: false })
        }
    })
}

MAIN.id = 'p0007';

const apm1 = new APlayer({
    container: document.getElementById('aplayer_main1'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: '把握着每个今天(上段)',
        artist: '私人',
        url: 'https://cdn1.tianli0.top/gh/k34869/MYZY/新歌颂咏_24_把握着每个今天(上段).mp3',
        cover: '/favicon'
    }]
});
const apm2 = new APlayer({
    container: document.getElementById('aplayer_main2'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: '把握着每个今天(下段)',
        artist: '私人',
        url: 'https://cdn1.tianli0.top/gh/k34869/MYZY/新歌颂咏_24_把握着每个今天(下段).mp3',
        cover: '/favicon'
    }]
});
</script>