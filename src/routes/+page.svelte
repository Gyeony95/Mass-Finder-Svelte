<script lang="ts">
	import GHCarousel from '$lib/components/GhCarousel.svelte';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	export let props: any;

	var showcase = [
		{
			name: 'Electronics',
			expand: {
				products: [
					{
						id: '1',
						name: 'Smartphone',
						image: 'images/main_banner_1.webp',
						slug: 'smartphone'
					},
					{
						id: '2',
						name: 'Laptop',
						image: 'images/main_banner_2.webp',
						slug: 'laptop'
					},
					{
						id: '3',
						name: 'Laptop',
						image: 'images/main_banner_3.webp',
						slug: 'laptop'
					}
				]
			}
		}
	];
</script>

<svelte:head>
	<title>삼원파워감속기</title>
</svelte:head>

<div>
	<GHCarousel />
	<div class="mx-3 md:mx-10">
		<section class="text-gray-800 text-center lg:text-left lg:px-32 lg:py-5">
			<div class="grid lg:grid-cols-2 gap-6 xl:gap-12 justify-center">
				<div class="mb-6 lg:mb-0">
					<h3 class="mt-4 text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight">고객센터</h3>
					<p class="mt-4 text-lg">궁금하신 점이 있으시면 언제든지 연락주시기 바랍니다.</p>
					<p class="mt-2 text-2xl md:text-2xl xl:text-3xl">031-434-6771</p>
					<p class="mt-2 text-1xl md:text-1xl xl:text-2xl">swdisco@naver.com</p>
				</div>
				<div class="mb-6 lg:mb-0">
					<!-- <p class="text-gray-500 text-lg">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eum iste repudiandae nisi
						modi placeat velit repellendus, tempore voluptates facere maiores praesentium harum
						deleniti voluptatibus laudantium quasi quos recusandae soluta ullam maxime quaerat
						debitis beatae accusamus reprehenderit! Eius veniam itaque numquam aliquid officiis
						nemo, quidem maxime, maiores aliquam officia voluptatum.
					</p> -->
					<h3 class="mt-4 text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight">
						제작의뢰하기
					</h3>
					<p class="mt-4 text-lg">제작문의를 해주시면 최선을 다해서 맞추어 드리겠습니다.</p>
					<button class="mt-2 shortcut-button">바로가기</button>
				</div>
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.0109088325144!2d126.73651381530466!3d37.31856927984502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b717875a97c7f%3A0x47bc6e6fa7dfc704!2z6rK96riw64-EIOyViOyCsOyLnCDri6jsm5Dqtawg7ISx6rOh64-ZIOuyiOyYgTHroZwgNjU!5e0!3m2!1sko!2skr!4v1626243439869!5m2!1sko!2skr"
					width="100%"
					height="250"
					style="border:0;"
					loading="lazy"
				/>
			</div>
		</section>
	</div>
	<div class=" bg-[#f4f6f7]">
		<div class="pt-10 pb-10 pl-10 pr-10">
			{#each showcase as showsection}
				<div class="grid gap-12 grid-cols-2 lg:grid-cols-4">
					{#each showsection.expand.products as product (product.id)}
						<ProductItem
							title={product.name}
							image={product.image}
							hoverImage={product.image}
							link="/products/{product.slug}"
						/>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* 기본 버튼 스타일 */
	.shortcut-button {
		padding: 6px 24px; /* 패딩 조정 */
		background-color: white; /* 배경색 */
		color: black; /* 글자색 */
		border: 1px solid black; /* 테두리 스타일 */
		text-decoration: none; /* 텍스트 밑줄 제거 */
		font-size: 16px; /* 글자 크기 */
		transition: all 0.3s; /* 부드러운 전환 효과 */
		cursor: pointer; /* 마우스 커서를 포인터로 변경 */
		display: inline-block; /* 적절한 위치에 디스플레이 */
	}

	/* 호버 시의 스타일 */
	.shortcut-button:hover {
		background-color: #2557ab; /* 호버 시 배경색 */
		color: white; /* 호버 시 글자색 */
		border-color: #2557ab; /* 호버 시 테두리 색 */
	}
</style>
