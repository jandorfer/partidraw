import Mode from "./Mode";
import AreaSinkBehavior from "../behaviors/AreaSinkBehavior";

export default class MouseDrawAreaMode extends Mode {
    constructor(sink) {
        this.name = "Drawing";
        this.description = "Click and drag the mouse to set the path for particles to fill.";
        this.sink = sink;
        
        this.started = false;
        this.active = false;
    }
        
    onmousedown(e) {
        if (!this.started) {
            this.started = true;
            // Clear the current area the first time around
            this.sink.area = [];
        }
        
        this.active = true;
        this.addPoint(e);
    }
    
    onmousemove(e) {
        if (this.active) {
            this.addPoint(e);
        }
    }
    
    onmouseup(e) {
        this.active = false;
    }
    
    stop() {
        this.active = false;
        this.started = false;
    }
    
    addPoint(e) {
        this.sink.area.push({x: e.clientX, y: e.clientY});
    }
}