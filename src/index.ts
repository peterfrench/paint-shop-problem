#!/usr/bin/env node
import { getColorBatch } from './colorBatch';
const args = process.argv.slice(2);
(async () => {
    try {
        const [filePath, debug, maxExecutions] = args
        const batch = await getColorBatch(filePath, parseInt(debug) === 1, parseInt(maxExecutions))
        console.log(batch)
    }catch(e) {
        console.log(e.message)
    }
})()