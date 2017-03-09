"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */

var Country = function () {
    function Country(code, earth) {
        _classCallCheck(this, Country);

        this.earth = earth;
        this.code = code;
        this.spaceMeshes = [];
        this.meshes = [];

        // TODO später ersetzen
        this.activeColor = 0xD92716;
        this.inactiveColor = 0x71DD12;
    }

    _createClass(Country, [{
        key: "addPath",
        value: function addPath(pathData, code) {
            var actions = [];
            if (typeof pathData == "string") {
                var matches = pathData.match(/[a-z][-|\d|\.|\s]*/gi);
                var m = void 0;
                matches.forEach(function (m) {
                    var cmd = m[0];
                    var data = m.substr(1).trim();
                    data = data.split(" ");
                    for (var i = 0; i < data.length / 2; i++) {
                        actions.push({
                            command: cmd,
                            x: parseFloat(data[i * 2]),
                            y: parseFloat(data[i * 2 + 1])
                        });
                    }
                });
            } else {
                actions = pathData;
            }

            // let shape = new THREE.Shape();
            var pos = new THREE.Vector2(0, 0);
            var start = new THREE.Vector2(0, 0);
            var moved = false;
            var a = void 0;
            for (var i = 0; i < actions.length; i++) {
                a = actions[i];
                if (a.command == "M" || a.command == "L") {
                    pos.x = a.x;
                    pos.y = a.y;
                } else if (a.command == "m" || a.command == "l") {
                    pos.x += a.x;
                    pos.y += a.y;
                }
                if (a.command == "M" || a.command == "m") {
                    if (moved) {
                        // shape.lineTo(start.x, start.y);
                        this.earth.borderCtx.lineTo(this.earth.mapLon2X(start.x), this.earth.mapLat2Y(start.y));
                        this.addPath(actions.slice(i));
                        this.earth.borderCtx.stroke();
                        this.earth.borderCtx.fill();
                        break;
                    } else {
                        moved = true;
                        // shape.moveTo(pos.x, pos.y);
                        this.earth.borderCtx.moveTo(this.earth.mapLon2X(pos.x), this.earth.mapLat2Y(pos.y));
                        start.x = pos.x;
                        start.y = pos.y;
                    }
                } else if (a.command == "L" || a.command == "l") {
                    // shape.lineTo(pos.x, pos.y);
                    this.earth.borderCtx.lineTo(this.earth.mapLon2X(pos.x), this.earth.mapLat2Y(pos.y));
                } else if (a.command == "Z" || a.command == "z") {
                    if (start.x != pos.x || start.y != pos.y) {
                        // shape.lineTo(start.x, start.y);
                        this.earth.borderCtx.lineTo(this.earth.mapLon2X(start.x), this.earth.mapLat2Y(start.y));
                        this.earth.borderCtx.stroke();
                        this.earth.borderCtx.fill();
                    }
                }
            }

            // let extrudeSettings = {
            //     amount: 1,
            //     bevelEnabled: false,
            // };
            // let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            // let material = new THREE.MeshLambertMaterial({color: this.inactiveColor});
            // // let mesh = new THREE.Mesh(geometry, material);
            // let mesh = new THREE.Mesh(geometry);
            // mesh.country = this;
            // // if (this.code != "TST")
            // //     app.earthScene.add(mesh);
            // this.spaceMeshes.push(mesh);
        }
    }, {
        key: "transform",
        value: function transform() {
            var that = this;
            if (
            // that.code == "RUS" ||
            // that.code == "CAN" ||
            // that.code == "USA" ||
            // that.code == "BRA" ||
            that.code == "TST" ||
            // true ||
            false) {
                this.spaceMeshes.forEach(function (spaceMesh) {
                    spaceMesh.geometry.vertices.forEach(function (vert) {
                        // console.log("transform vertex");
                        var rFactor = 0;
                        if (vert.z === 0) {
                            // Erdmittelpunkt
                            rFactor = 0.1; // bei 0 tritt bei der boolschen Operation ein Fehler auf
                            // vert.x = that.earth.pos.x;
                            // vert.y = that.earth.pos.y;
                        } else {
                            // Erdoberfläche
                            rFactor = 1.8;
                            // rFactor = 1.1;
                        }
                        var lon = vert.x;
                        var lat = vert.y;
                        vert.x = Math.sin(lon * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * that.earth.radius * rFactor;
                        vert.z = Math.cos(lon * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * that.earth.radius * rFactor;
                        vert.y = Math.sin(lat * Math.PI / 180) * that.earth.radius * rFactor;
                    });

                    if (that.code == "TST") {
                        // console.log("-----------------------");
                        // console.log("spaceMesh: %o", spaceMesh);
                        // console.log("that.earth.oceanMesh: %o", that.earth.oceanMesh);
                        var csgSpaceMesh = new ThreeBSP(spaceMesh);
                        var csgOceanMesh = new ThreeBSP(that.earth.oceanMesh);
                        // console.log("csgSpaceMesh: %o", csgSpaceMesh);
                        // console.log("csgOceanMesh: %o", csgOceanMesh);
                        var csgResult = csgOceanMesh.intersect(csgSpaceMesh);
                        // console.log("csgResult: %o", csgResult);
                        var mesh = csgResult.toMesh(new THREE.MeshLambertMaterial({ color: that.inactiveColor, side: THREE.DoubleSide }));
                        mesh.geometry.computeVertexNormals();
                        // console.log("mesh: %o", mesh);
                        mesh.country = that;
                        that.earth.scene.add(mesh);
                        that.meshes.push(mesh);
                    }

                    console.log("spaceMesh: %o", spaceMesh);

                    spaceMesh.geometry.faces.forEach(function (face) {
                        // console.log("face: %o", face);
                        [face.a, face.b, face.c].forEach(function (vertexIndex) {
                            var vector = new THREE.Vector3(spaceMesh.geometry.vertices[vertexIndex].x, spaceMesh.geometry.vertices[vertexIndex].y, spaceMesh.geometry.vertices[vertexIndex].z);
                            console.log("length: %d", vector.length());
                        });
                    });
                });
            }
        }
    }, {
        key: "setActive",
        value: function setActive() {
            var that = this;
            this.meshes.forEach(function (m) {
                m.material.color.set(that.activeColor);
            });
        }
    }, {
        key: "setInactive",
        value: function setInactive() {
            var that = this;
            this.meshes.forEach(function (m) {
                m.material.color.set(that.inactiveColor);
            });
        }
    }]);

    return Country;
}();