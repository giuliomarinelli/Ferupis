import { getOriginalsMimeTypes } from '@apps/ferupis-qwik/pics'

interface Arg {
  arg: string,
  action: () => void
}

const args: Arg[] = [
  {
    arg: '--mime',
    action: () => {
      const mimeTypes = getOriginalsMimeTypes()
      if (!mimeTypes || !Array.isArray(mimeTypes) || mimeTypes.length === 0) {
        console.log('NO MIME Types Originals')
        return
      }
      console.log(`MIME Types Original
${'='.repeat(30)}\n`)
      mimeTypes.forEach((m, i) => console.log(`${i + 1} - ${m}`))
      console.log(`Count: ${mimeTypes.length}`)
      console.log('\n')
    }
  }
]

const exec = () => {
  const actionFn = args.find((a) => a.arg === process.argv[2])?.action
  if (!actionFn) {
    console.error('Wrong command')
    return
  }
  actionFn()
}

exec()
