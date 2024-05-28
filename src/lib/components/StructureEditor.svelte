<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import OCL from 'openchemlib/full';
	import { createEventDispatcher } from 'svelte';

	export let width: number = 675;
	export let height: number = 450;
	export let initialMolfile: string = '';
	export let initialIDCode: string = '';
	export let fragment: boolean = false;
	export let svgMenu: boolean = true;

	const dispatch = createEventDispatcher();
	let domRef: HTMLDivElement;

	let editor: any = null;
	let hadFirstChange: boolean = false;

	onMount(() => {
		domRef.innerHTML = '';

		const root = domRef.getRootNode() as ShadowRoot | Document;
		let originalGetElementById: typeof document.getElementById | undefined;

		if (root instanceof ShadowRoot) {
			originalGetElementById = document.getElementById;
			document.getElementById = root.getElementById.bind(root);
		}

		try {
			editor = new OCL.StructureEditor(domRef, svgMenu, 1);
		} finally {
			if (root instanceof ShadowRoot) {
				document.getElementById = originalGetElementById!;
			}
		}

		if (initialMolfile && initialIDCode) {
			throw new Error('Cannot specify both initialMolfile and initialIDCode');
		}
		if (initialMolfile) editor.setMolFile(initialMolfile);
		if (initialIDCode) editor.setIDCode(initialIDCode);
		editor.setFragment(fragment);

		editor.setChangeListenerCallback(() => {
			if (!hadFirstChange) {
				hadFirstChange = true;
			} else {
				const molfile = editor.getMolFileV3();
				const molecule = editor.getMolecule();
				const idCode = editor.getIDCode();
				dispatch('change', { molfile, molecule, idCode });
			}
		});

		editor.setAtomHighlightCallback((atomId: number, enter: boolean) => {
			if (enter) {
				dispatch('atomEnter', { atomId });
			} else {
				dispatch('atomLeave', { atomId });
			}
		});

		editor.setBondHighlightCallback((bondId: number, enter: boolean) => {
			if (enter) {
				dispatch('bondEnter', { bondId });
			} else {
				dispatch('bondLeave', { bondId });
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$: if (editor) {
		editor.setFragment(fragment);
	}
</script>

<div id="editor" bind:this={domRef} style="width: {width}px; height: {height}px;" />

<style>
	#editor {
		width: var(--width);
		height: var(--height);
		border: 1px solid #ccc;
	}
</style>
