<template>
  <div>
    <div class="pt-4 overflow-y-auto h-96">
      <TagItem v-for="(tag, index) in tags" :key="index" :tag="tag" />
    </div>
    <Modal :show="true" title="Editar Etiqueta">
      <div class="my-4 leading-relaxed">
        <label class="font-semibold p-2">Nuevo Nombre</label>
        <input
          placeholder="Nombre"
          class="edit-tag-input app-font-semibold focus:outline-none focus:ring-2 focus:ring-gray-200"
          type="text"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TagItem, { Tag } from '~/components/TagItem.vue'
import Modal from '~/components/Modal.vue'

export default Vue.extend({
  components: {
    TagItem,
    Modal,
  },
  data() {
    return {
      tags: [
        { id: '', pid: 6, name: 'Balance', color: '#8e44ad' },
        { id: '', pid: 5, name: 'Completada', color: '#27ae60' },
        { id: '', pid: 4, name: 'Cancelada', color: '#bdc3c7' },
        { id: '', pid: 3, name: 'Local', color: '#f1c40f' },
        { id: '', pid: 2, name: 'Pagado', color: '#9b59b6' },
        { id: '', pid: 1, name: 'Transferencia', color: '#3498db' },
      ] as Tag[],
    }
  },
})
</script>

<style scoped>
.edit-tag-input {
  @apply mt-4 py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md;
}
</style>
