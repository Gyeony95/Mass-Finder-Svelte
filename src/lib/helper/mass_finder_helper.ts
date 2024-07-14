import { AminoModel } from '$lib/model/AminoModel';
import type { IonType, FormyType } from '../../type/Types';

import {calculateSimilarity, sortAmino, removeDuplicates } from './mass_util';


let dataMap: { [key: string]: number } = {};
const topSolutionsCount = 20;
const saIterations = 100;
const initialTemperature = 10000.0;
const coolingRate = 0.99;
const absoluteTemperature = 0.00001;
const fWeight = 27.99;

export class MassFinderHelper {
    static formyType: FormyType = 'unknown';
    static ionType: IonType = 'unknown';

    static calcByIonType(targetMass: number, initAminos: string, fomyType: FormyType, ionType: IonType, aminoMap: { [key: string]: number }): AminoModel[] {
        this.ionType = ionType;
        let bestSolutions: AminoModel[] = [];
        switch (this.ionType) {
            case 'unknown':
                for (const i of ['H', 'Na', 'K'] as IonType[]) {
                    bestSolutions = bestSolutions.concat(this.calc(targetMass - this.getIonWeight(i), initAminos, fomyType, i, aminoMap));
                }
                bestSolutions = bestSolutions.map(e => new AminoModel({ ...e, weight: (e.weight ?? 0) + this.getIonWeight(e.ionType ?? 'unknown') }));
                bestSolutions = sortAmino(bestSolutions, targetMass).slice(0, topSolutionsCount);
                break;
            default:
                bestSolutions = this.calc(targetMass - this.getIonWeight(this.ionType), initAminos, fomyType, ionType, aminoMap);
                bestSolutions = bestSolutions.map(e => new AminoModel({ ...e, weight: (e.weight ?? 0) + this.getIonWeight(e.ionType ?? 'unknown') }));
        }
        bestSolutions = bestSolutions.map(e => new AminoModel({ ...e, similarity: calculateSimilarity(targetMass, e.weight ?? 0) }));
        return bestSolutions;
    }

    static calc(targetMass: number, initAminos: string, fomyType: FormyType, ionType: IonType, aminoMap: { [key: string]: number }): AminoModel[] {
        this.formyType = fomyType;
        dataMap = { ...aminoMap };
        let bestSolutions: AminoModel[] = [];
        const initAminoWeight = this.getInitAminoWeight(initAminos);
        targetMass -= initAminoWeight;

        const [minRange, maxRange] = this.getMinMaxRange(this.formyType, targetMass);
        for (let i = minRange; i < maxRange; i++) {
            const addWeight = this.getWaterWeight(i);
            let solutions = this.calcByFType(this.formyType, targetMass + addWeight);
            solutions = removeDuplicates(solutions);
            bestSolutions = bestSolutions.concat(solutions);
        }

        bestSolutions = sortAmino(bestSolutions, targetMass).slice(0, topSolutionsCount);
        bestSolutions = this.setInitAminoToResult(bestSolutions, initAminos, initAminoWeight);
        bestSolutions = this.setMetaData(bestSolutions, this.formyType, ionType, initAminos);

        bestSolutions.forEach(solution => {
            console.log(`combins : ${solution.code}, result : ${solution.weight}`);
        });

        return bestSolutions;
    }

    static calcByFType(fType: FormyType, targetMass: number): AminoModel[] {
        const bestSolutions: AminoModel[] = [];
        for (let i = 0; i < saIterations; i++) {
            switch (fType) {
                case 'no':
                    const solutionNo = this.simulatedAnnealing(targetMass);
                    bestSolutions.push(new AminoModel({ code: Object.keys(solutionNo)[0], weight: this.getWeightSum(Object.keys(solutionNo)[0]) }));
                    break;
                case 'yes':
                    const solutionYes = this.simulatedAnnealing(targetMass - fWeight);
                    bestSolutions.push(new AminoModel({ code: `f${Object.keys(solutionYes)[0]}`, weight: this.getWeightSum(`f${Object.keys(solutionYes)[0]}`) }));
                    break;
                case 'unknown':
                    const solutionUnknown1 = this.simulatedAnnealing(targetMass);
                    const solutionUnknown2 = this.simulatedAnnealing(targetMass - fWeight);
                    bestSolutions.push(new AminoModel({ code: Object.keys(solutionUnknown1)[0], weight: this.getWeightSum(Object.keys(solutionUnknown1)[0]) }));
                    bestSolutions.push(new AminoModel({ code: `f${Object.keys(solutionUnknown2)[0]}`, weight: this.getWeightSum(`f${Object.keys(solutionUnknown2)[0]}`) }));
                    break;
            }
        }
        return bestSolutions;
    }

