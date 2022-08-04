function createElement(type, location) {
    const newElement = document.createElement(type)
    location.appendChild(newElement)

    return newElement
}

function createImage(src, location) {
    const newElement = createElement("img", location)
    newElement.src = src
    return newElement
}

class Element {
    constructor(htmlElement) {
        this.element = htmlElement
    }

    // requires an initial rotate()-tion
    getElementAngle() {
        var style = window.getComputedStyle(this.element, null);
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

    moveElement(x, y) {
        // const elementPos = getElementPosition(element)
        // positionElement(element, elementPos.x + x, elementPos.y + y)

        // console.log("x: " + parseInt(element.style.left))
        // console.log("xComputedrn: " + element.style.left)
        const style = getComputedStyle(this.element)
            // if (x <= window.innerWidth) {
        this.element.style.left = parseInt(style.left) + x + "px"
            // }
            // if (y <= window.innerHeight) {
        this.element.style.top = parseInt(style.top) + y + "px"
            // }
    }

    positionElement(x, y) {
            // console.log("pos: " + x + ", " + y)
            this.element.style.left = x + "px"
            this.element.style.top = y + "px"
        }
        //2215550100, 2215550101 - 197358  - James

    setElementHeading(degrees) {
        if (degrees < 1 && degrees > -1) {
            console.log("Trying to set rotation to 0")
            this.element.style.transform = "rotate(1deg)"
        } else {
            this.element.style.transform = "rotate(" + degrees + "deg)"
        }
    }

    rotateElement(degrees) {
        this.setElementHeading(this.getElementAngle() + degrees)
    }

    getElementPosition() {
        return { x: parseInt(this.element.style.left), y: parseInt(this.element.style.top) }
    }

    getPositionAtCenter() {
        const offset = { x: this.element.clientWidth / 2, y: this.element.clientHeight / 2 }
        const position = this.getElementPosition()
        return { x: position.x + offset.x, y: position.y + offset.y }
    }

}