import WorkflowParser from './workflow-parser.js';
import fs from 'fs-extra';
import path from 'path';

/**
 * 工作流运行器主入口
 */
async function main() {
    console.log('🎭 Playwright 工作流自动化系统');
    console.log('================================');

    try {
        // 工作流文件路径
        const workflowPath = path.resolve('recorded_workflow_2025-07-25T16-29-04.json');
        
        // 检查文件是否存在
        if (!await fs.pathExists(workflowPath)) {
            console.error('❌ 工作流文件不存在:', workflowPath);
            return;
        }

        // 创建解析器
        const parser = new WorkflowParser(workflowPath);
        
        // 生成测试文件
        console.log('📝 生成Playwright测试文件...');
        const testScript = parser.generatePlaywrightTest();
        const testFilePath = path.resolve('tests', 'workflow-automation.spec.js');
        await fs.ensureDir(path.dirname(testFilePath));
        await fs.writeFile(testFilePath, testScript);
        console.log('✅ 测试文件已生成:', testFilePath);

        // 生成独立运行器
        console.log('📝 生成工作流运行器...');
        const runnerScript = parser.generateWorkflowRunner();
        const runnerFilePath = path.resolve('src', 'workflow-executor.js');
        await fs.writeFile(runnerFilePath, runnerScript);
        console.log('✅ 运行器文件已生成:', runnerFilePath);

        console.log('');
        console.log('🎉 自动化脚本生成完成!');
        console.log('');
        console.log('📋 使用说明:');
        console.log('1. 安装依赖: npm install');
        console.log('2. 安装浏览器: npm run install-browsers');
        console.log('3. 运行测试: npm test');
        console.log('4. 带界面运行: npm run test:headed');
        console.log('5. 调试模式: npm run test:debug');
        console.log('6. 独立运行器: npm run workflow');
        console.log('');

    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        console.error(error.stack);
    }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default main;
