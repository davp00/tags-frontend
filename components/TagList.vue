<template>
  <div>
    <div
      v-if="tags.length"
      ref="tagContainer"
      class="pt-4 overflow-y-auto h-96"
    >
      <RecycleScroller
        page-mode
        class="virtual-list"
        :items="tags"
        :item-size="50"
      >
        <template v-slot="{ item }">
          <TagItem :tag="item" />
        </template>
      </RecycleScroller>
      <!--<DynamicScroller
        :items="tags"
        :item-size="50"
        class="scroller"
        min-item-size="5"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
          >
            <TagItem :tag="item" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>-->

      <InfiniteLoading
        spinner="spiral"
        @infinite="infiniteScroll"
      ></InfiniteLoading>
    </div>
    <Modal :show="false" title="Editar Etiqueta">
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
import Vue from 'vue';
import { mapState } from 'vuex';
import TagItem from '~/components/TagItem.vue';
import Modal from '~/components/Modal.vue';
import { ActionTypes } from '~/store';

export default Vue.extend({
  components: {
    TagItem,
    Modal,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState(['tags']),
  },
  mounted() {
    this.$store.dispatch(ActionTypes.GET_TAG_LIST);
  },
  methods: {
    infiniteScroll($state: any) {
      setTimeout(() => {
        if (!this.loading) {
          this.loading = true;
          this.$store
            .dispatch(ActionTypes.GET_TAG_LIST)
            .then((loaded: boolean) => {
              if (loaded) {
                $state.loaded();
                this.loading = false;
                console.log('PASA POR ACA');
              } else {
                $state.complete();
              }
            });
        }
      }, 500);
    },
  },
});
</script>

<style scoped>
.vue-recycle-scroller__item-view .hover {
  background: none;
}
.edit-tag-input {
  @apply mt-4 py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md;
}
</style>
