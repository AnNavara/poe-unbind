<script lang="ts">
    import Messages from './Messages.svelte';
    import QRCode from 'qrcode';

    $: logFilePath = null;
    $: watching = false;
    $: href = '';
    $: status = false;

    $: messages = [];

    const setLogPath = async () => {
        logFilePath = null;
        logFilePath = await api.setPoePath();
    };

    const msgToCanvas = (message) => {
        const canvas = document.querySelector('#qr-canvas');
        canvas.classList.remove('hidden');
        QRCode.toCanvas(canvas, message, function (error) {
            if (error) console.error(error);
        });
    };

    window.addEventListener('message', (event) => {
        if (!event.data) return;
        const { message, type } = event.data;

        switch (type) {
            case 'address':
                href = message;
                msgToCanvas(message);
                break;
            case 'logPath':
                logFilePath = message;
                break;
            case 'onWatch':
                console.log(message);
                watching = true;
                break;
            case 'offWatch':
                console.log(message);
                watching = false;
                break;
            // case 'onServer':
            //     console.log(message);
            //     server = true;
            //     break;
            // case 'offServer':
            //     console.log(message);
            //     server = false;
            //     break;
            case 'message':
                messages = [...messages, { message, date: new Date() }];
                break;
            case 'status':
                status = message;
                break;
            default:
                console.log(type);
                console.log(message);
                break;
        }
    });
</script>

<main class="main">
    <header class="header">
        <span class="logPath">
            {#if logFilePath}
                {logFilePath}
            {:else}
                Client.txt not found
            {/if}
        </span>
        <div class="container">
            <button on:click={setLogPath}>Set poe folder</button>
            {#if !watching}
                <button on:click={api.startWatcher}>Start Watching</button>
            {:else}
                <button class="active" on:click={api.stopWatcher}
                    >Stop Watching</button
                >
            {/if}
        </div>
        <div class="container">
            {#if status === true}
                <span>Server started at: {href}</span>
            {:else}
                <span>Server not started</span>
            {/if}
            <div>
                <canvas class="hidden" id="qr-canvas" />
            </div>
        </div>
    </header>
    <Messages {messages} />
</main>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .header {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-template-rows: repeat(2, auto);
        gap: 1rem;
        min-width: 400px;
        align-items: center;
        text-align: center;
    }

    .hidden {
        width: 0;
        height: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .logPath {
        grid-column: 1 / 3;
    }
</style>
