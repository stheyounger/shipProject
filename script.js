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

    function smallestHeadingChange(currentHeading, headingToMouse) {

        const absCurrentHeading = Math.abs(currentHeading)
        const absHeadingToMouse = Math.abs(headingToMouse)


        console.log("degreesToMouse: " + headingToMouse)
        console.log("current angle : " + currentHeading)

        // # 1 & 2
        if (getSign(currentHeading) != getSign(headingToMouse)) {
            if ((Math.abs(currentHeading) + Math.abs(headingToMouse)) < (360 - absCurrentHeading - absHeadingToMouse)) {
                // #1
                console.log("#1")

                return -getSign(currentHeading) * (Math.abs(currentHeading) + Math.abs(headingToMouse))
            } else {
                // #2
                console.log("#2")

                return getSign(currentHeading) * (360 - absCurrentHeading - absHeadingToMouse)
            }
        }
        // #3
        if (getSign(currentHeading) == getSign(headingToMouse) && absCurrentHeading < absHeadingToMouse) {
            console.log("#3")

            return headingToMouse - currentHeading
        }
        // #4
        if (getSign(currentHeading) == getSign(headingToMouse) && absCurrentHeading > absHeadingToMouse) {
            console.log("#4")

            return -(currentHeading - headingToMouse)
        }
        // #5
        if (absCurrentHeading == absHeadingToMouse)
            return 0

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

    let mouseX = 0
    let mouseY = 0
    let endGameLoop = false

    const ship1 = document.querySelector(".ship1")

    const littleSound = new Audio('littleSound.mp3')

    moveElement(ship1, 100, 100)

    function calcMaxRateHeadingDelta(currentHeading, targetHeading, dt, degreesPerMili) {
        const deltaHeading = angleDiff(currentHeading, targetHeading)

        console.log("deltaHEading: " + deltaHeading)
        const maxDegreesThisLoop = degreesPerMili * dt

        const headingChange = coerceIn(-maxDegreesThisLoop, maxDegreesThisLoop, deltaHeading) //coerceIn(-5, 5, (halfToFullCircle(headingToMouse) - halfToFullCircle(getAngle(ship))) % 360)
        return headingChange
    }

    function updateShip(ship, target, dt) {
        console.log("start iteration")
        const shipPos = getPositionAtCenter(ship)

        const magnitude = 1 //coerceIn(5, 13, .05 * pointDistance(shipPos.x, shipPos.y, target.x, target.y))

        const headingToMouse = fullToHalf(flipAngle(radToDeg(-Math.atan2(target.x - shipPos.x, target.y - shipPos.y))))
        const currentHeading = getAngle(ship)

        const anglePerThisCycle = .09 * dt
        const headingChange = coerceIn(-anglePerThisCycle, anglePerThisCycle, smallestHeadingChange(currentHeading, headingToMouse))

        // const newShipPos = calcVector(0, 0, magnitude, 90 + currentHeading + headingChange)


        // moveElement(ship, newShipPos.x, newShipPos.y)
        // setElementHeading(ship, headingToMouse)
        rotateElement(ship, headingChange)


        // console.log("dt: " + dt)
        // console.log("delta Heading: " + deltaHeading)
        // console.log("magnitude: " + magnitude)
        console.log("headingChange: " + headingChange)
        console.log("degreesToMouse: " + headingToMouse)
        console.log("current angle : " + currentHeading)
            // console.log("newShipPos: " + newShipPos.x + ", " + newShipPos.y)
        console.log("shipPos: " + shipPos.x + ", " + shipPos.y)
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

}

// holler.onLoad(() => {
//     holler.me(() => {
//         holler.appInstance.notifyClients("hi cli")

//         holler.onClientEvent((event) => {
//             console.log("Recived: " + event)
//         })
//     })
// })};