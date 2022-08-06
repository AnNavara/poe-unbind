<script>
    export let message;
</script>

<div>
    <div class="message">
        <span class="colored">
            [{new Intl.DateTimeFormat('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).format(message.date)}]
        </span>
        <span class="colored">@{message.message.split(':')[0]}:</span>
        <span>{message.message.split(':')[1]}</span>
    </div>
</div>

<style>
    .message {
        font-size: 1.1rem;
        padding: 0.5rem 0.8rem;
        border-radius: 8px;
        letter-spacing: 0.02em;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
        background-color: #1a1a1a;
    }

    .colored {
        color: #9c62d6;
    }
</style>
