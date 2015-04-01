import ParticleScene from "./ParticleScene";
import AreaSinkBehavior from "./behaviors/AreaSinkBehavior";
import FireflyBehavior from "./behaviors/FireflyBehavior";
import WrappingBoundsBehavior from "./behaviors/WrappingBoundsBehavior";

import RandomAreaResetMode from "./modes/RandomAreaResetMode";

const PARTICLE_COUNT = 1500;

class ParticleDrawing {
    constructor(count) {
        this.count = count;
        
        this.setupScene();
        this.setupRenderer();
        this.setupModes();
        this.setupResize();
        
        this.tick();
    }
    
    setupScene() {
        this.firefly = new FireflyBehavior();
        this.boundsWrapping = new WrappingBoundsBehavior(window.innerWidth, window.innerHeight);
        this.areaSink = AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight);
	
        this.scene = new ParticleScene(
            this.count, 
            this.firefly, 
            this.areaSink,
            this.boundsWrapping);
    }
    
    setupRenderer() {
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.left = "0";
        this.renderer.view.style.top = "0";
        
        document.body.appendChild(this.renderer.view);
    }
    
    setupModes() {
        this.mode = 0;
        this.modes = [
            new RandomAreaResetMode(this.areaSink)
        ];
        
        window.onclick = (e) => { this.modes[this.mode].onclick(e); }
        window.mousedown = (e) => { this.modes[this.mode].mousedown(e); }
        window.mousemove = (e) => { this.modes[this.mode].mousemove(e); }
        window.mouseup = (e) => { this.modes[this.mode].mouseup(e); }
    }
    
    setupResize() {
        window.addEventListener('resize', this.resize);
        window.onorientationchange = this.resize;
    }
    
    resize() {
        let width = window.innerWidth, height = window.innerHeight; 
		this.boundsWrapping.width = width;
		this.boundsWrapping.height = height;
        this.renderer.view.style.width = width + "px"
        this.renderer.view.style.height = height + "px"
        this.renderer.resize(width, height);
    }
    
    tick() {
        this.scene.update();
        this.renderer.render(this.scene.container);
        requestAnimationFrame(this.tick.bind(this));
    }
    
    switchMode(mode) {
        if (mode < 0 || mode > this.modes.length) return;
        
        this.modes[this.mode].stop();
        this.mode = mode;
        this.modes[this.mode].start();
    }
}

document.addEventListener('DOMContentLoaded', () => new ParticleDrawing(PARTICLE_COUNT));
