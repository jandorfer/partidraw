import Behavior from "./Behavior";

export default class WrappingBoundsBehavior extends Behavior {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    update(particle) {
        if (particle.position.x > this.width) {
            particle.position.x = particle.position.x - this.width;
        } else if (particle.position.x < 0) {
            particle.position.x = particle.position.x + this.width;
        }
        
        if (particle.position.y > this.height) {
            particle.position.y = particle.position.y - this.height;
        } else if (particle.position.y < 0) {
            particle.position.y = particle.position.y + this.height;
        }
    }
}