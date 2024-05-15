<script lang="ts">
	import type { Menu, SubMenu } from '$lib/model/MenuModel';
	import { afterUpdate, onMount } from 'svelte';

	/// 선택된 큰 단위의 메뉴
	export let menu: Menu;

	/// 실제로 클릭된 메뉴
	let _activeMenu: string;

	/// 큰 단위의 메뉴의 하위 메뉴
	let menuItems: SubMenu[] = [];

	onMount(() => {
		if (menu && menu.submenus) {
			menuItems = menu.submenus || [];
		}
		_activeMenu = getActiveRoute();
	});

	function getActiveRoute(): string {
		const pathname = window.location.pathname;
		return pathname.startsWith('/') ? pathname.slice(1) : pathname;
	}

	afterUpdate(() => {
		if (menu && menu.submenus) {
			menuItems = menu.submenus || [];
		}
	});
</script>

<nav class="drawer">
	<h1 class="title">My Company</h1>
	<ul class="menu">
		{#if (menuItems?.length || 0) > 0}
			{#each menuItems as menuItem}
				<li>
					<a
						href="javascript:void(0)"
						class:highlight={_activeMenu === menuItem.link}
						on:click={() => {}}
					>
						{menuItem.title}
						{#if (menuItem.submenus || []).length > 0}
							<span class:rotate={_activeMenu === menuItem.link}>▼</span>
						{/if}
					</a>
					{#if _activeMenu === menuItem.link && (menuItem.submenus || []).length > 0}
						<ul class="submenu">
							{#each menuItem.submenus || [] as submenu}
								<li><a href="javascript:void(0)">{submenu.title}</a></li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		{/if}
	</ul>
</nav>

<style>
	.drawer {
		width: 250px;
		background-color: #f4f4f4;
		height: 100vh;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	.title {
		margin-bottom: 20px;
	}

	.menu a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		color: black;
		text-decoration: none;
	}

	.menu a.highlight {
		color: blue;
	}

	.rotate {
		display: inline-block;
		transition: transform 0.3s ease;
		transform: rotate(0deg);
	}

	.rotate.rotate {
		transform: rotate(180deg);
	}

	.submenu {
		list-style: none;
		padding-left: 20px;
	}

	.submenu li a {
		color: gray;
	}
</style>
