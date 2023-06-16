## 怜悯

<div id="aplayer_main"></div>

<script src="/js/dist-view.js"></script>

<button id="lodingShi" class="waves-effect waves-light">加载诗歌</button>

<script>
lodingShi.onclick = () => {
    $.ajax({
        type: 'GET',
        url: '/data/x0075/index.md',
        success(data) {
            $(lodingShi).remove()
            MAIN.element.$mainLayout.find('.br').append(marked.parse(data))
            MAIN.tip('✅加载完成')
            new Viewer(MAIN.element.$mainLayout.find('.br')[0], { toolbar: false })
        }
    })
}

MAIN.id = 'p0001';
        
const apm = new APlayer({
    container: document.getElementById('aplayer_main'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: '怜悯',
        artist: '私人',
        url: 'https://cdn1.tianli0.top/gh/k34869/MYZY/怜悯.mp3',
        cover: '/favicon'
    }]
});
</script>