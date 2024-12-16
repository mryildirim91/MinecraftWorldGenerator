import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import {blocks, resources} from "./blocks";

export function createUi(world : any) : void{
    const gui = new GUI();
    gui.add(world.size, 'width', 8, 128, 1).name('Width');
    gui.add(world.size, 'height', 8, 128, 1).name('Height');

    const terrainFolder : GUI = gui.addFolder('Terrain');
    terrainFolder.add(world.params, 'seed', 0, 10000).name('Seed');
    terrainFolder.add(world.params.terrain, 'scale', 10, 100).name('Scale');
    terrainFolder.add(world.params.terrain, 'magnitude', 0, 1).name('Magnitude');
    terrainFolder.add(world.params.terrain, 'offset', 0, 1).name('Offset');

    const resourcesFolder : GUI = gui.addFolder('Resources');

    resources.forEach(resource =>{
        const resourceFolder = resourcesFolder.addFolder(resource.name);
        resourceFolder.add(resource, 'scarcity', 0, 1).name('Scarcity');
        const scale : GUI = resourceFolder.addFolder('Scale');
        scale.add(resource.scale, 'x', 10, 100).name('X Scale');
        scale.add(resource.scale, 'y', 10, 100).name('Y Scale');
        scale.add(resource.scale, 'z', 10, 100).name('Z Scale');
    })

    gui.onChange(() : void =>{
        world.generate();
    });
}