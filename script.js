let prevTime = 0

function gameLoop(loopTime, action) {
    const currentTime = Date.now()
    const dt = currentTime - prevTime
    prevTime = currentTime
    action(dt);

    if (!endGameLoop)
        setTimeout(() => { gameLoop(loopTime, action) }, loopTime)
}

function moveElement(element, x, y) {
    // const elementPos = getElementPosition(element)
    // positionElement(element, elementPos.x + x, elementPos.y + y)

    // console.log("x: " + elementPos.x)
    // console.log("xComputedrn: " + element.style.left)
    const style = getComputedStyle(element)
    if (x <= window.innerWidth) {
        element.style.left = parseInt(style.left) + x + "px"
    }
    if (y <= window.innerHeight) {
        element.style.top = parseInt(style.top) + y + "px"
    }
}

function positionElement(element, x, y) {
    // console.log("pos: " + x + ", " + y)
    element.style.left = x + "px"
    element.style.top = y + "px"
}
//2215550100, 2215550101 - 197358  - James

function setElementHeading(element, degrees) {
    element.style.transform = "rotate(" + degrees + "deg)"
}

function rotateElement(element, degrees) {
    setElementHeading(element, getAngle(element) + degrees)
}

// function moveShipToward(ship, x, y, speed) {
//     const degrees = Math.atan2(ship.style.left, ship.style.top, x, y)
//     const intermediatePoint = calcVector(ship.style.left, ship.style.top, speed, degrees)

//     moveElement(ship, intermediatePoint.x, intermediatePoint.y)
// }

function getElementPosition(element) {
    return { x: parseInt(element.style.left), y: parseInt(element.style.top) }
}

function getPositionAtCenter(element) {
    const offset = { x: element.clientWidth / 2, y: element.clientHeight / 2 }
        // console.log("offset: " + offset.x + ", " + offset.y)
    return { x: parseInt(element.style.left) - offset.x, y: parseInt(element.style.top) - offset.y }
}

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

function angleDiff(a, b) {
    return mod(((a - b) + 180), 360 - 180)
}

function halfToFullCircle(halfCircleDegrees) {
    return (halfCircleDegrees + 360) % 360
}

let mouseX = 0
let mouseY = 0
let endGameLoop = false

const ship1 = document.querySelector(".ship1")

const littleSound = new Audio('littleSound.mp3')


moveElement(ship1, 100, 100)
setElementHeading(ship1, mouseX, mouseY)

function calcMaxRateHeadingDelta(currentHeading, targetHeading, dt, degreesPerMili) {
    const deltaHeading = -(currentHeading - targetHeading)
    console.log("deltaHeading: " + deltaHeading)
    const maxDegreesThisLoop = degreesPerMili * dt
    const headingChange = coerceIn(-maxDegreesThisLoop, maxDegreesThisLoop, deltaHeading) //coerceIn(-5, 5, (halfToFullCircle(headingToMouse) - halfToFullCircle(getAngle(ship))) % 360)
    return headingChange
}

function updateShip(ship, target, dt) {

    const shipPos = getPositionAtCenter(ship)


    const magnitude = coerceIn(5, 13, .05 * pointDistance(shipPos.x, shipPos.y, mouseX, mouseY))

    const headingToMouse = radToDeg(-Math.atan2(target.x - shipPos.x, target.y - shipPos.y))
    const currentHeading = halfToFullCircle(getAngle(ship))

    const headingChange = calcMaxRateHeadingDelta(currentHeading, 180 + headingToMouse, dt, .09)

    const newShipPos = calcVector(0, 0, magnitude, 90 + headingToMouse)

    moveElement(ship, newShipPos.x, newShipPos.y)
    rotateElement(ship, headingChange)


    console.log("dt: " + dt)
        // console.log("delta Heading: " + deltaHeading)
        // console.log("magnitude: " + magnitude)
        // console.log("diff" + headingToMouse - prevHeading % 360)
    console.log("headingChange: " + headingChange)
    console.log("degreesToMouse: " + headingToMouse)
    console.log("current angle : " + getAngle(ship))
    console.log("newShipPos: " + newShipPos.x + ", " + newShipPos.y)
        // console.log("mouse pos: " + mouseX + ", " + mouseY)
}

gameLoop(100, (dt) => {
    updateShip(ship1, { x: mouseX, y: mouseY }, dt)
})

document.onkeydown = function(event) {

    switch (event.key) {
        // case "w":
        //     moveElement(ship, 0, -5)
        //     break;
        // case "a":
        //     moveElement(ship, -5, 0)
        //     break;
        // case "s":
        //     moveElement(ship, 0, 5)
        //     break;
        // case "d":
        //     moveElement(ship, 5, 0)
        //     break;
        case " ":
            littleSound.play();
            break;
        case "q":
            endGameLoop = true
    }
};

window.onmousemove = function(event) {
    mouseY = event.clientY
    mouseX = event.clientX
}

function getAngle(element) {
    var style = window.getComputedStyle(element, null);
    var transform = style.getPropertyValue("transform")

    // With rotate(30deg)...
    // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    // console.log('Matrix: ' + transform);

    // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

    var values = transform.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];

    var scale = Math.sqrt(a * a + b * b);

    // arc sin, convert from radians to degrees, round
    // DO NOT USE: see update below
    var sin = b / scale;
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle
}