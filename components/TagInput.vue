<template>
  <form class="p-2" @submit.prevent="handleSubmit">
    <input
      v-model="tagName"
      placeholder="Añadir etiqueta"
      class="w-full tagInput text-xl py-2 px-3 bg-white rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none"
    />
  </form>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TagInput',
  data() {
    return {
      tagName: '' as string,
    };
  },
  methods: {
    handleSubmit() {
      this.tagName = '';
    },
  },
});
</script>

<style>
.tagInput {
  caret-color: rgb(78, 91, 201);
}
</style>
