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
        class="tag-item-button-delete background-transparent focus:outline-none"
        type="button"
        style="transition: all 0.15s ease"
        @click="deleteTag"
      >
        Borrar
      </button>
      <button
        class="tag-item-button-edit background-transparent focus:outline-none"
        type="button"
        style="transition: all 0.15s ease"
        @click="editTag()"
      >
        Editar
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Tag } from '~/definitions/tag';
import { ActionTypes } from '~/definitions/index.store';

export default Vue.extend({
  props: {
    tag: {
      required: true,
      type: Object,
    } as PropOptions<Tag>,
  },
  data() {
    return {
      isRemoving: null as boolean | null,
    };
  },
  methods: {
    editTag() {
      this.$store.dispatch(ActionTypes.TOGGLE_MODAL, this.tag);
    },
    deleteTag() {
      this.$store.dispatch(ActionTypes.DELETE_TAG, this.tag);
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

.tag-item-button-edit {
  @apply text-gray-400 font-bold px-3 py-1 text-sm outline-none mr-1 mb-1 float-right;
}

.tag-item-button-delete {
  @apply text-gray-400 font-bold px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 float-right;
}
</style>
