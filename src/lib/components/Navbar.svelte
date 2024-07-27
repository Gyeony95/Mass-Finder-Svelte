<script lang="ts">
	import { onMount } from 'svelte';
	import type { Menu, SubMenu } from '$lib/model/MenuModel';
	import { browser } from '$app/environment';
	import { menuStore } from '$lib/stores/menuStore';
	import { goto } from '$app/navigation';

	let menus: Menu[] = [];

	onMount(async () => {
		if (browser) {
			const response = await fetch('/json/menu.json');
			menus = await response.json();
			menuStore.set(menus);
		}
	});

	function onTapDraw() {
		window.location.href = '/draw';
	}
</script>

<nav class="sticky top-0 z-10 bg-[#282828] text-white">
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center py-4">
			<div>
				<a class="mx-5 font-extrabold text-xl" href="/">Mass Finder</a>
			</div>
			<div>
				<button
					on:click={onTapDraw}
					class="mx-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Draw
				</button>
			</div>
		</div>
	</div>
</nav>

<style>
	/* 메뉴 스타일링 */
	.menu {
		position: relative;
		display: inline-block;
	}

	/* 모든 드롭다운 내용을 숨김 */
	.dropdown-content,
	.sub-dropdown-content {
		display: none;
		position: absolute;
		background-color: #f9f9f9;
		min-width: 180px;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	/* 메뉴 아이템에 마우스를 올렸을 때 드롭다운 내용을 보여줌 */
	.menu:hover .dropdown-content {
		display: block;
	}

	/* 서브메뉴 포지셔닝 - 상대적 위치 설정 */
	.submenu {
		position: relative;
	}

	/* 서브메뉴 아이템에 마우스를 올렸을 때 서브 드롭다운 내용을 보여줌 */
	.submenu:hover .sub-dropdown-content {
		display: block;
		left: 100%; /* 상위 메뉴 항목의 오른쪽에 위치 */
		top: 0; /* 상위 메뉴 항목의 상단에 맞춤 */
	}

	/* 드롭다운 링크 스타일링 */
	.dropdown-content a,
	.sub-dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	/* 드롭다운 링크에 마우스를 올렸을 때 */
	.dropdown-content a:hover,
	.sub-dropdown-content a:hover {
		background-color: #f1f1f1;
	}
</style>
