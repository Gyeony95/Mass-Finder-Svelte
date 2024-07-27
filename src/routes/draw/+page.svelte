<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Molecule } from '$lib/model/atom';

	let sketcher: ChemDoodle.SketcherCanvas;
	let molecularFormula = writable('');
	let monoisotopicWeight = writable('');

	onMount(() => {
		// 기초 셋팅  ex. https://web.chemdoodle.com/tutorial/2d-structure-canvases/sketcher-canvas 참고
		ChemDoodle.ELEMENT['H'].jmolColor = 'black';
		ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
		sketcher = new ChemDoodle.SketcherCanvas('sketcher', 500, 300, {
			useServices: true,
			oneMolecule: true // 분자구조 한개만 그리게 처리
		});
		sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
		sketcher.styles.atoms_useJMOLColors = true;
		sketcher.styles.bonds_clearOverlaps_2D = true;
		sketcher.styles.shapes_color = 'c10000';
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
		console.log('Molecular Weight:', molecule.getMonoisotopicMass());
		console.log('ghghgh ' + asString);
		console.log(molecule.getMolecularFormula()); // "C5H12"

		molecularFormula.set(molecule.getMolecularFormula());
		monoisotopicWeight.set(molecule.getMonoisotopicMass().toString());
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
	<h1>Chemical Draw Canvas</h1>
	<canvas id="sketcher" width="500" height="500" />
	<button on:click={onTapButton}>Calulate Chem</button>
	{#if molecularFormula}
		<p>molecularFormula : {$molecularFormula}</p>
	{/if}
	{#if monoisotopicWeight}
		<p>monoisotopicWeight : {$monoisotopicWeight}</p>
	{/if}
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
