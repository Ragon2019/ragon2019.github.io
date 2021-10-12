// canvas 上绑定的事件
const canvasEvent = function(game) {
    const canvas = e(`#${game.topCanvasID}`)
    const ctx = canvas.getContext('2d')
    let mousedown = false
    let targetDot = null
    let haveTarget = false
    let dotSize = game.dotSize

    canvas.addEventListener('mousedown', event => {
        mousedown = true
        let mouseX = event.offsetX
        let mouseY = event.offsetY

        // 鼠标在按钮位置，返回
        let isOnButton = clickedButton(game, mouseX, mouseY)
        if (isOnButton) {
            return
        }

        // 查看是否点击现有 dot
        let lines = game.lines
        for (let i = lines.length - 1; i >= 0; i--) {
            let line = lines[i]
            let sections = line.sections
            for (let j = sections.length - 1; j >= 0; j--) {
                let section = sections[j]
                let dots = section.data
                for (let z = dots.length - 1; z >= 0; z--) {
                    let dot = dots[z]
                    if ((dot.x - dotSize < mouseX && mouseX < dot.x + dotSize) && (dot.y - dotSize < mouseY && mouseY < dot.y + dotSize)) {
                        haveTarget = true
                        targetDot = targetDot === null ? [] : targetDot
                        targetDot.push(dot)
                    }
                }
            }
        }

        // 没有点击现有 dot，创建新 dot
        let lastLine = lines[lines.length - 1]
        let sections = lastLine.sections
        let lastSection = sections[sections.length - 1]
        let lastDot = lastSection.data[lastSection.data.length - 1]
        if (haveTarget === false) {
            // 加新线 / 加新片段 / 加新点
            if (game.newLine) {
                let line = {
                    sections: [
                        {
                            data: [
                                {
                                    x: mouseX,
                                    y: mouseY,
                                }
                            ],
                        },
                    ],
                }
                game.lines.push(line)
            } else if (game.newSection) {
                let newSection = {
                    data: [
                        {
                            x: lastDot.x,
                            y: lastDot.y,
                        },
                        {
                            x: mouseX,
                            y: mouseY,
                        },
                    ],
                }
                sections.push(newSection)
            } else {
                lastSection.data.push({
                    x: mouseX,
                    y: mouseY,
                })
            }
            // 重置新建操作
            game.newLine = false
            game.newSection = false
            updateDom(game)
            // 画图
            drawAll(game)
        }
    })

    canvas.addEventListener('mousemove', event => {
        let mouseX = event.offsetX
        let mouseY = event.offsetY

        game.mouseX = mouseX
        game.mouseY = mouseY
        // 鼠标在按钮位置，不更新 dot 坐标
        let isOnButton = clickedButton(game, mouseX, mouseY)
        if (mousedown && haveTarget && !isOnButton) {
            targetDot.forEach(dot => {
                dot.x = mouseX
                dot.y = mouseY
                drawAll(game)
            })
        }

        // 画 cursor
        drawCursor(game)
    })

    canvas.addEventListener('mouseup', event => {
        mousedown = false
        targetDot = null
        haveTarget = false
    })

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault()
        // 删除 dot
        let mouseX = event.offsetX
        let mouseY = event.offsetY

        let lines = game.lines
        for (let i = lines.length - 1; i >= 0; i--) {
            let line = lines[i]
            let sections = line.sections
            for (let j = sections.length - 1; j >= 0; j--) {
                let section = sections[j]
                let dots = section.data
                for (let z = dots.length - 1; z >= 0; z--) {
                    let dot = dots[z]
                    if ((dot.x - dotSize < mouseX && mouseX < dot.x + dotSize) && (dot.y - dotSize < mouseY && mouseY < dot.y + dotSize)) {
                        dots.splice(z, 1)
                    }
                }
            }
        }
        drawAll(game)
    })
}
// 清空
const clearAllEvent = function(game) {
    const button = e('#button-clearall')
    button.addEventListener('click', event => {
        game.newLine = false
        game.newSection = false
        game.lines = [
            {
                sections: [
                    {
                        data: [],
                    },
                ],
            },
        ]
        // 清空数据后需要重新给 canvas 绑定事件（原因是：原有 canvas 事件函数中拿到的 lines 数据还是未清空的）
        init(game)
    })
}
// 动画
const animationStart = function(game, config) {
    game.animationProgress = 0
    clearTimeout(game.animationTimer)
    clearTimeout(game.speedBallTimer)
    game.animationSettings = config
    drawAll(game, {
        animation: true,
    })
}
const animationEvent = function(game) {
    const button = e('#button-animation')
    const buttonBallDot = e('#button-animation-ball-dot')
    const buttonBallSpeed = e('#button-animation-ball-speed')
    button.addEventListener('click', event => {
        animationStart(game, {
            backgroundLine: false,
            line: true,
            magicLine: true,
            pointsLine: true,
            ball: false,
            points: true,
        })
    })
    buttonBallDot.addEventListener('click', event => {
        animationStart(game, {
            backgroundLine: true,
            line: false,
            magicLine: false,
            pointsLine: false,
            ball: true,
            points: false,
        })
    })
    buttonBallSpeed.addEventListener('click', event => {
        clearTimeout(game.animationTimer)
        clearTimeout(game.speedBallTimer)
        drawAll(game, {
            speedBall: true,
        })
        // animationStart(game, {
        //     backgroundLine: false,
        //     line: true,
        //     magicLine: false,
        //     pointsLine: false,
        //     ball: false,
        //     points: false,
        // })
    })
}
//
const getLinesDataEvent = function(game) {
    const button = e('#button-getLinesData')
    button.addEventListener('click', event => {
        let d = JSON.stringify(game.lines, null, 4)
        log('linesData is-', d)
    })
}
//
const revokeEvent = function(game) {
    const button = e('.revoke')
    button.addEventListener('click', e => {
    })
}
// 画图设置相关事件
const operationContainerEvent = function(game) {
    // click
    e('.operation-container').addEventListener('click', event => {
        let t = event.target
        if (t.id === 'newSection') {
            game.newSection = !game.newSection
            game.newLine = false
            log('newSection')
        } else if (t.id === 'newLine') {
            game.newSection = false
            game.newLine = !game.newLine
            log('newLine')
        }
        updateDom(game)
    })
}
const gameSetEvent = function(game) {
    let keyMap = {
        'l': 'newLine',
        's': 'newSection',
    }
    // keydown
    document.addEventListener('keydown', event => {
        let action = keyMap[event.key]
        log('keydown-event.key', event.key)
        if (action === 'newSection') {
            game.newSection = !game.newSection
            game.newLine = false
            log('newSection')
        } else if (action === 'newLine') {
            game.newSection = false
            game.newLine = !game.newLine
            log('newLine')
        }
        updateDom(game)
    })
}
// resize
const resizeEvent = function(game) {
    if (game.resizeEvent !== undefined) {
        window.removeEventListener('resize', game.resizeEvent)
    }
    game.resizeEvent = _.debounce(function(event) {
        init(game)
    }, 300).bind(this)
    window.addEventListener('resize', game.resizeEvent)
}

const clickedButton = function(game, dotX, dotY) {
    let buttonsID = game.buttonsID
    for (let i = 0; i < buttonsID.length; i++) {
        let buttonID = buttonsID[i]
        let button = e(`#${buttonID}`)
        let x = button.offsetLeft
        let y = button.offsetTop
        let width = button.offsetWidth
        let height = button.offsetHeight
        let clicked = isDotInRect(dotX, dotY, x, y, width, height)
        if (clicked) {
            return button
        }
    }
    return false
}

const canvasButtonClickEvent = function(game) {
    let id = game.topCanvasID
    let canvas = e(`#${id}`)

    canvas.addEventListener('click', event => {
        let mouseX = event.offsetX
        let mouseY = event.offsetY

        let button = clickedButton(game, mouseX, mouseY)
        if (button !== false) {
            button.click()
        }
    })
}