<script lang="ts">
	export let bestSolutions: any[];
	export let exactMass: number;

	function calculateDifference(target: number, value: number): number {
		return Math.abs(target - value);
	}
</script>

<table>
	<thead>
		<tr>
			<th>No.</th>
			<th>Mass</th>
			<th>Sequence</th>
			<th>Adduct</th>
			<th>Difference</th>
		</tr>
	</thead>
	<tbody>
		{#each bestSolutions as solution, index}
			<tr>
				<td>{index + 1}</td>
				<td>{solution.weight.toFixed(3)}</td>
				<td>{solution.code}</td>
				<td>{solution.ionType}</td>
				<td>{calculateDifference(exactMass, solution.weight).toFixed(3)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: center;
	}
	th {
		background-color: #f2f2f2;
		color: #333;
	}
	tr:nth-child(even) {
		background-color: #f9f9f9;
	}
	tr:hover {
		background-color: #f1f1f1;
	}
</style>
