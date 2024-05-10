<script>
	import { onMount } from 'svelte';
	let index = 0;
	const images = [
		'/images/main_banner_1.webp',
		'/images/main_banner_2.webp',
		'/images/main_banner_3.webp'
	];

	onMount(() => {
		const interval = setInterval(() => {
			index = (index + 1) % images.length;
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="carousel">
	{#each images as image, i}
		<img src={image} alt={`Image ${i}`} class:active={index === i} />
	{/each}
</div>

<style>
	.carousel {
		width: 100%;
		height: 500px;
		overflow: hidden;
		position: relative;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
		position: absolute;
		top: 0;
		left: 0;
	}

	img.active {
		opacity: 1;
		z-index: 1;
	}
</style>
