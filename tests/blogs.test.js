const Page = require('./helper/page')
let page;

beforeEach(async() => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})

afterEach(async () => {
    await page.close()
})


describe('When User Logged In', () => {
    
    beforeEach(async() => {
        await page.login()
        await page.click('a.btn-floating')
    })

    test('Check Blog Create Form Visible or Not', async() => {
    
        const label = await page.getContentOf('form label')
        expect(label).toEqual('Blog Title')
    })
    describe('Check Form Validation with valid value', () => {
        beforeEach( async() => {
            await page.type('.title input', 'My Title')
            await page.type('.content input', 'My Content')
            await page.click('form button')
        })
        test('Submit and Review Data', async() => {
            const confirmMessage = await page.getContentOf('h5')
            expect(confirmMessage).toEqual('Please confirm your entries')
        })
        test('Saving Blog and goto index page', async() => {
            await page.click('button.green')
            await page.waitFor('.card')

            const title = await page.getContentOf('.card-title')
            const content = await page.getContentOf('p')

            expect(title).toEqual('My Title')
            expect(content).toEqual('My Content')
        })
    })
    describe('Check Form Validation with Invalid value', () => {
        beforeEach( async() => {
            await page.click('form button')
        })

        test('check Error Message', async() => {
            const titleError = await page.getContentOf('.title .red-text')
            const contentError = await page.getContentOf('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })
    })
})

describe('When User Not Logged In', () => {
    test('User Can Not Create Blog Post', async() => {
        const result = await page.post('/api/blogs', {title: 'My Title', content: 'My Content'})
        expect(result).toEqual({ error: 'You must log in!' })
    })
    test('User Can Not Fetch Blog Post', async() => {
        const result = await page.get('/api/blogs')
        expect(result).toEqual({ error: 'You must log in!' })
    })
})