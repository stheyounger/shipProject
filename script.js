window.onload = () => {

    const landingPage = document.querySelector(".landingPage")
    const startButton = document.querySelector(".startButton")
    const gamePage = document.querySelector(".gamePage")

    startButton.onclick = () => {
        gamePage.style.display = "block"
        landingPage.remove()
        startGame()
    }

    let prevTime = 0

    function startGame() {

        const mouseHtmlFollower = document.querySelector(".mouseFollower")
        const mouseFollower = new Element(mouseHtmlFollower)
        const mouseInitStyle = getComputedStyle(mouseHtmlFollower)

        let mouseX = parseInt(mouseInitStyle.left)
        let mouseY = 0
            // let mouseX = 0
            // let mouseY = 0
        let endGameLoop = false

        const littleSound = new Audio('littleSound.mp3')

        const ships = createShips(50)

        function createShips(number) {
            const shipList = []
            for (let i = 1; i <= number; i++) {
                const newShipHtmlElement = createImage("ship.png", gamePage)
                const shipElement = new Element(newShipHtmlElement)
                const ship = new Ship(shipElement)
                shipList.push(ship)

                newShipHtmlElement.classList = "ship"
                shipElement.positionElement(Math.random() * window.innerWidth + 1, Math.random() * window.innerHeight + 1)
            }
            return shipList
        }

        gameLoop(10, (dt) => {
            console.log("mousex: " + mouseX)
            if (mouseX != 0 && mouseY != 0) {

                ships.forEach((ship) => {
                    ship.persue({ x: mouseX, y: mouseY }, dt)
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

        document.body.onmousemove = function(event) {
            mouseX += event.movementX
            mouseY += event.movementY
            mouseFollower.moveElement(event.movementX, event.movementY)
        }

        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
        document.body.onclick = function() {
            document.body.requestPointerLock();

            littleSound.play();
        }


        function gameLoop(loopTime, action) {
            const currentTime = Date.now()
            const dt = currentTime - prevTime
            prevTime = currentTime
            action(dt);

            if (!endGameLoop)
                setTimeout(() => { gameLoop(loopTime, action) }, loopTime)
        }
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