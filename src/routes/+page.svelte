<script lang="ts">
	import IonSelector from '$lib/components/IonSelector.svelte';
	import FormylationSelector from '$lib/components/FormylationSelector.svelte';
	import AminoMapSelector from '$lib/components/AminoMapSelector.svelte';
	import NcAASelector from '$lib/components/NcAASelector.svelte';
	import ResultTable from '$lib/components/ResultTable.svelte';
	import { MassFinderHelper } from '$lib/helper/mass_finder_helper';
	import type { FormyType, IonType } from '../type/Types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	// 기초 아미노산 리스트
	const aminoMap: { [key: string]: number } = {
		G: 75.03,
		A: 89.05,
		S: 105.04,
		T: 119.06,
		C: 121.02,
		V: 117.08,
		L: 131.09,
		I: 131.09,
		M: 149.05,
		P: 115.06,
		F: 165.08,
		Y: 181.07,
		W: 204.09,
		D: 133.04,
		E: 147.05,
		N: 132.05,
		Q: 146.07,
		H: 155.07,
		K: 146.11,
		R: 174.11
	};

	// 상태 관리 변수들
	let exactMass: number | null = null;
	/// 필수로 들어가야 하는 아미노산이 있다면 여기다 기입(선택값)
	let essentialSequence: string = '';
	/// 포밀레이스 여부
	let formylation: FormyType = 'yes';
	/// 이온이 있는지 여부
	let adduct: IonType = 'H';
	/// Amino Acid 영역에서 선택된 아미노산의 종류, 초기값은 전체
	let selectedAminos: { [key: string]: number } = { ...aminoMap };
	/// 사용자 지정 아미노산
	let ncAA: { [key: string]: number } = { B: 0.0, J: 0.0, O: 0.0, U: 0.0, X: 0.0, Z: 0.0 };
	const loading = getContext<Writable<boolean>>('loading');
	let bestSolutions: any[] = [];

	/// Calculate! 버튼 클릭시 호출되는 메서드
	async function handleCalculate(): Promise<void> {
		loading.set(true);
		// 데이터 검증 실패하면 프로세스 끝냄
		if (validata() === false) return loading.set(false);
		// 비동기로 처리하여 UI 업데이트를 보장
		setTimeout(() => {
			try {
				// 0 이 아닌 입력된 값들만 필터링
				let filteredNcAA = Object.fromEntries(
					Object.entries(ncAA).filter(([key, value]) => value !== 0)
				);

				// 기초 아미노산들 + 사용자 지정 아미노산을 합쳐서 경우의수를 구함
				const aminoMapMerged = { ...selectedAminos, ...filteredNcAA };

				// 계산 결과
				bestSolutions = MassFinderHelper.calcByIonType(
					exactMass!,
					essentialSequence,
					formylation,
					adduct,
					aminoMapMerged
				);
				console.log('Best solutions:', bestSolutions);
			} finally {
				loading.set(false);
			}
		}, 100);
	}

	function handleFormylationChange(newFormylation: FormyType): void {
		formylation = newFormylation;
	}

	function handleAdductChange(newAdduct: IonType): void {
		adduct = newAdduct;
	}

	function handleNcAAChange(e: CustomEvent<{ [key: string]: any }>): void {
		let _data = Object.entries(e.detail).reduce((acc, [key, value]) => {
			acc[key] = Number(value?.monoisotopicWeight ?? 0.0);
			return acc;
		}, {} as { [key: string]: number });
		ncAA = _data;
	}

	/// Amino Selector 에서 값이 바뀌면 string : bool 형태로 내려오는데 이걸 string : number 형태로 바꿔서 저장
	function handleAminoMapChange(newAminos: { [key: string]: boolean }): void {
		selectedAminos = Object.fromEntries(
			Object.entries(newAminos)
				.filter(([key, value]) => value)
				.map(([key]) => [key, aminoMap[key]])
		);
	}

	/// 현재입력된 값에 문제가 없는지 체크
	function validata(): boolean {
		if (exactMass === null) {
			alert('Please Input ExtraMass');
			return false;
		}

		if (validateEssentialSequence() === false) {
			alert('Please enter the correct Essential Sequence');
			return false;
		}

		return true;
	}

	/// essentialSequence의 유효성을 검사하는 함수
	function validateEssentialSequence(): boolean {
		// 0 이 아닌 입력된 값들만 필터링
		let filteredNcAA = Object.fromEntries(
			Object.entries(ncAA).filter(([key, value]) => value !== 0)
		);

		for (let char of essentialSequence) {
			if (!aminoMap[char] && !filteredNcAA[char]) {
				return false;
			}
		}
		return true;
	}

	/// essentialSequence 값을 항상 대문자로 변환
	function handleEssentialSequenceInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		essentialSequence = input.value.toUpperCase();
	}
</script>

<svelte:head>
	<title>Mass Finder</title>
	<link rel="stylesheet" href="chem_doodle/install/ChemDoodleWeb.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/ChemDoodleWeb.js"></script>
	<link rel="stylesheet" href="chem_doodle/install/uis/jquery-ui-1.11.4.css" type="text/css" />
	<script type="text/javascript" src="chem_doodle/install/uis/ChemDoodleWeb-uis.js"></script>
</svelte:head>

<div class="container">
	<div class="title">Mass finder</div>
	<div class="form-group">
		<input type="number" bind:value={exactMass} placeholder="Exact Mass" />
	</div>
	<div class="form-group">
		<input
			type="text"
			bind:value={essentialSequence}
			placeholder="Essential Sequence (Option)"
			on:input={handleEssentialSequenceInput}
		/>
	</div>
	<div class="form-group">
		<FormylationSelector on:change={(e) => handleFormylationChange(e.detail)} />
	</div>
	<div class="form-group">
		<IonSelector on:change={(e) => handleAdductChange(e.detail)} />
	</div>
	<div class="form-group">
		<AminoMapSelector on:changeAminos={(e) => handleAminoMapChange(e.detail)} />
	</div>
	<div class="form-group">
		<NcAASelector on:changeNcAA={handleNcAAChange} />
	</div>
	<button type="button" class="calculate" on:click={handleCalculate}>Calculate!</button>
	{#if exactMass !== null && bestSolutions.length > 0}
		<ResultTable {bestSolutions} {exactMass} />
	{/if}
</div>

<style>
	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
		background: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: relative;
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
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}
	.loading-spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
