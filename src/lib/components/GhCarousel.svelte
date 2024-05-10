<script>
	import { onMount } from 'svelte';
	let index = 0;
	const images = [
		'/images/main_banner_1.webp',
		'/images/main_banner_2.webp',
		'/images/main_banner_3.webp'
	];

	const title = '사이크로감속기,무단변속기 제작';
	const subTitle = '고객 여러분의 만족을 위해 지속적으로 보완 연구, 개발하고 있습니다.';
	const welcome = 'WELCOM TO SAMWON';

	onMount(() => {
		const interval = setInterval(() => {
			index = (index + 1) % images.length;
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="carousel">
	{#each images as image, i}
		<div class="slide">
			<img src={image} alt={`Image ${i}`} class:active={index === i} />
			<div class="text-content {index === i ? 'active' : ''}">
				<p class="text-l md:text-2xl xl:text-2xl underline">{welcome}</p>
				<p class="text-3xl md:text-5xl xl:text-5xl">{title}</p>
				<p class="text-xl md:text-3xl xl:text-3xl">{subTitle}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.carousel {
		width: 100%;
		height: 500px;
		overflow: hidden;
		position: relative;
	}
	.slide {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}
	.text-content {
		position: absolute;
		bottom: 50%;
		width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 10px;
		border-radius: 5px;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}
	p {
		margin: 10px 0;
		color: white;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}
	img.active,
	.text-content.active {
		opacity: 1;
	}
</style>
