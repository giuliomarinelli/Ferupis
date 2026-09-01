# VS Code: estensioni da disattivare nei workspace Qwik

Queste estensioni vanno disattivate con l'azione **Disable (Workspace)** quando
si lavora a un progetto Qwik. Il servizio TypeScript integrato di VS Code gestisce
gia' IntelliSense e auto-import; queste estensioni aggiungono server o provider
di completamento sovrapposti.

| ID estensione | Motivo |
| --- | --- |
| `angular.ng-template` | Angular Language Service si attiva anche sui file TypeScript e non serve a Qwik. |
| `steoates.autoimport` | Scansiona file TypeScript e `node_modules`, sovrapponendosi all'auto-import nativo. |
| `christian-kohler.npm-intellisense` | Duplica i suggerimenti dei moduli durante gli import. |
| `christian-kohler.path-intellisense` | Duplica i suggerimenti dei percorsi durante gli import. |

## Eccezione MDX

`unifiedjs.vscode-mdx` va mantenuta attiva quando il progetto usa MDX, come nel
workspace Ferupis. Conviene disattivarla nel workspace solo nei progetti che non
contengono e non prevedono file `.mdx`.

L'estensione fornisce evidenziazione, language server e integrazione TypeScript,
ma non e' un formatter di documento. Nel workspace Ferupis i file MDX usano
quindi Prettier in modo esplicito:

```json
{
  "mdx.server.enable": true,
  "[mdx]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

Il file `apps/ferupis-qwik/tsconfig.json` abilita inoltre i controlli del
language server:

```json
{
  "mdx": {
    "checkMdx": true
  }
}
```

### Limite noto dell'auto-import MDX

Nella versione `unifiedjs.vscode-mdx@1.8.17` i suggerimenti di auto-import per
un componente possono non comparire subito dopo il carattere `<`. Il problema
e' noto anche a monte. Come soluzione temporanea, scrivi il nome dentro
un'espressione, per esempio `{ComeBackBtn}`, richiama IntelliSense con
`Ctrl+Space`, accetta l'auto-import e poi usa normalmente `<ComeBackBtn />`.
In alternativa usa il quick fix sul simbolo non risolto.

Non riattivare `steoates.autoimport`: esegue una scansione separata e non risolve
questa limitazione specifica del provider MDX.

## Impostazioni e plugin TypeScript

Nel workspace Ferupis ESLint viene eseguito al salvataggio, non durante la
digitazione:

```json
{
  "eslint.run": "onSave"
}
```

Il plugin `typescript-plugin-css-modules` e' stato rimosso sia dalle dipendenze
sia dalla sezione `compilerOptions.plugins` del `tsconfig.json`: il progetto non
usa CSS Modules e il plugin aggiungeva lavoro inutile al servizio TypeScript.
Va installato solo nei workspace che contengono realmente file come
`*.module.css`.

## Causa principale trovata in Ferupis

Le estensioni sovrapposte contribuivano al carico, ma la causa principale della
latenza TSX e degli auto-import era il tipo del componente polimorfico `Poly`.
La combinazione di un generico aperto come `C extends string | FunctionComponent`
con `PropsOf<string extends C ? 'div' : C>` costringeva TypeScript a espandere
milioni di istanze di tipo durante ogni analisi del progetto.

Il contratto ora mantiene un insieme chiuso di tag (`ContainerTag`) e le
proprieta' HTML comuni:

```ts
type PolyProps = {
  as?: ContainerTag;
} & Omit<HTMLAttributes<HTMLElement>, 'ref'>;
```

Prima di reintrodurre un componente polimorfico generico basato su `PropsOf`, va
misurato il costo sul progetto completo. Non aggirare il problema con `any` o
cast non verificati: si perderebbe il controllo sui tag e sulle proprieta'
ammesse.

### Misure sul progetto completo

| Metrica TypeScript | Prima | Dopo |
| --- | ---: | ---: |
| Istanze di tipo | 6.461.359 | 289.668 |
| Memoria | 725.809 KB | 221.601 KB |
| Tempo di check | 4,93 s | 0,52 s |
| Tempo totale | 5,89 s | 1,40 s |

Dopo il riavvio dei processi TypeScript reali di VS Code, il server semantico e'
passato da circa 1,26 GB a circa 380-396 MB e non mostrava attivita' CPU durante
il periodo di inattivita' misurato.

## Estensioni da mantenere

- TypeScript and JavaScript Language Features di VS Code (integrata): auto-import
  per `@builder.io/qwik` e per l'alias `~/*` definito nel progetto.
- Tailwind CSS IntelliSense, ESLint e Prettier.
- Qwik Snippets e Qwik City Link Autocomplete, se usati.

## Verifica

Dopo aver cambiato le estensioni, usa **Disable (Workspace)** o **Enable
(Workspace)** dalla UI di VS Code e chiudi completamente tutte le finestre di
Code se i vecchi processi extension host o TypeScript restano attivi. Il solo
comando **Developer: Reload Window** puo' non bastare a sostituire tutti i
processi gia' avviati.

Esegui quindi:

```powershell
code --status
npx tsc -p apps/ferupis-qwik/tsconfig.json --noEmit --extendedDiagnostics
npm run --workspace @apps/ferupis-qwik build.types
```

In un file `.tsx`, il suggerimento per `component$` deve proporre l'import da
`@builder.io/qwik`; per le importazioni locali deve rispettare l'alias `~/*`.
Controlla inoltre che il numero di istanze di tipo non torni nell'ordine dei
milioni. Per una modifica a tipi condivisi, esegui anche ESLint sui file toccati
e `git diff --check`.

La disattivazione per workspace e' una preferenza locale di VS Code, non viene
condivisa dal repository. Questo documento serve a riprodurla per ogni
workspace Qwik.
