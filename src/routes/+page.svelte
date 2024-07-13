<script lang="ts">
	let exactMass: number | null = null;
	let essentialSequence: string = '';
	let formylation: string = 'yes';
	let adduct: string = 'H';
	let aminoAcids: { [key: string]: boolean } = {
		G: true,
		A: true,
		S: true,
		T: true,
		C: true,
		V: true,
		L: true,
		I: true,
		M: true,
		P: true,
		F: true,
		Y: true,
		W: true,
		D: true,
		E: true,
		N: true,
		Q: true,
		H: true,
		K: true,
		R: true
	};
	let ncAA: { [key: string]: string } = { B: '', J: '', O: '', U: '', X: '', Z: '' };

	function handleCalculate(): void {
		// Implement your calculation logic here
		console.log('Calculating...');
	}

	function toggleAllAminoAcids(value: boolean): void {
		for (let key in aminoAcids) {
			aminoAcids[key] = value;
		}
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
	<div class="form-group radio-group">
		<label>Formylation</label>
		<label><input type="radio" bind:group={formylation} value="yes" /> yes</label>
		<label><input type="radio" bind:group={formylation} value="no" /> no</label>
		<label><input type="radio" bind:group={formylation} value="unknown" /> unknown</label>
	</div>
	<div class="form-group radio-group">
		<label>Adduct</label>
		<label><input type="radio" bind:group={adduct} value="H" /> H</label>
		<label><input type="radio" bind:group={adduct} value="Na" /> Na</label>
		<label><input type="radio" bind:group={adduct} value="K" /> K</label>
		<label><input type="radio" bind:group={adduct} value="unknown" /> unknown</label>
	</div>
	<div class="form-group">
		<div class="amino-acids-header">
			<label>Amino acid</label>
			<div class="buttons">
				<button type="button" on:click={() => toggleAllAminoAcids(false)}>All Uncheck</button>
				<button type="button" on:click={() => toggleAllAminoAcids(true)}>STREP</button>
			</div>
		</div>
		<div class="amino-acids">
			{#each Object.keys(aminoAcids) as key}
				<label><input type="checkbox" bind:checked={aminoAcids[key]} /> {key}</label>
			{/each}
		</div>
	</div>
	<div class="form-group ncaa-inputs">
		{#each Object.keys(ncAA) as key}
			<div>
				<label>{key} :</label>
				<input type="text" bind:value={ncAA[key]} />
			</div>
		{/each}
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
	.amino-acids-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.amino-acids-header .buttons {
		display: flex;
		gap: 10px;
	}
	.amino-acids-header button {
		padding: 5px 10px;
		background-color: #add8e6;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.3s;
	}
	.amino-acids-header button:hover {
		background-color: #87ceeb;
	}
	.amino-acids-header button:active {
		background-color: #4682b4;
	}
	.amino-acids {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 10px;
		margin-bottom: 15px;
	}
	.amino-acids label {
		display: flex;
		align-items: center;
	}
	.amino-acids input[type='checkbox'] {
		margin-right: 5px;
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
