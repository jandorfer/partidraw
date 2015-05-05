import ParticleScene from "./ParticleScene";
import AreaSinkBehavior from "./behaviors/AreaSinkBehavior";
import FireflyBehavior from "./behaviors/FireflyBehavior";
import WrappingBoundsBehavior from "./behaviors/WrappingBoundsBehavior";

import Mode from "./modes/Mode";
import MouseDrawAreaMode from "./modes/MouseDrawAreaMode";
import RandomAreaResetMode from "./modes/RandomAreaResetMode";

const PARTICLE_COUNT = 1500;
const scale = 2;

class ParticleDrawing {
    constructor( count ) {
        this.count = count;

        this.setupScene();
        this.setupRenderer();
        this.setupModes();
        this.setupToggles();
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
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth * scale, window.innerHeight * scale);
        this.renderer.view.style.position = "fixed";
        this.renderer.view.style.left = "0";
        this.renderer.view.style.top = "0";
        this.renderer.view.style.bottom = "0";
        this.renderer.view.style.right = "0";

        document.body.appendChild(this.renderer.view);
    }

    setupModes() {
        this.mode = 1;
        this.modes = [
            new Mode(),
            new RandomAreaResetMode(this.areaSink),
            new MouseDrawAreaMode(this.areaSink)
        ];

        window.onclick = ( e ) => {
            this.modes[this.mode].onclick(e);
        }
        window.onmousedown = ( e ) => {
            this.modes[this.mode].onmousedown(e);
        }
        window.onmousemove = ( e ) => {
            this.modes[this.mode].onmousemove(e);
        }
        window.onmouseup = ( e ) => {
            this.modes[this.mode].onmouseup(e);
        }

        this.setupModeSwitcher();
    }

    setupModeSwitcher() {
        let root = document.getElementById("mode-switcher");
        let desc = document.getElementById("mode-desc");
        if ( !root ) return;

        let selected = null;
        for ( let i = 0; i < this.modes.length; i++ ) {
            let link = document.createElement('a');
            link.setAttribute("href", "#");
            link.onclick = ( e ) => {
                e.stopPropagation();
                if ( selected ) selected.classList.remove('active');
                selected = link;
                link.classList.add('active');
                if ( desc ) desc.innerHTML = this.modes[i].description;
                this.switchMode(i);
            }
            if ( this.mode === i ) {
                link.classList.add('active');
                if ( desc ) desc.innerHTML = this.modes[i].description;
                selected = link;
            }
            link.appendChild(document.createTextNode(this.modes[i].name));
            root.appendChild(link);
        }
    }

    setupToggles() {
        let root = document.getElementById("toggles");
        if ( !root ) return;

        let link = document.createElement('a');
        link.setAttribute("href", "#");
        link.onclick = ( e ) => {
            e.stopPropagation();
            this.areaSink.area = AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight).area;
        };
        link.appendChild(document.createTextNode("reset"));
        root.appendChild(link);

        let link2 = document.createElement('a');
        link2.setAttribute("href", "#");
        link2.onclick = ( e ) => {
            e.stopPropagation();
            this.firefly.enabled = !this.firefly.enabled;
            link2.innerHTML = "firefly " + (this.firefly.enabled ? "on" : "off");
        };
        link2.innerHTML = "firefly " + (this.firefly.enabled ? "on" : "off");
        root.appendChild(link2);

        let link3 = document.createElement('a');
        link3.setAttribute("href", "#");
        link3.onclick = ( e ) => {
            e.stopPropagation();
            this.boundsWrapping.enabled = !this.boundsWrapping.enabled;
            link3.innerHTML = "wrapping " + (this.boundsWrapping.enabled ? "on" : "off");
        };
        link3.innerHTML = "wrapping " + (this.boundsWrapping.enabled ? "on" : "off");
        root.appendChild(link3);
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
        window.onorientationchange = this.resize.bind(this);
    }

    resize() {
        let width = window.innerWidth, height = window.innerHeight;
        this.boundsWrapping.width = width;
        this.boundsWrapping.height = height;
        this.renderer.resize(width * scale, height * scale);
    }

    tick() {
        this.scene.update();
        this.renderer.render(this.scene.container);
        requestAnimationFrame(this.tick.bind(this));
    }

    switchMode( mode, e ) {
        if ( mode < 0 || mode > this.modes.length ) return;

        this.modes[this.mode].stop();
        this.mode = mode;
        this.modes[this.mode].start();
    }
}

document.addEventListener('DOMContentLoaded', () => new ParticleDrawing(PARTICLE_COUNT));
