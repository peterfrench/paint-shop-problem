import { getColorBatch, ERROR_CODE } from './colorBatch';

describe('valid color batch', () => {
    test('single matte', async () => {
        expect(await getColorBatch('./src/fixtures/5color-3ppl.txt')).toEqual('G G G G M')
    })
    
    test('double matte', async () => {
        expect(await getColorBatch('./src/fixtures/2color-2ppl.txt')).toEqual('M M')
    })

    test('larger number of customers', async () => {
        expect(await getColorBatch('./src/fixtures/5color-14ppl.txt')).toEqual('G M G M G')
    })
})

describe('no solutions', () => {
    test('one matte, one gloss', async () => {
        try {
            await getColorBatch('./src/fixtures/no-solution.txt')
        }catch(e) {
            expect(e).toEqual(new Error(ERROR_CODE.NO_SOLUTION))
        }
    })
})