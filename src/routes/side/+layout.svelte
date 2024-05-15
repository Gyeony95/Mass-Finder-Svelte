<script lang="ts">
	import SideDrawer from '$lib/components/SideDrawer.svelte';
</script>

<div class="app-container">
	<!-- <SideDrawer /> -->
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
