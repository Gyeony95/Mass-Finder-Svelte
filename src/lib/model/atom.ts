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

    // 각 분자별 무게
    private atomicWeights: { [key: string]: number } = {
        'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.01, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
        'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974, 'S': 32.06, 'Cl': 35.45, 'Ar': 39.948,
        'K': 39.098, 'Ca': 40.078, 'Sc': 44.956, 'Ti': 47.867, 'V': 50.9415, 'Cr': 51.996, 'Mn': 54.938, 'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693, 'Cu': 63.546, 'Zn': 65.38,
        'Ga': 69.723, 'Ge': 72.63, 'As': 74.922, 'Se': 78.971, 'Br': 79.904, 'Kr': 83.798, 'Rb': 85.468, 'Sr': 87.62, 'Y': 88.906, 'Zr': 91.224,
        'Nb': 92.906, 'Mo': 95.95, 'Tc': 98, 'Ru': 101.07, 'Rh': 102.91, 'Pd': 106.42, 'Ag': 107.87, 'Cd': 112.41, 'In': 114.82, 'Sn': 118.71,
        'Sb': 121.76, 'Te': 127.60, 'I': 126.90, 'Xe': 131.29, 'Cs': 132.91, 'Ba': 137.33, 'La': 138.91, 'Ce': 140.12, 'Pr': 140.91, 'Nd': 144.24,
        'Pm': 145, 'Sm': 150.36, 'Eu': 151.96, 'Gd': 157.25, 'Tb': 158.93, 'Dy': 162.50, 'Ho': 164.93, 'Er': 167.26, 'Tm': 168.93, 'Yb': 173.05, 'Lu': 174.97,
        'Hf': 178.49, 'Ta': 180.95, 'W': 183.84, 'Re': 186.21, 'Os': 190.23, 'Ir': 192.22, 'Pt': 195.08, 'Au': 196.97, 'Hg': 200.59, 'Tl': 204.38, 'Pb': 207.2,
        'Bi': 208.98, 'Po': 209, 'At': 210, 'Rn': 222, 'Fr': 223, 'Ra': 226, 'Ac': 227, 'Th': 232.04, 'Pa': 231.04, 'U': 238.03
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

    /// fomular 계산 함수
    getMolecularFormula(): string {
        const elementCount: { [key: string]: number } = {};
        const hydrogenCount: { [key: string]: number } = {};

        /// ## 1. 원소 개수 세기
        this.atoms.forEach(atom => {
            // Map에 각 원소가 이미 있으면 value 에 1을 더해주고 없으면 새로 추가 후 value를 1로 셋팅
            if (elementCount[atom.label]) {
                elementCount[atom.label]++;
            } else {
                elementCount[atom.label] = 1;
            }
        });

        /// ## 2. 수소 원자 개수 계산
        this.atoms.forEach(atom => {
            // 각 원소별 최대 결합의 수
            const valence = this.valenceElectrons[atom.label] || 0;
            // 해당 원자에 연결된 진짜 결합의 수
            const bonds = this.bonds.filter(bond => bond.a1.pid === atom.pid || bond.a2.pid === atom.pid);
            // 최대 결합수 - 진짜 겹합수 해서 필요한 수소의 갯수 가져옴
            const hydrogenNeeded = valence - bonds.length;
            if (hydrogenNeeded > 0) {
                hydrogenCount['H'] = (hydrogenCount['H'] || 0) + hydrogenNeeded;
            }
        });

        // 위에서 더 필요한 수소가 있다고 판된됐을때 총 수소의 수에 더해줌
        if (hydrogenCount['H']) {
            elementCount['H'] = (elementCount['H'] || 0) + hydrogenCount['H'];
        }

        /// ## 3. 화학식 생성
        // 각 요소를 순회하면서 갯수를 도출하여 join
        return Object.keys(elementCount).map(element => {
            const count = elementCount[element];
            return count > 1 ? `${element}${count}` : element;
        }).join('');
    }

    /// 분자량 계산 함수
    getMolecularWeight(): number {
        const formula = this.getMolecularFormula();
        const elementPattern = /([A-Z][a-z]*)(\d*)/g;
        let match;
        let molecularWeight = 0;

        while ((match = elementPattern.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            const atomicWeight = this.atomicWeights[element] || 0;
            molecularWeight += atomicWeight * count;
        }

        return molecularWeight;
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