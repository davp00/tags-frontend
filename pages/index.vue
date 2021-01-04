<template>
  <div class="">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-start-4 col-span-6 mt-8">
        <Card title="Etiquetas">
          <TagInput />
          <TagList />
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Card from '~/components/Card.vue';
import TagInput from '~/components/TagInput.vue';
import TagList from '~/components/TagList.vue';

export default Vue.extend({
  components: {
    Card,
    TagInput,
    TagList,
  },
});
</script>
