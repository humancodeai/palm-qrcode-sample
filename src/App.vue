<template>
  <HomeMobile v-if="isMobile"></HomeMobile>
  <Home v-else></Home>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Home from '@/views/HomePage.vue';
import HomeMobile from '@/views/HomeMobile.vue';

const isMobile = computed(() => {
  return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent
  );
});
</script>

<style lang="less" scoped></style>
