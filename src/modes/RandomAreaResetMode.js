import Mode from "./Mode";
import AreaSinkBehavior from "../behaviors/AreaSinkBehavior";

export default class RandomAreaResetMode extends Mode {
    constructor(sink) {
        this.sink = sink;
    }
    
    onclick(e) {
        this.sink.area = AreaSinkBehavior.Rectangle(
                Math.floor(Math.random() * (window.innerWidth / 2)), 
                Math.floor(Math.random() * (window.innerHeight / 2)), 
                Math.floor(Math.random() * (window.innerWidth / 3)), 
                Math.floor(Math.random() * (window.innerHeight / 3))).area;
    }
}