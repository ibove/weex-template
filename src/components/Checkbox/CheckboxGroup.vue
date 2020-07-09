<template>
  <div role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ElCheckboxGroup",

  componentName: "ElCheckboxGroup",
  props: {
    value: {}
  }
};
</script>