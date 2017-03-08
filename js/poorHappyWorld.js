window.addEventListener("load", function(){

var earthContainer;
var earthScene;
var earthCamera;
var earthRenderer;
var raycaster;
var mouse;

function init(){
    earthContainer = document.querySelector("div#earth-container");
    earthScene = new THREE.Scene();
    earthCamera = new THREE.PerspectiveCamera(
        75,
        earthContainer.getBoundingClientRect().width / earthContainer.getBoundingClientRect().height,
        0.1,
        1000
    );
    // earthCamera.position.set(0, 3, 5);
    earthCamera.position.set(0, 150, 400);
    earthCamera.rotation.set(-0.3, 0, 0);
    earthRenderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    earthRenderer.setClearColor(0x000000, 0);
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    earthContainer.addEventListener("click", function(e){
    	mouse.x = (e.clientX / window.innerWidth ) * 2 - 1;
    	mouse.y = -(e.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, earthCamera);
        var intersects = raycaster.intersectObjects(earthScene.children);
        if (intersects.length) {
            // intersects[0].object.material.color.set(0xff0000);
            console.log(intersects[0].object.country.code);
            intersects[0].object.country.meshes.forEach(function(m){
                m.material.color.set(0xff0000);
            });
            // console.log(intersects[0].point);
        }
    });

    setEarthRenderSize();
    window.addEventListener("resize", setEarthRenderSize);
    earthContainer.appendChild(earthRenderer.domElement);

    var light = new THREE.SpotLight(0xffffff, 1);
	// light.position.set(5, 3, 7);
	light.position.set(900, 500, 1300);
    earthScene.add(light);
    earthScene.add(new THREE.AmbientLight(0x505050));

    // var geometry = new THREE.SphereGeometry(180, 32, 32);
    // var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
    // var mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 0, 0);
    // earthScene.add(mesh);

    // Extrude Test
    // var shapeA = new THREE.Shape();
    // var shapeB = new THREE.Shape();
    // shapeA.moveTo(0, 0);
    // shapeA.lineTo(90, 0);
    // shapeA.lineTo(90, 90);
    // shapeA.lineTo(0, 90);
    // shapeA.lineTo(0, 0);
    // shapeA.lineTo(-90, 0);
    // shapeA.lineTo(-90, -90);
    // shapeA.lineTo(0, -90);
    // shapeA.lineTo(0, 0);
    //
    // // shapeA.moveTo(-10, 0);
    // // shapeA.lineTo(-100, 0);
    // // shapeA.lineTo(-100, 90);
    // // shapeA.lineTo(-10, 90);
    // // shapeA.lineTo(-10, 0);
    //
    // shapeB.moveTo(90, 0);
    // shapeB.lineTo(180, 0);
    // shapeB.lineTo(180, 90);
    // shapeB.lineTo(90, 90);
    // shapeB.lineTo(90, 0);
    // var geometryA = new THREE.ExtrudeGeometry(shapeA, {
    //     amount: 180,
    //     bevelEnabled: false,
    // });
    // var materialA = new THREE.MeshLambertMaterial({color: 0x0000ff});
    // var meshA = new THREE.Mesh(geometryA, materialA);
    // earthScene.add(meshA);
    // var geometryB = new THREE.ExtrudeGeometry(shapeB, {
    //     amount: 90,
    //     bevelEnabled: false,
    // });
    // var materialB = new THREE.MeshLambertMaterial({color: 0x0000ff});
    // var meshB = new THREE.Mesh(geometryB, materialB);
    // earthScene.add(meshB);

    // Mouse over
    // var meshes = new Array(5);
    // var width = 180;
    // var pos = new THREE.Vector3();
    // for (var i = 0; i<meshes.length; i++) {
    //     pos.x = width*i/(meshes.length-1)-(width/2);
    //     pos.z = width*i/(meshes.length-1)-(width/2);
    //     // meshes[i] = new THREE.Mesh(geometry, material);
    //     meshes[i] = new THREE.Mesh(
    //         new THREE.SphereGeometry(50, 32, 32),
    //         new THREE.MeshLambertMaterial({color: 0x0000ff})
    //     );
    //     meshes[i].position.set(pos.x, pos.y, pos.z);
    //     earthScene.add(meshes[i]);
    // }


    // Länderkürzel abfragen
    // var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=45,7&sensor=false";
    // $.getJSON(url, function (data) {
    //     if (data.results && data.results[0]) {
    //         for (var i = 0; i < data.results[0].address_components.length; i++) {
    //             if (data.results[0].address_components[i].types.indexOf ('country') > -1) {
    //                 console.log(data.results[0].address_components[i].short_name);
    //                 break;
    //             }
    //         }
    //     }
    // });

    THREE.Triangulation.setLibrary( THREE.Triangulation.libraries.earcut );
    var earth = new Earth(200, earthScene);
    var i = 1;
    // $.ajax(window.location+"img/map-test2.svg", {
    // $.ajax(window.location+"img/map-test.svg", {
    $.ajax(window.location+"img/earth.svg", {
        success: function(svg){
            var paths = svg.querySelectorAll(".country");
            paths.forEach(function(el){
                // console.log(i++);
                el.classList.remove("country");
                // var code = el.getAttribute("class");
                // pathString = el.getElementsByTagName("path")[0].getAttribute("d");
                earth.addPath(
                    el.getAttribute("class"),
                    el.getElementsByTagName("path")[0].getAttribute("d")
                );
            });
            earth.transform();
            console.log("fertig");
        },
    });


    // http://stackoverflow.com/questions/17604071/parse-xml-using-javascript
    // var xml = "";
    // if (window.DOMParser){
    //     parser = new DOMParser();
    //     xmlDoc = parser.parseFromString(txt, "text/xml");
    // } else { // Internet Explorer
    //     xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //     xmlDoc.async = false;
    //     xmlDoc.loadXML(txt);
    // }

    earthRenderLoop();
}

function earthRenderLoop(){
    // earthScene.children.forEach(function(item){
    //     item.rotation.y += 0.02;
    // });

    // raycaster.setFromCamera(mouse, earthCamera);
    // var intersects = raycaster.intersectObjects(earthScene.children);
    // if (intersects.length) {
    //     intersects[0].object.material.color.set(0xff0000);
    //     console.log(intersects[0].point);
    // }

    requestAnimationFrame(earthRenderLoop);
    earthRenderer.render(earthScene, earthCamera);
}

function setEarthRenderSize(){
    earthRenderer.setSize(
        earthContainer.getBoundingClientRect().width,
        earthContainer.getBoundingClientRect().height
    );
    earthCamera.aspect = earthContainer.getBoundingClientRect().width / earthContainer.getBoundingClientRect().height;
    earthCamera.updateProjectionMatrix();
}

init();

});
