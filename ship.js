class Ship {
    constructor(element) {
        this.element = element
    }

    persue(target, dt) {
        const shipPos = this.element.getPositionAtCenter()

        const randSpeedOffset = Math.random() / 10
        
        const pxPerMili = { min: 0.2, max: 1.3 }
        const magnitude = coerceIn(pxPerMili.min * dt, pxPerMili.max * dt, (.07 * pointDistance(shipPos.x, shipPos.y, target.x, target.y)) + randSpeedOffset)

        const maxDegreePerMili = 0.3
        const randMaxDegreePerMiliOffset = (Math.random() / 3)
        const headingToMouse = fullToHalf(flipAngle(radToDeg(-Math.atan2(target.x - shipPos.x, target.y - shipPos.y))))
        const currentHeading = this.element.getElementAngle()
        const anglePerThisCycle = (maxDegreePerMili + randMaxDegreePerMiliOffset) * dt
        const headingChange = coerceIn(-anglePerThisCycle, anglePerThisCycle, this.smallestHeadingChange(currentHeading, headingToMouse))

        const shipPosAng = currentHeading + headingChange - 90
        const newShipPos = calcVector(0, 0, magnitude, shipPosAng)


        this.element.moveElement(newShipPos.x, newShipPos.y)
        this.element.rotateElement(headingChange)
    }

    smallestHeadingChange(currentHeading, headingToMouse) {

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
}
