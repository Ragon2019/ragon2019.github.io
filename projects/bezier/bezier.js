// 贝塞尔曲线
class Bezier {
    // section 为一条线段上的一条贝塞尔曲线
    constructor(canvas, game, dots) {
        this.game = game
        this.dotsInCurveNumber = game.dotsInCurveNumber
        this.dotSize = game.dotSize
        this.dots = dots
        this.ctx = canvas.getContext('2d')
        this.dotsToDrawMagicLines = []
    }

    drawCurve() {
        let dots = this.dots
        let ctx = this.ctx
        let beginDot = dots[0]
        // 获取在弧线上的点
        let dotsInCurve = this.getDotsInCurve(dots, this.dotsInCurveNumber)

        ctx.lineWidth = 2
        ctx.strokeStyle = "red"

        ctx.beginPath()
        ctx.moveTo(beginDot.x, beginDot.y)
        for (let i = 0; i < dotsInCurve.length; i++) {
            let dot = dotsInCurve[i]
            // 画线
            ctx.lineTo(dot.x, dot.y)
        }
        // ctx.closePath()
        // ctx.fill()
        ctx.stroke()
    }

    drawPoints() {
        let ctx = this.ctx
        let points = this.dots
        let pointSize = this.dotSize
        ctx.fillStyle = 'grey'
        ctx.strokeStyle = "grey"
        for (let i = 0; i < points.length; i++) {
            let point = points[i]
            ctx.beginPath()
            ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI)
            if (i === 0 || i === points.length - 1) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
        }
    }

    drawPointsLines() {
        let ctx = this.ctx
        let points = this.dots
        ctx.strokeStyle = "grey"
        ctx.beginPath()
        for (let i = 0; i < points.length; i++) {
            let point = points[i]
            if (i === 0) {
                ctx.moveTo(point.x, point.y)
            } else {
                ctx.lineTo(point.x, point.y)
            }
        }
        ctx.stroke()
    }

    getLength() {
        let dots = this.dots
        let beginDot = dots[0]
        let dotsInCurve = this.getDotsInCurve(dots, this.dotsInCurveNumber)
        let curveLength = 0

        for (let i = 0; i < dotsInCurve.length; i++) {
            let dot = dotsInCurve[i]
            let lastDot
            if (i === 0) {
                lastDot = beginDot
            } else {
                lastDot = dotsInCurve[i - 1]
            }

            // 计算弧线长度
            let x = Math.abs(dot.x - lastDot.x)
            let y = Math.abs(dot.y - lastDot.y)
            curveLength += Number(Math.sqrt(x ** 2 + y ** 2).toFixed(2))
        }
        curveLength = Number(curveLength.toFixed(2))
        return curveLength
    }

    drawCurveAnimation() {
        let dots = this.dots
        let ctx = this.ctx
        let beginDot = dots[0]

        ctx.lineWidth = 2
        ctx.strokeStyle = "red"

        let dotsInCurve = this.getDotsInCurve(dots, this.dotsInCurveNumber, this.game.animationProgress)

        // 画弧线
        ctx.beginPath()
        ctx.moveTo(beginDot.x, beginDot.y)
        // 获取在弧线上的点
        let dl = Math.floor(dotsInCurve.length * this.game.animationProgress)
        for (let i = 0; i < dl; i++) {
            let dot = dotsInCurve[i]
            // 画线
            ctx.lineTo(dot.x, dot.y)
        }
        // ctx.closePath()
        // ctx.fill()
        ctx.stroke()
    }

    drawBallAnimation() {
        let dots = this.dots
        let ctx = this.ctx
        let pointSize = this.dotSize
        let dotsInCurve = this.getDotsInCurve(dots, this.dotsInCurveNumber, this.game.animationProgress)
        let dl = Math.floor(dotsInCurve.length * this.game.animationProgress)
        let dot = (dl === 0) ? dotsInCurve[0] : dotsInCurve[dl - 1]

        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, pointSize, 0, 2 * Math.PI)
        ctx.fill()
    }

    drawMagicLines() {
        let dots = this.dots
        // 有动画时，getDotsInCurve 方法中会改变 dotsToDrawMagicLines
        this.getDotsInCurve(dots, this.dotsInCurveNumber, this.game.animationProgress)

        let ctx = this.ctx
        let m = this.dotsToDrawMagicLines
        ctx.save()
        ctx.strokeStyle = 'lightGreen'
        for (let i = 0; i < m.length; i++) {
            let itemI = m[i]
            ctx.beginPath()
            for (let j = 0; j < itemI.length; j++) {
                let itemJ = itemI[j]
                if (j === 0) {
                    ctx.moveTo(itemJ.x, itemJ.y)
                } else {
                    ctx.lineTo(itemJ.x, itemJ.y)
                }
            }
            ctx.stroke()
        }
        ctx.restore()
    }

    getDotInCurve(dots, ratio, drawMagicLine) {
        let r
        let d = []
        if (dots.length >= 2) {
            for (let i = 0; i < dots.length - 1; i++) {
                let dot = dots[i]
                let nextDot = dots[i + 1]
                let x = (dot.x + ((nextDot.x - dot.x) * ratio))
                let y = (dot.y + ((nextDot.y - dot.y) * ratio))
                let o = {
                    x: Number(x.toFixed(2)),
                    y: Number(y.toFixed(2)),
                }
                d.push(o)
                //
                if (drawMagicLine && d.length !== 1) {
                    this.dotsToDrawMagicLines.push(d)
                }
            }
            r = this.getDotInCurve(d, ratio, drawMagicLine)
        } else {
            r = dots[0]
        }

        return r
    }

    // 获取所有弧线上的点
    // 有 animationProgress 时，更新 dotsToDrawMagicLines 数组
    getDotsInCurve(dots, curveDotsNum, animationProgress) {
        let r = []
        let animationRatioIndex
        if (animationProgress !== undefined) {
            animationRatioIndex = Math.floor(curveDotsNum * animationProgress) - 1
        }
        for (let i = 0; i < curveDotsNum; i++) {
            let drawMagicLine = false
            if (i === animationRatioIndex) {
                drawMagicLine = true
            }
            let ratio = Number(((i + 1) / curveDotsNum).toFixed(2))
            let d = this.getDotInCurve(dots, ratio, drawMagicLine)
            r.push(d)
        }
        return r
    }
}