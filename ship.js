function createElement(type) {
    const newElement = document.createElement(type)
    document.body.appendChild(newElement)
    return newElement
}

function createImage(src) {
    const newElement = createElement("img")
    newElement.src = src
    return newElement
}

// requires an initial rotate()-tion
function getAngle(element) {
    var style = window.getComputedStyle(element, null);
    var transform = style.getPropertyValue("transform")

    // With rotate(30deg)
    var values = transform.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];

    var scale = Math.sqrt(a * a + b * b);

    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle
}

function moveElement(element, x, y) {
    // const elementPos = getElementPosition(element)
    // positionElement(element, elementPos.x + x, elementPos.y + y)

    // console.log("x: " + parseInt(element.style.left))
    // console.log("xComputedrn: " + element.style.left)
    const style = getComputedStyle(element)
        // if (x <= window.innerWidth) {
    element.style.left = parseInt(style.left) + x + "px"
        // }
        // if (y <= window.innerHeight) {
    element.style.top = parseInt(style.top) + y + "px"
        // }
}

function positionElement(element, x, y) {
    // console.log("pos: " + x + ", " + y)
    element.style.left = x + "px"
    element.style.top = y + "px"
}
//2215550100, 2215550101 - 197358  - James

function setElementHeading(element, degrees) {
    if (degrees < 1 && degrees > -1) {
        console.log("Trying to set rotation to 0")
        element.style.transform = "rotate(1deg)"
    } else {
        element.style.transform = "rotate(" + degrees + "deg)"
    }
}

function rotateElement(element, degrees) {
    setElementHeading(element, getAngle(element) + degrees)
}

function getElementPosition(element) {
    return { x: parseInt(element.style.left), y: parseInt(element.style.top) }
}

function getPositionAtCenter(element) {
    const offset = { x: element.clientWidth / 2, y: element.clientHeight / 2 }
    const position = getElementPosition(element)
    return { x: position.x + offset.x, y: position.y + offset.y }
}


function smallestHeadingChange(currentHeading, headingToMouse) {

    const absCurrentHeading = Math.abs(currentHeading)
    const absHeadingToMouse = Math.abs(headingToMouse)


    // console.log("degreesToMouse: " + headingToMouse)
    // console.log("current angle : " + currentHeading)

    // # 1 & 2
    if (getSign(currentHeading) != getSign(headingToMouse)) {
        if ((Math.abs(currentHeading) + Math.abs(headingToMouse)) < (360 - absCurrentHeading - absHeadingToMouse)) {
            // #1
            // console.log("#1")

            return -getSign(currentHeading) * (Math.abs(currentHeading) + Math.abs(headingToMouse))
        } else {
            // #2
            // console.log("#2")

            return getSign(currentHeading) * (360 - absCurrentHeading - absHeadingToMouse)
        }
    }
    // #3
    if (getSign(currentHeading) == getSign(headingToMouse) && absCurrentHeading < absHeadingToMouse) {
        // console.log("#3")

        return headingToMouse - currentHeading
    }
    // #4
    if (getSign(currentHeading) == getSign(headingToMouse) && absCurrentHeading > absHeadingToMouse) {
        // console.log("#4")

        return -(currentHeading - headingToMouse)
    }
    // #5
    if (absCurrentHeading == absHeadingToMouse)
        return 0

}

function flipAngle(value) {
    return mod((value + 180), 360)
}


function shipPersue(ship, target, dt) {
    const shipPos = getPositionAtCenter(ship)

    const pxPerMili = { min: 0.2, max: 1.3 }
    const magnitude = coerceIn(pxPerMili.min * dt, pxPerMili.max * dt, .07 * pointDistance(shipPos.x, shipPos.y, target.x, target.y))

    const maxDegreePerMili = 0.2
    const headingToMouse = fullToHalf(flipAngle(radToDeg(-Math.atan2(target.x - shipPos.x, target.y - shipPos.y))))
    const currentHeading = getAngle(ship)
    const anglePerThisCycle = maxDegreePerMili * dt
    const headingChange = coerceIn(-anglePerThisCycle, anglePerThisCycle, smallestHeadingChange(currentHeading, headingToMouse))

    const shipPosAng = currentHeading + headingChange - 90
    const newShipPos = calcVector(0, 0, magnitude, shipPosAng)


    moveElement(ship, newShipPos.x, newShipPos.y)
    rotateElement(ship, headingChange)

    // console.log('shipPosAng: ' + shipPosAng)
    // console.log("heading + change: " + (currentHeading + headingChange))
    // console.log("dt: " + dt)
    // console.log("delta Heading: " + deltaHeading)
    // console.log("magnitude: " + magnitude)
    // console.log("headingChange: " + headingChange)
    // console.log("degreesToMouse: " + headingToMouse)
    // console.log("current angle : " + currentHeading)
    // console.log("newShipPos: " + newShipPos.x + ", " + newShipPos.y)
    // console.log("shipPos: " + shipPos.x + ", " + shipPos.y)
    // console.log("mouse pos: " + target.x + ", " + target.y)
}