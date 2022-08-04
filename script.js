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

    let mouseX = 0
    let mouseY = 0
    let endGameLoop = false

    const littleSound = new Audio('littleSound.mp3')

    const ships = createShips(50)


    gameLoop(10, (dt) => {
        if (mouseX != 0 && mouseY != 0) {
            ships.forEach((ship) => {
                shipPersue(ship, { x: mouseX, y: mouseY }, dt)
            })
        }
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

    const body = document.querySelector("body")
    const mouseFollower = document.querySelector(".mouseFollower")
    body.onmousemove = function(event) {
        mouseY += event.movementY
        mouseX += event.movementX
        positionElement(mouseFollower, mouseX, mouseY)
    }
    window.onclick = function() {
        littleSound.play();
    }

    body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock;
    body.onclick = function() {
        body.requestPointerLock();
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