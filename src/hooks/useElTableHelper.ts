import * as debounce from 'lodash/debounce'
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

export default function (reqData: Function) {
  const tableRef = ref()
  const tableHeight = ref<number>()

  // 当前页码
  const pageNo = ref<number>(1)
  // 每一页展示多少条数据
  const pageSize = ref<number>(3)
  // 存储已有品牌数据总数
  const total = ref<number>(0)

  // 分页器当前尺寸发生变化的时候触发
  const handleSizeChange = (val: number) => {
    pageNo.value = 1
    pageSize.value = val
    reqData()
  }

  // 分页器当前页码发生变化的时候触发
  const handleCurrentChange = (val: number) => {
    pageNo.value = val
    reqData()
  }

  const setHeight = () => {
    const $table = tableRef.value
    const bottomOffset = 83
    if (!$table) return

    // 计算列表高度并设置
    const height =
      window.innerHeight - $table.$el.getBoundingClientRect().top - bottomOffset
    nextTick(() => {
      tableHeight.value = height
      $table.doLayout()
    })
      .then(() => {})
      .catch(() => {})
  }

  // 根据屏幕自动计算表格高度
  const handleFn = debounce(() => setHeight(), 150)
  onMounted(() => {
    handleFn()
    window.addEventListener('resize', handleFn)
    reqData()
  })
  onBeforeUnmount(() => window.removeEventListener('resize', handleFn))

  return {
    tableRef,
    tableHeight,
    pageNo,
    pageSize,
    total,
    handleSizeChange,
    handleCurrentChange,
  }
}
