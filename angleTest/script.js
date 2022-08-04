window.onload = () => {
    let prevTime = 0

    function gameLoop(loopTime, action) {
        const currentTime = Date.now()
        const dt = currentTime - prevTime
        prevTime = currentTime
        action(dt);

        if (!endGameLoop)
            setTimeout(() => { gameLoop(loopTime, action) }, loopTime)
    }

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

    function getElementPosition(element) {
        return { x: parseInt(element.style.left), y: parseInt(element.style.top) }
    }

    function getPositionAtCenter(element) {
        const offset = { x: element.clientWidth / 2, y: element.clientHeight / 2 }
        const position = getElementPosition(element)
        return { x: position.x + offset.x, y: position.y + offset.y }
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

    // function angleDiff(a, b) {
    //     return mod(((a - b) + 180), 360 - 180)
    // }

    function getSign(number) {
        return number / Math.abs(number)
    }

    function isPositive(number) {
        return number > 0
    }

    function angleDifference(a, b) {


        // const absA = Math.abs(a)
        // const absB = Math.abs(b)
        // let subbed = 0
        // if (absA > absB) {
        //     subbed = a - b
        // } else {
        //     subbed = b - a
        // }
        // if (absA > absB)
        //     return getSign(a) * subbed
        // else
        //     return getSign(b) * subbed

        // if (getSign(a) == getSign(b)) {
        //     return a + b
        // } else {
        //     return a - b
        // }
        // const absA = Math.abs(a)
        // const absB = Math.abs(b)
        // const absSubtract = absA - absB
        // if (absA > absB)
        //     return getSign(a) * absSubtract
        // else
        //     return getSign(b) * absSubtract
    }

    // function angleDifference(a, b) {
    //     const absA = Math.abs(a)
    //     const absB = Math.abs(b)
    //     if (absA > absB)
    //         return a - absB
    //     else
    //         return absA - b
    // }

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

    let endGameLoop = false

    function calcMaxRateHeadingDelta(currentHeading, targetHeading, dt, degreesPerMili) {
        const deltaHeading = angleDiff(currentHeading, targetHeading)

        console.log("deltaHEading: " + deltaHeading)
        const maxDegreesThisLoop = degreesPerMili * dt

        const headingChange = coerceIn(-maxDegreesThisLoop, maxDegreesThisLoop, deltaHeading) //coerceIn(-5, 5, (halfToFullCircle(headingToMouse) - halfToFullCircle(getAngle(ship))) % 360)
        return headingChange
    }

    function smallestHeadingChange(currentHeading, headingToMouse) {

        const absCurrentHeading = Math.abs(currentHeading)
        const absHeadingToMouse = Math.abs(headingToMouse)

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


        // console.log("degreesToMouse: " + headingToMouse)
        // console.log("current angle : " + currentHeading)
    }

    console.log("headingChange: " + smallestHeadingChange(70, -100))

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


}