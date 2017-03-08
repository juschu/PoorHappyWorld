/*jshint esversion: 6 */

class OrbitCamera{
    constructor(radius, fov, aspectRatio, center){
        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 5000);
        this.radius = radius;
        this.center = center;
        this.relPos = new THREE.Vector3(0, 0, radius);
        this.updateAbsPos();
        this.lon = 0;
        this.lat = 0;
    }

    updateAbsPos(){
        this.absPos = this.center.clone().add(this.relPos);
        this.camera.position.set(
            this.absPos.x,
            this.absPos.y,
            this.absPos.z
        );
        this.camera.lookAt(this.center);
    }

    setAspectRatio(aRatio){
        this.camera.aspect = aRatio;
        this.camera.updateProjectionMatrix();
    }

    setRadius(radius){
        let factor = radius / this.radius;
        this.radius = radius;
        this.camera.position.x *= factor;
        this.camera.position.y *= factor;
        this.camera.position.z *= factor;
    }

    setLon(lon){
        this.lon = (lon+180)%360-180;
        this.relPos.x = Math.sin(lon*Math.PI/180)*Math.cos(this.lat*Math.PI/180)*this.radius;
        this.relPos.z = Math.cos(lon*Math.PI/180)*Math.cos(this.lat*Math.PI/180)*this.radius;
        this.updateAbsPos();
    }

    setLat(lat){
        if (lat >= -90 && lat <= 90) {
            this.lat = lat;
            this.relPos.y = Math.sin(lat*Math.PI/180)*this.radius;
            this.setLon(this.lon);
            this.updateAbsPos();
        }
    }

    rotateLon(deg){
        this.setLon(deg+this.lon);
    }

    rotateLat(deg){
        this.setLat(deg+this.lat);
    }
}
