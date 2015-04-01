import ParticleScene from "./ParticleScene";
import AreaSinkBehavior from "./behaviors/AreaSinkBehavior";
import FireflyBehavior from "./behaviors/FireflyBehavior";
import WrappingBoundsBehavior from "./behaviors/WrappingBoundsBehavior";

import Mode from "./modes/Mode";
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
        this.mode = 1;
        this.modes = [
            new Mode(),
            new RandomAreaResetMode(this.areaSink)
        ];
        
        window.onclick = (e) => { this.modes[this.mode].onclick(e); }
        window.mousedown = (e) => { this.modes[this.mode].mousedown(e); }
        window.mousemove = (e) => { this.modes[this.mode].mousemove(e); }
        window.mouseup = (e) => { this.modes[this.mode].mouseup(e); }
        
        this.setupModeSwitcher();
    }
    
    setupModeSwitcher() {
        let root = document.getElementById("mode-switcher");
        let desc = document.getElementById("mode-desc");
        if (!root) return;
        
        let selected = null;
        for (let i=0; i<this.modes.length; i++) {
            let link = document.createElement('a');
            link.setAttribute("href", "#");
            link.onclick = (e) => {
                e.stopPropagation();
                if (selected) selected.classList.remove('active');
                selected = link;
                link.classList.add('active');
                if (desc) desc.innerHTML = this.modes[i].description;
                this.switchMode(i);
            }
            if (this.mode === i) {
                link.classList.add('active');
                if (desc) desc.innerHTML = this.modes[i].description;
                selected = link;
            }
            link.appendChild(document.createTextNode(this.modes[i].name));
            root.appendChild(link);
        }
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
    
    switchMode(mode, e) {
        if (mode < 0 || mode > this.modes.length) return;
        
        
        
        this.modes[this.mode].stop();
        this.mode = mode;
        this.modes[this.mode].start();
    }
}

document.addEventListener('DOMContentLoaded', () => new ParticleDrawing(PARTICLE_COUNT));
