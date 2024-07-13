<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let initNcAA: { [key: string]: number } = {};

	let ncaaMap: { [key: string]: number } = {
		B: 0.0,
		J: 0.0,
		O: 0.0,
		U: 0.0,
		X: 0.0,
		Z: 0.0
	};

	let controllerMap: { [key: string]: string } = {
		B: '',
		J: '',
		O: '',
		U: '',
		X: '',
		Z: ''
	};

	onMount(() => {
		for (let key in ncaaMap) {
			if (initNcAA[key] !== undefined) {
				let newValue = initNcAA[key];
				ncaaMap[key] = newValue;
				if (newValue !== 0) {
					controllerMap[key] = newValue.toString();
				}
			}
		}
	});

	function handleInputChange(key: string, value: string): void {
		let doubleValue = parseFloat(value);
		ncaaMap[key] = isNaN(doubleValue) ? 0.0 : doubleValue;
		dispatch('changeNcAA', ncaaMap);
	}
</script>

<div>
	<label>ncAA</label>
	<div class="ncaa-inputs">
		{#each Object.keys(controllerMap) as key}
			<div>
				<label>{key} :</label>
				<input
					type="text"
					bind:value={controllerMap[key]}
					on:input={(e) => handleInputChange(key, e.target.value)}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
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
	.ncaa-inputs input {
		flex-grow: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.ncaa-inputs input:focus {
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
		outline: none;
	}
</style>