    static simulatedAnnealing(targetMass: number): { [key: string]: number } {
        let temperature = initialTemperature;
        let currentSolution = this.randomSolution(targetMass);
        let currentEnergy = this.evaluate(currentSolution, targetMass);

        let bestSolution = [...currentSolution];
        let bestEnergy = currentEnergy;

        while (temperature > absoluteTemperature) {
            const newSolution = this.neighborSolution(currentSolution, targetMass);
            const newEnergy = this.evaluate(newSolution, targetMass);

            if (this.acceptanceProbability(currentEnergy, newEnergy, temperature) > Math.random()) {
                currentSolution = newSolution;
                currentEnergy = newEnergy;
            }

            if (currentEnergy < bestEnergy) {
                bestSolution = [...currentSolution];
                bestSolution.sort();
                bestEnergy = currentEnergy;
            }

            temperature *= coolingRate;
        }

        return { [bestSolution.join('')]: bestEnergy };
    }

    static randomSolution(targetMass: number): string[] {
        const solution: string[] = [];
        let mass = 0;
        while (mass < targetMass) {
            const aminoAcid = Object.keys(dataMap)[Math.floor(Math.random() * Object.keys(dataMap).length)];
            const aminoAcidMass = dataMap[aminoAcid];
            if (mass + aminoAcidMass > targetMass) break;
            solution.push(aminoAcid);
            mass += aminoAcidMass;
        }
        return solution;
    }

    static neighborSolution(currentSolution: string[], targetMass: number): string[] {
        const newSolution = [...currentSolution];
        if (newSolution.length > 0) {
            const index = Math.floor(Math.random() * newSolution.length);
            const newAminoAcid = Object.keys(dataMap)[Math.floor(Math.random() * Object.keys(dataMap).length)];
            newSolution[index] = newAminoAcid;

            while (this.evaluate(newSolution, targetMass) > targetMass) {
                newSolution.splice(Math.floor(Math.random() * newSolution.length), 1);
            }
        }
        return newSolution;
    }

    static evaluate(solution: string[], targetMass: number): number {
        const mass = solution.reduce((sum, gene) => sum + (dataMap[gene] ?? 0), 0);
        return Math.abs(targetMass - mass);
    }

    static acceptanceProbability(currentEnergy: number, newEnergy: number, temperature: number): number {
        return newEnergy < currentEnergy ? 1.0 : Math.exp((currentEnergy - newEnergy) / temperature);
    }

    static getWeightSum(solutionCombine: string): number {
        let result = solutionCombine.split('').reduce((sum, e) => sum + (dataMap[e] ?? 0), 0);
        if (solutionCombine.startsWith('f')) {
            result -= this.getWaterWeight(solutionCombine.length - 1);
            result += fWeight;
        } else {
            result -= this.getWaterWeight(solutionCombine.length);
        }
        return result;
    }

    static getWaterWeight(aminoLength: number): number {
        if (aminoLength === 0) return 0;
        return 18.01 * (aminoLength - 1);
    }

    static getMinMaxRange(type: FormyType, targetMass: number): [number, number] {
        const minValue = Math.min(...Object.values(dataMap));
        const maxValue = Math.max(...Object.values(dataMap));
        const max = type === 'yes' || type === 'unknown' ? Math.ceil(targetMass / fWeight) : Math.ceil(targetMass / minValue);
        const min = Math.floor(targetMass / maxValue);
        return [min, max];
    }

    static getInitAminoWeight(initAmino: string): number {
        const initAminoWaterWeight = this.getWaterWeight(initAmino.length + 1);
        let initAminoWeight = 0;
        if (initAmino) {
            for (const i of initAmino.split('')) {
                initAminoWeight += dataMap[i] ?? 0;
            }
        }
        return initAminoWeight - initAminoWaterWeight;
    }

    static setInitAminoToResult(bestSolutions: AminoModel[], initAmino: string, initAminoWeight: number): AminoModel[] {
        if (!initAmino) return bestSolutions;
        return bestSolutions.map(item => {
            if (!item.code) {
                return new AminoModel({ ...item, code: initAmino, weight: (item.weight ?? 0) + initAminoWeight });
            } else {
                const firstString = item.code[0];
                if (firstString === 'f') {
                    return new AminoModel({ ...item, code: `f${initAmino}${item.code.slice(1)}`, weight: (item.weight ?? 0) + initAminoWeight });
                } else {
                    return new AminoModel({ ...item, code: `${initAmino}${item.code}`, weight: (item.weight ?? 0) + initAminoWeight });
                }
            }
        });
    }

    static setMetaData(bestSolutions: AminoModel[], formyType: FormyType, ionType: IonType, essentialSeq: string): AminoModel[] {
        return bestSolutions.map(e => new AminoModel({ ...e, formyType, ionType, essentialSeq }));
    }

    static getIonWeight(ionType: IonType): number {
        switch (ionType) {
            case 'H': return 1.008;
            case 'Na': return 22.990;
            case 'K': return 39.098;
            case 'unknown': return 0;
            default: return 0;
        }
    }
}