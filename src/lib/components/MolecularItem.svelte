<script lang="ts">
	export let data;
	export let index;
	export let deleteData;
</script>

<div class="data-item">
	<div class="info">
		<p>Molecular Formula: {data.molecularFormula}</p>
		<p>Monoisotopic Weight: {data.monoisotopicWeight}</p>
	</div>
	<button on:click={() => deleteData(index)}>X</button>
</div>

<style>
	.data-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 15px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-top: 10px;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-right: 20px;
	}

	.info p {
		margin: 0;
	}

	button {
		width: 50px;
		height: 50px;
		background-color: #ff4d4d;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #ff3333;
	}

	button:active {
		background-color: #cc0000;
	}
</style>
