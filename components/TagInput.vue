<template>
  <form @submit="handleSubmit">
    <input
      v-model="tagName"
      placeholder="Añadir etiqueta"
      class="w-full text-xl focus:ring-2 focus:ring-blue-600"
    />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TagInput',
  data() {
    return {
      tagName: '' as string,
    }
  },
  methods: {
    handleSubmit(e: any) {
      e.preventDefault()
      this.tagName = ''
    },
  },
})
</script>

<style></style>
