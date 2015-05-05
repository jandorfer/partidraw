import Behavior from "./Behavior";

export default class FireflyBehavior extends Behavior {

    initialize(particle) {
        particle.direction = particle.direction || Math.random() * Math.PI * 2;
        particle.zdirection = particle.zdirection || Math.random() * Math.PI * 2;
        particle.speed = particle.speed || 1;
        particle.turn = Math.random() - 0.5;
        particle.zturn = Math.random() - 0.5;
    }
    
    update(particle) {
        if (!this.enabled) return;
        
        particle.direction += particle.turn * 0.1;
        particle.zdirection += particle.zturn * 0.5;
        particle.turn += 0.15 * (Math.random() - 0.5);
        if (particle.turn > 1) particle.turn = 1;
        if (particle.turn < -1) particle.turn = -1;
        particle.zturn += 0.05 * (Math.random() - 0.5);
        
        particle.position.x += Math.sin(particle.direction) * particle.speed;
        particle.position.y += Math.cos(particle.direction) * particle.speed;
        
        // BUG Pixi v3 rc4 ParticleContainer not allowing scale animation
        let zoff = Math.sin(particle.zdirection) * 0.05;
        particle.scale.x += zoff;
        particle.scale.y += zoff;
    }
}