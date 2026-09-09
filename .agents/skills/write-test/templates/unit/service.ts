/**
 * 示例纯逻辑模块（write-test 单测模板的被测对象）。
 * 复制到 src/services/<name>.ts 后替换为真实业务逻辑；此处仅演示可跑、可断言。
 * 禁止 any；出入参显式类型。
 */

/** 把状态枚举值渲染成展示文本（纯函数，便于单测） */
export function formatStatus(status: 'todo' | 'doing' | 'done'): string {
  switch (status) {
    case 'todo':
      return '待处理';
    case 'doing':
      return '进行中';
    case 'done':
      return '已完成';
    default:
      return status;
  }
}

/** 分页页脚信息（纯函数） */
export function pageSummary(current: number, pageSize: number, total: number): string {
  if (total === 0) return '暂无数据';
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  return `第 ${start}-${end} 条，共 ${total} 条`;
}
