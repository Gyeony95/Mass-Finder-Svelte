<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import MolecularListItem from '$lib/components/MolecularListItem.svelte';

	const dispatch = createEventDispatcher();

	let savedData = writable([]);
	let selectedData = writable<Record<string, any>>({
		B: null,
		J: null,
		O: null,
		U: null,
		X: null,
		Z: null
	});

	let showModal = writable(false);
	let selectedKey: keyof typeof $selectedData = 'B'; // key의 타입 지정

	onMount(() => {
		loadSavedData();
	});

	function loadSavedData() {
		let storedData = JSON.parse(localStorage.getItem('moleculeData') || '[]');
		savedData.set(storedData);
	}

	// openModal 함수에서 key를 타입 캐스팅해서 전달
	function openModal(key: keyof typeof $selectedData) {
		selectedKey = key;
		showModal.set(true);
	}

	function closeModal() {
		showModal.set(false);
	}

	function selectData(data: any) {
		selectedData.update((values) => ({ ...values, [selectedKey]: data }));
		closeModal();
	}

	function confirmSelection() {
		dispatch('changeNcAA', $selectedData);
	}

	function onClickBody(index: number) {
		let _data = $savedData[index];
		selectData(_data);
		confirmSelection();
	}

	// 미리 typedKey를 타입 캐스팅하여 템플릿에 전달할 준비
	const keys = Object.keys($selectedData) as Array<keyof typeof $selectedData>;
</script>

<div>
	<label>ncAA Selector</label>
	<div class="ncaa-selectors">
		<!-- key를 미리 타입 캐스팅해서 사용 -->
		{#each keys as key}
			<div>
				<label>{key} :</label>
				<button on:click={() => openModal(key)}>
					{#if $selectedData[key]}
						<div>{$selectedData[key].molecularFormula}</div>
						<div>{$selectedData[key].monoisotopicWeight}</div>
					{:else}
						Select <!-- null인 경우 표시 -->
					{/if}
				</button>
			</div>
		{/each}
	</div>
	<button on:click={confirmSelection}>Confirm</button>
</div>

{#if $showModal}
	<Modal onClose={closeModal}>
		<ul>
			{#each $savedData as data, index}
				<li>
					<MolecularListItem {data} {index} {onClickBody} />
				</li>
			{/each}
		</ul>
	</Modal>
{/if}

<style>
	.ncaa-selectors {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin-bottom: 15px;
	}
	.ncaa-selectors div {
		display: flex;
		align-items: center;
	}
	.ncaa-selectors button {
		flex-grow: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		background-color: #f5f5f5;
		cursor: pointer;
	}
	.ncaa-selectors button:focus {
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
		outline: none;
	}
</style>
