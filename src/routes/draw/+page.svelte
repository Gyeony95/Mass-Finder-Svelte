<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Molecule } from '$lib/model/atom';

	let sketcher: ChemDoodle.SketcherCanvas;
	let molecularFormula = writable('');
	let monoisotopicWeight = writable('');
	let moleculeJson = writable('');
	let savedData = writable([]);

	onMount(() => {
		// 기초 셋팅
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

		// 저장된 데이터 불러오기
		loadSavedData();
	});

	function onTapButton() {
		let mol = sketcher.getMolecule();
		let dummy = new ChemDoodle.io.JSONInterpreter().molTo(mol);
		let obj = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
		let asString = JSON.stringify(obj);
		moleculeJson.set(asString);
		const molecule = Molecule.fromJson(asString);

		molecularFormula.set(molecule.getMolecularFormula());
		monoisotopicWeight.set(molecule.getMonoisotopicMass().toString());
	}

	/// 계산된 데이터 로컬 스토리지에 저장
	function saveData() {
		// 계산된게 없으면 리턴 처리
		if ($moleculeJson == '') return alert('Please Input Data');

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
	}

	/// 저장된 데이터 불러오기
	function loadSavedData() {
		let storedData = JSON.parse(localStorage.getItem('moleculeData') || '[]');
		savedData.set(storedData);
	}

	/// 리스트에서 아이템 삭제
	function deleteData(index) {
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
	<button on:click={onTapButton}>Calculate Chem</button>
	{#if $molecularFormula}
		<p class="result">Molecular Formula: {$molecularFormula}</p>
	{/if}
	{#if $monoisotopicWeight}
		<p class="result">Monoisotopic Weight: {$monoisotopicWeight}</p>
	{/if}
	<button on:click={saveData}>Save Data</button>

	<h2>Saved Molecule Data</h2>
	<ul>
		{#each $savedData as data, index}
			<li>
				<div class="data-item">
					<p>Molecular Formula: {data.molecularFormula}</p>
					<p>Monoisotopic Weight: {data.monoisotopicWeight}</p>
					<button on:click={() => deleteData(index)}>X</button>
				</div>
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
		max-width: 600px;
		margin: 40px auto;
	}

	h1,
	h2 {
		font-family: 'Arial', sans-serif;
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

	p.result {
		margin-top: 20px;
		font-size: 18px;
		color: #333;
		background-color: #e9e9e9;
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
	}

	li {
		margin-top: 10px;
		background-color: #fff;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.data-item {
		display: flex;
		flex-direction: column;
	}

	.data-item p {
		margin: 0;
	}

	.data-item button {
		width: 70px;
		background-color: #ff4d4d;
	}
</style>
