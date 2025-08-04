import fs from 'fs-extra';
import path from 'path';

/**
 * 工作流解析器类
 * 用于解析recorded workflow JSON文件并生成Playwright测试脚本
 */
class WorkflowParser {
    constructor(workflowPath) {
        this.workflowPath = workflowPath;
        this.workflow = null;
        this.loadWorkflow();
    }

    /**
     * 加载工作流文件
     */
    loadWorkflow() {
        try {
            const workflowContent = fs.readFileSync(this.workflowPath, 'utf8');
            this.workflow = JSON.parse(workflowContent);
            console.log(`✅ 成功加载工作流: ${this.workflow.name}`);
        } catch (error) {
            console.error('❌ 加载工作流文件失败:', error.message);
            throw error;
        }
    }

    /**
     * 解析工作流步骤
     */
    parseSteps() {
        if (!this.workflow || !this.workflow.steps) {
            throw new Error('工作流数据无效');
        }

        const actions = [];
        let currentUrl = '';

        for (const step of this.workflow.steps) {
            switch (step.type) {
                case 'navigation':
                    actions.push({
                        type: 'navigation',
                        url: step.url,
                        timestamp: step.timestamp
                    });
                    currentUrl = step.url;
                    break;

                case 'click':
                    actions.push({
                        type: 'click',
                        selector: step.cssSelector || step.xpath,
                        elementText: step.elementText,
                        url: currentUrl,
                        timestamp: step.timestamp
                    });
                    break;

                case 'input':
                    actions.push({
                        type: 'input',
                        selector: step.cssSelector || step.xpath,
                        value: step.value,
                        url: currentUrl,
                        timestamp: step.timestamp
                    });
                    break;

                case 'key_press':
                    actions.push({
                        type: 'key_press',
                        key: step.key,
                        selector: step.cssSelector || step.xpath,
                        url: currentUrl,
                        timestamp: step.timestamp
                    });
                    break;

                case 'scroll':
                    actions.push({
                        type: 'scroll',
                        scrollX: step.scrollX,
                        scrollY: step.scrollY,
                        url: currentUrl,
                        timestamp: step.timestamp
                    });
                    break;
            }
        }

        return actions;
    }

    /**
     * 生成Playwright测试脚本
     */
    generatePlaywrightTest() {
        const actions = this.parseSteps();
        let testScript = `import { test, expect } from '@playwright/test';

/**
 * 自动生成的Playwright测试
 * 基于工作流: ${this.workflow.name}
 * 描述: ${this.workflow.description}
 * 生成时间: ${new Date().toLocaleString()}
 */
test.describe('录制的工作流自动化测试', () => {
    test('执行工作流: ${this.workflow.name}', async ({ page }) => {
        // 设置页面超时时间
        page.setDefaultTimeout(30000);
        
        // 监听控制台消息
        page.on('console', msg => console.log('页面日志:', msg.text()));
        
        // 监听页面错误
        page.on('pageerror', error => console.error('页面错误:', error));

`;

        let lastUrl = '';
        
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            
            switch (action.type) {
                case 'navigation':
                    if (action.url !== lastUrl) {
                        testScript += `        // 导航到: ${action.url}
        await page.goto('${action.url}');
        await page.waitForLoadState('networkidle');
        
`;
                        lastUrl = action.url;
                    }
                    break;

                case 'click':
                    const clickSelector = this.sanitizeSelector(action.selector);
                    testScript += `        // 点击元素: ${action.elementText || 'Unknown'}
        await page.click('${clickSelector}');
        await page.waitForTimeout(1000);
        
`;
                    break;

                case 'input':
                    const inputSelector = this.sanitizeSelector(action.selector);
                    testScript += `        // 输入文本: ${action.value}
        await page.fill('${inputSelector}', '${action.value}');
        await page.waitForTimeout(500);
        
`;
                    break;

                case 'key_press':
                    testScript += `        // 按键: ${action.key}
        await page.keyboard.press('${action.key}');
        await page.waitForTimeout(500);
        
`;
                    break;

                case 'scroll':
                    testScript += `        // 滚动页面
        await page.mouse.wheel(${action.scrollX}, ${action.scrollY});
        await page.waitForTimeout(1000);
        
`;
                    break;
            }
        }

