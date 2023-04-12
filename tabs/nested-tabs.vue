<template>
<el-tabs
  v-model="activeGroup"
  type="border-card"
>
  <el-tab-pane
    label="P"
    name="p"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'p'"    // 应该可以省略
      v-model="activeP"
    >
      <el-tab-pane
        label="Include"
        name="include"
      >
        Include Content
      </el-tab-pane>
      <el-tab-pane
        label="Exclude"
        name="exclude"
      >
        Exclude Content
      </el-tab-pane>
    </el-tabs>
  </el-tab-pane>
  <el-tab-pane
    label="F"
    name="f"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'f'"
      v-model="activeF"
    >
      <el-tab-pane
        label="Include"
        name="include"
      >
        Include Content
      </el-tab-pane>
      <el-tab-pane
        label="Exclude"
        name="exclude"
      >
        Exclude Content
      </el-tab-pane>
    </el-tabs>
  </el-tab-pane>
  <el-tab-pane
    label="M"
    name="m"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'm'"
      v-model="activeM"
    >
      <el-tab-pane
        label="Include"
        name="include"
      >
        Include Content
      </el-tab-pane>
      <el-tab-pane
        label="Exclude"
        name="exclude"
      >
        Exclude Content
      </el-tab-pane>
    </el-tabs>
  </el-tab-pane>
</el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeGroup: 'p',
      activeP: 'include',
      activeF: 'include',
      activeM: 'include'
    }
  },
}
</script>
