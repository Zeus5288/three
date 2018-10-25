var log = console.log.bind(console);

var globeObj = (function() {
    'use strict';

    // 判断浏览器是否支持webgl
    if(!Detector.webgl) Detector.addGetWebGLMessage();

    var container;
    var camera, scene, renderer;
    var groupEarth,groupMoon,groupPoint, groupSun;
    var winWth = window.innerWidth, winHgt = window.innerHeight;

    // 太阳
    function sun() {
 
        var sunGgeometry = new THREE.SphereGeometry(230, 100, 100);
        var sunMaterial = new THREE.MeshLambertMaterial({
            color: 0xffff00,
            emissive: 0xff0000
        });
        var sunMesh = new THREE.Mesh(sunGgeometry, sunMaterial);
        groupSun.add(sunMesh);

    }

    // 地球
    function globe() {
        var globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('images/textures/earth.jpg', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(90, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            globeMesh.position.x = 400;
            globeMesh.position.z = 400;
            groupEarth.add(globeMesh);
        });
    }

    // 月球
    function moon() {
        var moonTextureLoader = new THREE.TextureLoader();
        moonTextureLoader.load('images/textures/moon.jpg', function (texture) {
            var moonGgeometry = new THREE.SphereGeometry(50, 100, 100);
            var moonMaterial = new THREE.MeshStandardMaterial({map: texture});
            var moonMesh = new THREE.Mesh(moonGgeometry, moonMaterial);
            moonMesh.position.x = 400;
            moonMesh.position.z = 400;
            groupMoon.add(moonMesh);

        });
    }

    // 星点
    function stars() {
        var starsGeometry = new THREE.Geometry();
        for (var i = 0; i < 2000; i ++) {
            var starVector = new THREE.Vector3(
                THREE.Math.randFloatSpread(500),
                THREE.Math.randFloatSpread(50),
                THREE.Math.randFloatSpread(500)
            );
            starsGeometry.vertices.push(starVector);
        }
        var starsMaterial = new THREE.PointsMaterial({color: 0x00ffff})
        var starsPoint = new THREE.Points(starsGeometry, starsMaterial);
        groupPoint.add(starsPoint);
    }

    // 光
    function lights() {
        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
        hemisphereLight.position.x = 0;
        hemisphereLight.position.y = 0;
        hemisphereLight.position.z = -200;
        scene.add(hemisphereLight);
    }

    // 初始化
    function init() {
        container = document.getElementById('zh_globe_container');

        scene = new THREE.Scene();
        var bgTexture = new THREE.TextureLoader().load("images/textures/star.jpg");
        scene.background = bgTexture;

        camera = new THREE.PerspectiveCamera(50, winWth/winHgt, 1, 4000);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.position.x = 0;
        camera.position.y = 100;
        camera.position.z = 3333;
        camera.lookAt(0,0,0);

        groupSun = new THREE.Group();
        groupEarth = new THREE.Group();
        groupMoon = new THREE.Group();
        groupPoint = new THREE.Group();
        
        scene.add(groupSun);
        scene.add(groupEarth);
        scene.add(groupMoon);
        scene.add(groupPoint);

        //太阳
        sun();

        // 地球    
        globe();

        //月球
        moon();

        // // 星点
        stars();
    
        // 半球光
        lights();

        // 渲染器
        renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(winWth, winHgt);
        container.appendChild(renderer.domElement);

        // resize事件
        window.addEventListener('resize', onWindowResize, false);
    }

    // 窗口大小改变
    function onWindowResize() {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // 渲染
    function render() {
        groupEarth.rotation.y -= 0.01;
        groupMoon.rotation.y -= 0.05;
        renderer.render(scene, camera);
    }

    // 动画
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    init();
    animate();
    
})();