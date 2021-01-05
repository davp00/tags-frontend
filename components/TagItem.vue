<template>
  <div class="w-full pt-2 pb-4 pl-4 hover:bg-gray-50">
    <span
      class="font-extrabold text-center text-2xl mr-2"
      :style="{ color: tag.color }"
    >
      •
    </span>
    <span class="app-font-bold text-base tracking-tight text-capitalize">
      {{ tag.name }}
    </span>
    <span>
      <button
        class="background-transparent text-gray-400 font-bold px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 float-right"
        type="button"
        style="transition: all 0.15s ease"
        @click="deleteTag()"
      >
        Borrar
      </button>
      <button
        class="background-transparent text-gray-400 font-bold px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 float-right"
        type="button"
        style="transition: all 0.15s ease"
      >
        Editar
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Tag } from '~/interfaces/tag';
import { ActionTypes } from '~/store';

export default Vue.extend({
  props: {
    tag: {
      required: true,
      type: Object,
    } as PropOptions<Tag>,
  },
  methods: {
    deleteTag() {
      this.$store.dispatch(ActionTypes.DELETE_TAG, this.tag.id);
    },
  },
});
</script>
<style>
:root {
  --tagcolor: gray;
}

.tag-item:hover {
  border-left: solid 3px var(--tagcolor) !important;
}
</style>
