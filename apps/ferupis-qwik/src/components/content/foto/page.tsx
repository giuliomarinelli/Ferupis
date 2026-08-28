import { component$ } from "@builder.io/qwik";
import { ContentHeader } from "~/components/content-typography";
import { Container } from "~/components/layout/container";
import BeeEggs from "~/media/pics/restored/7B978A4F7D3E4D589CF600FADD1FFFC3.png?jsx";
import BeeLarvaeOne from "~/media/pics/restored/A0E1C9DF8D484068BB4E295B8FE1E296.png?jsx";
import BeeLarvaeTwo from "~/media/pics/restored/C59449AB7C7C4C87AA48DEB007BF0DC6.png?jsx";
import BeeLarvaeThree from "~/media/pics/restored/C7891874BD47406782644829A645DE4E.png?jsx";
import BeePupae from "~/media/pics/restored/30F7DF9D49194354B1614B7FEB30DFF2.png?jsx";
import T3CombOne from "~/media/pics/restored/26A6C5DC9BA746AB8A55D114BAC0899F.png?jsx";
import T3CombTwo from "~/media/pics/restored/6ECC581D28EB49BD9B1E5B7EFDBC1F70.png?jsx";
import T3CombThree from "~/media/pics/restored/DA9E9AE808BB416895C53ED545F78F59.png?jsx";
import T3CombFour from "~/media/pics/restored/A716350413FB489C9E8DC23AF037FC1B.png?jsx";
import VarroaDetailOne from "~/media/pics/restored/B6F649241E824683865D59E9F7240F81.png?jsx";
import VarroaDetailTwo from "~/media/pics/restored/2E342B55E82C420F801738F149706F28.png?jsx";
import VarroaFilter from "~/media/pics/restored/C07D22B09C594F75A875F2B2A9D11FC8.png?jsx";
import QueenCellOne from "~/media/pics/restored/C8F2C8ADE00A43FAA7CE5A4D43DD7E61.png?jsx";
import QueenCellTwo from "~/media/pics/restored/0655546052F94CBE94940731F7D6BF29.png?jsx";
import QueenCellThree from "~/media/pics/restored/8EFE321B33DD43448C981014DAB36704.png?jsx";
import QueenCellFour from "~/media/pics/restored/A5CDD02311484A9FBDBC24022857D554.png?jsx";
import QueenEmergence from "~/media/pics/restored/EB608EB0411147248F4B90EF84DB3C75.png?jsx";
import VirginQueenOne from "~/media/pics/restored/86381C94F18D4F149EBD94A4C59D0F7D.png?jsx";
import VirginQueenTwo from "~/media/pics/restored/D00D7BCCA8D444EBBFB146501D647787.png?jsx";
import QueenBeeOne from "~/media/pics/restored/D4A26D9D0D034AE7B77B0F776710E8A3.png?jsx";
import QueenBeeTwo from "~/media/pics/restored/A72177FC586845069226693A41790A86.png?jsx";
import QueenBeeCloseup from "~/media/pics/restored/39CB184798BE49EEA400B87A570C652C.png?jsx";
import BeeSwarm from "~/media/pics/restored/AA5DFDEBDC1347579023AEF04BF359CE.png?jsx";
import HoneyCombOne from "~/media/pics/restored/914593BDBAF44A09BE8E4CC7E5967AE4.png?jsx";
import HoneyCombTwo from "~/media/pics/restored/0559E35E7A4B4C99823B1166DE79D307.png?jsx";
import HoneyCombThree from "~/media/pics/restored/9FA125D9C8FC43D6A7CE88624DD48524.png?jsx";
import ApiaryHive from "~/media/pics/restored/5F30F22E464E42A9B5C8DCB96AA26E44.png?jsx";
import Hazel from "~/media/pics/restored/68C0AC71E31A4F3D8260AB33DF315F29.png?jsx";
import Dandelion from "~/media/pics/restored/F560569CE5EE43BB960B83457F592797.png?jsx";
import Acacia from "~/media/pics/restored/29F1C5571A404B0992BB4C6C3E3F044C.png?jsx";
import Linden from "~/media/pics/restored/F02E5B559195462AA135F93C03A6D2F3.png?jsx";
import Sunflower from "~/media/pics/restored/588782FF311346958AE566886A879207.png?jsx";
import { FotoSubtitle } from "./subtitle";

const figureClass = "min-w-0";
const imageClass = "aspect-[3/2] h-auto w-full rounded-xl object-cover";
const captionClass = "mt-2 text-sm leading-5 opacity-70";

