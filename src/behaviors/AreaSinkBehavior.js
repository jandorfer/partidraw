import Behavior from "./Behavior";

export default class AreaSinkBehavior extends Behavior {

    constructor(area) {
        super();
        this.area = area;
    }

    initialize(particle, index, count) {
        particle.percentIndex = (1.0 * index) / (1.0 * count);
    }
    
    update(particle) {
        if (!this.enabled) return;
        
        let pos = Math.floor(this.area.length * particle.percentIndex);
        let sink = this.area[pos];
        let direction = Math.atan2(sink.x - particle.position.x, sink.y - particle.position.y);
        
        let speed = particle.speed;
        if (speed <= 0) speed = 0.1;
        speed = speed * (0.1 * Math.sqrt(Math.pow(sink.x - particle.position.x, 2), Math.pow(sink.y - particle.position.y)));
        
        particle.position.x += Math.sin(direction) * speed;
        particle.position.y += Math.cos(direction) * speed;
    }
        
    static shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    
    static Rectangle(x, y, width, height) {
        if (width <= 0) width = 1;
        if (height <= 0) height = 1;
        let area = new Array(width * height);
        for (let i=0; i<width; i++) {
            for (let j=0; j<height; j++) {
                area[j * width + i] = {x: x + i, y: y + j};
            }
        }
        area = AreaSinkBehavior.shuffle(area);
        return new AreaSinkBehavior(area);
    }
}