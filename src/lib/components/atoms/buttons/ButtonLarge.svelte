<script>
    export let onClick = () => {};
</script>

<button class="base" on:click={onClick}>
    <div class="iconContainer">
        <slot name="svg">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-at"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path
                    d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"
                />
            </svg>
        </slot>
    </div>
    <div class="content">
        <h3 class="title"><slot name="title" /></h3>
        <span class="text"><slot /></span>
    </div>
    <div class="click">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
        </svg>
    </div>
</button>

<style>
    .iconContainer {
        padding: 6px;
        border-radius: var(--border-radius-small);
        background: var(--secondary-header);
        display: flex;
    }
    h3 {
        padding: 0px;
        margin: 0px;
    }
    .base {
        display: flex;
        gap: 12px;
        flex: 1 1 auto;
        flex-grow: 1;
        height: 72px;
        background: rgba(24, 25, 35, max(0.5, 0.7));
        border-radius: var(--border-radius);
        align-items: center;
        padding: 0px 12px 0px 12px;
        transition: 0.125s ease-in all;
        border: none;
    }
    .base:hover {
        background-color: rgba(var(--background-dark-rgb), max(0.85, 0.8));
        filter: grayscale(0.3);
    }
    .base:active {
        filter: saturate(1.2);
        background: var(--primary-background);
    }
    .content {
        flex-direction: column;
        display: flex;
        -webkit-box-flex: 1;
        flex-grow: 1;
        gap: 6px;
        align-items: baseline;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .base > div div {
        gap: 8px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .title {
        font-size: 1.24356rem;
        font-weight: 600;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .text {
        font-size: 0.9375rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
