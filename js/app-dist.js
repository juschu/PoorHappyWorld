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
        this.earthCamera = new OrbitCamera(400, 75, this.earthContainer.getBoundingClientRect().width / this.earthContainer.getBoundingClientRect().height, this.earth.pos);
        this.earthRenderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // this.earthRenderer.setClearColor(0xffffff, 0);
        this.earthRenderer.setClearColor(0xffffff, 1);
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
        // $.ajax(window.location+"img/earth.svg", {
        // $.ajax(window.location+"img/generic.svg", {
        //     success: function(svg){
        //         var paths = svg.querySelectorAll(".country");
        //         for (let i = 0; i<paths.length; i++) {
        //             // console.log("path #"+i);
        //             paths[i].classList.remove("country");
        //             app.earth.addPath(
        //                 paths[i].getAttribute("class"),
        //                 paths[i].getElementsByTagName("path")[0].getAttribute("d")
        //             );
        //         }
        //         // app.earth.transform();
        //         console.log("fertig");
        //         // console.log(app.earth.oceanMesh.material);
        //         console.log(app.earth.borderCanvas);
        //         document.getElementsByTagName("body")[0].appendChild(app.earth.borderCanvas);
        //         // app.earth.oceanMesh.material.map = THREE.ImageUtils.loadTexture("../img/earth2.jpg");
        //         // app.earth.oceanMesh.material.map = THREE.TextureLoader("../img/earth2.jpg");
        //         // app.earth.oceanMesh.material.needsUpdate = true;
        //         setTimeout(function(){
        //             // app.earth.oceanMesh.material.map = new THREE.Texture(app.earth.borderCanvas);
        //             // app.earth.oceanMesh.material = new THREE.MeshLambertMaterial({
        //             //     // color: 0x2E6AEE,
        //             //     // wireframe: true,
        //             //     map: new THREE.Texture(app.earth.borderCanvas),
        //             //     // map: "../img/earth1.jpg",
        //             //     // map: THREE.ImageUtils.loadTexture("../img/earth2.jpg"),
        //             // });
        //             // app.earth.oceanMesh.material.needsUpdate = true;
        //             console.log("timeout");
        //         }, 10000);
        //     },
        // });

        this.earthRenderLoop();
    }

    _createClass(App, [{
        key: "earthRenderLoop",
        value: function earthRenderLoop() {
            requestAnimationFrame(app.earthRenderLoop);
            // app.earth.texture.needsUpdate = true;
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