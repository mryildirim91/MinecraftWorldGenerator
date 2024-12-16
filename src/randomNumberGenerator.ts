
export class RandomNumberGenerator{

    private minValue: number;
    private maxValue: number;
    private readonly mask: number = 0xffffffff;

    public constructor(seed: number) {
        this.minValue = (123456789 + seed) & this.mask;
        this.maxValue = (987654321 - seed) & this.mask;
    }

    public random(): number {
        this.maxValue = (36969 * (this.maxValue & 65535) + (this.maxValue >> 16)) & this.mask;
        this.minValue = (18000 * (this.minValue & 65535) + (this.minValue >> 16)) & this.mask;

        let result : number = ((this.maxValue << 16) + (this.minValue & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }
}