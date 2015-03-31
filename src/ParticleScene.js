export default class ParticleScene {

    constructor(count, ...behaviors) {
        this.particles = [];
        this.behaviors = behaviors;
        this.container = new PIXI.ParticleContainer(count, [true, true, false, true, true]);
        this.texture = new PIXI.Texture.fromImage("sprite.png");
        
        for (let i=0; i<count; i++) {
            var particle = new PIXI.Sprite(this.texture);
            particle.anchor.set(0.5);
            particle.scale.x = 0.2;
            particle.scale.y = 0.2;
            
            // BUG Pixi v3 rc4 ParticleContainer doesn't support transparency at all
            particle.alpha = 0.6;
            
            for (let j=0; j<behaviors.length; j++) {
                behaviors[j].initialize(particle, i, count);
            }
            
            this.particles.push(particle);
            this.container.addChild(particle);
        }
    }
    
    update() {
        for (let i=0; i<this.particles.length; i++) {
            for (let j=0; j<this.behaviors.length; j++) {
                this.behaviors[j].update(this.particles[i]);
            }
        }
    }
}