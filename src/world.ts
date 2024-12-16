import * as THREE from 'three';
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";
import {RandomNumberGenerator} from "./randomNumberGenerator";
import {blocks, resources} from "./blocks";

const geometry = new THREE.BoxGeometry();

export class World extends THREE.Group{

    private size: { width: number; height: number };
    private data : any = [];
    private params = {
        seed: 0,
        terrain: {
            scale: 30,
            magnitude:0.5,
            offset:0.2
        }
    }

    public constructor(size = { width : 64, height : 32 }) {
        super();
        this.size = size;
    }

    public generate() : void{
        const randomNumberGenerator = new RandomNumberGenerator(this.params.seed)
        this.initializeTerrain()
        this.generateResources(randomNumberGenerator)
        this.generateTerrain(randomNumberGenerator)
        this.generateMeshes()
    }

    private initializeTerrain() : void{
        this.data = [];
        for (let x : number = 0; x < this.size.width; x++){
            const slice : any = [];
            for(let y : number = 0; y < this.size.height; y++){
                const row : any = [];
                for(let z : number = 0; z < this.size.width; z++){
                    row.push({
                        id : blocks.empty.id,
                        instanceId: null
                    })
                }
                slice.push(row);
            }
            this.data.push(slice);
        }
    }

    private generateTerrain(rnd : any) : void{
        const simplex = new SimplexNoise(rnd);
        for (let x : number = 0; x < this.size.width; x++){
            for(let z : number = 0; z < this.size.width; z++){

                const value : number = simplex.noise(x / this.params.terrain.scale, z / this.params.terrain.scale)
                const scaledNoise : number = this.params.terrain.offset + this.params.terrain.magnitude * value;
                let height : number = Math.floor(this.size.height * scaledNoise);
                height = Math.max(0, Math.min(height, this.size.height - 1))

                for (let y : number = 0; y <= this.size.height; y++){
                    if(y < height && this.getBlock(x,y,z).id === blocks.empty.id){
                        this.setBlockId(x,y,z,blocks.dirt.id)
                    }
                    else if(y === height){
                        this.setBlockId(x,y,z,blocks.grass.id)
                    }
                    else if(y > height) {
                        this.setBlockId(x,y,z,blocks.empty.id)
                    }
                }
            }
        }
    }

    private generateResources(rnd : any) : void{
        const simplex = new SimplexNoise(rnd);

        resources.forEach(resource =>{
            for (let x : number = 0; x < this.size.width; x++){
                for(let y : number = 0; y < this.size.height; y++){
                    for(let z : number = 0; z < this.size.width; z++){
                        const value : number = simplex.noise3d(x / resource.scale.x, y / resource.scale.y, z / resource.scale.z);
                        if(value > resource.scarcity){
                            this.setBlockId(x, y, z, resource.id);
                        }
                    }
                }
            }
        })
    }

    private generateMeshes() : void {

        this.clear();
        const maxCount : number = Math.pow(this.size.width, 2) * this.size.height

        const meshes : Record<number, THREE.InstancedMesh> = {};
        Object.values(blocks).filter(blockType => blockType.id !== blocks.empty.id).forEach(blockType => {
            const mesh = new THREE.InstancedMesh(geometry, blockType.material, maxCount);
            mesh.name = blockType.name;
            meshes[blockType.id] = mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.count = 0;
        });


        const matrix = new THREE.Matrix4();
        const offset = 0.5;

        for (let x : number = 0; x < this.size.width; x++){
            for(let y : number = 0; y < this.size.height; y++){
                for(let z : number = 0; z < this.size.width; z++){
                    const blockId : any = this.getBlock(x,y,z).id
                    if(blockId === blocks.empty.id) continue;

                    const mesh : any = meshes[blockId];
                    const instanceId : number = mesh.count;

                    if(!this.isBlockObscured(x,y,z)){
                        matrix.setPosition(x + offset,y + offset, z + offset);
                        mesh.setMatrixAt(instanceId, matrix);
                        this.setBlockInstanceId(x,y,z,instanceId);
                        mesh.count++;
                    }
                }
            }
        }

        this.add(...Object.values(meshes) as THREE.Object3D[]);
    }

    private getBlock(x : number, y : number, z : number) : any{
        if(this.inBounds(x,y,z)){
            return this.data[x][y][z];
        }else {
            return null;
        }
    }

    private inBounds(x: number, y: number, z: number) : boolean {
        return x >= 0 && x < this.size.width &&
            y >= 0 && y < this.size.height &&
            z >= 0 && z < this.size.width;
    }

    private setBlockId(x: number, y: number, z: number, id : number) : void{
        if(this.inBounds(x,y,z)){
            this.data[x][y][z].id = id;
        }
    }

    private setBlockInstanceId(x: number, y: number, z: number, instanceId : number) : void{
        if(this.inBounds(x,y,z)){
            this.data[x][y][z].instanceId = instanceId;
        }
    }

    private isBlockObscured(x : number, y : number, z : number) : boolean{
        const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
        const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
        const left = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
        const right = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
        const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
        const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

        return !(up === blocks.empty.id ||
            down === blocks.empty.id ||
            left === blocks.empty.id ||
            right === blocks.empty.id ||
            forward === blocks.empty.id ||
            back === blocks.empty.id);
    }
}