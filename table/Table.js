import { isEmpty, isFunction } from 'lodash'
import uuid from 'uuid/v1'

export default {
  name: 'Table',
  props: {
    height: {
      type: String | Number,
      default() {
        return ' '
      }
    },
    cellClassName: {
      type: Function | String,
      default() {
        return ' '
      }
    },
    headerCellClassName: {
      type: Function | String,
      default() {
        return ' '
      }
    },
    rowKey: {
      type: Function | String
    },
    dataSource: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object | Boolean,
      default() {
        return {}
      }
    },
    tableKey: { // (多级表头的情景)动态切换列会导致列闪烁，外层组件一定要提供，并且column显示隐藏切换时要重新赋值
      type: String,
      default() {
        return uuid()
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUpdate() { // 不涉及到多级表头，可以做到不抖动切换表头列
    this.$nextTick(() => {
      console.log('rrr')
      this.$refs.elTable.doLayout()
    })
  },
  watch: {
    dataSource() {
      this.handleResize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      // todo: Columns中有fixed，需要重新布局
      this.$nextTick(() => {
        this.$refs.elTable.debouncedUpdateLayout()
        this.$refs.elTable.doLayout()
      })
    },
    renderColumns(column) {

      if (column.label === 'Actual') {
        console.log('render column', column.label)

      }
      if (column.hide) {
        return null
      }

      let { prop } = column

      const {
        type,
        align,
        headerAlign,
        resizable,
        label,
        className,
        fixed,
        width,
        minWidth,
        showOverflowTooltip,
        children = [],
        /** * @deprecated use prop instead */
        dataIndex,
        reserveSelection,
        defaultRender,
        headerRender,
        key = uuid() // 解决多级表头渲染出错问题 - 必须要有唯一的key, 不能用index，因嵌套表头的index值会重复
      } = column

      if (!prop) {
        prop = dataIndex
      }

      const scopedSlots = {}

      if (isFunction(defaultRender)) {
        scopedSlots.default = props => defaultRender.call(this, props)
      }

      if (isFunction(headerRender)) {
        scopedSlots.header = props => headerRender.call(this, props)
      }

      return (
        <el-table-column
          { ...{
            props: { type, prop, align, headerAlign, key, fixed, width, reserveSelection, label, minWidth, showOverflowTooltip, className, resizable },
            scopedSlots
          } }
        >
          { isEmpty(children) ? null : children.map(child => this.renderColumns(child)) }
        </el-table-column>
      )
    },
    clearSelection() {
      this.$refs.elTable.clearSelection()
    }
  },
  render() {

    console.log('tableKey', this.tableKey)

    // todo: usePagination
    const mergedPagination = {
      props: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 30, 60, 100],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        ...this.pagination
      },
      on: {
        'size-change': (size) => {
          const { sizeChange } = this.pagination
          if (isFunction(sizeChange)) {
            sizeChange(size)
          }
        },
        'current-change': (current) => {
          const { currentChange } = this.pagination
          if (isFunction(currentChange)) {
            currentChange(current)
          }
        }
      }
    }

    return (<div>
      <el-table
        ref='elTable'
        height={ this.height }
        headerCellStyle={ {
          background: 'rgb(27,105,212,0.08)',
          color: '#606266'
        } }
        key={ this.tableKey }
        class={ { 'table-no-data': !this.dataSource.length } }
        rowStyle={ { height: '48px' } }
        border
        emptyText=' '
        rowKey={ this.rowKey }
        size='default'
        stripe
        useVirtual
        cellClassName={ (props) => {
          if (typeof this.cellClassName === 'function') {
            return this.cellClassName(props)
          } else {
            return this.cellClassName
          }
        } }
        headerCellClassName={ (props) => {
          if (typeof this.headerCellClassName === 'function') {
            return this.headerCellClassName(props)
          } else {
            return this.headerCellClassName
          }
        } }
        on-select={ (selection, row) => this.$emit('select', selection, row) }
        on-select-all={ (selection) => this.$emit('select-all', selection) }
        on-selection-change={ (selection) => this.$emit('selection-change', selection) }
        cellStyle={ {
          padding: '5px 0',
          height: '30px',
          border: 'none'
        } }
        data={ this.dataSource }
      >
        { this.columns.map((column) => this.renderColumns(column)) }
      </el-table>
      { this.pagination ? (<el-pagination
        style='text-align:right;margin-top:12px;'
        { ...mergedPagination }
      />) : null }
    </div>)
  }
}
