<template>
    <div class="Main">
        <slot></slot>
    </div>
</template>

<style scoped>
.Main {
    color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 5;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    box-shadow: inset 0px 0px 30px 4px #03f463;
    animation: rainbow-shadow 2s linear infinite;
}

@keyframes rainbow-shadow {
    0% {
        box-shadow: inset 0px 0px 30px 4px #03f463;
    }
    14% {
        box-shadow: inset 0px 0px 30px 4px red;
    }
    28% {
        box-shadow: inset 0px 0px 30px 4px orange;
    }
    42% {
        box-shadow: inset 0px 0px 30px 4px yellow;
    }
    57% {
        box-shadow: inset 0px 0px 30px 4px green;
    }
    71% {
        box-shadow: inset 0px 0px 30px 4px blue;
    }
    85% {
        box-shadow: inset 0px 0px 30px 4px indigo;
    }
    100% {
        box-shadow: inset 0px 0px 30px 4px violet;
    }
}
</style>