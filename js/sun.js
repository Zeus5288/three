var log = console.log.bind(console);

var globeObj = (function() {
    'use strict';

    // 判断浏览器是否支持webgl
    if(!Detector.webgl) Detector.addGetWebGLMessage();

    var container;
    var camera, scene, renderer,controls,light;
    var groupEarth,groupMoon,groupPoint, groupSun,groupMu;
    var globeMesh,moonMesh,muMesh;
    var winWth = window.innerWidth, winHgt = window.innerHeight;

     function initControls() { 
          
         controls = new THREE.OrbitControls( camera, renderer.domElement ); 
         // 如果使用animate方法时，将此函数删除 
         //controls.addEventListener( 'change', render ); 
         // 使动画循环使用时阻尼或自转 意思是否有惯性 
         controls.enableDamping = true; 
         //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
         //controls.dampingFactor = 0.25; 
         //是否可以缩放 
         controls.enableZoom = true; 
         //是否自动旋转 
         controls.autoRotate = true; 
         //设置相机距离原点的最远距离 
         controls.minDistance = 1000; 
         //设置相机距离原点的最远距离 
         controls.maxDistance = 2000; 
         //是否开启右键拖拽 
         controls.enablePan = true; 
     }
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

     // 木星
     function mu() {
        var globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('images/textures/mu.jpg', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(120, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            muMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            muMesh.position.x = -500;
            muMesh.position.z = 500;
            groupMu.add(muMesh);
        });
    }

    // 地球
    function globe() {
        var globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('images/textures/earth.jpg', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(90, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            globeMesh.position.x = 800;
            globeMesh.position.z = 800;
            groupEarth.add(globeMesh);
        });
    }

    // 月球
    function moon() {
        var moonTextureLoader = new THREE.TextureLoader();
        moonTextureLoader.load('images/textures/moon.jpg', function (texture) {
            var moonGgeometry = new THREE.SphereGeometry(30, 100, 100);
            var moonMaterial = new THREE.MeshStandardMaterial({map: texture});
            moonMesh = new THREE.Mesh(moonGgeometry, moonMaterial);
            moonMesh.position.x = 800;
            moonMesh.position.z = 800;
            groupEarth.add(moonMesh);
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
        hemisphereLight.position.z = 0;
        scene.add(hemisphereLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0,0,0);
        scene.add(spotLight);

        light = new THREE.PointLight(0xffffff, 5, 10000);

        let loader = new THREE.TextureLoader();
        // 添加镜头炫光
        let textFlare0 = loader.load("images/textures/sun.png");
        let textFlare3 = loader.load("images/textures/sun2.png");

        let lensFlare = new THREE.Lensflare();

        lensFlare.addElement(new THREE.LensflareElement(textFlare0, 500, 0, light.color));
        // lensFlare.addElement(new THREE.LensflareElement(textFlare3, 60, 0.6, light.color));
        // lensFlare.addElement(new THREE.LensflareElement(textFlare3, 100, 0.7, light.color));
        // lensFlare.addElement(new THREE.LensflareElement(textFlare3, 60, 0.9, light.color));
        // lensFlare.addElement(new THREE.LensflareElement(textFlare3, 70, 1, light.color));

        light.add(lensFlare);
        light.position.set(0, 0, 0);

        scene.add(light);

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
        camera.position.z = 2000;
        camera.lookAt(0,0,0);

        groupSun = new THREE.Group();
        groupEarth = new THREE.Group();
        groupMu = new THREE.Group();
        groupMoon = new THREE.Group();
        groupPoint = new THREE.Group();
        
        scene.add(groupSun);
        scene.add(groupMu);
        scene.add(groupEarth);
        scene.add(groupMoon);
        scene.add(groupPoint);

        //太阳
        // sun();

        //木星
        mu();

        // 地球    
        globe();

        //月球
        moon();

        // // 星点
        // stars();

        // 半球光
        lights();

        // 渲染器
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, 
            preserveDrawingBuffer: true
        });
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

    var speed = 0;

    // 渲染
    function render() {
        groupEarth.rotation.y -= 0.004;
        globeMesh.rotation.y += 0.01;
       
        groupMu.rotation.y -= 0.01;
        muMesh.rotation.y += 0.04;

        moonMesh.position.x = 800 + 200*(Math.cos(speed));
        moonMesh.position.z = 800 + 200*(Math.sin(speed));
        moonMesh.rotation.y += 0.05;
        speed -= 0.04;
        renderer.render(scene, camera);
    }

    // 动画
    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        render();
    }

    init();
    initControls();
    animate();
    
})();