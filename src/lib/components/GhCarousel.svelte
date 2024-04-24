<script>
	import { onMount } from 'svelte';
	let index = 0;
	const images = ['/images/img1.jpeg', '/images/img2.jpeg', '/images/img3.jpeg'];

	onMount(() => {
		const interval = setInterval(() => {
			index = (index + 1) % images.length;
		}, 2000); // 0.5초 간격

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="carousel">
	{#each images as image, i}
		<img src={image} alt={`Image ${i}`} class:fade={index !== i} />
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
		transition: opacity 0.5s ease-in-out;
	}

	img.fade {
		opacity: 0;
	}
</style>
