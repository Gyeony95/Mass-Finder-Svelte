<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormyType } from '../../type/Types';

	const dispatch = createEventDispatcher();

	let fomyType: FormyType = 'yes';

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		fomyType = target.value as FormyType;
		dispatch('change', fomyType);
	}
</script>

<div class="formylation">
	<label>Formylation</label>
	<label>
		<input type="radio" value="yes" bind:group={fomyType} on:change={handleChange} />
		Yes
	</label>
	<label>
		<input type="radio" value="no" bind:group={fomyType} on:change={handleChange} />
		No
	</label>
	<label>
		<input type="radio" value="unknown" bind:group={fomyType} on:change={handleChange} />
		Unknown
	</label>
</div>

<style>
	.formylation {
		margin-bottom: 15px;
	}
	.formylation label {
		margin-right: 10px;
	}
</style>
