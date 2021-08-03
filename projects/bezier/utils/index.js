const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)

const es = (selector) => document.querySelectorAll(selector)

const dc = (tag) => document.createElement(tag)

const debounce = (func, wait) => {
    let timer
    console.log('debounce')
    return function() {
        clearTimeout(timer)
        timer = setTimeout(func.bind(this, ...arguments), wait)
    }
}

/*
    [
        {
            "sections": [
                {
                    "data": [
                        {
                            "x": 217,
                            "y": 349
                        },
                        {
                            "x": 40,
                            "y": 106
                        }
                    ]
                },
                {
                    "data": [
                        {
                            "x": 40,
                            "y": 106
                        },
                        {
                            "x": 224,
                            "y": 146
                        }
                    ]
                }
            ]
        }
    ]
    */
const getMirrorData = function(data, x, y) {
    let r = JSON.parse(JSON.stringify(data))
    r.forEach(line => {
        let sections = line.sections
        sections.forEach(section => {
            let data = section.data
            data.forEach(item => {
                if (x) {
                    item.x = x - item.x + x
                }
                if (y) {
                    item.y = y - item.y + y
                }
            })
        })
    })
    return r
}

// 清空画布
const clearCanvas = function(canvas) {
    const ctx = canvas.getContext('2d')
    const canvasSize = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
    }
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
}

// 点是否在矩形中
const isDotInRect = function(dotX, dotY, rectX, rectY, rectWidth, rectHeight) {
    let conditionX = rectX < dotX && dotX < (rectX + rectWidth)
    let conditionY = rectY < dotY && dotY < (rectY + rectHeight)
    let r = conditionX && conditionY
    return r
}

const distanceBetweenTwoDots = function(dot1, dot2) {
    let x = Math.abs(dot1.x - dot2.x)
    let y = Math.abs(dot1.y - dot2.y)
    let r = Number(Math.sqrt(x ** 2 + y ** 2).toFixed(2))
    return r
}

const midPointBetweenTwoDots = function(dot1, dot2) {
    let x = (dot1.x + dot2.x) / 2
    let y = (dot1.y + dot2.y) / 2
    let r = {
        x,
        y,
    }
    return r
}