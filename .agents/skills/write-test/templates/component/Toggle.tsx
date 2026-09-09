/**
 * 示例组件：开关按钮（write-test RTL 组件测试模板的被测对象）。
 * 复制到 src/components/Toggle.tsx 后替换为真实业务组件。
 */
import { useState } from 'react';
import { Button } from 'antd';

/** 开关按钮示例：点击切换开/关 */
function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <Button
      role="switch"
      type={on ? 'primary' : 'default'}
      onClick={() => setOn((v) => !v)}
    >
      {on ? '已开启' : '已关闭'}
    </Button>
  );
}

export default Toggle;
