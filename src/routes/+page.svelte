<script lang="ts">
	import { onMount } from 'svelte';

	let sketcher: ChemDoodle.SketcherCanvas;

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
		console.log('ghghgh ' + asString);
		// 프로판 구조 추출 및 화학식 생성
		let atomCounts = countAtoms(mol);
		atomCounts = addHydrogenAtoms(atomCounts);
		const molecularFormula = createMolecularFormula(atomCounts);

		console.log(molecularFormula); // "C3H8"
	}

	// 원자 개수를 세는 함수
	function countAtoms(json: any) {
		const atomCounts: { [key: string]: number } = {};

		json.atoms.forEach((atom: any) => {
			const label = atom.label;
			if (atomCounts[label]) {
				atomCounts[label]++;
			} else {
				atomCounts[label] = 1;
			}
		});

		return atomCounts;
	}

	// 프로판의 수소 원자 추가 함수
	function addHydrogenAtoms(atomCounts: { [key: string]: number }) {
		// 프로판(C3H8)의 수소 원자 개수는 8
		atomCounts['H'] = 8;
		return atomCounts;
	}

	// 화학식 문자열을 만드는 함수
	function createMolecularFormula(atomCounts: { [key: string]: number }) {
		let formula = '';

		for (const atom in atomCounts) {
			formula += atom + atomCounts[atom];
		}

		return formula;
	}
</script>

<svelte:head>
	<title>Mass Finder</title>
	<link rel="stylesheet" href="chem_doodle/install/ChemDoodleWeb.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/ChemDoodleWeb.js"></script>
	<link rel="stylesheet" href="chem_doodle/install/uis/jquery-ui-1.11.4.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/uis/ChemDoodleWeb-uis.js"></script>
</svelte:head>

<main>
	<h1>ChemDoodle Web Components Example</h1>
	<canvas id="sketcher" width="500" height="500" />
	<button on:click={onTapButton}>Extract SMILES</button>
</main>

<style>
	h1 {
		text-align: center;
		margin-bottom: 20px;
	}

	canvas {
		display: block;
		margin: 0 auto;
		border: 1px solid #ccc;
	}

	button {
		display: block;
		margin: 20px auto;
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
