"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */

var OrbitCamera = function () {
    function OrbitCamera(radius, fov, aspectRatio, center) {
        _classCallCheck(this, OrbitCamera);

        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 5000);
        this.radius = radius;
        this.center = center;
        this.relPos = new THREE.Vector3(0, 0, radius);
        this.updateAbsPos();
        this.lon = 0;
        this.lat = 0;
    }

    _createClass(OrbitCamera, [{
        key: "updateAbsPos",
        value: function updateAbsPos() {
            this.absPos = this.center.clone().add(this.relPos);
            this.camera.position.set(this.absPos.x, this.absPos.y, this.absPos.z);
            this.camera.lookAt(this.center);
        }
    }, {
        key: "setAspectRatio",
        value: function setAspectRatio(aRatio) {
            this.camera.aspect = aRatio;
            this.camera.updateProjectionMatrix();
        }
    }, {
        key: "setRadius",
        value: function setRadius(radius) {
            var factor = radius / this.radius;
            this.radius = radius;
            this.camera.position.x *= factor;
            this.camera.position.y *= factor;
            this.camera.position.z *= factor;
        }
    }, {
        key: "setLon",
        value: function setLon(lon) {
            this.lon = (lon + 180) % 360 - 180;
            this.relPos.x = Math.sin(lon * Math.PI / 180) * Math.cos(this.lat * Math.PI / 180) * this.radius;
            this.relPos.z = Math.cos(lon * Math.PI / 180) * Math.cos(this.lat * Math.PI / 180) * this.radius;
            this.updateAbsPos();
        }
    }, {
        key: "setLat",
        value: function setLat(lat) {
            if (lat >= -90 && lat <= 90) {
                this.lat = lat;
                this.relPos.y = Math.sin(lat * Math.PI / 180) * this.radius;
                this.setLon(this.lon);
                this.updateAbsPos();
            }
        }
    }, {
        key: "rotateLon",
        value: function rotateLon(deg) {
            this.setLon(deg + this.lon);
        }
    }, {
        key: "rotateLat",
        value: function rotateLat(deg) {
            this.setLat(deg + this.lat);
        }
    }]);

    return OrbitCamera;
}();