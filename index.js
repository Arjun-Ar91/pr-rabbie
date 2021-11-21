class CommonPage {
    async launchApp() {
        await page.goto(URL);
    }

    async goBack() {
        await page.goBack();
    }

    async getCurrentPageUrl() {
        return await page.url();
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

    async waitForElement(locator) {
        await page.waitForSelector(locator);
    }

    async wait(ms) {
        await page.waitForTimeout(ms);
    }

    /**
     * Description  - This method should be used where you need to wait for a particular element to be disappeared from the DOM view
     */
    async waitForNotVisible(locator, pollTime = 200) {
        await this.wait(1000);
        let isVisible = await this.isVisible(locator);
        while (isVisible) {
            await this.wait(pollTime);
            isVisible = await this.isVisible(locator);
        }
    }

    /**
     * Description  - This method should be used where you need to wait for a particular element and perform an assertion to TRUE
     * You can increase the poll time and number of times you wanted to search in the application by calling from the page class
     * Example - you can pass like (locator, 5, 400) which keeps searching for the specified locator element every 400 milliseconds for
     * 5 times equating to 2 seconds on whole. Ideal to keep within 5 times max.
     */
    async elementShouldBeVisible(locator, numberOfTimesToSearch = 5, pollTime = 300) {
        let isVisible = await this.isVisible(locator);
        let count = 0;
        while (!isVisible && count <= numberOfTimesToSearch) {
            ++count;
            await this.wait(pollTime);
            isVisible = await this.isVisible(locator);
        }
        expect(await commonPage.isVisible(locator)).toBeTruthy();
    }

    async getText(locator) {
        const element = await page.waitForSelector(locator);
        return await element.innerText();
    }

    async getPages() {
        return await context.pages();
    }

    async isVisible(locator) {
        let isVisible = false;
        try {
            isVisible = await page.isVisible(locator);
        } catch (e) {
            if (e.message.toString().includes('Element is not attached to the DOM')) {
                await this.wait(2000);
                isVisible = await page.isVisible(locator);
            }
        }
        return isVisible;
    }

    async getTitle() {
        return page.title();
    }

    /**
     * Description  - this method should be used for all test where number of elements required for validation in the test
     * is more than zero
     */
    async waitAndGetElements(locator) {
        await this.waitForElement(locator);
        return page.$$(locator);
    }

    /**
     * Description  - this method can be used to get elements where you need to validate elements to be equal to 0, if
     * test requires more than 0, then use only `waitAndGetElements` function
     */
    async getElements(locator) {
        return page.$$(locator);
    }

    async getChildElementText(parentLocator, childLocator) {
        return await parentLocator.$eval(childLocator, (locatorText) => locatorText.textContent);
    }
    async getTextOfChildElement(parentlocator, childlocator) {
        const element = await this.waitAndGetElement(parentLocator);
        return await element.$eval(childLocator, (locatorText) => locatorText.textContent);
    }

    async waitAndGetElement(locator) {
        await this.waitForElement(locator);
        return page.$(locator);
    }

    async getTextLocator(locator) {
        return `//*[text()="${locator}"]`;
    }

    async isButtonEnabled(locator) {
        return await page.isEnabled(locator);
    }

    async getChildElementAttribute(parentLocator, childLocator, attribute) {
        return await parentLocator.$eval(childLocator, (attributeValue) => attributeValue.getAttribute(attribute));
    }

    async getDownloadFileName(locator) {
        await commonPage.waitForElement(locator);
        const [download] = await Promise.all([
            // Start waiting for the download
            page.waitForEvent('download'),
            // Perform the action that initiates download
            page.click(locator),
        ]);
        return await download.suggestedFilename();
    }

    async waitForNewTabToOpen(locator) {
        const [newPage] = await Promise.all([context.waitForEvent('page'), page.click(locator)]);
        await newPage.waitForLoadState();
        return await newPage;
    }

    async isChildElementVisible(parentLocator, childLocator) {
        return await parentLocator.$eval(childLocator, (elem) => {
            return elem.style.display !== 'none';
        });
    }

    async getElement(locator) {
        return page.$(locator);
    }
}

export const commonPage = new CommonPage();
