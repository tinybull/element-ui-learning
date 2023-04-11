<template>
  <el-table :data="tableData">
    <el-table-column
      label="No."
      width="60"
      fixed="left"
      key="1"
      align="center"
    />
    <el-table-column
      label="Rule Name"
      width="220"
      fixed="left"
      key="2"
      align="center"
    />
    <el-table-column
      label="CBU Code"
      width="120"
      key="3"
      fixed="left"
      align="center"
    />
    <el-table-column
      label="CKD Code"
      width="120"
      fixed="left"
      key="4"
      align="center"
    />
    <el-table-column
      label="Dealer Name(EN)"
      width="180"
      fixed="left"
      key="5"
      align="center"
    />
    <el-table-column
      label="Region"
      width="120"
      key="6"
      align="center"
    />

    <el-table-column
      label="Target Achievement"
      width="320"
      key="7"
      align="center"
    >
      <el-table-column
        label="Original"
        width="160"
        key="8"
        align="center"
      />
      <el-table-column
        label="Final"
        width="160"
        align="center"
        key="9"
      />
    </el-table-column>

    <el-table-column
      align="center"
      key="10"
    >

      <template v-slot:header>
        <span>Actual</span>

        <el-popover
          placement="bottom-start"
          trigger="click"
        >
          <el-checkbox
            :indeterminate="actual.isIndeterminate "
            v-model="actual.checkAll"
            @change="handleCheckAllChange('actual',$event)"
          >
            全选
          </el-checkbox>
          <div class="el-divider el-divider--horizontal" style="margin: 4px 0;"></div>
          <el-checkbox-group
            v-model="actual.checkedReasons"
            @change="handleCheckedReasonChange('actual',$event)"
          >
            <div v-for="r in actual.reasonColumns">
              <el-checkbox :label="r.label"> {{ r.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
          <div class="el-divider el-divider--horizontal" style="margin: 4px 0;"></div>
          <span slot="reference" style="float:left;cursor:pointer;">
                  Reason
              <i class="el-icon-copy-document" style="margin-left:8px;"></i>
            </span>
        </el-popover>
      </template>


      <el-table-column
        label="Original"
        width="160"
        key="11"
        align="center"
      />
      <el-table-column
        label="Final"
        width="160"
        key="12"
        align="center"
      />
      <el-table-column
        label="Total Adjustment"
        width="220"
        key="13"
        align="center"
      />
      <el-table-column
        v-for="r in actual.reasonColumns"
        :key="r.key"
        :label="r.label"
        width="160"
        align="center"
        v-if="!r.hide"
      />
    </el-table-column>

  </el-table>
</template>

<script>
import _ from 'lodash'
import API from "@/api";
import { Page } from "@/utils/page";
import VbTable from '@/components/Table'
import uuid from 'uuid/v1'

export default {
  data() {
    return {
      searchForm: {
        period: new Date().getFullYear() + '',
        ruleName: ''
      },
      columns: [],
      params: {},
      page: new Page(),
      loading: false,
      tableData: [],
      actualPopoverVisible: false,
      actual: {
        checkedReasons: [],
        isIndeterminate: false,
        checkAll: true,
        reasonColumns: []
      },
      checkAll: false,
      key: uuid()
    };
  },
  // beforeUpdate() {
  //   this.$nextTick(()=>{
  //     console.log('next tick')
  //     this.$refs.vbTable.$refs.elTable.doLayout();
  //   })
  // },
  mounted() {
    this.actual.reasonColumns = [
      {
        label: 'Reason1',
        headerAlign: 'center',
        align: 'right',
        hide: false,
        width: 160,
        key: uuid()
      },
      {
        label: 'Reason2',
        headerAlign: 'center',
        align: 'right',
        hide: false,
        width: 160,
        key: uuid()
      },
      {
        label: 'Reason3',
        headerAlign: 'center',
        align: 'right',
        hide: false,
        width: 160,
        key: uuid()
      },
    ]

    this.actual.checkedReasons = this.actual.reasonColumns.map(r => r.label)

    this.$watch('actual.checkedReasons', function(newVal) {
      console.log('newVal', newVal)
      console.log(newVal)
      this.actual.reasonColumns.forEach(r => r.hide = true)
      newVal.forEach(v => {
        console.log(v)
        const item = _.find(this.actual.reasonColumns, (r) => {
          console.log(v, r.label)
          return r.label === v
        })
        console.log(item)
        item.hide = false;
      })
    })
  },
  methods: {
    handleCheckAllChange(t, val) {
      console.log('handleCheckAllChange', val)
      this[t].checkedReasons = val ? this[t].reasonColumns.map(r => r.label) : [];
      this[t].isIndeterminate = false;
      this[t].checkAll = val
    },
    handleCheckedReasonChange(t, value) {
      let checkedCount = value.length;
      this[t].checkAll = checkedCount === this[t].reasonColumns.length;
      this[t].isIndeterminate = checkedCount > 0 && checkedCount < this[t].reasonColumns.length;
    }
  }
};
</script>

<style scoped lang="scss">

::v-deep .el-table__header-wrapper,
::v-deep .el-table__fixed-header-wrapper {
  .is-group {
    th {
      height: 35px;
      padding: 0;

      &.merge-column {
        & > .cell {
          text-align: center;
        }
      }
    }
  }
}
</style>

