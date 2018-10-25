$(function(){

    let camera;
    let scene;
    let renderer;
    let stats;
    let gui;

    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function initStats(){
        let stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById('Stats-output').appendChild(stats.domElement);
        return stats;
    }

    function init() {
        gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'bouncingSpeed', 0, 0.5);
        
        stats = initStats();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
    
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
    
        let axes = new THREE.AxisHelper(20); //坐标轴对象
        scene.add(axes);
        scene.add(spotLight);
    
        let planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
        let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x =- 0.5*Math.PI;
        
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
    
        scene.add(plane);
        
        let cubeGeometry = new THREE.CubeGeometry(4,4,4);
        let cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
    
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
    
        scene.add(cube);
    
        let sphereGeometry = new THREE.SphereGeometry(4,20,20);
        let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
    
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
    
        scene.add(sphere);
    
        camera.position.x = -50;
        camera.position.y = 40; 
        camera.position.z = 100;
        camera.lookAt(scene.position);
    
        $('#WebGL-output').append(renderer.domElement);
        renderScene();
    
        var step = 0;
        function renderScene() {
            stats.update();

            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            step += controls.bouncingSpeed;
            sphere.position.x = 20 + (10*(Math.cos(step)));
            sphere.position.y = 2 + (10*(Math.abs(Math.sin(step))));
    
            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
        }
    
    }// init-end

    init();

    window.addEventListener('resize', onResize, false);   
})