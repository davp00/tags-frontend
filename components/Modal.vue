<template>
  <div>
    <div v-if="showModal" class="modal focus:outline-none">
      <div class="relative w-auto my-6 mx-auto max-w-md">
        <!--content-->
        <div class="modal-content focus:outline-none">
          <!--header-->
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t"
          >
            <h3 class="text-3xl font-semibold">{{ title }}</h3>
            <button
              class="modal-exit-button focus:outline-none"
              @click="toggleModal()"
            >
              <span class="modal-exit-button-text focus:outline-none"> × </span>
            </button>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
            <slot />
          </div>
          <!--footer-->
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b"
          >
            <button
              class="modal-close-button focus:outline-none background-transparent"
              type="button"
              @click="toggleModal()"
            >
              Cerrar
            </button>
            <button
              class="modal-submit-button active:bg-green-600 hover:shadow-lg focus:outline-none"
              type="button"
              @click="toggleModal()"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    show: {
      required: true,
      type: Boolean,
    },
    title: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      showModal: true,
    }
  },
  watch: {
    showModal(newV) {
      console.log(newV)
    },
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal
    },
  },
})
</script>

<style scoped>
.modal {
  @apply overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none justify-center items-center flex;
}

.modal-content {
  @apply border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none;
}

.modal-exit-button {
  @apply p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none;
}

.modal-exit-button-text {
  @apply bg-transparent text-black h-6 w-6 text-2xl block outline-none;
}

.modal-close-button {
  @apply text-gray-400 font-bold uppercase px-6 py-2 text-sm outline-none  mr-1 mb-1;
  transition: all 0.15s ease;
}

.modal-submit-button {
  @apply bg-yellow-400 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow outline-none mr-1 mb-1;
  transition: all 0.15s ease;
}
</style>
