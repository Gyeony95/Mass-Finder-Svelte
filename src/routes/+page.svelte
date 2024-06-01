<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Molecule } from '$lib/model/atom';

	let sketcher: ChemDoodle.SketcherCanvas;
	let molecularFormula = writable('');

	onMount(() => {
		// changes the default JMol color of hydrogen to black so it appears on white backgrounds
		ChemDoodle.ELEMENT['H'].jmolColor = 'black';
		// darkens the default JMol color of sulfur so it appears on white backgrounds
		ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
		// initializes the SketcherCanvas
		sketcher = new ChemDoodle.SketcherCanvas('sketcher', 500, 300, {
			useServices: true,
			oneMolecule: false
		});
		// sets terminal carbon labels to display
		sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
		// sets atom labels to be colored by JMol colors, which are easy to recognize
		sketcher.styles.atoms_useJMOLColors = true;
		// enables overlap clear widths, so that some depth is introduced to overlapping bonds
		sketcher.styles.bonds_clearOverlaps_2D = true;
		// sets the shape color to improve contrast when drawing figures
		sketcher.styles.shapes_color = 'c10000';
		// because we do not load any content, we need to repaint the sketcher, otherwise we would just see an empty area with the toolbar
		// however, you can instead use one of the Canvas.load... functions to pre-populate the canvas with content, then you don't need to call repaint
		sketcher.repaint();
	});

	function onTapButton() {
		let mol = sketcher.getMolecule();
		let dummy = new ChemDoodle.io.JSONInterpreter().molTo(mol);
		let obj = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
		let asString = JSON.stringify(obj);
		const molecule = Molecule.fromJson(asString);

		console.log('Molecule JSON:', molecule.getMoleculeJson());
		console.log('Molecular Formula:', molecule.getMolecularFormula());
		console.log('ghghgh ' + asString);
		// // 프로판 구조 추출 및 화학식 생성
		// let atomCounts = countAtoms(mol);
		// atomCounts = addHydrogenAtoms(atomCounts, mol);
		// const molecularFormulaValue = createMolecularFormula(atomCounts);

		console.log(molecule.getMolecularFormula()); // "C5H12"
		molecularFormula.set(molecule.getMolecularFormula());
	}

	// // 원자 개수를 세는 함수
	// function countAtoms(json: any) {
	// 	const atomCounts: { [key: string]: number } = {};

	// 	json.atoms.forEach((atom: any) => {
	// 		const label = atom.label;
	// 		if (atomCounts[label]) {
	// 			atomCounts[label]++;
	// 		} else {
	// 			atomCounts[label] = 1;
	// 		}
	// 	});

	// 	return atomCounts;
	// }

	// // 수소 원자 추가 함수
	// function addHydrogenAtoms(atomCounts: { [key: string]: number }, json: any) {
	// 	// 각 탄소 원자가 4개의 결합을 갖도록 수소 원자를 추가합니다.
	// 	let carbonBonds: { [key: number]: number } = {};
	// 	json.bonds.forEach((bond: any) => {
	// 		if (bond.a1.label === 'C') {
	// 			if (carbonBonds[bond.a1.pid]) {
	// 				carbonBonds[bond.a1.pid]++;
	// 			} else {
	// 				carbonBonds[bond.a1.pid] = 1;
	// 			}
	// 		}
	// 		if (bond.a2.label === 'C') {
	// 			if (carbonBonds[bond.a2.pid]) {
	// 				carbonBonds[bond.a2.pid]++;
	// 			} else {
	// 				carbonBonds[bond.a2.pid] = 1;
	// 			}
	// 		}
	// 	});

	// 	// 탄소 원자마다 부족한 결합 수만큼 수소 원자를 추가합니다.
	// 	let hydrogenCount = 0;
	// 	for (const pid in carbonBonds) {
	// 		hydrogenCount += 4 - carbonBonds[pid];
	// 	}
	// 	atomCounts['H'] = hydrogenCount;
	// 	return atomCounts;
	// }

	// // 화학식 문자열을 만드는 함수
	// function createMolecularFormula(atomCounts: { [key: string]: number }) {
	// 	let formula = '';

	// 	for (const atom in atomCounts) {
	// 		formula += atom + atomCounts[atom];
	// 	}

	// 	return formula;
	// }
</script>

<svelte:head>
	<title>Mass Finder</title>
	<link rel="stylesheet" href="chem_doodle/install/ChemDoodleWeb.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/ChemDoodleWeb.js"></script>
	<link rel="stylesheet" href="chem_doodle/install/uis/jquery-ui-1.11.4.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/uis/ChemDoodleWeb-uis.js"></script>
</svelte:head>

<main>
	<h1>Chemical Draw Canvas</h1>
	<canvas id="sketcher" width="500" height="500" />
	<button on:click={onTapButton}>Extract SMILES</button>
	<p>{$molecularFormula}</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background-color: #f5f5f5;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		margin: 40px auto;
	}

	h1 {
		font-family: 'Arial', sans-serif;
		font-size: 24px;
		color: #333;
		margin-bottom: 20px;
	}

	canvas {
		border: 2px solid #ccc;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	button {
		margin-top: 20px;
		padding: 12px 24px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 25px;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.3s ease;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	button:hover {
		background-color: #0056b3;
	}

	button:active {
		background-color: #004494;
	}

	p {
		margin-top: 20px;
		font-size: 18px;
		color: #333;
	}
</style>
