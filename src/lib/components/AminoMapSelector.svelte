<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// 외부에서 입력받은 [changeAminos] 를 호출하기 위함
	const dispatch = createEventDispatcher();

	/// 사용할 아미노산의 모음, 초기값은 전체
	let selectedAminos: { [key: string]: boolean } = {
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

	let buttonAllCheck: boolean = true;

	function handleCheckboxChange(key: string, value: boolean): void {
		selectedAminos[key] = value;
		dispatch('changeAminos', selectedAminos);
		checkButtonAllSelected();
	}

	function checkButtonAllSelected(): void {
		buttonAllCheck = Object.values(selectedAminos).every((value) => value);
	}

	function toggleAllAminos(): void {
		const newValue = !buttonAllCheck;
		for (let key in selectedAminos) {
			selectedAminos[key] = newValue;
		}
		dispatch('changeAminos', selectedAminos);
		checkButtonAllSelected();
	}

	function toggleStrep(): void {
		const strep = ['W', 'S', 'H', 'P', 'Q', 'F', 'E', 'K'];
		for (let key in selectedAminos) {
			selectedAminos[key] = strep.includes(key);
		}
		dispatch('changeAminos', selectedAminos);
		checkButtonAllSelected();
	}
</script>

<div>
	<div class="amino-acids-header">
		<label>Amino acid</label>
		<div class="buttons">
			<button type="button" on:click={toggleAllAminos}
				>{buttonAllCheck ? 'All Uncheck' : 'All Check'}</button
			>
			<button type="button" on:click={toggleStrep}>STREP</button>
		</div>
	</div>
	<div class="amino-acids">
		{#each Object.keys(selectedAminos) as key}
			<label>
				<input
					type="checkbox"
					bind:checked={selectedAminos[key]}
					on:change={(e) => handleCheckboxChange(key, e.target.checked)}
				/>
				{key}
			</label>
		{/each}
	</div>
</div>

<style>
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
</style>
