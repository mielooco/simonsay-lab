/* Geometry adapter for a cube minus independently placed spherical and planar tools.
 * Uses Evan Wallace's MIT-licensed csg.js; see CSG-LICENSE.txt.
 */
(function(root) {
    const HALF=60;
    const CSG=root.CSG||(typeof require==='function'?require('./csg.js'):null);
    function makeCutter(cut) {
        if(cut.kind==='plane') {
            const yaw=(cut.yaw??45)*Math.PI/180,pitch=(cut.pitch??35)*Math.PI/180;
            const normal=[cut.direction[0]*Math.cos(pitch)*Math.cos(yaw),cut.direction[1]*Math.sin(pitch),cut.direction[2]*Math.cos(pitch)*Math.sin(yaw)];
            const threshold=HALF*normal.reduce((sum,n)=>sum+Math.abs(n),0)-cut.depth;
            return {...cut,normal,threshold};
        }
        const offset=(cut.radius-cut.depth)/Math.sqrt(3);
        return {...cut,center:cut.direction.map(sign=>sign*(HALF+offset))};
    }
    function fieldAt(x,y,z,tools) {
        let value=Math.max(Math.abs(x),Math.abs(y),Math.abs(z))-HALF;
        for(const tool of tools) {
            const removed=tool.kind==='plane'
                ?tool.normal[0]*x+tool.normal[1]*y+tool.normal[2]*z-tool.threshold
                :tool.radius-Math.hypot(x-tool.center[0],y-tool.center[1],z-tool.center[2]);
            value=Math.max(value,removed);
        }
        return value;
    }
    function planeTool(tool) {
        const normal=new CSG.Vector(tool.normal);
        const reference=Math.abs(normal.y)<.9?new CSG.Vector(0,1,0):new CSG.Vector(1,0,0);
        const u=reference.cross(normal).unit(),v=normal.cross(u).unit();
        const center=normal.times(tool.threshold+200);
        const rotate=p=>u.times(p.x).plus(v.times(p.y)).plus(normal.times(p.z));
        const polygons=CSG.cube({radius:200}).toPolygons().map(polygon=>new CSG.Polygon(
            polygon.vertices.map(vertex=>new CSG.Vertex(rotate(vertex.pos).plus(center),rotate(vertex.normal)))
        ));
        return CSG.fromPolygons(polygons);
    }
    function polygonize(cuts) {
        let solid=CSG.cube({radius:HALF});
        for(const cut of cuts.filter(c=>c.enabled&&c.depth>0)) {
            const tool=makeCutter(cut);
            const cutter=tool.kind==='plane'?planeTool(tool):CSG.sphere({center:tool.center,radius:tool.radius,slices:48,stacks:24});
            solid=solid.subtract(cutter);
        }
        const positions=[],normals=[];
        for(const polygon of solid.toPolygons()) {
            for(let i=1;i<polygon.vertices.length-1;i++) {
                const vertices=[polygon.vertices[0],polygon.vertices[i],polygon.vertices[i+1]];
                const ab=vertices[1].pos.minus(vertices[0].pos),ac=vertices[2].pos.minus(vertices[0].pos);
                if(ab.cross(ac).length()<1e-8)continue;
                for(const vertex of vertices) {
                    positions.push(vertex.pos.x,vertex.pos.y,vertex.pos.z);
                    const normal=vertex.normal.unit();normals.push(normal.x,normal.y,normal.z);
                }
            }
        }
        return {positions:new Float32Array(positions),normals:new Float32Array(normals)};
    }
    const api={HALF,makeCutter,fieldAt,polygonize};
    if(typeof module!=='undefined'&&module.exports)module.exports=api;
    else root.VolumeCutting=api;
})(typeof globalThis!=='undefined'?globalThis:this);
