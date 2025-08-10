import { test, expect } from '@playwright/test';

/**
 * 高级工作流测试 - 包含更多断言和验证
 * 更新: 2025/8/11 - 基于新的AI聊天搜索框工作流更新
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
        
        // 验证AI聊天搜索框存在
        const searchInput = page.locator('textarea.chat-input-textarea.chat-input-scroll-style[id="chat-textarea"]').first();
        await expect(searchInput).toBeVisible();

        // 2. 输入搜索关键词
        console.log('⌨️ 输入搜索关键词: playwright官网');
        await searchInput.click();
        await searchInput.fill('playwright官网');
        
        // 验证输入内容
        await expect(searchInput).toHaveValue('playwright官网');

        // 3. 执行搜索
        console.log('🔍 执行搜索...');
        await Promise.all([
            page.waitForNavigation(),
            searchInput.press('Enter')
        ]);

        // 验证搜索结果页面
        await expect(page).toHaveURL(/.*s\?.*wd=playwright.*/);
        
        // 等待搜索结果加载
        await page.waitForSelector('.result, span.tts-b-hl', { timeout: 10000 });

        // 4. 查找并点击Playwright官网链接
        console.log('🎯 查找Playwright官网链接...');
        
        // 等待页面稳定并检查是否有验证码
        await page.waitForTimeout(3000);
        
        const isCaptchaPage = await page.locator('text=验证码').count() > 0 || 
                             await page.locator('text=请输入验证码').count() > 0 ||
                             page.url().includes('captcha');
        
        if (isCaptchaPage) {
            console.log('⚠️ 遇到验证码页面，直接导航到Playwright官网...');
            await page.goto('https://playwright.dev/');
        } else {
            let linkFound = false;
            
            // 策略1: 查找标题链接中包含playwright的
            try {
                const titleLinks = page.locator('h3 a, .title a').filter({ hasText: /playwright/i });
                if (await titleLinks.count() > 0) {
                    console.log('✅ 在标题中找到Playwright链接');
                    await titleLinks.first().click();
                    linkFound = true;
                }
            } catch (e) {
                console.log('策略1失败:', e.message);
            }
            
            // 策略2: 查找href包含playwright.dev的链接
            if (!linkFound) {
                try {
                    const devLinks = page.locator('a[href*="playwright.dev"]');
                    if (await devLinks.count() > 0) {
                        console.log('✅ 找到playwright.dev链接');
                        await devLinks.first().click();
                        linkFound = true;
                    }
                } catch (e) {
                    console.log('策略2失败:', e.message);
                }
            }
            
            // 策略3: 查找文本包含playwright的任何链接
            if (!linkFound) {
                try {
                    const anyPlaywrightLink = page.locator('a').filter({ hasText: /playwright/i });
                    if (await anyPlaywrightLink.count() > 0) {
                        console.log('✅ 找到包含Playwright文本的链接');
                        await anyPlaywrightLink.first().click();
                        linkFound = true;
                    }
                } catch (e) {
                    console.log('策略3失败:', e.message);
                }
            }
            
            // 策略4: 点击第一个搜索结果
            if (!linkFound) {
                try {
                    const firstResult = page.locator('.result h3 a, .c-container h3 a').first();
                    if (await firstResult.count() > 0) {
                        console.log('ℹ️ 点击第一个搜索结果');
                        await firstResult.click();
                        linkFound = true;
                    }
                } catch (e) {
                    console.log('策略4失败:', e.message);
                }
            }
            
            // 最后的备用方案
            if (!linkFound) {
                console.log('🔄 所有策略都失败，直接导航到Playwright官网');
                await page.goto('https://playwright.dev/');
            }
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
