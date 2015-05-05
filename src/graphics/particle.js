/**
 * A circular particle that extends from PIXI graphics
 */
export default class Particle {
    static randomInt( min, max ) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    constructor( {color,alpha,x,y} ) {
        let pixiGraphic = new PIXI.Graphics();
        pixiGraphic.lineStyle(0);
        pixiGraphic.beginFill(color, alpha);
        pixiGraphic.drawCircle(x, y, Particle.randomInt(1,3));
        pixiGraphic.endFill();

        return pixiGraphic;
    }

}