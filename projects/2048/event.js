const keyUpEvent = function(event) {
    let arrowKeyMapper = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right',
        'ArrowDown': 'down',
    }
    let c = event.code
    if (c.startsWith('Arrow')) {
        let direction = arrowKeyMapper[c]
        play(direction)
    } else if (c === 'Space') {
        pauseGame()
    } else if (c === 'KeyR') {
        init()
    }
}

const bindEvent = function() {
    let playgroundContainer = e('.playground-container')

    // Respond to direction keys
    window.addEventListener('keyup', keyUpEvent)

    // Respond to button presses
    e('.restart').addEventListener('click', function(event) {
        init(true)
    })

    // Respond to swipe events
    let touchStartClientX
    let touchStartClientY
    playgroundContainer.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1 || event.targetTouches > 1) {
            return // Ignore if touching with more than 1 finger
        }

        touchStartClientX = event.touches[0].clientX
        touchStartClientY = event.touches[0].clientY

        event.preventDefault()
    })

    playgroundContainer.addEventListener('touchmove', function(event) {
        event.preventDefault()
    })

    playgroundContainer.addEventListener('touchend', function(event) {
        if (event.touches.length > 1 || event.targetTouches > 1) {
            return // Ignore if touching with more than 1 finger
        }

        let touchEndClientX
        let touchEndClientY

        touchEndClientX = event.changedTouches[0].clientX
        touchEndClientY = event.changedTouches[0].clientY

        let dx = touchEndClientX - touchStartClientX
        let absDx = Math.abs(dx)
        let dy = touchEndClientY - touchStartClientY
        let absDy = Math.abs(dy)

        // 0: up, 1: right, 2: down, 3: left
        let move = {
            '0': 'up',
            '1': 'right',
            '2': 'down',
            '3': 'left',
        }
        if (Math.max(absDx, absDy) > 10) {
            // (right : left) : (down : up)
            let k = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)
            let direction = move[k]
            play(direction)
        }
    })
}