export const FotoPage = component$(() => (
  <Container
    context="content"
    tag="section"
    classOverride="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
  >
    <ContentHeader.Root class="mb-10 w-full sm:mb-12">
      <ContentHeader.Eyebrow text="Ferupis" />
      <ContentHeader.Heading text="Foto" tag="h1" class="foto-color" />
      <ContentHeader.Subtitle component={FotoSubtitle} />
    </ContentHeader.Root>

    <div
      class="grid grid-cols-1 gap-x-4 gap-y-8 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-10"
      aria-label="Galleria fotografica"
    >
      <figure class={figureClass}>
        <BeeEggs alt="Uova" class={imageClass} />
        <figcaption class={captionClass}>Uova</figcaption>
      </figure>
      <figure class={figureClass}>
        <BeeLarvaeOne alt="Larve" class={imageClass} />
        <figcaption class={captionClass}>Larve</figcaption>
      </figure>
      <figure class={figureClass}>
        <BeeLarvaeTwo alt="Larve" class={imageClass} />
        <figcaption class={captionClass}>Larve</figcaption>
      </figure>
      <figure class={figureClass}>
        <BeeLarvaeThree alt="Larve" class={imageClass} />
        <figcaption class={captionClass}>Larve</figcaption>
      </figure>
      <figure class={figureClass}>
        <BeePupae alt="Pupe" class={imageClass} />
        <figcaption class={captionClass}>Pupe</figcaption>
      </figure>
      <figure class={figureClass}>
        <T3CombOne alt="Favo T3" class={imageClass} />
        <figcaption class={captionClass}>Favo T3</figcaption>
      </figure>
      <figure class={figureClass}>
        <T3CombTwo alt="Favo T3" class={imageClass} />
        <figcaption class={captionClass}>Favo T3</figcaption>
      </figure>
      <figure class={figureClass}>
        <T3CombThree alt="Favo T3" class={imageClass} />
        <figcaption class={captionClass}>Favo T3</figcaption>
      </figure>
      <figure class={figureClass}>
        <T3CombFour alt="Favo T3" class={imageClass} />
        <figcaption class={captionClass}>Favo T3</figcaption>
      </figure>
      <figure class={figureClass}>
        <VarroaDetailOne alt="Varroa" class={imageClass} />
        <figcaption class={captionClass}>Varroa</figcaption>
      </figure>
      <figure class={figureClass}>
        <VarroaDetailTwo alt="Varroa" class={imageClass} />
        <figcaption class={captionClass}>Varroa</figcaption>
      </figure>
      <figure class={figureClass}>
        <VarroaFilter alt="Filtro con varroe" class={imageClass} />
        <figcaption class={captionClass}>Filtro con varroe</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenCellOne alt="Cella reale" class={imageClass} />
        <figcaption class={captionClass}>Cella reale</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenCellTwo alt="Cella reale" class={imageClass} />
        <figcaption class={captionClass}>Cella reale</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenCellThree alt="Cella reale" class={imageClass} />
        <figcaption class={captionClass}>Cella reale</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenCellFour alt="Cella reale" class={imageClass} />
        <figcaption class={captionClass}>Cella reale</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenEmergence alt="Nascita dell’ape regina" class={imageClass} />
        <figcaption class={captionClass}>Nascita dell’ape regina</figcaption>
      </figure>
      <figure class={figureClass}>
        <VirginQueenOne alt="Ape regina vergine" class={imageClass} />
        <figcaption class={captionClass}>Ape regina vergine</figcaption>
      </figure>
      <figure class={figureClass}>
        <VirginQueenTwo alt="Ape regina vergine" class={imageClass} />
        <figcaption class={captionClass}>Ape regina vergine</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenBeeOne alt="Ape regina" class={imageClass} />
        <figcaption class={captionClass}>Ape regina</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenBeeTwo alt="Ape regina" class={imageClass} />
        <figcaption class={captionClass}>Ape regina</figcaption>
      </figure>
      <figure class={figureClass}>
        <QueenBeeCloseup alt="Ape regina" class={imageClass} />
        <figcaption class={captionClass}>Ape regina</figcaption>
      </figure>
      <figure class={figureClass}>
        <BeeSwarm alt="Sciame" class={imageClass} />
        <figcaption class={captionClass}>Sciame</figcaption>
      </figure>
      <figure class={figureClass}>
        <HoneyCombOne alt="Favo con miele" class={imageClass} />
        <figcaption class={captionClass}>Favo con miele</figcaption>
      </figure>
      <figure class={figureClass}>
        <HoneyCombTwo alt="Favo con miele" class={imageClass} />
        <figcaption class={captionClass}>Favo con miele</figcaption>
      </figure>
      <figure class={figureClass}>
        <HoneyCombThree alt="Favo con miele" class={imageClass} />
        <figcaption class={captionClass}>Favo con miele</figcaption>
      </figure>
      <figure class={figureClass}>
        <ApiaryHive alt="Alveare" class={imageClass} />
        <figcaption class={captionClass}>Alveare</figcaption>
      </figure>
      <figure class={figureClass}>
        <Hazel alt="Nocciolo" class={imageClass} />
        <figcaption class={captionClass}>Nocciolo</figcaption>
      </figure>
      <figure class={figureClass}>
        <Dandelion alt="Tarassaco" class={imageClass} />
        <figcaption class={captionClass}>Tarassaco</figcaption>
      </figure>
      <figure class={figureClass}>
        <Acacia alt="Acacia" class={imageClass} />
        <figcaption class={captionClass}>Acacia</figcaption>
      </figure>
      <figure class={figureClass}>
        <Linden alt="Tiglio" class={imageClass} />
        <figcaption class={captionClass}>Tiglio</figcaption>
      </figure>
      <figure class={figureClass}>
        <Sunflower alt="Girasole" class={imageClass} />
        <figcaption class={captionClass}>Girasole</figcaption>
      </figure>
    </div>
  </Container>
));
