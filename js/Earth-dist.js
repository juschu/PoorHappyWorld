"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */

var Earth = function () {
    function Earth(radius, scene) {
        _classCallCheck(this, Earth);

        this.radius = radius;
        this.countrys = [];
        this.scene = scene;
        this.csgMesh = null;
        this.oceanMesh = null;
        this.pos = new THREE.Vector3(0, 0, 0);

        // this.resFactor = 8;
        this.resFactor = 1;
        this.borderCanvas = document.createElement("canvas");
        this.borderCanvas.setAttribute("height", 180 * this.resFactor);
        this.borderCanvas.setAttribute("width", 360 * this.resFactor);
        this.borderCtx = this.borderCanvas.getContext("2d");
        this.fillCanvas = document.createElement("canvas");
        this.fillCanvas.setAttribute("height", 180 * this.resFactor);
        this.fillCanvas.setAttribute("width", 360 * this.resFactor);
        this.fillCtx = this.fillCanvas.getContext("2d");
        document.getElementsByTagName("body")[0].appendChild(this.borderCanvas);
        this.borderCtx.lineWidth = 1 * this.resFactor;
        this.borderCtx.strokeStyle = "#000";
        this.borderCtx.clearRect(0, 0, 360 * this.resFactor, 180 * this.resFactor);
        this.borderCtx.fillStyle = "#FFF";
        this.borderCtx.beginPath();
        this.borderCtx.moveTo(this.mapLon2X(-40), this.mapLat2Y(40));
        this.borderCtx.lineTo(this.mapLon2X(40), this.mapLat2Y(40));
        this.borderCtx.lineTo(this.mapLon2X(40), this.mapLat2Y(-40));
        this.borderCtx.lineTo(this.mapLon2X(-40), this.mapLat2Y(-40));
        this.borderCtx.lineTo(this.mapLon2X(-40), this.mapLat2Y(40));
        this.borderCtx.stroke();

        this.oceanMesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius * 0.999, 50, 50), new THREE.MeshLambertMaterial({
            color: 0x2E6AEE,
            wireframe: true
        }));
        this.oceanMesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.scene.add(this.oceanMesh);
    }

    _createClass(Earth, [{
        key: "mapLon2X",
        value: function mapLon2X(lon) {
            return (lon + 180) * this.resFactor;
        }
    }, {
        key: "mapLat2Y",
        value: function mapLat2Y(lat) {
            return (-1 * lat + 90) * this.resFactor;
        }
    }, {
        key: "getCountryByCode",
        value: function getCountryByCode(code) {
            var country = null;
            for (var i = 0; i < this.countrys.length; i++) {
                if (this.countrys[i].code == code) {
                    country = this.countrys[i];
                    break;
                }
            }
            return country;
        }
    }, {
        key: "addCountry",
        value: function addCountry(code) {
            var country = new Country(code, this);
            this.countrys.push(country);
            return country;
        }
    }, {
        key: "addPath",
        value: function addPath(code, pathString) {
            // console.log("addPath (" + code + "): " + pathString);
            // console.log("addPath (" + code + ")");
            var country = this.getCountryByCode(code);
            if (!country) country = this.addCountry(code);
            country.addPath(pathString, code);
        }
    }, {
        key: "transform",
        value: function transform() {
            var that = this;
            var i = 1;
            this.countrys.forEach(function (country) {
                console.log("transform country #" + i + " (" + country.code + ")");
                i++;
                country.transform();
            });
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(e.clientX / window.innerWidth * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), app.earthCamera.camera);
            var intersects = raycaster.intersectObjects(app.earthScene.children);
            if (intersects.length && intersects[0].object.country) {
                if (app.activeCountry) app.activeCountry.setInactive();
                app.activeCountry = intersects[0].object.country;
                app.activeCountry.setActive();
                // console.log(intersects[0].point);
            } else {
                if (app.activeCountry) app.activeCountry.setInactive();
                app.activeCountry = null;
            }
            if (app.activeCountry) console.log("app.activeCountry.code: %o", app.activeCountry.code);else console.log("no active country");
        }
    }]);

    return Earth;
}();