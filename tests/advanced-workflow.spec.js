import { test, expect } from '@playwright/test';

/**
 * 高级工作流测试 - 包含更多断言和验证
 */
test.describe('高级工作流自动化测试', () => {
    test('百度搜索Playwright并访问官网', async ({ page }) => {
        // 设置页面配置
        page.setDefaultTimeout(30000);
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // 监听网络请求（可选）
        const responses = [];
        page.on('response', response => {
            if (response.status() === 200) {
                responses.push(response.url());
            }
        });

        // 1. 访问百度首页
        console.log('🌐 访问百度首页...');
        await page.goto('https://www.baidu.com/');
        await page.waitForLoadState('networkidle');
        
        // 验证页面标题
        await expect(page).toHaveTitle(/百度一下/);
        
        // 验证搜索框存在
        const searchInput = page.locator('#kw');
        await expect(searchInput).toBeVisible();

        // 2. 输入搜索关键词
        console.log('⌨️ 输入搜索关键词: playwright');
        await searchInput.click();
        await searchInput.fill('playwright');
        
        // 验证输入内容
        await expect(searchInput).toHaveValue('playwright');

        // 3. 执行搜索
        console.log('🔍 执行搜索...');
        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press('Enter')
        ]);

        // 验证搜索结果页面
        await expect(page).toHaveURL(/.*s\?.*wd=playwright.*/);
        
        // 等待搜索结果加载
        await page.waitForSelector('.result', { timeout: 10000 });

        // 4. 查找并点击Playwright官网链接
        console.log('🎯 查找Playwright官网链接...');
        
        // 使用更灵活的选择器
        const playwrightLink = page.locator('a').filter({ 
            hasText: /playwright\.dev|Playwright.*官/i 
        }).first();
        
        // 如果找不到官网链接，尝试点击第一个结果
        const resultLinks = page.locator('.result h3 a');
        const firstResult = resultLinks.first();
        
        if (await playwrightLink.count() > 0) {
            console.log('✅ 找到Playwright官网链接');
            await playwrightLink.click();
        } else {
            console.log('ℹ️ 点击第一个搜索结果');
            await firstResult.click();
        }

        // 5. 等待页面跳转并验证
        await page.waitForLoadState('networkidle');
        
        // 检查是否到达了Playwright官网
        const currentUrl = page.url();
        console.log('📍 当前页面URL:', currentUrl);
        
        if (currentUrl.includes('playwright.dev')) {
            console.log('✅ 成功访问Playwright官网');
            
            // 验证官网页面元素
            await expect(page.locator('h1, .hero-title')).toBeVisible();
            
            // 6. 查找并点击"Get started"按钮
            console.log('🚀 查找Get started按钮...');
            const getStartedBtn = page.locator('a').filter({ 
                hasText: /get started|开始|入门/i 
            }).first();
            
            if (await getStartedBtn.count() > 0) {
                await getStartedBtn.click();
                await page.waitForLoadState('networkidle');
                
                // 验证是否进入文档页面
                const docsUrl = page.url();
                console.log('📚 文档页面URL:', docsUrl);
                await expect(page.url()).toMatch(/docs|documentation/);
                
                console.log('✅ 成功进入Playwright文档页面');
            } else {
                console.log('ℹ️ 未找到Get started按钮，跳过此步骤');
            }
        } else {
            console.log('ℹ️ 未直接跳转到Playwright官网，可能需要手动确认');
        }

        // 7. 截取最终页面截图
        await page.screenshot({ 
            path: `test-results/final-page-${Date.now()}.png`,
            fullPage: true 
        });

        console.log('✅ 工作流执行完成!');
        console.log(`📊 页面响应数量: ${responses.length}`);
    });

    test('简化版工作流 - 直接访问Playwright官网', async ({ page }) => {
        console.log('🎯 直接访问Playwright官网...');
        
        // 直接访问Playwright官网
        await page.goto('https://playwright.dev/');
        await page.waitForLoadState('networkidle');
        
        // 验证页面加载
        await expect(page).toHaveTitle(/Playwright/);
        
        // 查找并点击Get started
        const getStartedLink = page.locator('a[href*="/docs"]').first();
        if (await getStartedLink.count() > 0) {
            await getStartedLink.click();
            await page.waitForLoadState('networkidle');
            
            // 验证文档页面
            await expect(page.url()).toMatch(/docs/);
            console.log('✅ 成功访问Playwright文档');
        }
        
        // 截图保存
        await page.screenshot({ 
            path: `test-results/playwright-docs-${Date.now()}.png` 
        });
    });
});
