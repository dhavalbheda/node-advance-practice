const Page = require('./helper/page')

let page;

beforeEach(async() => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})
afterEach(async () => {
     await page.close()
})

test('Launch Puppeteer', async() => {
    const text = await page.getContentOf('a.brand-logo')
    expect(text).toEqual('Blogster')
})

test('Login With Google Auth', async() => {
    await page.click('.right a')
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/)
})

test('After Login Check Logout Button', async () => {
    await page.login()
    const text = await page.getContentOf('a[href="/auth/logout"]')
    expect(text).toEqual('Logout')
})
