import * as THREE from 'three';

// Planet class for Team B
export class PlanetB {
    constructor(scene, orbitRadius, orbitSpeed, teamBTextures, teamBModels) {
        this.models = teamBModels || [];
        this.spawnedModels = [];

        this.textures = teamBTextures;
        this.scene = scene;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
        this.angle = Math.random() * Math.PI * 2;

        // Create planet group
        this.group = new THREE.Group();

        // --- STEP 1: Planet ---
        const rockColorTexture = this.textures.planet.color;
        const rockNormalTexture = this.textures.planet.normal;
        const rockRoughnessTexture = this.textures.planet.roughness;

        const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({
            map: rockColorTexture,
            normalMap: rockNormalTexture,
            roughnessMap: rockRoughnessTexture,
            color: new THREE.Color('#8a5a42'),
            emissive: new THREE.Color('#66150a'),
            emissiveIntensity: 0.2
        });

        this.planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        this.planetMesh.castShadow = true;
        this.planetMesh.receiveShadow = true;
        this.group.add(this.planetMesh);

        // --- STEP 2: Moons ---
        const moon1ColorTexture = this.textures.moon1.color;
        const moon1NormalTexture = this.textures.moon1.normal;
        const moon1RoughnessTexture = this.textures.moon1.roughness;
        const moon2ColorTexture = this.textures.moon2.color;
        const moon2NormalTexture = this.textures.moon2.normal;
        const moon2RoughnessTexture = this.textures.moon2.roughness;

        this.moon1OrbitGroup = new THREE.Group();
        this.moon2OrbitGroup = new THREE.Group();

        const moon1Geometry = new THREE.SphereGeometry(0.35, 24, 24);
        const moon2Geometry = new THREE.SphereGeometry(0.55, 24, 24);

        const moon1Material = new THREE.MeshStandardMaterial({
            map: moon1ColorTexture,
            normalMap: moon1NormalTexture,
            roughnessMap: moon1RoughnessTexture,
            color: new THREE.Color('#8a8178')
        });

        const moon2Material = new THREE.MeshStandardMaterial({
            map: moon2ColorTexture,
            normalMap: moon2NormalTexture,
            roughnessMap: moon2RoughnessTexture,
            color: new THREE.Color('#9b7b67')
        });

        this.moon1Mesh = new THREE.Mesh(moon1Geometry, moon1Material);
        this.moon2Mesh = new THREE.Mesh(moon2Geometry, moon2Material);
        this.moon1Mesh.castShadow = true;
        this.moon1Mesh.receiveShadow = true;
        this.moon2Mesh.castShadow = true;
        this.moon2Mesh.receiveShadow = true;
        this.moon1Mesh.position.x = 3.0;
        this.moon2Mesh.position.x = 4.0;

        this.moon2OrbitGroup.rotation.y = Math.PI;
        this.moon1OrbitSpeed = 1.0;
        this.moon2OrbitSpeed = 0.5;
        this.moon1OrbitGroup.add(this.moon1Mesh);
        this.moon2OrbitGroup.add(this.moon2Mesh);
        this.group.add(this.moon1OrbitGroup);
        this.group.add(this.moon2OrbitGroup);

        // --- STEP 3: Place models evenly without collision ---
        // --- STEP 3: Place models closer to the planet ---
        const planetRadius = 2;
        const numModels = this.models.length;

        // Compute angular widths for each model
        const modelAngles = [];
        let totalAngle = 0;

        this.models.forEach((gltf, i) => {
            const model = gltf.scene.clone(true);
            const modelScale = (i >= numModels - 2) ? 0.45 : 0.65;
            model.scale.set(modelScale, modelScale, modelScale);

            const bbox = new THREE.Box3().setFromObject(model);
            const width = bbox.max.x - bbox.min.x;
            const angularWidth = width / planetRadius;
            modelAngles.push(angularWidth);
            totalAngle += angularWidth;
        });

        // Compute spacing
        let currentAngle = 0;
        const gap = (2 * Math.PI - totalAngle) / numModels;

        // Place models
        // Place models
        this.models.forEach((gltf, i) => {
            const model = gltf.scene.clone(true);

            // --- Custom scale per model ---
            let modelScale;
            if (gltf === teamBModels.robot1) {
                modelScale = 0.35; // smaller than other models but still visible
            } else {
                modelScale = 0.65; // normal size for others
            }
            model.scale.set(modelScale, modelScale, modelScale);

            const bbox = new THREE.Box3().setFromObject(model);
            const minY = bbox.min.y;

            const angle = currentAngle + modelAngles[i] / 2;
            const x = Math.cos(angle) * planetRadius * 0.70;
            const z = Math.sin(angle) * planetRadius * 0.70;
            const y = planetRadius * 0.70 - minY;

            model.position.set(x, y, z);

            // Face outward
            model.lookAt(new THREE.Vector3(0, planetRadius * 0.95, 0));
            model.rotation.y += Math.random() * 0.3;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.group.add(model);
            this.spawnedModels.push(model);

            currentAngle += modelAngles[i] + gap;
        });

        // --- STEP 4: Add group to scene ---
        this.scene.add(this.group);
    }

    update(delta) {
        // Planet orbit
        this.angle += this.orbitSpeed * delta * 30;
        this.group.position.x = Math.cos(this.angle) * this.orbitRadius;
        this.group.position.z = Math.sin(this.angle) * this.orbitRadius;

        // Planet rotation (optional)
        this.group.rotation.y += delta * 0.5;

        // Moons orbit
        this.moon1OrbitGroup.rotation.z += delta * this.moon1OrbitSpeed;
        this.moon2OrbitGroup.rotation.y += delta * this.moon2OrbitSpeed;
    }

    click(mouse, scene, camera) {
        // TODO: Raycasting code here
    }
}