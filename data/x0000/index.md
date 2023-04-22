
## 新歌颂咏001兴起

<div id="aplayer0"></div>

<div id="aplayer1"></div>

---

<img alt="0" width="100%" data-original="/data/x0000/0.png" />

---

<img alt="1" width="100%" data-original="/data/x0000/1.png" />

---

<img alt="2" width="100%" data-original="/data/x0000/2.png" />

---

<img alt="3" width="100%" data-original="/data/x0000/3.png" />

---

<p style="text-align: center">到底了...</p>

<script src="/js/dist-view.js"></script>

<script>
MAIN.id = 'x0000';
        
const ap0 = new APlayer({
    container: document.getElementById('aplayer0'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: 'X001',
        artist: '新歌颂咏',
        url: 'https://res.wx.qq.com/voice/getvoice?mediaid=Mzg2ODcwNDIzNl8yMjQ3NDgzNzYy',
        cover: '/favicon'
    }]
});
const ap1 = new APlayer({
    container: document.getElementById('aplayer1'),
    volume: 1,
    loop: 'none',
    preload: 'none',
    audio: [{
        name: 'X001领唱',
        artist: '新歌颂咏',
        url: 'https://res.wx.qq.com/voice/getvoice?mediaid=Mzg2ODcwNDIzNl8yMjQ3NDgzNzYz',
        cover: '/favicon'
    }]
});
</script>
