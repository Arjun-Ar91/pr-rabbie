class CommonPage {
    async launchApp(url) {
        await page.goto(url);
    }

    async click(locator) {
        await page.waitForSelector(locator);
        await page.click(locator);
    }

    async enterText(locator, text) {
        await page.fill(locator, text);
    }

    async getAttribute(locator, attribute) {
        return await page.getAttribute(locator, attribute);
    }

    async getText(locator) {
        const element = await page.waitForSelector(locator);
        return await element.innerText();
    }
}

module.exports = new CommonPage();
