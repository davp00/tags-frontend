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
import { CREATE_TAG_MUTATION } from '~/gql/mutations';

export default Vue.extend({
  name: 'TagInput',
  data() {
    return {
      tagName: '' as string,
    };
  },
  methods: {
    handleSubmit() {
      if (this.tagName && !/^\s*$/.test(this.tagName)) {
        this.createTag(this.tagName);
      }
      this.tagName = '';
    },
    async createTag(name: string) {
      const { $apolloProvider } = this as any;
      const result = await $apolloProvider.defaultClient.mutate({
        mutation: CREATE_TAG_MUTATION,
        variables: {
          name,
        },
      });

      return result.data.createTag;
    },
  },
});
</script>

<style>
.tagInput {
  caret-color: rgb(78, 91, 201);
}
</style>
