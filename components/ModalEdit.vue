<template>
  <Modal
    :show="modal"
    title="Editar Etiqueta"
    :loading="loading"
    @togglemodal="onToggleModal"
    @submit="onSubmit"
  >
    <div class="my-4 leading-relaxed">
      <label class="font-semibold p-2">Nuevo Nombre</label>
      <input
        v-model="name"
        placeholder="Nombre"
        class="edit-tag-input app-font-semibold focus:outline-none focus:ring-2 focus:ring-gray-200"
        type="text"
      />
    </div>
    <div v-if="error" class="font-bold text-red-400">
      <small>
        <p>
          Ha ocurrido un error al editar la etiqueta, posiblemente se deba a que
          fue eliminada.
        </p>
      </small>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Modal from './Modal.vue';
import { ActionTypes } from '~/definitions/index.store';
import { Tag } from '~/definitions/tag';
import { EDIT_TAG_MUTATION } from '~/gql/mutations';

export default Vue.extend({
  components: {
    Modal,
  },
  data() {
    return {
      name: '' as string,
      loading: false,
      error: false,
    };
  },
  computed: {
    ...mapState(['modal', 'tag']),
  },
  watch: {
    tag(newV: Tag) {
      if (newV) {
        this.name = newV.name;
      } else {
        this.name = '';
        this.loading = false;
      }
    },
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const { $apolloProvider } = this as any;
      const result = await $apolloProvider.defaultClient.mutate({
        mutation: EDIT_TAG_MUTATION,
        variables: {
          id: this.tag.id,
          name: this.name,
        },
      });
      if (!result.data.editTag) {
        this.error = true;
        return;
      }
      this.onToggleModal();
    },
    onToggleModal() {
      this.$store.dispatch(ActionTypes.TOGGLE_MODAL, undefined);
      this.error = false;
    },
  },
});
</script>

<style scoped>
.edit-tag-input {
  @apply mt-4 py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md;
}
</style>
