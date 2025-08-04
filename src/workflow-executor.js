import { chromium } from 'playwright';

/**
 * 工作流运行器
 * 基于: Recorded Workflow
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
            
            console.log('🌐 导航到: https://www.baidu.com/');
            await this.page.goto('https://www.baidu.com/');
            await this.page.waitForLoadState('networkidle');
            
            console.log('👆 点击: ');
            await this.page.click('#kw');
            await this.page.waitForTimeout(1000);
            
            console.log('⌨️ 输入: p');
            await this.page.fill('#kw', 'p');
            await this.page.waitForTimeout(500);
            
            console.log('⌨️ 输入: playwright');
            await this.page.fill('#kw', 'playwright');
            await this.page.waitForTimeout(500);
            
            console.log('⌨️ 按键: Enter');
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(500);
            
            console.log('👆 点击: ');
            await this.page.click('#su');
            await this.page.waitForTimeout(1000);
            
            console.log('📜 滚动页面');
            await this.page.mouse.wheel(0, 200);
            await this.page.waitForTimeout(1000);
            
            console.log('📜 滚动页面');
            await this.page.mouse.wheel(0, 300);
            await this.page.waitForTimeout(1000);
            
            console.log('👆 点击: ...reliable end-to-end testing for modern web apps | Playwright');
            await this.page.click('p._paragraph_1g9za_2.cu-line-clamp-default.cu-line-clamp-1.md.sc-paragraph');
            await this.page.waitForTimeout(1000);
            
            console.log('🌐 导航到: https://playwright.dev/');
            await this.page.goto('https://playwright.dev/');
            await this.page.waitForLoadState('networkidle');
            
            console.log('👆 点击: Get started');
            await this.page.click('a.getStarted_Sjon[href="/docs/intro"]');
            await this.page.waitForTimeout(1000);
            
            
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
    });
