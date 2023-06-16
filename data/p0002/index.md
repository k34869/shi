## 爱弟兄

<div id="aplayer_main1"></div>

<div id="aplayer_main2"></div>

<script src="/js/dist-view.js"></script>

<button id="lodingShi" class="waves-effect waves-light">加载诗歌</button>

<script>
lodingShi.onclick = () => {
    $.ajax({
        type: 'GET',
        url: '/data/x0116/index.md',
        success(data) {
            $(lodingShi).remove()
            MAIN.element.$mainLayout.find('.br').append(marked.parse(data))
            MAIN.tip('✅加载完成')
            new Viewer(MAIN.element.$mainLayout.find('.br')[0], { toolbar: false })
        }
    })
}

MAIN.id = 'p0002';
        
const apm1 = new APlayer({
    container: document.getElementById('aplayer_main1'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: '爱弟兄',
        artist: '私人',
        url: 'https://cdn1.tianli0.top/gh/k34869/MYZY/爱弟兄.mp3',
        cover: '/favicon'
    }]
});
const apm2 = new APlayer({
    container: document.getElementById('aplayer_main2'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: '新歌颂咏_121_爱弟兄',
        artist: '私人',
        url: 'https://gitee.com/k34869/zhuhuifu/raw/master/%E6%96%B0%E6%AD%8C%E9%A2%82%E5%92%8F_121_%E7%88%B1%E5%BC%9F%E5%85%84_07-23-08-59.aac',
        cover: '/favicon'
    }]
});
</script>