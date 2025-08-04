# Playwright 工作流自动化系统

基于录制的用户操作自动生成Playwright测试脚本的自动化工具。

## 🎯 功能特性

- ✅ 自动解析录制的workflow JSON文件
- ✅ 生成标准的Playwright测试脚本
- ✅ 支持多种操作类型：导航、点击、输入、按键、滚动
- ✅ 提供独立的工作流运行器
- ✅ 完整的错误处理和日志记录
- ✅ 支持多浏览器测试（Chrome、Firefox、Safari）

## 📁 项目结构

```
workflow-use/
├── src/
│   ├── workflow-parser.js      # 工作流解析器
│   ├── workflow-runner.js      # 主运行器
│   └── workflow-executor.js    # 独立执行器
├── tests/
│   └── workflow-automation.spec.js  # 自动生成的测试文件
├── package.json                # 项目配置
├── playwright.config.js        # Playwright配置
└── recorded_workflow_*.json    # 录制的工作流文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装Playwright浏览器

```bash
npm run install-browsers
```

### 3. 生成自动化脚本

```bash
npm run workflow
```

### 4. 运行测试

```bash
# 无界面模式
npm test

# 有界面模式（推荐调试时使用）
npm run test:headed

# 调试模式
npm run test:debug

# UI模式
npm run test:ui
```

## 📋 NPM 脚本说明

| 命令 | 说明 |
|------|------|
| `npm test` | 运行所有测试（无界面） |
| `npm run test:headed` | 运行测试（有界面） |
| `npm run test:debug` | 调试模式运行测试 |
| `npm run test:ui` | 使用Playwright UI模式 |
| `npm run install-browsers` | 安装Playwright浏览器 |
| `npm run workflow` | 生成工作流自动化脚本 |
| `npm run generate-report` | 生成测试报告 |

## 🔧 配置说明

### Playwright 配置

项目包含完整的Playwright配置文件 `playwright.config.js`，支持：

- 多浏览器测试（Chrome、Firefox、Safari）
- 并行测试执行
- 测试重试机制
- 多种报告格式（HTML、JSON、JUnit）
- 失败时截图和录屏
- 跟踪记录

### 工作流解析

系统会自动解析录制的工作流JSON文件，支持以下操作类型：

- **navigation**: 页面导航
- **click**: 元素点击
- **input**: 文本输入
- **key_press**: 按键操作
- **scroll**: 页面滚动

## 📊 测试报告

测试完成后，系统会生成多种格式的报告：

- HTML报告：`playwright-report/index.html`
- JSON报告：`test-results/results.json`
- JUnit报告：`test-results/results.xml`

查看HTML报告：
```bash
npm run generate-report
```

## 🐛 调试技巧

1. **使用有界面模式**：
   ```bash
   npm run test:headed
   ```

2. **使用调试模式**：
   ```bash
   npm run test:debug
   ```

3. **查看详细日志**：
   ```bash
   DEBUG=pw:api npm test
   ```

4. **单独运行工作流执行器**：
   ```bash
   node src/workflow-executor.js
   ```

## ⚠️ 注意事项

1. **选择器兼容性**：自动生成的选择器可能需要根据实际页面调整
2. **网络延迟**：根据网络情况调整等待时间
3. **页面变化**：如果目标页面结构发生变化，需要更新选择器
4. **浏览器兼容性**：测试不同浏览器时注意兼容性问题

## 📝 自定义配置

### 修改浏览器配置

编辑 `playwright.config.js` 文件，可以：
- 添加或移除测试浏览器
- 调整超时时间
- 配置代理设置
- 设置基础URL

### 自定义工作流解析

编辑 `src/workflow-parser.js` 文件，可以：
- 添加新的操作类型支持
- 修改选择器转换逻辑
- 调整生成的测试脚本格式

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

## 📄 许可证

MIT License

## 🆘 支持

如果遇到问题，请：
1. 检查Playwright官方文档
2. 查看生成的测试日志
3. 使用调试模式排查问题
4. 提交Issue描述问题
