<script lang="ts">
	import IonSelector from '$lib/components/IonSelector.svelte';
	import FormylationSelector from '$lib/components/FormylationSelector.svelte';
	import AminoMapSelector from '$lib/components/AminoMapSelector.svelte';
	import NcAAInputArea from '$lib/components/NcAAInputArea.svelte';
	import { MassFinderHelper } from '$lib/helper/mass_finder_helper';
	import type { FormyType, IonType } from '../type/Types';

	/// 아미노산들의 리스트
	const aminoMap: { [key: string]: number } = {
		G: 75.03,
		A: 89.05,
		S: 105.04,
		T: 119.06,
		C: 121.02,
		V: 117.08,
		L: 131.09,
		I: 131.09,
		M: 149.05,
		P: 115.06,
		F: 165.08,
		Y: 181.07,
		W: 204.09,
		D: 133.04,
		E: 147.05,
		N: 132.05,
		Q: 146.07,
		H: 155.07,
		K: 146.11,
		R: 174.11
	};

	let exactMass: number | null = null;
	let essentialSequence: string = '';
	let formylation: FormyType = 'yes';
	let adduct: IonType = 'H';
	let selectedAminos: { [key: string]: number } = { ...aminoMap };
	let ncAA: { [key: string]: number } = { B: 0.0, J: 0.0, O: 0.0, U: 0.0, X: 0.0, Z: 0.0 };

	function handleCalculate(): void {
		const aminoMapMerged = { ...selectedAminos, ...ncAA };

		const bestSolutions = MassFinderHelper.calcByIonType(
			exactMass!,
			essentialSequence,
			formylation,
			adduct,
			aminoMapMerged
		);
		console.log('Best solutions:', bestSolutions);
	}

	function handleFormylationChange(newFormylation: FormyType): void {
		formylation = newFormylation;
	}

	function handleAdductChange(newAdduct: IonType): void {
		adduct = newAdduct;
	}

	function handleNcAAChange(newNcAA: { [key: string]: number }): void {
		ncAA = newNcAA;
	}

	function handleAminoMapChange(newAminos: { [key: string]: boolean }): void {
		selectedAminos = Object.fromEntries(
			Object.entries(newAminos)
				.filter(([key, value]) => value)
				.map(([key]) => [key, aminoMap[key]])
		);
	}
</script>

<div class="container">
	<div class="title">Mass finder</div>
	<div class="form-group">
		<input type="number" bind:value={exactMass} placeholder="Exact Mass" />
	</div>
	<div class="form-group">
		<input type="text" bind:value={essentialSequence} placeholder="Essential Sequence (Option)" />
	</div>
	<div class="form-group">
		<FormylationSelector on:change={(e) => handleFormylationChange(e.detail)} />
	</div>
	<div class="form-group">
		<IonSelector on:change={(e) => handleAdductChange(e.detail)} />
	</div>
	<div class="form-group">
		<AminoMapSelector on:changeAminos={(e) => handleAminoMapChange(e.detail)} />
	</div>
	<div class="form-group">
		<NcAAInputArea bind:initNcAA={ncAA} on:changeNcAA={(e) => handleNcAAChange(e.detail)} />
	</div>
	<button type="button" class="calculate" on:click={handleCalculate}>Calculate!</button>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
		background: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	.title {
		text-align: center;
		font-size: 24px;
		margin-bottom: 20px;
		color: #333;
	}
	.form-group {
		margin-bottom: 15px;
	}
	.form-group input[type='number'],
	.form-group input[type='text'] {
		width: calc(100% - 20px);
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.form-group input[type='number']:focus,
	.form-group input[type='text']:focus {
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
		outline: none;
	}
	.radio-group,
	.checkbox-group {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
	}
	.ncaa-inputs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin-bottom: 15px;
	}
	.ncaa-inputs div {
		display: flex;
		align-items: center;
	}
	.ncaa-inputs input[type='text'] {
		flex-grow: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.ncaa-inputs input[type='text']:focus {
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
		outline: none;
	}
	button.calculate {
		display: block;
		width: 100%;
		padding: 10px;
		background-color: #add8e6;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.3s;
	}
	button.calculate:hover {
		background-color: #87ceeb;
	}
	button.calculate:active {
		background-color: #4682b4;
	}
</style>
