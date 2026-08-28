import { component$, type ClassList } from "@builder.io/qwik";
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

export type PhotoImageProps = {
  slug: string;
  alt: string;
  class?: ClassList;
};

export const PhotoImage = component$<PhotoImageProps>((props) => {
  const imageProps = { alt: props.alt, class: props.class };

  switch (props.slug) {
    case "uova-api":
      return <BeeEggs {...imageProps} />;
    case "larve-api":
      return <BeeLarvaeOne {...imageProps} />;
    case "larve-api-2":
      return <BeeLarvaeTwo {...imageProps} />;
    case "larve-api-3":
      return <BeeLarvaeThree {...imageProps} />;
    case "pupe-api":
      return <BeePupae {...imageProps} />;
    case "favo-t3":
      return <T3CombOne {...imageProps} />;
    case "favo-t3-2":
      return <T3CombTwo {...imageProps} />;
    case "favo-t3-3":
      return <T3CombThree {...imageProps} />;
    case "favo-t3-4":
      return <T3CombFour {...imageProps} />;
    case "varroa":
      return <VarroaDetailOne {...imageProps} />;
    case "varroa-2":
      return <VarroaDetailTwo {...imageProps} />;
    case "filtro-con-varroe":
      return <VarroaFilter {...imageProps} />;
    case "cella-reale":
      return <QueenCellOne {...imageProps} />;
    case "cella-reale-2":
      return <QueenCellTwo {...imageProps} />;
    case "cella-reale-3":
      return <QueenCellThree {...imageProps} />;
    case "cella-reale-4":
      return <QueenCellFour {...imageProps} />;
    case "nascita-ape-regina":
      return <QueenEmergence {...imageProps} />;
    case "ape-regina-vergine":
      return <VirginQueenOne {...imageProps} />;
    case "ape-regina-vergine-2":
      return <VirginQueenTwo {...imageProps} />;
    case "ape-regina":
      return <QueenBeeOne {...imageProps} />;
    case "ape-regina-2":
      return <QueenBeeTwo {...imageProps} />;
    case "ape-regina-3":
      return <QueenBeeCloseup {...imageProps} />;
    case "sciame-api":
      return <BeeSwarm {...imageProps} />;
    case "favo-con-miele":
      return <HoneyCombOne {...imageProps} />;
    case "favo-con-miele-2":
      return <HoneyCombTwo {...imageProps} />;
    case "favo-con-miele-3":
      return <HoneyCombThree {...imageProps} />;
    case "alveare":
      return <ApiaryHive {...imageProps} />;
    case "nocciolo":
      return <Hazel {...imageProps} />;
    case "tarassaco":
      return <Dandelion {...imageProps} />;
    case "acacia":
      return <Acacia {...imageProps} />;
    case "tiglio":
      return <Linden {...imageProps} />;
    case "girasole":
      return <Sunflower {...imageProps} />;
    default:
      return null;
  }
});
