<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IonType } from '../../type/Types';

	const dispatch = createEventDispatcher();

	let ionType: IonType = 'H';

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		ionType = target.value as IonType;
		dispatch('change', ionType);
	}
</script>

<div class="ion-selector">
	<label>Adduct</label>
	<label>
		<input type="radio" value="H" bind:group={ionType} on:change={handleChange} />
		H
	</label>
	<label>
		<input type="radio" value="Na" bind:group={ionType} on:change={handleChange} />
		Na
	</label>
	<label>
		<input type="radio" value="K" bind:group={ionType} on:change={handleChange} />
		K
	</label>
	<label>
		<input type="radio" value="unknown" bind:group={ionType} on:change={handleChange} />
		Unknown
	</label>
</div>

<style>
	.ion-selector {
		margin-bottom: 15px;
	}
	.ion-selector label {
		margin-right: 10px;
	}
</style>