        testScript += `        // 测试完成
        console.log('✅ 工作流执行完成');
    });
});`;

        return testScript;
    }

    /**
     * 清理选择器字符串
     */
    sanitizeSelector(selector) {
        if (!selector) return '';
        
        // 优先使用CSS选择器，如果是XPath则转换
        if (selector.startsWith('id(')) {
            // 简单的XPath到CSS选择器转换
            const idMatch = selector.match(/id\("([^"]+)"\)/);
            if (idMatch) {
                return `#${idMatch[1]}`;
            }
        }
        
        // 清理CSS选择器中的特殊字符
        return selector.replace(/'/g, "\\'");
    }

    /**
     * 生成工作流运行器
     */
    generateWorkflowRunner() {
        const actions = this.parseSteps();
        
        return `import { chromium } from 'playwright';

/**
 * 工作流运行器
 * 基于: ${this.workflow.name}
 */
class WorkflowRunner {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async setup() {
        console.log('🚀 启动浏览器...');
        this.browser = await chromium.launch({ 
            headless: false,
            slowMo: 1000 // 添加延迟以便观察
        });
        this.page = await this.browser.newPage();
        
        // 设置视口大小
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        
        // 监听页面事件
        this.page.on('console', msg => console.log('📄 页面日志:', msg.text()));
        this.page.on('pageerror', error => console.error('❌ 页面错误:', error));
    }

    async run() {
        try {
            await this.setup();
            console.log('▶️ 开始执行工作流...');
            
            ${this.generateRunnerSteps(actions)}
            
            console.log('✅ 工作流执行完成!');
            
        } catch (error) {
            console.error('❌ 工作流执行失败:', error);
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔚 浏览器已关闭');
        }
    }
}

// 运行工作流
const runner = new WorkflowRunner();
runner.run()
    .then(() => runner.cleanup())
    .catch(error => {
        console.error('执行失败:', error);
        runner.cleanup();
    });`;
    }

    /**
     * 生成运行器步骤
     */
    generateRunnerSteps(actions) {
        let steps = '';
        let lastUrl = '';

        for (const action of actions) {
            switch (action.type) {
                case 'navigation':
                    if (action.url !== lastUrl) {
                        steps += `            console.log('🌐 导航到: ${action.url}');
            await this.page.goto('${action.url}');
            await this.page.waitForLoadState('networkidle');
            
`;
                        lastUrl = action.url;
                    }
                    break;

                case 'click':
                    const clickSelector = this.sanitizeSelector(action.selector);
                    steps += `            console.log('👆 点击: ${action.elementText || 'Unknown'}');
            await this.page.click('${clickSelector}');
            await this.page.waitForTimeout(1000);
            
`;
                    break;

                case 'input':
                    const inputSelector = this.sanitizeSelector(action.selector);
                    steps += `            console.log('⌨️ 输入: ${action.value}');
            await this.page.fill('${inputSelector}', '${action.value}');
            await this.page.waitForTimeout(500);
            
`;
                    break;

                case 'key_press':
                    steps += `            console.log('⌨️ 按键: ${action.key}');
            await this.page.keyboard.press('${action.key}');
            await this.page.waitForTimeout(500);
            
`;
                    break;

                case 'scroll':
                    steps += `            console.log('📜 滚动页面');
            await this.page.mouse.wheel(${action.scrollX}, ${action.scrollY});
            await this.page.waitForTimeout(1000);
            
`;
                    break;
            }
        }

        return steps;
    }
}

export default WorkflowParser;
