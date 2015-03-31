// A basic, immutable implementation of a quad tree
// Intended for indexing to speed up collision detection in 2d point-systems

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        Object.freeze(this);
    }
    
    offset(x, y) {
        return new Point(this.x + x, this.y + y);
    }
    
    scale(scalarX, scalarY) {
        return new Point(this.x * scalarX, this.y * (scalarY || scalarX));
    }
};

class Box {
    constructor(center, halfDimension) {
        this.center = center;
        this.halfDimension = halfDimension;
        
        Object.freeze(this);
    }
    
    contains(point) {
        return point.x <= this.center.x + this.halfDimension.x && 
               point.x >= this.center.x - this.halfDimension.x &&
               point.y <= this.center.y + this.halfDimension.y &&
               point.y >= this.center.y - this.halfDimension.y;
    }
    
    intersects(box) {
        return
            // That box's corners inside this?
            this.contains(box.nwCorner()) ||
            this.contains(box.neCorner()) ||
            this.contains(box.seCorner()) ||
            this.contains(box.swCorner()) ||
            // This completely contained in that box?
            box.contains(this.center);
    }
    
    nwCorner() {
        return this.center.offset(this.halfDimension.scale(-1, 1));
    }
    
    neCorner() {
        return this.center.offset(this.halfDimension.scale(1, 1));
    }
    
    seCorner() {
        return this.center.offset(this.halfDimension.scale(1, -1));
    }
    
    swCorner() {
        return this.center.offset(this.halfDimension.scale(-1, -1));
    }
    
    /**
     * Returns four Box instances covering the four sub-quadrants of this Box.
     * They are returned in a clockwise-ordered array, from "nw" on.
     */
    quads() {
        let hhd = this.halfDimension.scale(0.5),
            c = this.center;
        
        return [
            new Box(c.offset(-1 * hhd.x, hhd.y), hhd),      
            new Box(c.offset(hhd.x, hhd.y), hhd),
            new Box(c.offset(hhd.x, -1 * hhd.y), hhd), 
            new Box(c.offset(-1 * hhd.x, -1 * hhd.y), hhd)
        ];
    }
};

const NODE_CAPACITY = 4;

export class QuadTree {
    constructor(basis, {bounds, nw, ne, sw, se, points}) {
        this.bounds = bounds || basis.bounds;
        this.nw = nw || basis.nw;
        this.ne = ne || basis.nw;
        this.sw = sw || basis.sw;
        this.se = se || basis.se;
        this.points = points || basis.points;
        
        Object.freeze(this);
    }
    
    /**
     * Returns a new QuadTree instance which contains the added point and all other
     * points already in the tree, or false if the new point does not fall within 
     * the bounds of this tree.
     */
    insert(point) {
        if (!bounds.containsPoint(point)) return false; 

        if (!this.points || this.points.size < this.capacity) {
            let newPoints = this.points ? 
                this.points.push(point) : Immutable.List().push(point);
            return new QuadTree(this, {points: newPoints});
        }

        // If not already subdivided, create subdivided version and insert there
        if (!this.nw) {
            return this.subdivide().insert(point);
        }
    
        // Check sub-areas (branches), replace whichever accepts it in our tracked set
        let b;
        if ((b = this.nw.insert(point))) return new QuadTree(this, {nw: b});
        if ((b = this.ne.insert(point))) return new QuadTree(this, {ne: b});
        if ((b = this.sw.insert(point))) return new QuadTree(this, {sw: b});
        if ((b = this.se.insert(point))) return new QuadTree(this, {se: b});

        // error...
        return false;
    }
    
    subdivide() {
        let quads = this.bounds.quads();
        return new QuadTree(this, {
            nw: new QuadTree({bounds: quads[0], points: this.queryLocal(quads[0])}),
            ne: new QuadTree({bounds: quads[1], points: this.queryLocal(quads[1])}),
            se: new QuadTree({bounds: quads[2], points: this.queryLocal(quads[2])}),
            sw: new QuadTree({bounds: quads[3], points: this.queryLocal(quads[3])})
        });
    }
    
    /**
     * Returns contained points, only considering those directly in this quadtree.
     * (In other words ignores child branches/quads).
     */
    queryLocal(box) {
        if (!this.points) return Immutable.List();
        return this.points.filter(p => this.bounds.contains(p));
    }
    
    query(box) {
        if (!this.bounds.intersects(box)) return Immutable.List();
        
        let results = queryLocal(box);
        
        if (!this.nw) return results; // No sub-branches to check
        
        return results.merge(
            this.nw.query(box),
            this.ne.query(box),
            this.se.query(box),
            this.sw.query(box)
        );
    }
};