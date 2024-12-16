import * as THREE from 'three';
import {Texture} from "three";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path : string) : Texture{
    const texture : Texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return texture
}

const textures = {
    dirt: loadTexture('src/textures/dirt.png'),
    grass: loadTexture('src/textures/grass_carried.png'),
    grassSide: loadTexture('src/textures/grass_side_carried.png'),
    stone: loadTexture('src/textures/stone.png'),
    coalOre: loadTexture('src/textures/coal_ore.png'),
    ironOre: loadTexture('src/textures/iron_ore.png'),
}

export const blocks = {
    empty: {
        id: 0,
        name: 'empty',
        color: 0xffffff,
        material: [new THREE.MeshLambertMaterial()]
    },
    grass: {
        id: 1,
        name: 'grass',
        color: 0x559020,
        material: [
            new THREE.MeshLambertMaterial({map: textures.grassSide}),
            new THREE.MeshLambertMaterial({map: textures.grassSide}),
            new THREE.MeshLambertMaterial({map: textures.grass}),
            new THREE.MeshLambertMaterial({map: textures.dirt}),
            new THREE.MeshLambertMaterial({map: textures.grassSide}),
            new THREE.MeshLambertMaterial({map: textures.grassSide}),
        ]
    },
    dirt: {
        id: 2,
        name: 'dirt',
        color: 0x807020,
        material: new THREE.MeshLambertMaterial({map: textures.dirt})
    },
    stone: {
        id: 3,
        name: 'stone',
        color: 0xb9b0a4,
        scale: {x: 30, y: 30, z: 30},
        scarcity: 0.5,
        material: new THREE.MeshLambertMaterial({map: textures.stone})
    },
    coalOre: {
        id: 4,
        name: 'coalOre',
        color: 0x161616,
        scale: {x: 20, y: 20, z: 20},
        scarcity: 0.8,
        material: new THREE.MeshLambertMaterial({map: textures.coalOre})
    },
    ironOre: {
        id: 5,
        name: 'ironOre',
        color: 0x4e4f55,
        scale: {x: 60, y: 60, z: 60},
        scarcity: 0.9,
        material: new THREE.MeshLambertMaterial({map: textures.ironOre})
    }
}

export const resources = [
    blocks.stone,
    blocks.coalOre,
    blocks.ironOre
]