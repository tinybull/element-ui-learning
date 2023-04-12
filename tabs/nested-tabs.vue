<template>
<el-tabs
  v-model="activeGroup"
  type="border-card"
>
  <el-tab-pane
    label="Parts Category"
    name="partsCategory"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'partsCategory'"
      v-model="activePartsCategory"
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
    label="Family Code"
    name="familyCode"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'familyCode'"
      v-model="activeFamilyCode"
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
    label="Material Number"
    name="materialNumber"
    style="height: 432px;"
  >
    <el-tabs
      v-if="activeGroup === 'materialNumber'"
      v-model="activeMaterialNumber"
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
      activeGroup: 'partsCategory',
      activePartsCategory: 'include',
      activeFamilyCode: 'include',
      activeMaterialNumber: 'include'
    }
  },
}
</script
