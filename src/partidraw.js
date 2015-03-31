import ParticleScene from "./ParticleScene";
import AreaSinkBehavior from "./behaviors/AreaSinkBehavior";
import FireflyBehavior from "./behaviors/FireflyBehavior";
import WrappingBoundsBehavior from "./behaviors/WrappingBoundsBehavior";

const PARTICLE_COUNT = 1500;

function setup() {
	let renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);
	renderer.view.style.position = "absolute";
	renderer.view.style.left = "0";
	renderer.view.style.top = "0";
	
	let boundsWrapping = new WrappingBoundsBehavior(window.innerWidth, window.innerHeight);
	
	let particles = new ParticleScene(
            PARTICLE_COUNT, 
            new FireflyBehavior(), 
            AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight),
            boundsWrapping);
            
	var update = () => {
        particles.update();
        renderer.render(particles.container);
        requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
	
	var resize = () => {
		let width = window.innerWidth, height = window.innerHeight; 
		boundsWrapping.width = width;
		boundsWrapping.height = height;
        renderer.view.style.width = width + "px"
        renderer.view.style.height = height + "px"
        renderer.resize(width, height);
	}
	window.addEventListener('resize', resize);
    window.onorientationchange = resize;
    
    window.onclick = () => {
        particles.behaviors[1].area = AreaSinkBehavior.Rectangle(
            Math.floor(Math.random() * (window.innerWidth / 2)), 
            Math.floor(Math.random() * (window.innerHeight / 2)), 
            Math.floor(Math.random() * (window.innerWidth / 3)), 
            Math.floor(Math.random() * (window.innerHeight / 3))).area;
    }
}

document.addEventListener('DOMContentLoaded', setup);
