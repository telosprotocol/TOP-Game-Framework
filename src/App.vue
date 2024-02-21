<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="!$route.meta.noKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.noKeepAlive"> </router-view>
    <portal-target name="modal" multiple></portal-target>
  </div>
</template>
<script>
export default {};
</script>
