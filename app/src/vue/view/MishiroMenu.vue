<template>
<div class="main-block-style flex-center">
  <div class="gray-area menu-content">
    <button class="cgss-btn-lg cgss-btn-lg-ok" @click="showOption($event.target)">{{$t("menu.option")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-star" @click="showLicense">{{$t("menu.license")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-star" @click="cacheClear">{{$t("menu.cacheClear")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-ok" @click="update">{{$t("menu.update")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-star" @click="showVar">{{$t("menu.var")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-star" @click="relaunch">{{$t("menu.relaunch")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-ok" @click="calculator">{{$t("menu.calculator")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-star" @click="showAbout">{{$t("menu.about")}}</button>
    <button class="cgss-btn-lg cgss-btn-lg-default" @click="exit">{{$t("menu.exit")}}</button>
  </div>
</div>
</template>

<script lang="ts" src="../../ts/renderer/mishiro-menu.ts">
</script>

<style>
.menu-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 672px;
}
.menu-content button {
  margin: 10px;
}

.margin-left-20{
  margin-left: 20px;
}
.introduction{
  width: 672px;
  height: calc(100% - 150px);
  margin-bottom: 30px;
}
.spinner{
  width: 48px;
  height: 48px;
  position: absolute;
  bottom: 40px;
  right: 40px;
}
</style>
