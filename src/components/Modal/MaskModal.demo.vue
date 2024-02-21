import MaskModal from './MaskModal.vue';
<template>
  <MaskModal>
    <template v-slot:toolbar>
      <div class="tz-modal_toolbar">
        <button class="color-link btn-reset">LinkButton &gt;</button>
      </div>
    </template>

    <!-- block   
    <template v-slot:toolbar>
      <button class="tz-btn-pblock mb-2">
        block   
      </button>
    </template> -->
  </MaskModal>
</template>
<script>
import MaskModal from './MaskModal.vue';
export default {
  components: {
    MaskModal,
  },
};
</script>
