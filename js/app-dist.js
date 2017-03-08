"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */

var app = null;

window.addEventListener("load", function () {
    app = new App();
});

var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.earthContainer = null;
        this.earthScene = null;
        this.earthCamera = null;
        this.earthRenderer = null;
        this.earth = null;
        this.activeCountry = null;
        this.mouseDown = false;
        this.mouseDragged = false;
        this.dragSensitivity = 0.25;

        app = this;

        // scene setup
        this.earthContainer = document.querySelector("div#earth-container");
        this.earthScene = new THREE.Scene();
        this.earth = new Earth(200, this.earthScene);
        this.earthCamera = new OrbitCamera(600, 75, this.earthContainer.getBoundingClientRect().width / this.earthContainer.getBoundingClientRect().height, this.earth.pos);
        this.earthRenderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.earthRenderer.setClearColor(0x000000, 0);
        this.setEarthRenderSize();
        this.earthContainer.appendChild(this.earthRenderer.domElement);

        var light = new THREE.SpotLight(0xffffff, 1);
        light.position.set(900, 500, 1300);
        this.earthScene.add(light);
        this.earthScene.add(new THREE.AmbientLight(0x505050));

        // register eventlistener
        this.earthContainer.addEventListener("click", this.onClick);
        this.earthContainer.addEventListener("mousedown", this.onMouseDown);
        this.earthContainer.addEventListener("mouseup", this.onMouseUp);
        this.earthContainer.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("resize", this.setEarthRenderSize);

        // build earth
        // https://github.com/mapbox/earcut
        // https://github.com/Wilt/three.js_triangulation
        THREE.Triangulation.setLibrary(THREE.Triangulation.libraries.earcut);
        $.ajax(window.location + "img/earth.svg", {
            // $.ajax(window.location+"img/generic.svg", {
            success: function success(svg) {
                var paths = svg.querySelectorAll(".country");
                paths.forEach(function (el) {
                    el.classList.remove("country");
                    app.earth.addPath(el.getAttribute("class"), el.getElementsByTagName("path")[0].getAttribute("d"));
                });
                app.earth.transform();
                console.log("fertig");
            }
        });

        // let geometry = new THREE.BoxGeometry(300, 300, 300);
        // let sphere = new THREE.SphereGeometry(200, 32, 32);
        // let shape = new THREE.Shape();
        // shape.moveTo(-100, 100);
        // shape.lineTo(100, 100);
        // shape.lineTo(100, -100);
        // shape.lineTo(-100, -100);
        // shape.lineTo(-100, 100);
        // let extrude = new THREE.ExtrudeGeometry(shape, {amount: 300, bevelEnabled: false});
        //
        // let rot = new THREE.MeshLambertMaterial({color: 0xff0000});
        // let blau = new THREE.MeshLambertMaterial({color: 0x0000ff});
        //
        // let meshRot = new THREE.Mesh(extrude);
        // // meshRot.position.set(100, 100, 100);
        // let meshBlau = new THREE.Mesh(sphere);
        // // meshBlau.position.set(-100, -100, 0);
        // console.log("meshRot: %o", meshRot);
        // console.log("meshBlau: %o", meshBlau);
        //
        // let csgRot = new ThreeBSP(meshRot);
        // let csgBlau = new ThreeBSP(meshBlau);
        // console.log("csgRot: %o", csgRot);
        // console.log("csgBlau: %o", csgBlau);
        //
        // let csgProcessed = csgBlau.intersect(csgRot);
        // // let csgProcessed = csgBlau.subtract(csgRot);
        // console.log("csgProcessed: %o", csgProcessed);
        // let meshProcessed = csgProcessed.toMesh(new THREE.MeshLambertMaterial({color: 0x009900}));
        // console.log("meshProcessed: %o", meshProcessed);
        // meshProcessed.geometry.computeVertexNormals();
        // meshProcessed.rotation.set(Math.PI/8, Math.PI/8, 0);
        // // this.earthScene.add(meshRot);
        // // this.earthScene.add(meshBlau);
        // this.earthScene.add(meshProcessed);

        this.earthRenderLoop();
    }

    _createClass(App, [{
        key: "earthRenderLoop",
        value: function earthRenderLoop() {
            requestAnimationFrame(app.earthRenderLoop);
            app.earthRenderer.render(app.earthScene, app.earthCamera.camera);
        }
    }, {
        key: "setEarthCameraDistance",
        value: function setEarthCameraDistance(dist) {
            app.earthCamera(app.earth.radius + dist);
        }

        // Eventhandler

    }, {
        key: "setEarthRenderSize",
        value: function setEarthRenderSize() {
            app.earthRenderer.setSize(app.earthContainer.getBoundingClientRect().width, app.earthContainer.getBoundingClientRect().height);
            app.earthCamera.setAspectRatio(app.earthContainer.getBoundingClientRect().width / app.earthContainer.getBoundingClientRect().height);
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            if (app.mouseDragged) app.mouseDragged = false;else app.earth.onClick(e);
        }
    }, {
        key: "onMouseDown",
        value: function onMouseDown() {
            app.mouseDown = true;
        }
    }, {
        key: "onMouseUp",
        value: function onMouseUp() {
            app.mouseDown = false;
        }
    }, {
        key: "onMouseMove",
        value: function onMouseMove(e) {
            if (app.mouseDown) {
                app.mouseDragged = true;
                app.earthCamera.rotateLon(-e.movementX * app.dragSensitivity);
                app.earthCamera.rotateLat(e.movementY * app.dragSensitivity);
            }
        }
    }]);

    return App;
}();