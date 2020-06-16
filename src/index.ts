import fs from 'fs'
import readline from 'readline'

function checkRestriction(filepath: string): Promise<string | null> {
  const rules = new RegExp(
    `(.reduce\\()|(.map\\()|
    (.filter\\()|(.indexOf\\()|(.toLocaleString\\()|
    (.lastIndexOf\\()|(.reverse\\()|(.reduceRight\\()|(.includes\\()|
    (.flat\\()|(.flatMap\\()|(.find\\()|(.findIndex\\()|(.fill\\()|
    (.every\\()|(.copyWithin\\()|(.entries\\()|(.of\\()|(new Set\\()`,
    'g'
  )

  const rl = readline.createInterface({
    input: fs.createReadStream(filepath)
  })

  return new Promise(resolve => {
    let lineNumber = 1
    let result: null | string = null
    rl.on('line', input => {
      if (rules.test(input)) {
        result = `${input.trim()}: ${lineNumber}`
        rl.close()
        rl.removeAllListeners()
      }
      lineNumber += 1
    }).on('close', () => resolve(result))
  })
}

export = checkRestriction
