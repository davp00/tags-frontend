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
          <div
            class="tag-item"
            :style="{
              '--tagcolor': item.color,
            }"
          >
            <TagItem :tag="item" />
          </div>
        </template>
      </RecycleScroller>

      <InfiniteLoading
        spinner="spiral"
        @infinite="infiniteScroll"
      ></InfiniteLoading>
    </div>
    <ModalEdit />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import TagItem from '~/components/TagItem.vue';
import { ActionTypes } from '~/definitions/index.store';
import { UPDATE_TAG_LIST_SUBSCRIPTION } from '~/gql/subscriptions';
import { TAG_LIST_QUERY } from '~/gql/querys';
import ModalEdit from '~/components/ModalEdit.vue';

export default Vue.extend({
  components: {
    TagItem,
    ModalEdit,
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
    this.getTagList();
    this.watchTagEvents();
  },
  methods: {
    async getTagList() {
      const { $apolloProvider } = this as any;
      const result = await $apolloProvider.defaultClient.query({
        query: TAG_LIST_QUERY,
        variables: {
          pagination: {
            limit: 10000,
            page: this.$store.state.page,
          },
        },
      });
      await this.$store.dispatch(
        ActionTypes.GET_TAG_LIST,
        result.data.tagList.tags
      );
      return result.data.tagList.tags.length !== 0;
    },
    watchTagEvents() {
      const { $apolloProvider } = this as any;
      const observer = $apolloProvider.defaultClient.subscribe({
        query: UPDATE_TAG_LIST_SUBSCRIPTION,
      });

      const $store = this.$store;

      observer.subscribe({
        next({ data }: any) {
          if (data.updateTagList) {
            const { action } = data.updateTagList;
            $store.dispatch(ActionTypes.WATCH_TAG_EVENTS, data.updateTagList);
            console.log(action);
          }
        },
        error() {
          alert('Ha ocurrido un error en el socket');
        },
      });
    },
    infiniteScroll($state: any) {
      if (!this.loading) {
        this.loading = true;

        this.getTagList().then((loaded: boolean) => {
          setTimeout(() => {
            if (loaded) {
              $state.loaded();
              this.loading = false;
            } else {
              $state.complete();
            }
          }, 100);
        });
      }
    },
  },
});
</script>

<style scoped>
.vue-recycle-scroller__item-view .hover {
  background: none;
}
</style>
