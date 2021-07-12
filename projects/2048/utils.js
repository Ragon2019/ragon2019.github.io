const log = console.log.bind(console)

const e = (selector) => {
    return document.querySelector(selector)
}

const ea = (selector) => {
    return document.querySelectorAll(selector)
}

const positionClass = (position) => {
    return `cell-position-${ position.y + 1 }-${ position.x + 1 }`
}