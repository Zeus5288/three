//检测webgl的兼容性
if(!Detector.webgl) Detector.addGetWebGLMessage();
 
let scene;
let camera, renderer, sphere, controls, stats;
let ambientLight, spotLight;
let composer;
let clock;

main();
render();

function main() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(-10, 15, 35);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(new THREE.Color(0,0,0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false;

    clock = new THREE.Clock();

    ambientLight = new THREE.AmbientLight(0x181818);
    scene.add(ambientLight);

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(550, 100, 1000);
    spotLight.intensity = 0.6;
    scene.add(spotLight);

    //创建地球
    sphere = createMesh(new THREE.SphereGeometry(10, 60, 60));
    scene.add(sphere);

    document.getElementById("container").appendChild(renderer.domElement);

    /**
     * 添加渲染通道
     */
    //在当前场景和摄像机的基础上渲染一个新场景
    let renderPass = new THREE.RenderPass(scene, camera);
    //通过扫描线和失真来实现模拟电视屏幕的效果
    let effectFilm = new THREE.FilmPass(0.03, 0.03, 3000, false);
    //将渲染结果输出到屏幕
    effectFilm.renderToScreen = true;

    //渲染效果组合器，每个通道都按照传入的顺序执行
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectFilm);
        
    //菜单栏元素
    let guiFields = {
       
    };

    //新建一个菜单栏
    let gui = new dat.GUI();
   
    stats = initStats();
}

//创建一个Mesh
function createMesh(geometry) {

    //初始化纹理加载器
    let textureLoader = new THREE.TextureLoader();
    //加载图片
    let uniforms = {
        planetTexture:{value:textureLoader.load("images/planets/earth_atmos_2048.jpg")},
        specularTexture:{value:textureLoader.load("images/planets/earth_specular_2048.jpg")},
        normalTexture:{value:textureLoader.load("images/planets/earth_normal_2048.jpg")}
    };

    //创建phong材料，并进行相应图片的贴图
    let planetMaterial = new THREE.MeshPhongMaterial();
    planetMaterial.specularMap = uniforms.specularTexture.value;
    planetMaterial.specular = new THREE.Color(0x4444aa);

    planetMaterial.normalMap = uniforms.normalTexture.value;
    planetMaterial.map = uniforms.planetTexture.value;

    //新建一个mesh
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, [planetMaterial]);

    return mesh;
}

//渲染更新场景

function render() {
    stats.update();
    let delta = clock.getDelta();
    controls.update(delta);
    sphere.rotation.y += 0.002;
    requestAnimationFrame(render);

    //没有着色器通道系统默认为WebGLRenderer.render
    //使用着色器通道后，应使用使用composer.render
    composer.render(delta);
}

//左上角帧显示
function initStats() {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("stats").appendChild(stats.domElement);

    return stats;
}