<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Molecule } from '$lib/model/atom';
	import MolecularItem from '$lib/components/MolecularItem.svelte';

	let sketcher: ChemDoodle.SketcherCanvas;
	let molecularFormula = writable('');
	let monoisotopicWeight = writable('');
	let moleculeJson = writable({});
	let savedData = writable([]);

	onMount(() => {
		// 기초 셋팅
		ChemDoodle.ELEMENT['H'].jmolColor = 'black';
		ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
		sketcher = new ChemDoodle.SketcherCanvas('sketcher', 500, 300, {
			useServices: false, // 허용안된 기능인거같아서 막음
			oneMolecule: true // 분자구조 한개만 그리게 처리
		});
		sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
		sketcher.styles.atoms_useJMOLColors = true;
		sketcher.styles.bonds_clearOverlaps_2D = true;
		sketcher.styles.shapes_color = 'c10000';
		sketcher.repaint();

		// 저장된 데이터 불러오기
		loadSavedData();
	});

	function onTapButton() {
		let mol = sketcher.getMolecule();
		let molJson = new ChemDoodle.io.JSONInterpreter().molTo(mol);
		let obj = new ChemDoodle.io.JSONInterpreter().molFrom(molJson);
		let asString = JSON.stringify(obj);
		moleculeJson.set(molJson);
		const molecule = Molecule.fromJson(asString);

		molecularFormula.set(molecule.getMolecularFormula());
		monoisotopicWeight.set(molecule.getMonoisotopicMass().toString());
	}

	/// 계산된 데이터 로컬 스토리지에 저장
	function saveData() {
		// 계산된게 없으면 리턴 처리
		if (Object.keys($moleculeJson).length === 0 && $moleculeJson.constructor === Object) {
			return alert('Please Calculate Data');
		}

		/// 계산된 데이터를 하나의 맵으로 만들어 저장
		const dataSet = {
			moleculeJson: $moleculeJson,
			molecularFormula: $molecularFormula,
			monoisotopicWeight: $monoisotopicWeight
		};
		// 기존 데이터 있으면 불러옴
		let storedData = JSON.parse(localStorage.getItem('moleculeData') || '[]');
		storedData.push(dataSet);
		localStorage.setItem('moleculeData', JSON.stringify(storedData));
		loadSavedData();
		alert('Data Saved!');
	}

	/// 저장된 데이터 불러오기
	function loadSavedData() {
		let storedData = JSON.parse(localStorage.getItem('moleculeData') || '[]');
		savedData.set(storedData);
	}

	/// 리스트에서 아이템 삭제
	function deleteData(index: number) {
		let storedData = JSON.parse(localStorage.getItem('moleculeData') || '[]');
		storedData.splice(index, 1);
		localStorage.setItem('moleculeData', JSON.stringify(storedData));
		loadSavedData();
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
	<br />
	<div class="buttons">
		<button on:click={onTapButton}>Calculate Chem</button>
		<button on:click={saveData}>Save Data</button>
	</div>
	{#if $molecularFormula || $monoisotopicWeight}
		<div class="results">
			{#if $molecularFormula}
				<p>Molecular Formula: {$molecularFormula}</p>
			{/if}
			{#if $monoisotopicWeight}
				<p>Monoisotopic Weight: {$monoisotopicWeight}</p>
			{/if}
		</div>
	{/if}
	<h2 class="results">Saved Molecule Data</h2>
	<ul>
		{#each $savedData as data, index}
			<li>
				<MolecularItem {data} {index} {deleteData} />
			</li>
		{/each}
	</ul>
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
		max-width: 800px;
		margin: 40px auto;
	}

	h1,
	h2 {
		font-family: 'Arial', sans-serif;
		color: #333;
		margin-bottom: 20px;
		text-align: center;
	}

	canvas {
		border: 2px solid #ccc;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	.buttons {
		display: flex;
		gap: 20px;
		margin-bottom: 20px;
	}

	button {
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

	.results {
		width: 100%;
		text-align: left;
		margin-bottom: 20px;
	}

	.results p {
		margin: 0;
		padding: 10px;
		background-color: #e9e9e9;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		font-size: 18px;
		color: #333;
	}

	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
	}

	li {
		display: flex;
		justify-content: left;
	}
</style>
