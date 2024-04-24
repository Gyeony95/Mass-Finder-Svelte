<script>
	import '$lib/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>삼원파워감속기</title>
	<meta
		name="description"
		content="E-commerce solution built with SvelteKit, a headless CMS integration, uses Stripe for payments, providing better performance and faster development time"
	/>
</svelte:head>

<Navbar />
<slot />
<Footer />
