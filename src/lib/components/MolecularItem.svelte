<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	export let index;
	export let deleteData;

	onMount(() => {
		let canvasId = `canvas-${index}`;

		setTimeout(() => {
			ChemDoodle.ELEMENT['H'].jmolColor = 'black';
			ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
			let myCanvas = new ChemDoodle.ViewerCanvas(canvasId, 150, 150);
			myCanvas.styles.bonds_width_2D = 0.6;
			myCanvas.styles.bonds_saturationWidthAbs_2D = 2.6;
			myCanvas.styles.bonds_hashSpacing_2D = 2.5;
			myCanvas.styles.atoms_font_size_2D = 10;
			myCanvas.styles.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
			myCanvas.styles.atoms_displayTerminalCarbonLabels_2D = true;
			let mol = new ChemDoodle.io.JSONInterpreter().molFrom(data.moleculeJson);
			myCanvas.loadMolecule(mol);
			myCanvas.repaint();
		}, 100);
	});
</script>

<div class="data-item">
	<div class="info">
		<p>Molecular Formula: {data.molecularFormula}</p>
		<p>Monoisotopic Weight: {data.monoisotopicWeight}</p>
	</div>
	<canvas id={`canvas-${index}`} width="150" height="150" />
	<button on:click={() => deleteData(index)}>X</button>
</div>

<style>
	.data-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 15px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-top: 10px;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-right: 20px;
	}

	.info p {
		margin: 0;
	}

	button {
		width: 50px;
		height: 50px;
		background-color: #ff4d4d;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #ff3333;
	}

	button:active {
		background-color: #cc0000;
	}
</style>
