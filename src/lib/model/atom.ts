interface Atom {
    label: string;
    x: number;
    y: number;
    i: string;
    enhancedStereo?: {
        type: string;
        group: number;
    };
}

interface Bond {
    b: number;
    e: number;
    i: string;
}

interface MoleculeData {
    atoms: Atom[];
    bonds: Bond[];
    rings: any[];
}