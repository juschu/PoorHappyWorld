window.addEventListener("load", function(){

var earthContainer;
var earthScene;
var earthCamera;
var earthRenderer;

function init(){
    earthContainer = document.querySelector("div#earth-container");
    earthScene = new THREE.Scene();
    earthCamera = new THREE.PerspectiveCamera(
        75,
        earthContainer.getBoundingClientRect().width / earthContainer.getBoundingClientRect().height,
        0.1,
        1000
    );
    earthRenderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    setEarthRenderSize();
    window.addEventListener("resize", setEarthRenderSize);
    earthContainer.appendChild(earthRenderer.domElement);

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
    var mesh = new THREE.Mesh(geometry, material);
    earthScene.add(mesh);

    earthCamera.position.z = 5;

    earthRenderLoop();
}

function earthRenderLoop(){
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
