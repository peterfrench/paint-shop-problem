import fs from 'fs'
import util from 'util'
import path from 'path' 
const readFile = util.promisify(fs.readFile)

export const enum ERROR_CODE {
    NO_SOLUTION = 'No solution exists',
    EXCEEDED_MAX_EXECUTIONS = 'Error: Exceeded max executions.'
}

const enum FINISH {
    GLOSS = 'G',
    MATTE  = 'M'
}

const DIVIDER = " "

export const getColorBatch = async (
    filePath: string,
    debug?: boolean,
    maxExecutions?: number
): Promise<string> => {
    // Reads entire file into memory
    // (Could potentially utilize streams here to improve performance)
    const file = await readFile(path.join(process.cwd(), filePath), 'utf8')
    const parts = file.split("\n")
    const [ colorsLine, ...preferenceLines ] = parts
    const customers: CustomerPreferences[] = []
    const numberOfColors = parseInt(colorsLine)

    // Fill batch with all gloss
    const batch: string[] = []
    for(let i = 0; i < numberOfColors; i++) {
        batch.push(FINISH.GLOSS)
    }

    // Build customers' color preference hash maps
    for(let i = 0; i < preferenceLines.length; i++) {
        const preferences = preferenceLines[i].split(DIVIDER)
        const customerPreferences: CustomerPreferences = {
            colors: {}
        }
        for(let p = 0; p < preferences.length; p += 2 ) {
            const position = parseInt(preferences[p])
            const finish = preferences[p+1]
            customerPreferences.colors[position] = finish as FINISH
            if(finish === FINISH.MATTE) {
                customerPreferences.hasMatte = true
                customerPreferences.mattePosition = position
            }
        }
        customers.push(customerPreferences)
    }

    if(debug) {
        console.log(customers)
    }
    
    let loopCount = 0

    // Validate current batch against each customer
    let customerPosition = 0
    while(customerPosition < customers.length) {
        // debugging
        if(debug) {
            console.log(batch)
        }
        if(maxExecutions) {
            if(loopCount >= maxExecutions) {
                throw new Error(ERROR_CODE.EXCEEDED_MAX_EXECUTIONS)
            }
            loopCount++
        }

        const customer = customers[customerPosition]
        // Check if customer has a favorite color already in the current batch
        let hasMatchedColor = false
        for (let [colorPosition, colorFinish] of Object.entries(customer.colors)) {
            // @ts-ignore
            if(batch[colorPosition - 1] === colorFinish) {
                hasMatchedColor = true
                break
            }
        }
        
        // If customer doesn't have a matching coslor, grab it's matte color
        // and update the batch to include that matte color. When a customer
        // doesn't have a matching color and doesn't have a matte finish, there
        // is no solution for this group of customers. 
        if(!hasMatchedColor) {
            if(customer.hasMatte && customer.mattePosition !== undefined) {
                // Update the current batch's color from gloss to matte
                batch[customer.mattePosition - 1] = FINISH.MATTE
                // Reset customer position in order to validate the new batch
                // against all customers.
                customerPosition = 0
            }else {
                throw new Error(ERROR_CODE.NO_SOLUTION)
            }
        // If the customer has a matching color, move on to validate the next customer's colors
        }else{
            customerPosition++
        }
    }

    return batch.join(DIVIDER)
}

interface CustomerPreferences {
    colors: Record<number, string>
    hasMatte?: boolean
    mattePosition?: number
}
