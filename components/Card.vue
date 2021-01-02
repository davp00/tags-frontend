<template>
  <div class="min-w-0 bg-white rounded-lg shadow-xs dark:bg-gray-800 shadow-lg">
    <h4 class="p-5 font-medium text-gray-600 dark:text-gray-300">
      {{ title }}
    </h4>
    <hr class="w:100" />
    <div class="overflow-y-auto text-gray-600 p-4 dark:text-gray-400">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    title: {
      required: true,
      type: String,
    } as PropOptions<string>,
  },
})
</script>
