/*jshint esversion: 6 */

class Country{
    constructor(code, earth){
        this.earth = earth;
        this.code = code;
        this.spaceMeshes = [];
        this.meshes = [];

        // TODO später ersetzen
        this.activeColor = 0xD92716;
        this.inactiveColor = 0x71DD12;
    }

    addPath(pathData, code){
        let actions = [];
        if (typeof pathData == "string") {
            let matches = pathData.match(/[a-z][-|\d|\.|\s]*/gi);
            let m;
            matches.forEach(function(m){
                let cmd = m[0];
                let data = m.substr(1).trim();
                data = data.split(" ");
                for (let i = 0; i<data.length/2; i++) {
                    actions.push({
                        command: cmd,
                        x: parseFloat(data[i*2]),
                        y: parseFloat(data[i*2+1]),
                    });
                }
            });
        } else {
            actions = pathData;
        }

        let shape = new THREE.Shape();
        let pos = new THREE.Vector2(0, 0);
        let start = new THREE.Vector2(0, 0);
        let moved = false;
        let a;
        for (let i = 0; i<actions.length; i++) {
            a = actions[i];
            if (a.command == "M" || a.command == "L") {
                pos.x = a.x;
                pos.y = a.y;
            } else if  (a.command == "m" || a.command == "l") {
                pos.x += a.x;
                pos.y += a.y;
            }
            if (a.command == "M" || a.command == "m") {
                if (moved) {
                    shape.lineTo(start.x, start.y);
                    this.addPath(actions.slice(i));
                    break;
                } else {
                    moved = true;
                    shape.moveTo(pos.x, pos.y);
                    start.x = pos.x;
                    start.y = pos.y;
                }
            } else if  (a.command == "L" || a.command == "l") {
                shape.lineTo(pos.x, pos.y);
            } else if (a.command == "Z" || a.command == "z") {
                if (start.x != pos.x || start.y != pos.y) {
                    shape.lineTo(start.x, start.y);
                }
            }
        }

        let extrudeSettings = {
            amount: 1,
            bevelEnabled: false,
        };
        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let material = new THREE.MeshLambertMaterial({color: this.inactiveColor});
        // let mesh = new THREE.Mesh(geometry, material);
        let mesh = new THREE.Mesh(geometry);
        mesh.country = this;
        app.earthScene.add(mesh);
        this.spaceMeshes.push(mesh);
    }

    transform(){
        let that = this;
        this.spaceMeshes.forEach(function(spaceMesh){
            spaceMesh.geometry.vertices.forEach(function(vert){
                if (vert.z === 0) {
                    // Erdmittelpunkt
                    vert.x = that.earth.pos.x;
                    vert.y = that.earth.pos.y;
                } else {
                    // Erdoberfläche
                    let lon = vert.x;
                    let lat = vert.y;
                    let rFactor = 1;
                    vert.x = Math.sin(lon*Math.PI/180)*Math.cos(lat*Math.PI/180)*that.earth.radius*rFactor;
                    vert.z = Math.cos(lon*Math.PI/180)*Math.cos(lat*Math.PI/180)*that.earth.radius*rFactor;
                    vert.y = Math.sin(lat*Math.PI/180)*that.earth.radius*rFactor;
                }
            });
            // // console.log("-----------------------");
            // // console.log("spaceMesh: %o", spaceMesh);
            // // console.log("that.earth.oceanMesh: %o", that.earth.oceanMesh);
            // let csgSpaceMesh = new ThreeBSP(spaceMesh);
            // let csgOceanMesh = new ThreeBSP(that.earth.oceanMesh);
            // // console.log("csgSpaceMesh: %o", csgSpaceMesh);
            // // console.log("csgOceanMesh: %o", csgOceanMesh);
            // let csgResult = csgSpaceMesh.intersect(csgOceanMesh);
            // // console.log("csgResult: %o", csgResult);
            // let mesh = csgResult.toMesh(new THREE.MeshLambertMaterial({color: that.inactiveColor, side: THREE.DoubleSide}));
            // mesh.geometry.computeVertexNormals();
            // // console.log("mesh: %o", mesh);
            // mesh.country = that;
            // that.earth.scene.add(mesh);
            // that.meshes.push(mesh);
        });
    }

    setActive(){
        let that = this;
        this.meshes.forEach(function(m){
            m.material.color.set(that.activeColor);
        });
    }

    setInactive(){
        let that = this;
        this.meshes.forEach(function(m){
            m.material.color.set(that.inactiveColor);
        });
    }
}
