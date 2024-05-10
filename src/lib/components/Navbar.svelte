<script lang="ts">
	import Cart from '$lib/components/Cart.svelte';
	import { cartItemsStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import '$lib/model/MenuModel.ts';
	import { browser } from '$app/environment';

	let menus: Menu[] = [];

	onMount(async () => {
		if (browser) {
			const response = await fetch('/static/json/menu.json');
			menus = await response.json();
		}
	});

	let cartOpened = false;
</script>

<nav class="sticky top-0 z-10 bg-[#282828] text-white">
	<script>
	</script>
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center py-4">
			<div>
				<a class="mx-5 font-extrabold text-xl" href="/">삼원파워감속기</a>
			</div>
			<div class="flex items-center gap-6 m-auto">
				{#each menus as menu}
					<div class="menu">
						<a class="menu-item hover:underline underline-offset-4" href={menu.link}>{menu.title}</a
						>
						{#if menu.submenus}
							<div class="dropdown-content">
								{#each menu.submenus as submenu}
									<div class="submenu">
										<a href={submenu.link}>{submenu.title}</a>
										{#if submenu.submenus}
											<div class="sub-dropdown-content">
												{#each submenu.submenus as thirdmenu}
													<a href={thirdmenu.link}>{thirdmenu.title}</a>
												{/each}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
			<div class="flex mx-5 gap-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
				<button class="relative" aria-label="Cart" on:click={() => (cartOpened = !cartOpened)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						/>
					</svg>
					{#if $cartItemsStore.length !== 0}
						<span class="absolute inset-0 object-right-top ml-3">
							<div
								class="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white"
							>
								{$cartItemsStore.length}
							</div>
						</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</nav>

{#if cartOpened}
	<Cart bind:cartOpened />
{/if}

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
		min-width: 160px;
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
