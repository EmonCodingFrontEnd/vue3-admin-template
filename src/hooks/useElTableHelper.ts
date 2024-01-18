import * as debounce from 'lodash/debounce'
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'

export default function (reqData: () => void, limit: number = 3) {
  const tableRef = ref()
  const tableHeight = ref<number>()

  // 当前页码
  const pageNo = ref<number>(1)
  // 每一页展示多少条数据
  const pageSize = ref<number>(limit)
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
    if (!$table) return
    const bottomOffset = 83
    // 计算列表高度并设置
    // nextTick(() => {
    tableHeight.value =
      window.innerHeight - $table.$el.getBoundingClientRect().top - bottomOffset
    $table.doLayout()
    // })
    //   .then(() => {
    //   })
    //   .catch(() => {
    //   })
  }

  // 根据屏幕自动计算表格高度
  const handleFn = debounce(() => setHeight(), 150)
  onMounted(() => {
    setTimeout(handleFn, 150) // 测试发现Main组件的过度动画需要138ms左右
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
