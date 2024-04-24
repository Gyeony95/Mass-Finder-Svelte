<script lang="ts">
	// import Carousel from '$lib/components/Carousel.svelte';
	import GHCarousel from '$lib/components/GhCarousel.svelte';

	// import ProductItem from '$lib/components/ProductItem.svelte';
	// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	// export let data: any;
	// let showcase = data.showcase;
	let banners: any;
</script>

<svelte:head>
	<title>SwiftMarket</title>
</svelte:head>

<GHCarousel />
