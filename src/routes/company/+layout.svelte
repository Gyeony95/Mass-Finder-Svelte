<script lang="ts">
	import SideDrawer from '$lib/components/SideDrawer.svelte';
	import type { Menu } from '$lib/model/MenuModel';
	import { beforeUpdate, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { menuStore } from '$lib/stores/menuStore';

	let menu: Menu;

	beforeUpdate(async () => {
		if ($menuStore.length < 1) {
			await loadMenu();
		} else {
			let allMenu = $menuStore;
			const companyMenu = allMenu.find((menuItem: Menu) => menuItem.title === '회사소개');
			if (companyMenu) menu = companyMenu;
		}
	});

	onMount(() => {});

	async function loadMenu() {
		if (browser) {
			const response = await fetch('/json/menu.json');
			var data = await response.json();
			const companyMenu = data.find((menuItem: Menu) => menuItem.title === '회사소개');
			if (companyMenu) menu = companyMenu;
		}
	}
</script>

<div class="app-container">
	<SideDrawer bind:menu />
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.app-container {
		display: flex;
		min-height: 100%; /* 뷰포트 높이를 100%로 설정 */
	}

	.content {
		flex-grow: 1; /* 나머지 공간을 모두 차지하도록 설정 */
		padding: 20px; /* 내용과의 여백 */
		overflow-y: visible; /* overflow를 visible로 설정하여 스크롤을 상위 요소에 의존하게 함 */
	}
</style>
