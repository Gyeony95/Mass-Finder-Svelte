<script lang="ts">
	import IonSelector from '$lib/components/IonSelector.svelte';
	import FormylationSelector from '$lib/components/FormylationSelector.svelte';
	import AminoMapSelector from '$lib/components/AminoMapSelector.svelte';
	import NcAAInputArea from '$lib/components/NcAAInputArea.svelte';

	let exactMass: number | null = null;
	let essentialSequence: string = '';
	let formylation: string = 'yes';
	let adduct: string = 'H';
	let selectedAminos: { [key: string]: boolean } = {};
	let ncAA: { [key: string]: number } = { B: 0.0, J: 0.0, O: 0.0, U: 0.0, X: 0.0, Z: 0.0 };

	function handleCalculate(): void {
		console.log('Calculating with selected aminos:', selectedAminos, 'ncAA:', ncAA);
	}

	function handleFormylationChange(newFormylation: string): void {
		formylation = newFormylation;
	}

	function handleAdductChange(newAdduct: string): void {
		adduct = newAdduct;
	}

	function handleNcAAChange(newNcAA: { [key: string]: number }): void {
		ncAA = newNcAA;
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
		<AminoMapSelector on:changeAminos={(e) => (selectedAminos = e.detail)} />
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
