const mod = (a, n) => a - Math.floor(a / n) * n

function degToRad(degrees) {
    return degrees / 180 * Math.PI
}

function radToDeg(radians) {
    return radians * 180 / Math.PI
}

function calcVector(x, y, magnitude, degrees) {
    const newX = (magnitude * Math.cos(degToRad(degrees))) + x
    const newY = (magnitude * Math.sin(degToRad(degrees))) + y
    return { x: newX, y: newY }
}

function coerceIn(min, max, value) {
    return Math.max(min, Math.min(max, value))
}

function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function wrapAngle(degrees) {
    return degrees % 360
}

function getSign(number) {
    return number / Math.abs(number)
}

function isPositive(number) {
    return number > 0
}

function flipAngle(value) {
    return mod((value + 180), 360)
}

function fullToHalf(fullDegree) {
    if (fullDegree <= 180) {
        return fullDegree
    } else {
        return -(360 - fullDegree)
    }
}

function halfToFullCircle(halfCircleDegrees) {
    return (halfCircleDegrees + 360) % 360
}