/*jshint esversion: 6 */

class Earth{
    constructor(radius, scene){
        this.radius = radius;
        this.countrys = [];
        this.scene = scene;
        this.oceanMesh = null;
        this.pos = new THREE.Vector3(0, 0, 0);

        // let geometry = new THREE.SphereGeometry(this.radius*0.999, 32, 32);
        let geometry = new THREE.SphereGeometry(this.radius*0.999, 50, 50);
        let material = new THREE.MeshLambertMaterial({
            color: 0x2E6AEE,
            // wireframe: true,
        });
        this.oceanMesh = new THREE.Mesh(geometry, material);
        this.oceanMesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.scene.add(this.oceanMesh);
    }

    getCountryByCode(code){
        let country = null;
        for (let i = 0; i<this.countrys.length; i++) {
            if (this.countrys[i].code == code) {
                country = this.countrys[i];
                break;
            }
        }
        return country;
    }

    addCountry(code){
        let country = new Country(code, this);
        this.countrys.push(country);
        return country;
    }

    addPath(code, pathString){
        // console.log("addPath (" + code + "): " + pathString);
        // console.log("addPath (" + code + ")");
        let country = this.getCountryByCode(code);
        if (!country) country = this.addCountry(code);
        country.addPath(pathString, code);
    }

    transform(){
        let that = this;
        this.countrys.forEach(function(country){
            country.transform();
        });
    }

    onClick(e){
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(
            (e.clientX / window.innerWidth ) * 2 - 1,
            -(e.clientY / window.innerHeight ) * 2 + 1
        ), app.earthCamera.camera);
        let intersects = raycaster.intersectObjects(app.earthScene.children);
        if (intersects.length && intersects[0].object.country) {
            if (app.activeCountry) app.activeCountry.setInactive();
            app.activeCountry = intersects[0].object.country;
            app.activeCountry.setActive();
            // console.log(intersects[0].point);
        } else {
            if (app.activeCountry) app.activeCountry.setInactive();
            app.activeCountry = null;
        }
        if (app.activeCountry) console.log("app.activeCountry.code: %o", app.activeCountry.code);
        else console.log("no active country");
    }
}
