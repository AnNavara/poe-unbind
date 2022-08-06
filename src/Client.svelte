<script>
    import Messages from './Messages.svelte';
    import sound from './assets/stairs-567.mp3';
    import RangeSlider from 'svelte-range-slider-pips';

    const notification = new Audio(sound);
    let volume = 50;
    notification.volume = Number(volume / 100);
    $: alertAllow = false;
    $: messages = [];
    $: connected = false;
    $: closed = false;
    const socket = new WebSocket(`ws://${window.location.hostname}:5202`);

    socket.onopen = () => {
        console.log('WS Open');
        connected = true;
    };
    socket.onclose = () => {
        closed = true;
        connected = false;
        console.log('Socket closed');
    };
    socket.onerror = () => {
        connected = false;
        console.log('Error with connection');
    };
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (alertAllow) notification.play();
        console.log(message);
        messages = [...messages, { message, date: new Date() }];
    };

    const changeVolume = (e) => {
        notification.volume = Number(e.detail.value / 100);
    };
</script>

<main>
    <header class="header">
        {#if connected === true}
            <span>Receving messages...</span>
        {:else}
            <span>Not connected</span>
        {/if}
        {#if closed === true}
            <span>Socket closed</span>
        {/if}
        <span>Volume</span>
        <RangeSlider values={[volume]} on:change={(e) => changeVolume(e)} />
        {#if alertAllow === true}
            <button class="active" on:click={() => (alertAllow = false)}
                >Deactivate sound alert</button
            >
        {:else}
            <button on:click={() => (alertAllow = true)}
                >Activate sound alert</button
            >
        {/if}
    </header>
    <Messages {messages} />
</main>

<style>
    .header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    :global(.rangeSlider > .rangeHandle) {
        border-radius: 10em;
    }
</style>
