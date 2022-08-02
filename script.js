function gameLoop(loopTime, action) {
    action();

    if (!endGameLoop)
        setTimeout(() => { gameLoop(loopTime, action) }, loopTime)
}

function moveElement(element, x, y) {
    // positionElement(element, parseInt(element.style.left), parseInt(element.style.top))

    const style = getComputedStyle(element)
    if (x <= window.innerWidth) {
        element.style.left = parseInt(style.left) + x + "px"
    }
    if (y <= window.innerHeight) {
        element.style.top = parseInt(style.top) + y + "px"
    }
}

function positionElement(element, x, y) {
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



let mouseX = 0
let mouseY = 0
let endGameLoop = false

const ship = document.querySelector(".ship1")
const style = getComputedStyle(ship)

const littleSound = new Audio('littleSound.mp3')


moveElement(ship, 100, 100)

let prevHeading = 0
const maxAngleChange = 5
gameLoop(10, () => {
    const shipPos = getElementPosition(ship)


    const magnitude = coerceIn(5, 13, .05 * pointDistance(shipPos.x, shipPos.y, mouseX, mouseY))

    const headingToMouse = 90 + radToDeg(-Math.atan2(mouseX - shipPos.x, mouseY - shipPos.y))
    const newHeading = prevHeading + coerceIn(-maxAngleChange, maxAngleChange, headingToMouse - prevHeading)
        // const newHeading = coerceIn(prevHeading - maxAngleChange, prevHeading + maxAngleChange, headingToMouse)
    prevHeading = newHeading


    const newShipPos = calcVector(shipPos.x, shipPos.y, magnitude, newHeading)

    positionElement(ship, newShipPos.x, newShipPos.y)
    setElementHeading(ship, newHeading - 225)


    // console.log("magnitude: " + magnitude)
    // console.log("diff" + headingToMouse - prevHeading % 360)
    // console.log("heading: " + newHeading)
    // console.log("degreesToMouse: " + headingToMouse)
    // console.log("newShipPos: " + newShipPos)
    // console.log("mouse pos: " + mouseX + ", " + mouseY)
})


// document.onkeydown = function(event) {
//     switch (event.key) {
//         case "w":
//             moveElement(ship, 0, -5)
//             break;
//         case "a":
//             moveElement(ship, -5, 0)
//             break;
//         case "s":
//             moveElement(ship, 0, 5)
//             break;
//         case "d":
//             moveElement(ship, 5, 0)
//             break;
//         case " ":
//             littleSound.play();
//             break;
//         case "q":
//             endGameLoop = true
//     }
// };
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