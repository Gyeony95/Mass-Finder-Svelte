<script lang="ts">
	export let onClose;
</script>

<div class="modal-backdrop" on:click={onClose} />
<div class="modal-content">
	<slot />
	<button on:click={onClose}>Close</button>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 20;
	}
</style>
