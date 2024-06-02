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
    font-weight: bold;
    font-size: 40px;
    display: grid;
    place-items: center;
    backdrop-filter: blur(5px);
}
</style>