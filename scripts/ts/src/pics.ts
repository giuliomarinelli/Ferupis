import { getOriginalsMimeTypes, getOriginalsOldWinPathByKeyname } from '@apps/ferupis-qwik/pics'

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
  },
  {
    arg: '--find-by-keyname',
    action: () => {
      const commandArgument = process.argv[2] ?? ''
      const keyname = commandArgument.includes('=')
        ? commandArgument.slice(commandArgument.indexOf('=') + 1)
        : process.argv[3]

      if (!keyname) {
        console.error('Usage: --find-by-keyname <keyname>')
        return
      }
      const searchResullt = getOriginalsOldWinPathByKeyname(keyname) ?? 'Not Found'
      console.log(`\n${searchResullt}\n`)
    }
  }
]

const exec = () => {
  const command = process.argv[2]?.split('=', 1)[0]
  const actionFn = args.find((a) => a.arg === command)?.action
  if (!actionFn) {
    console.error('Wrong command')
    return
  }
  actionFn()
}

exec()
