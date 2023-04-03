<template>
    <p>Hier ist ein Produkt... ({{ data }})</p>
</template>
  
<script>
export default {
    name: 'ProductTile',
    props: ['data'],
}
</script>