<template>
  <div>
    <el-form
      :model="searchForm"
      label-width="130px"
      @keyup.enter.native="handleSearch"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="Evaluation" required>
            <el-input
              v-model="searchForm.ruleName"
              maxlength="60"
              size="small"
              clearable
              placeholder="Input Rule Name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Year" required>
            <el-date-picker
              v-model="searchForm.period"
              type="year"
              clearable
              format="yyyy"
              size="small"
              value-format="yyyy"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right;margin-top: 8px;">
          <el-button icon="iconfont icon-qingchubeifen" @click="handleClear">
            Clear
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">
            Search
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider/>
    <el-row>
      <el-col :span="12">
        Month
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button type="default" style="width: auto;" icon="el-icon-download">Download</el-button>
      </el-col>
    </el-row>
    <vb-table ref="vbTable" :columns="columns" :data-source="tableData" :pagination="false"></vb-table>
    <el-pagination
      :current-page="page.index"
      :page-size="page.size"
      :page-sizes="[10,30,60,100]"
      :total="page.total"
      style="margin-top: 8px;text-align: right;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import moment from "moment";
import { mapState } from "vuex";
import API from "@/api";
import { Page } from "@/utils/page";
import VbTable from '@/components/Table'
import uuid from 'uuid/v1'

export default {
  components: {
    VbTable
  },
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
    this.columns = [
      {
        label: 'NO.',
        type: 'index',
        align: 'center',
        width: 60,
        key: uuid(),
        fixed: 'left'
      },
      {
        label: 'Rule Name',
        align: 'center',
        width: 220,
        key: uuid(),
        fixed: 'left'
      },
      {
        label: 'CBU Code',
        prop: 'cbu',
        align: 'center',
        width: 120,
        key: uuid(),
        fixed: 'left'
      },
      {
        label: 'CKD Code',
        prop: 'ckd',
        align: 'center',
        width: 120,
        key: uuid(),
        fixed: 'left'
      },
      {
        label: 'Dealer Name(EN)',
        prop: 'dealerNameEN',
        align: 'center',
        width: 180,
        key: uuid(),
        fixed: 'left',
        showOverflowTooltip: true
      },
      {
        label: 'Region',
        prop: 'region',
        align: 'center',
        key: uuid(),
        width: 120,
      },
      {
        label: 'Target Achievement',
        align: 'center',
        key: uuid(),
        width: 320,
        children: [
          {
            label: 'Original',
            headerAlign: 'center',
            align: 'right',
            key: uuid(),
            width: 160
          },
          {
            label: 'Final',
            headerAlign: 'center',
            align: 'right',
            key: uuid(),
            width: 160
          }
        ]
      },
      {
        align: 'center',
        width: 1020,
        key: uuid(),
        headerRender: () => {

          console.log('header render')

          const handleCheckedReasonChange = (value) => {
            let checkedCount = value.length;
            console.log(checkedCount, value)
            this.key = uuid()
            this.actual.checkAll = checkedCount === this.actual.reasonColumns.length;
            this.actual.isIndeterminate = checkedCount > 0 && checkedCount < this.actual.reasonColumns.length;
          }

          const handleCheckAllChange = (val) => {
            console.log('handleCheckAllChange', val)
            this.actual.checkedReasons = val ? this.actual.reasonColumns.map(r => r.label) : [];
            this.actual.isIndeterminate = false;
            this.actual.checkAll = val
            this.key = uuid()
          }

          return (
            <div>
              <span>Actual</span>

              <el-popover
                placement="bottom-start"
                trigger="click"
                value={ this.actualPopoverVisible }
              >
                <el-checkbox
                  indeterminate={ this.actual.isIndeterminate }
                  value={ this.actual.checkAll }
                  on-change={ handleCheckAllChange }
                >
                  全选
                </el-checkbox>
                <div class="el-divider el-divider--horizontal" style="margin: 4px 0;"></div>
                <el-checkbox-group
                  value={ this.actual.checkedReasons }
                  on-input={ (value) => {
                    this.actual.checkedReasons = value
                  } }
                  on-change={ handleCheckedReasonChange }
                >
                  {
                    this.actual.reasonColumns.map((r) => {
                      return <div>
                        <el-checkbox label={ r.label }> { r.label } </el-checkbox>
                      </div>
                    })
                  }
                </el-checkbox-group>
                <div class="el-divider el-divider--horizontal" style="margin: 4px 0;"></div>
                <span slot="reference" style="float:left;cursor:pointer;">
                    Reason
                    <i class="el-icon-copy-document" style="margin-left:8px;"></i>
                </span>
              </el-popover>
            </div>
          )
        },
        children: [
          {
            label: 'Original',
            headerAlign: 'center',
            align: 'right',
            width: 160,
            key: uuid(),
          },
          {
            label: 'Final',
            headerAlign: 'center',
            align: 'right',
            key: uuid(),
            width: 160
          },
          {
            label: 'Total Adjustment',
            headerAlign: 'center',
            align: 'right',
            key: uuid(),
            width: 220,
          },
          ...this.actual.reasonColumns
        ]
      }
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

    setTimeout(() => {
      let elBody = document.getElementsByClassName('el-table__body-wrapper')[0];
      let elMainContent = document.getElementById('el-main-content');
      elBody.addEventListener('scroll', function() {
        elMainContent.dispatchEvent(new Event('scroll'))
      })
    }, 0)
  },
  methods: {
    handleClear() {
      this.searchForm = {
        period: null,
        ruleName: ''
      };
      this.handleSearch()
      this.SET_EVALUATION_ONLINE_SEARCH_FORM(this.searchForm);
    },
    handleSearch() {
      this.page.index = 1;
      this.getListData(this.searchForm);
    },
    getListData(params) {
      if (params) {
        this.params = { ...params }
      }
      this.params.pageNumber = this.page.index
      this.params.pageSize = this.page.size

      this.loading = true;
      API.EVALUATION
        .getRuleOnlineData(this.params)
        .then(({ data: { object } }) => {
          this.tableData = object.data;
          this.page.total = Number(object.total);
        })
        .finally(() => {
          this.loading = false
          this.$refs.dataTable.doLayout();
        })
    },
    handleSizeChange(size) {
      this.page.size = size
      this.getListData()
    },
    handleCurrentChange(current) {
      this.page.index = current
      this.getListData()
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

