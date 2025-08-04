#!/usr/bin/env node
import { chromium } from 'playwright';

/**
 * 快速执行器 - 直接运行录制的工作流
 */
async function quickRun() {
    console.log('🎭 Playwright 快速执行器启动...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🌐 开始执行工作流...');
        
        // 执行您的工作流步骤
        await page.goto('https://www.baidu.com/');
        await page.fill('#kw', 'playwright');
        await page.press('#kw', 'Enter');
        
        // 等待搜索结果
        await page.waitForSelector('.result');
        
        // 查找Playwright相关链接并点击
        const playwrightLink = page.locator('a').filter({ 
            hasText: /playwright/i 
        }).first();
        
        if (await playwrightLink.count() > 0) {
            await playwrightLink.click();
            console.log('✅ 成功点击Playwright链接');
        }
        
        // 等待页面加载
        await page.waitForLoadState('networkidle');
        
        console.log('✅ 工作流执行完成！');
        console.log('📍 最终页面:', page.url());
        
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
    } finally {
        // 保持浏览器打开5秒供查看
        await page.waitForTimeout(5000);
        await browser.close();
        console.log('🔚 浏览器已关闭');
    }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    quickRun().catch(console.error);
}
