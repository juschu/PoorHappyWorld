/*jshint esversion: 6 */

var app = null;

window.addEventListener("load", function(){ app = new App(); });

class App{
    constructor(){
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
        this.earthCamera = new OrbitCamera(
            600,
            75,
            this.earthContainer.getBoundingClientRect().width / this.earthContainer.getBoundingClientRect().height,
            this.earth.pos
        );
        this.earthRenderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.earthRenderer.setClearColor(0x000000, 0);
        this.setEarthRenderSize();
        this.earthContainer.appendChild(this.earthRenderer.domElement);

        var light = new THREE.SpotLight(0xffffff, 1);
    	light.position.set(900, 500, 1300);
        this.earthScene.add(light);
        this.earthScene.add(new THREE.AmbientLight(0x505050));

        // register eventlistener
        // this.earthContainer.addEventListener("click", this.onClick);
        this.earthContainer.addEventListener("mousedown", this.onMouseDown);
        this.earthContainer.addEventListener("mouseup", this.onMouseUp);
        this.earthContainer.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("resize", this.setEarthRenderSize);

        this.earthContainer.addEventListener("click", function(){
            app.earth.drawTexture();
        });


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


        // let box = new THREE.BoxGeometry(300, 300, 300);
        // let sphere = new THREE.SphereGeometry(200, 32, 32);
        // let shape = new THREE.Shape();
        // shape.moveTo(-100, 100);
        // shape.lineTo(100, 100);
        // shape.lineTo(100, -100);
        // shape.lineTo(-100, -100);
        // shape.lineTo(-100, 100);
        // let extrude = new THREE.ExtrudeGeometry(shape, {amount: 300, bevelEnabled: false});
        //
        // let rot = new THREE.MeshLambertMaterial({color: 0xff0000, side: THREE.DoubleSide});
        // let gruen = new THREE.MeshLambertMaterial({color: 0x00ff00, side: THREE.DoubleSide});
        // let blau = new THREE.MeshLambertMaterial({color: 0x0000ff, side: THREE.DoubleSide});
        //
        // let meshRot = new THREE.Mesh(extrude, rot);
        // // meshRot.position.set(100, 100, 100);
        // let meshBlau = new THREE.Mesh(sphere, blau);
        // // meshBlau.position.set(-100, -100, 0);
        // console.log("meshRot: %o", meshRot);
        // console.log("meshBlau: %o", meshBlau);
        //
        // meshRot.geometry.vertices.forEach(function(vert){
        //     console.log("vert: %o", vert);
        //     if (vert.z === 0) {
        //         // Erdmittelpunkt
        //         vert.x *= .0;
        //         vert.y *= .0;
        //     } else {
        //         // // Erdoberfläche
        //         // let lon = vert.x;
        //         // let lat = vert.y;
        //         // let rFactor = 2;
        //         // vert.x = Math.sin(lon*Math.PI/180)*Math.cos(lat*Math.PI/180)*that.earth.radius*rFactor;
        //         // vert.z = Math.cos(lon*Math.PI/180)*Math.cos(lat*Math.PI/180)*that.earth.radius*rFactor;
        //         // vert.y = Math.sin(lat*Math.PI/180)*that.earth.radius*rFactor;
        //     }
        // });
        //
        // let csgRot = new ThreeBSP(meshRot);
        // let csgBlau = new ThreeBSP(meshBlau);
        // console.log("csgRot: %o", csgRot);
        // console.log("csgBlau: %o", csgBlau);
        //
        // let csgProcessed = csgRot.intersect(csgBlau);
        // // let csgProcessed = csgBlau.subtract(csgRot);
        // console.log("csgProcessed: %o", csgProcessed);
        // let meshProcessed = csgProcessed.toMesh(gruen);
        // console.log("meshProcessed: %o", meshProcessed);
        // meshProcessed.geometry.computeVertexNormals();
        // // meshProcessed.rotation.set(Math.PI/8, Math.PI/8, 0);
        // // this.earthScene.add(meshRot);
        // // this.earthScene.add(meshBlau);
        // this.earthScene.add(meshProcessed);



        this.earthRenderLoop();
    }

    earthRenderLoop(){
        requestAnimationFrame(app.earthRenderLoop);
        // app.earth.texture.needsUpdate = true;
        app.earthRenderer.render(app.earthScene, app.earthCamera.camera);
    }

    setEarthCameraDistance(dist){
        app.earthCamera(app.earth.radius+dist);
    }

    // Eventhandler
    setEarthRenderSize(){
        app.earthRenderer.setSize(
            app.earthContainer.getBoundingClientRect().width,
            app.earthContainer.getBoundingClientRect().height
        );
        app.earthCamera.setAspectRatio(
            app.earthContainer.getBoundingClientRect().width /
            app.earthContainer.getBoundingClientRect().height
        );
    }

    onClick(e){
        if (app.mouseDragged) app.mouseDragged = false;
        else app.earth.onClick(e);
    }

    onMouseDown(){
        app.mouseDown = true;
    }

    onMouseUp(){
        app.mouseDown = false;
    }

    onMouseMove(e){
        if (app.mouseDown){
            app.mouseDragged = true;
            app.earthCamera.rotateLon(-e.movementX*app.dragSensitivity);
            app.earthCamera.rotateLat(e.movementY*app.dragSensitivity);
        }
    }
}
