export interface Atom {
    label: string;
    x: number;
    y: number;
    z: number;
    enhancedStereo?: {
        type: string;
        group: number;
    };
    pid: number;
}

export interface Bond {
    a1: Atom;
    a2: Atom;
    bondOrder: number;
    pid: number;
}

export interface MoleculeJson {
    atoms: Atom[];
    bonds: Bond[];
    rings: any[];
}

export class Molecule {
    private atoms: Atom[] = [];
    private bonds: Bond[] = [];
    private pidCounter: number = 0;

    // 각 원소의 결합 수를 정의하는 테이블
    private valenceElectrons: { [key: string]: number } = {
        'H': 1, 'He': 0, 'Li': 1, 'Be': 2, 'B': 3, 'C': 4, 'N': 3, 'O': 2, 'F': 1, 'Ne': 0,
        'Na': 1, 'Mg': 2, 'Al': 3, 'Si': 4, 'P': 3, 'S': 2, 'Cl': 1, 'Ar': 0,
        'K': 1, 'Ca': 2, 'Sc': 3, 'Ti': 4, 'V': 5, 'Cr': 6, 'Mn': 7, 'Fe': 6, 'Co': 5, 'Ni': 4, 'Cu': 3, 'Zn': 2,
        'Ga': 3, 'Ge': 4, 'As': 5, 'Se': 6, 'Br': 1, 'Kr': 0, 'Rb': 1, 'Sr': 2, 'Y': 3, 'Zr': 4,
        'Nb': 5, 'Mo': 6, 'Tc': 7, 'Ru': 6, 'Rh': 5, 'Pd': 4, 'Ag': 3, 'Cd': 2, 'In': 3, 'Sn': 4,
        'Sb': 5, 'Te': 6, 'I': 1, 'Xe': 0, 'Cs': 1, 'Ba': 2, 'La': 3, 'Ce': 4, 'Pr': 5, 'Nd': 6,
        'Pm': 7, 'Sm': 6, 'Eu': 5, 'Gd': 4, 'Tb': 3, 'Dy': 2, 'Ho': 1, 'Er': 0, 'Tm': 1, 'Yb': 2, 'Lu': 3,
        'Hf': 4, 'Ta': 5, 'W': 6, 'Re': 7, 'Os': 6, 'Ir': 5, 'Pt': 4, 'Au': 3, 'Hg': 2, 'Tl': 1, 'Pb': 2,
        'Bi': 3, 'Po': 4, 'At': 5, 'Rn': 6, 'Fr': 7, 'Ra': 6, 'Ac': 5, 'Th': 4, 'Pa': 3, 'U': 2
    };

    addAtom(label: string, x: number, y: number, z: number, stereoType?: string, stereoGroup?: number): Atom {
        const atom: Atom = {
            label,
            x,
            y,
            z,
            enhancedStereo: stereoType ? { type: stereoType, group: stereoGroup || 1 } : undefined,
            pid: this.pidCounter++
        };
        this.atoms.push(atom);
        return atom;
    }

    addBond(a1: Atom, a2: Atom, bondOrder: number): void {
        const bond: Bond = {
            a1,
            a2,
            bondOrder,
            pid: this.pidCounter++
        };
        this.bonds.push(bond);
    }

    getMoleculeJson(): MoleculeJson {
        return {
            atoms: this.atoms,
            bonds: this.bonds,
            rings: []
        };
    }

    getMolecularFormula(): string {
        const elementCount: { [key: string]: number } = {};
        const hydrogenCount: { [key: string]: number } = {};

        this.atoms.forEach(atom => {
            if (elementCount[atom.label]) {
                elementCount[atom.label]++;
            } else {
                elementCount[atom.label] = 1;
            }
        });

        this.atoms.forEach(atom => {
            const valence = this.valenceElectrons[atom.label] || 0;
            const bonds = this.bonds.filter(bond => bond.a1.pid === atom.pid || bond.a2.pid === atom.pid);
            const hydrogenNeeded = valence - bonds.length;
            if (hydrogenNeeded > 0) {
                hydrogenCount['H'] = (hydrogenCount['H'] || 0) + hydrogenNeeded;
            }
        });

        if (hydrogenCount['H']) {
            elementCount['H'] = (elementCount['H'] || 0) + hydrogenCount['H'];
        }

        return Object.keys(elementCount).map(element => {
            const count = elementCount[element];
            return count > 1 ? `${element}${count}` : element;
        }).join('');
    }

    static fromJson(jsonString: string): Molecule {
        const moleculeData: MoleculeJson = JSON.parse(jsonString);
        const molecule = new Molecule();

        const atomsMap: { [pid: number]: Atom } = {};

        moleculeData.atoms.forEach(atomData => {
            const atom = molecule.addAtom(
                atomData.label,
                atomData.x,
                atomData.y,
                atomData.z,
                atomData.enhancedStereo?.type,
                atomData.enhancedStereo?.group
            );
            atom.pid = atomData.pid; // Ensure we match the original pids
            atomsMap[atomData.pid] = atom;
        });

        moleculeData.bonds.forEach(bondData => {
            const a1 = atomsMap[bondData.a1.pid];
            const a2 = atomsMap[bondData.a2.pid];
            molecule.addBond(a1, a2, bondData.bondOrder);
        });

        return molecule;
    }
}