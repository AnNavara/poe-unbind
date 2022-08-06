<script>
    import Message from './Message.svelte';
    export let messages;
</script>

<div class="messages">
    {#each messages
        .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
        .reverse() as message}
        <Message {message} />
    {/each}
</div>

<style>
    .messages {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }
</style>
