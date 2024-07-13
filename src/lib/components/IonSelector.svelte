<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	enum IonType {
		H = 'H',
		Na = 'Na',
		K = 'K',
		unknown = 'unknown'
	}

	type IonTypeKey = keyof typeof IonType;

	let ionType: IonTypeKey = 'H';

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		ionType = target.value as IonTypeKey;
		dispatch('change', ionType);
	}
</script>

<div class="ion-selector">
	<label>Adduct</label>
	{#each Object.keys(IonType) as key}
		<label>
			<input type="radio" value={key} bind:group={ionType} on:change={handleChange} />
			{IonType[key]}
		</label>
	{/each}
</div>

<style>
	.ion-selector {
		margin-bottom: 15px;
	}
	.ion-selector label {
		margin-right: 10px;
	}
</style>
