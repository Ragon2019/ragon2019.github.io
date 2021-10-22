var enableDebugMode = function(game, enable) {
    if (!enable) {
        return
    }
    window.paused = false
    window.addEventListener('keydown', function(event) {
        var k = event.key
        if (k === 'p') {
            // 暂停功能
            window.paused = !window.paused
        }
    })
    // 控制速度
    // document.querySelector('#id-input-speed').addEventListener('input', function(event) {
    //     var input = event.target
    //     window.fps = Number(input.value)
    // })
}


var __main = function() {
    var images = {
        scoreNumber: 'files/zuma素材/images/数字英文/x.png',
        background: localStorage.getItem('backgroundImage') ? localStorage.getItem('backgroundImage') : 'files/zuma素材/images/地图/map8.jpg',

        firer_close: 'files/zuma素材/images/firer-close.png',
        firer_open: 'files/zuma素材/images/firer-open.png',

        boom_ball: 'files/zuma素材/images/boom1.png',
        boom_gameover: 'files/zuma素材/images/爆炸/boom.png',
        boom_gamestart: 'files/zuma素材/images/闪光/闪光.png',

        skeleton_skeleton: 'files/zuma素材/images/skeleton/skeleton.png',
        skeleton_hole: 'files/zuma素材/images/skeleton/hole.png',

        wall_bottom: 'files/zuma素材/images/walls/bottom.png',
        wall_left: 'files/zuma素材/images/walls/left.png',
        wall_right: 'files/zuma素材/images/walls/right.png',
        wall_top: 'files/zuma素材/images/walls/top.png',

        ball_blue: 'files/zuma素材/images/balls/blue.png',
        ball_green: 'files/zuma素材/images/balls/green.png',
        ball_purple: 'files/zuma素材/images/balls/purple.png',
        ball_red: 'files/zuma素材/images/balls/red.png',
        ball_white: 'files/zuma素材/images/balls/white.png',
        ball_yellow: 'files/zuma素材/images/balls/yellow.png',
    }
    var game = MelonGame.instance(30, images, function(g) {
        // var s = SceneTitle.new(g)
        var s = Scene.new(g)
        g.runWithScene(s)
    })

    enableDebugMode(game, true)
}

__main()