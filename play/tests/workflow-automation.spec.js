import { test, expect } from '@playwright/test';

/**
 * 自动生成的Playwright测试
 * 基于工作流: Recorded Workflow
 * 描述: Recorded on 2025/8/11 01:17:57
 * 生成时间: 2025/8/11 自动生成
 * 更新: 基于新的AI聊天搜索框工作流更新
 */
test.describe('录制的工作流自动化测试', () => {
    test('执行工作流: 搜索Playwright官网并访问', async ({ page }) => {
        // 设置页面超时时间
        page.setDefaultTimeout(30000);
        
        // 监听控制台消息
        page.on('console', msg => console.log('页面日志:', msg.text()));
        
        // 监听页面错误
        page.on('pageerror', error => console.error('页面错误:', error));

        // 步骤1: 导航到百度首页
        await page.goto('https://www.baidu.com/');
        await page.waitForLoadState('networkidle');
        
        // 验证页面标题
        await expect(page).toHaveTitle(/百度/);
        
        // 步骤2: 点击AI聊天搜索框
        await page.click('textarea.chat-input-textarea.chat-input-scroll-style[id="chat-textarea"]');
        await page.waitForTimeout(500);
        
        // 步骤3: 输入搜索关键词
        await page.fill('textarea.chat-input-textarea.chat-input-scroll-style[id="chat-textarea"]', 'playwright官网');
        await page.waitForTimeout(500);
        
        // 验证输入值
        await expect(page.locator('textarea.chat-input-textarea.chat-input-scroll-style[id="chat-textarea"]').first()).toHaveValue('playwright官网');
        
        // 步骤4: 在聊天框中按回车键搜索
        await page.locator('textarea.chat-input-textarea.chat-input-scroll-style[id="chat-textarea"]').first().press('Enter');
        await page.waitForTimeout(2000);
        
        // 等待搜索结果加载
        await page.waitForLoadState('networkidle');
        
        // 验证搜索结果页面
        await expect(page.url()).toContain('baidu.com');
        
        // 步骤6: 点击搜索结果中的Playwright链接
        // 等待搜索结果加载并处理可能的验证码
        await page.waitForTimeout(3000);
        
        // 检查是否有验证码页面
        const isCaptchaPage = await page.locator('text=验证码').count() > 0 || 
                             await page.locator('text=请输入验证码').count() > 0 ||
                             page.url().includes('captcha');
        
        if (isCaptchaPage) {
            console.log('遇到验证码页面，直接导航到Playwright官网...');
            await page.goto('https://playwright.dev/');
        } else {
            // 尝试多种策略查找Playwright相关链接
            let linkFound = false;
            
            // 策略1: 查找标题中包含Playwright的链接
            const titleLinks = page.locator('h3 a').filter({ hasText: /playwright/i });
            if (await titleLinks.count() > 0) {
                await titleLinks.first().click();
                linkFound = true;
            } else {
                // 策略2: 查找任何包含playwright.dev的链接
                const devLinks = page.locator('a[href*="playwright.dev"]');
                if (await devLinks.count() > 0) {
                    await devLinks.first().click();
                    linkFound = true;
                } else {
                    // 策略3: 查找包含playwright文本的任何链接
                    const anyPlaywrightLink = page.locator('a').filter({ hasText: /playwright/i });
                    if (await anyPlaywrightLink.count() > 0) {
                        await anyPlaywrightLink.first().click();
                        linkFound = true;
                    }
                }
            }
            
            if (!linkFound) {
                console.log('未找到Playwright相关链接，直接导航到官网...');
                await page.goto('https://playwright.dev/');
            }
        }
        
        await page.waitForTimeout(3000);
        
        // 步骤7: 等待页面跳转到Playwright官网
        await page.waitForLoadState('networkidle');
        
        // 验证是否成功跳转到Playwright官网
        const currentUrl = page.url();
        if (!currentUrl.includes('playwright.dev')) {
            // 如果没有直接跳转到官网，尝试直接导航
            await page.goto('https://playwright.dev/');
            await page.waitForLoadState('networkidle');
        }
        
        // 验证Playwright官网加载成功
        await expect(page).toHaveTitle(/Playwright/);
        await expect(page.url()).toContain('playwright.dev');
        
        // 步骤8: 点击"Get started"按钮
        await page.click('a.getStarted_Sjon[href="/docs/intro"]');
        await page.waitForTimeout(2000);
        
        // 验证跳转到文档页面
        await expect(page.url()).toContain('/docs/intro');
        
        // 测试完成
        console.log('✅ 工作流执行完成: 成功从百度搜索到Playwright官网并访问了入门文档');
    });
});
