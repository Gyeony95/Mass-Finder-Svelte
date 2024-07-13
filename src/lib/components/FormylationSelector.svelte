<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	enum FormyType {
		y = 'yes',
		n = 'no',
		unknown = 'unknown'
	}

	type FormyTypeKey = keyof typeof FormyType;

	let fomyType: FormyTypeKey = 'y';

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		fomyType = target.value as FormyTypeKey;
		dispatch('change', fomyType);
	}
</script>

<div class="formylation">
	<label>Formylation</label>
	{#each Object.keys(FormyType) as key}
		<label>
			<input type="radio" value={key} bind:group={fomyType} on:change={handleChange} />
			{FormyType[key]}
		</label>
	{/each}
</div>

<style>
	.formylation {
		margin-bottom: 15px;
	}
	.formylation label {
		margin-right: 10px;
	}
</style>
