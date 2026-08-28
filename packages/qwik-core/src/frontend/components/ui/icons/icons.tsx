import { component$ } from '@builder.io/qwik'

export type IconProps = {
    class?: string | string[]
}

export const CheckIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class={['fill-current', className ?? '']}>
        <path
            class="fill-current"
            d="M504.1 75.8c11.3 9.1 13 25.5 3.9 36.8l-256 320
        c-4.8 6-11.9 9.7-19.5 10.3s-15.1-2.1-20.6-7.6l-128-128
        c-10-10-10-26.2 0-36.2s26.2-10 36.2 0L240 380.7
        471.2 72.1c9.1-11.3 25.5-13 36.9-3.9z"
        />
    </svg>
))

export const SunIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current relative -left-0.5', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc */}
        <path d="M320 496C328.8 496 336 503.2 336 512L336 592C336 600.8 328.8 608 320 608C311.2 608 304 600.8 304 592L304 512C304 503.2 311.2 496 320 496zM172.9 444.4C179.1 438.2 189.3 438.2 195.6 444.4C201.9 450.6 201.8 460.8 195.6 467.1L139 523.7C132.8 529.9 122.6 529.9 116.4 523.7C110.2 517.5 110.2 507.3 116.4 501.1L173 444.5zM444.4 444.4C450.6 438.2 460.8 438.2 467.1 444.4L523.7 501C529.9 507.2 529.9 517.4 523.7 523.6C517.5 529.8 507.3 529.8 501.1 523.6L444.5 467C438.3 460.8 438.3 450.6 444.5 444.3zM320 448C249.3 448 192 390.7 192 320C192 249.3 249.3 192 320 192C390.7 192 448 249.3 448 320C448 390.7 390.7 448 320 448zM320 224C267 224 224 267 224 320C224 373 267 416 320 416C373 416 416 373 416 320C416 267 373 224 320 224zM128 304C136.8 304 144 311.2 144 320C144 328.8 136.8 336 128 336L48 336C39.2 336 32 328.8 32 320C32 311.2 39.2 304 48 304L128 304zM592 304C600.8 304 608 311.2 608 320C608 328.8 600.8 336 592 336L512 336C503.2 336 496 328.8 496 320C496 311.2 503.2 304 512 304L592 304zM116.3 116.3C122.5 110.1 132.7 110.1 138.9 116.3L195.5 172.9C201.7 179.1 201.7 189.3 195.5 195.6C189.3 201.9 179.1 201.8 172.8 195.6L116.3 139C110.1 132.8 110.1 122.6 116.3 116.4zM501 116.3C507.2 110.1 517.4 110.1 523.6 116.3C529.8 122.5 529.8 132.7 523.6 138.9L467 195.5C460.8 201.7 450.6 201.7 444.3 195.5C438 189.3 438.1 179.1 444.3 172.8L501 116.3zM320 32C328.8 32 336 39.2 336 48L336 128C336 136.8 328.8 144 320 144C311.2 144 304 136.8 304 128L304 48C304 39.2 311.2 32 320 32z" />
    </svg>
))

export const SunRegularIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M344 608L296 608L296 496L344 496L344 608zM212.5 461.4L133.3 540.6L99.4 506.7L178.6 427.5L212.5 461.4zM540.6 506.7L506.7 540.6L427.5 461.4L461.4 427.5L540.6 506.7zM320 448C249.3 448 192 390.7 192 320C192 249.3 249.3 192 320 192C390.7 192 448 249.3 448 320C448 390.7 390.7 448 320 448zM320 240C275.8 240 240 275.8 240 320C240 364.2 275.8 400 320 400C364.2 400 400 364.2 400 320C400 275.8 364.2 240 320 240zM144 344L32 344L32 296L144 296L144 344zM608 344L496 344L496 296L608 296L608 344zM212.5 178.6L178.6 212.5L99.4 133.3L133.3 99.4L212.5 178.6zM540.6 133.3L461.4 212.5L427.5 178.6L506.7 99.4L540.6 133.3zM344 144L296 144L296 32L344 32L344 144z" />
    </svg>
))

export const MoonIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M423.7 85.9C392.1 71.9 357.1 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C385.3 576 444.9 551.5 490.1 511.3C503.1 499.7 515 486.8 525.4 472.8C509.9 477.1 493.6 479.6 476.8 480C475.2 480 473.6 480.1 472 480.1C361.5 480.1 272 390.6 272 280.1C272 203.7 314.8 137.3 377.8 103.6C392.1 95.9 407.5 90 423.7 85.9zM330.4 96.2C275.4 138.6 240 205.2 240 280C240 397 326.6 493.8 439.2 509.7C404.7 531.4 363.8 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96C323.5 96 326.9 96.1 330.4 96.2z" />
    </svg>
))

export const LargeCloseIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M586.4 88L354.4 320L586.4 552L552.5 585.9L320.5 353.9L88.5 585.9L54.6 552L286.6 320L54.6 88L88.5 54.1L320.5 286.1L552.5 54.1L586.4 88z" />
    </svg>
))

export const ThinCloseIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
        <path d="M507.3 155.3C513.5 149.1 513.5 138.9 507.3 132.7C501.1 126.5 490.9 126.5 484.7 132.7L320 297.4L155.3 132.7C149.1 126.5 138.9 126.5 132.7 132.7C126.5 138.9 126.5 149.1 132.7 155.3L297.4 320L132.7 484.7C126.5 490.9 126.5 501.1 132.7 507.3C138.9 513.5 149.1 513.5 155.3 507.3L320 342.6L484.7 507.3C490.9 513.5 501.1 513.5 507.3 507.3C513.5 501.1 513.5 490.9 507.3 484.7L342.6 320L507.3 155.3z" />
    </svg>
))

export const CollapseSidebarIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M219.1 93.1C247.2 65 292.8 65 320.9 93.1C349 121.2 349 166.8 320.9 194.9L281.8 234L468 234C507.8 234 540 266.2 540 306C540 345.8 507.8 378 468 378L281.8 378L320.9 417.1C349 445.2 349 490.8 320.9 518.9C292.8 547 247.2 547 219.1 518.9L57.1 356.9C29 328.8 29 283.2 57.1 255.1L219.1 93.1zM295.5 118.6C281.4 104.5 258.6 104.5 244.6 118.6L82.6 280.6C68.5 294.7 68.5 317.5 82.6 331.5L244.6 493.5C258.7 507.6 281.5 507.6 295.5 493.5C309.5 479.4 309.6 456.6 295.5 442.6L225.7 372.8C220.6 367.7 219 359.9 221.8 353.2C224.6 346.5 231.1 342.1 238.4 342.1L468 342C487.9 342 504 325.9 504 306C504 286.1 487.9 270 468 270L238.4 270C231.1 270 224.6 265.6 221.8 258.9C219 252.2 220.6 244.4 225.7 239.3L295.5 169.5C309.6 155.4 309.6 132.6 295.5 118.6z" />
    </svg>
))

export const ExpandSidebarIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M356.9 93.1C328.8 65 283.2 65 255.1 93.1C227 121.2 227 166.8 255.1 194.9L294.2 234L108 234C68.2 234 36 266.2 36 306C36 345.8 68.2 378 108 378L294.2 378L255.1 417.1C227 445.2 227 490.8 255.1 518.9C283.2 547 328.8 547 356.9 518.9L518.9 356.9C547 328.8 547 283.2 518.9 255.1L356.9 93.1zM280.5 118.6C294.6 104.5 317.4 104.5 331.4 118.6L493.4 280.6C507.5 294.7 507.5 317.5 493.4 331.5L331.4 493.5C317.3 507.6 294.5 507.6 280.5 493.5C266.5 479.4 266.4 456.6 280.5 442.6L350.3 372.8C355.4 367.7 357 359.9 354.2 353.2C351.4 346.5 344.9 342 337.6 342L108 342C88.1 342 72 325.9 72 306C72 286.1 88.1 270 108 270L337.6 270C344.9 270 351.4 265.6 354.2 258.9C357 252.2 355.4 244.4 350.3 239.3L280.5 169.5C266.4 155.4 266.4 132.6 280.5 118.6z" />
    </svg>
))

export const PhoneIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M252.6 259L304.4 208L208.4 48L64.4 128L64.4 144C64.4 382.6 257.8 576 496.4 576L512.4 576L592.4 432L432.4 336L381.4 387.8C322.2 365 275.4 318.2 252.6 259zM440.1 396.6L527.9 449.3L484.3 527.8C281.9 521.5 118.9 358.6 112.6 156.1L191.1 112.5L243.8 200.3C226.8 217.1 211 232.6 196.5 246.9L207.8 276.3C235.5 348.2 292.3 404.9 364.1 432.6L393.5 443.9C407.8 429.4 423.3 413.6 440.1 396.6z" />
    </svg>
))

export const FingerprintIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M96 320C96 196.3 196.3 96 320 96C390.3 96 453 128.4 494.1 179L504.2 191.4L529.1 171.2L519 158.8C472.1 101 400.3 64 320 64C178.6 64 64 178.6 64 320L64 384L96 384L96 320zM566.8 251.7L562.5 236.3L531.7 244.8L536 260.2C541.2 279.2 544.1 299.2 544.1 319.9L544.1 383.9L576.1 383.9L576.1 319.9C576.1 296.3 572.9 273.4 566.9 251.6zM320 144C289.5 144 260.7 151.8 235.7 165.5L254.5 191.8C274.2 181.7 296.4 176.1 320 176.1C399.5 176.1 464 240.6 464 320.1L464 345C464 379.6 461.3 414 455.9 448.1L488.3 448.1C493.5 414.1 496.1 379.6 496.1 345L496.1 320.1C496.1 222.9 417.3 144.1 320.1 144.1zM197.1 194C164.3 226 144 270.6 144 320L144 344.9C144 379.9 138.5 414.7 127.8 448L161.3 448C171 414.6 176 379.9 176 344.9L176 320C176 281.4 191.2 246.3 216 220.4L197.1 194zM320 224C267 224 224 267 224 320L224 344.9C224 390.9 216.4 436.5 201.5 480L235.2 480C249 436.4 256 390.8 256 344.9L256 320C256 284.7 284.7 256 320 256C355.3 256 384 284.7 384 320L384 344.9C384 390.5 378.6 435.8 367.9 480L400.8 480C410.9 435.8 416 390.5 416 344.9L416 320C416 267 373 224 320 224zM336 320L304 320L304 344.9C304 405.8 292.8 466.1 270.9 523C266.4 534.8 263.7 541.8 262.8 544L297.1 544L300.8 534.5C324.1 474 336 409.7 336 344.9L336 320z" />
    </svg>
))

export const OfferIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M240 64L224 64L224 160L64 160L64 544L576 544L576 160L416 160L416 64L240 64zM384 160L256 160L256 96L384 96L384 160zM240 192L544 192L544 320L96 320L96 192L240 192zM544 352L544 512L96 512L96 352L240 352L240 432L400 432L400 352L544 352zM272 352L368 352L368 400L272 400L272 352z" />
    </svg>
))

export const ArrowRightJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M392.7 588C407.7 588 422.7 582.8 434.5 572.3C464.8 545.5 559.5 457.8 609.6 362.2C614 353.9 616 344.8 616 336C616 327.2 614 318.1 609.6 309.8C559.5 214.2 464.8 126.5 434.5 99.7C422.7 89.2 407.7 84 392.7 84C363.1 84 336.2 104.4 330.8 135.3C326.7 158.7 321.1 195.9 317.8 243.4L131.8 227.9C91 224.5 56 256.7 56 297.6L56 374.3C56 415.3 91 447.5 131.8 444.1L317.8 428.6C321.1 476.1 326.7 513.3 330.8 536.7C336.2 567.6 363.2 588 392.7 588zM397.4 530.4C393.9 533.5 386.8 532.1 385.9 527.1C382.1 505.4 377.1 470.9 374 425.4C371.9 394.4 344.9 370.2 313.1 372.8L127.1 388.3C119 389 112 382.5 112 374.4L112 297.7C112 289.5 119 283.1 127.2 283.7L313.2 299.2C345 301.9 371.9 277.6 374.1 246.6C377.2 201.2 382.2 166.6 386 144.9C386.9 139.9 394 138.5 397.5 141.6C427.6 168.2 515.2 250.3 560.1 336C515.2 421.6 427.6 503.8 397.5 530.4z" />
    </svg>
))

export const ArrowLeftJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M279.3 588C264.3 588 249.3 582.8 237.5 572.3C207.2 545.5 112.5 457.8 62.4 362.2C58 353.9 56 344.8 56 336C56 327.2 58 318.1 62.4 309.8C112.5 214.2 207.2 126.5 237.5 99.7C249.3 89.2 264.3 84 279.3 84C308.9 84 335.8 104.4 341.2 135.3C345.3 158.7 350.9 195.9 354.2 243.4L540.2 227.9C581 224.5 616 256.7 616 297.7L616 374.4C616 415.4 581 447.6 540.2 444.2L354.2 428.7C350.9 476.2 345.3 513.4 341.2 536.8C335.8 567.7 308.8 588.1 279.3 588.1zM274.6 530.4C278.1 533.5 285.2 532.1 286.1 527.1C289.9 505.4 294.9 470.9 298 425.4C300.1 394.4 327.1 370.2 358.9 372.8L544.9 388.3C553.1 389 560.1 382.5 560.1 374.3L560.1 297.6C560.1 289.4 553.1 283 544.9 283.6L358.9 299.1C327.1 301.8 300.2 277.5 298 246.5C294.9 201.1 289.9 166.5 286.1 144.8C285.2 139.8 278.1 138.4 274.6 141.5C244.5 168.1 156.9 250.2 112 335.9C156.9 421.5 244.5 503.7 274.6 530.3z" />
    </svg>
))

export const ArrowUpJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M588 279.3C588 264.3 582.8 249.3 572.3 237.5C545.5 207.2 457.8 112.5 362.2 62.4C353.9 58 344.8 56 336 56C327.2 56 318.1 58 309.8 62.4C214.2 112.5 126.5 207.2 99.7 237.5C89.2 249.3 84 264.3 84 279.3C84 308.9 104.4 335.8 135.3 341.2C158.7 345.3 195.9 350.9 243.4 354.2L227.9 540.2C224.5 581 256.7 616 297.6 616L374.3 616C415.3 616 447.5 581 444.1 540.2L428.6 354.2C476.1 350.9 513.3 345.3 536.7 341.2C567.6 335.8 588 308.8 588 279.3zM530.4 274.6C533.5 278.1 532.1 285.2 527.1 286.1C505.4 289.9 470.9 294.9 425.4 298C394.4 300.1 370.2 327.1 372.8 358.9L388.3 544.9C389 553.1 382.5 560.1 374.3 560.1L297.6 560.1C289.4 560.1 283 553.1 283.6 544.9L299.1 358.9C301.8 327.1 277.5 300.2 246.5 298C201.1 294.9 166.5 289.9 144.8 286.1C139.8 285.2 138.4 278.1 141.5 274.6C168.1 244.5 250.2 156.9 335.9 112C421.5 156.9 503.7 244.5 530.3 274.6z" />
    </svg>
))

export const CheckJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M594.7 121C563.7 82 508.3 72.5 466.1 98.9C396.1 142.7 328.3 216 282 271.3C271.7 283.6 261.6 295.7 252.9 306.8L201.7 278.4C158.9 254.6 105.2 266 75.8 305C46.4 344 50.2 398.7 84.7 433.3L210.7 559.3C231.9 580.5 261.6 590.8 291.4 587.3C321.2 583.8 347.7 566.9 363.4 541.3C369.2 531.9 375.3 522.5 381.4 513.2C393.3 495.1 410.5 469.5 431.5 440.1C473.9 380.7 529.8 308.6 587.3 251.2C622.5 216 625.7 159.9 594.7 120.9zM550.9 155.9C564.2 172.6 562.8 196.6 547.7 211.7C487.1 272.3 429.1 347.2 385.9 407.7C364.4 437.8 346.8 464 334.6 482.7C328.2 492.4 321.9 502.2 315.8 512.1C309.1 523 297.7 530.3 284.9 531.8C272.1 533.3 259.4 528.9 250.3 519.8L124.3 393.8C109.5 379 107.9 355.5 120.5 338.8C133.1 322.1 156.1 317.2 174.4 327.4L225.6 355.8C249.9 369.3 280.1 362.8 297.1 341.4C305.6 330.7 314.9 319.2 324.9 307.3C370.7 252.6 433.8 185.2 495.8 146.4C513.9 135.1 537.6 139.2 550.9 155.9z" />
    </svg>
))

export const ArrowRotateLeftJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
        <path d="M532 336C532 273.6 512.3 225.2 479.5 192.5C446.7 159.8 398.4 140 336 140C290.2 140 252 150.6 222.1 169.1C245 194.1 263.6 219.7 271.2 230.5C277.1 238.9 280 248.7 280 258.5C280 285.8 257.9 308 230.5 308L112 308C81.1 308 56 282.9 56 252L56 133.5C56 106.2 78.1 84 105.5 84C115.3 84 125.1 86.9 133.5 92.8C142.3 99 160.7 112.4 180.7 129.4C222.7 99.5 275.8 84 336 84C410.5 84 474.1 107.8 519.1 152.9C564.1 198 588 261.5 588 336C588 410.5 564.2 474.1 519.1 519.1C474 564.1 410.5 588 336 588C232.8 588 151.3 542.1 111 460.4C104.2 446.5 109.9 429.7 123.7 422.9C137.5 416.1 154.4 421.8 161.2 435.6C190.5 495.1 250.4 532 336 532C398.4 532 446.8 512.3 479.5 479.5C512.2 446.7 532 398.4 532 336zM169.2 194.8C149.6 175.2 126.9 157.4 112 146.4L112 252L217.6 252C206.6 237.1 188.8 214.4 169.2 194.8z" />
    </svg>
))

export const DiscoverIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM202.1 411.9L192 448C194.7 447.2 261.4 428.6 392 392C428.6 261.4 447.2 194.7 448 192C445.3 192.8 378.6 211.4 248 248L202.1 411.9zM238.2 401.8L274 274L401.8 238.2L366 366L238.2 401.8zM320 344C333.3 344 344 333.3 344 320C344 306.7 333.3 296 320 296C306.7 296 296 306.7 296 320C296 333.3 306.7 344 320 344z" />
    </svg>
))

export const AddressBookIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M128 96L128 544L480 544L480 96L128 96zM96 64L512 64L512 576L96 576L96 64zM576 128L576 224L544 224L544 128L576 128zM576 256L576 352L544 352L544 256L576 256zM576 400L576 480L544 480L544 384L576 384L576 400zM336 256C336 238.3 321.7 224 304 224C286.3 224 272 238.3 272 256C272 273.7 286.3 288 304 288C321.7 288 336 273.7 336 256zM240 256C240 220.7 268.7 192 304 192C339.3 192 368 220.7 368 256C368 291.3 339.3 320 304 320C268.7 320 240 291.3 240 256zM247.1 384L225.8 448L192.1 448L224.1 352L384.1 352L416.1 448L382.4 448L361.1 384L247.2 384z" />
    </svg>
))

export const CopyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M252 72C212.2 72 180 104.2 180 144L180 198L144 198C104.2 198 72 230.2 72 270L72 468C72 507.8 104.2 540 144 540L342 540C381.8 540 414 507.8 414 468L414 414L450 414C489.8 414 522 381.8 522 342L522 144C522 104.2 489.8 72 450 72L252 72zM378 414L378 468C378 487.9 361.9 504 342 504L144 504C124.1 504 108 487.9 108 468L108 270C108 250.1 124.1 234 144 234L180 234L180 342C180 381.8 212.2 414 252 414L378 414zM216 144C216 124.1 232.1 108 252 108L450 108C469.9 108 486 124.1 486 144L486 342C486 361.9 469.9 378 450 378L252 378C232.1 378 216 361.9 216 342L216 144z" />
    </svg>
))

export const CompassDraftingIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M384.3 160C384.3 124.7 355.6 96 320.3 96C285 96 256.3 124.7 256.3 160C256.3 195.3 285 224 320.3 224C355.6 224 384.3 195.3 384.3 160zM362.6 246.2C349.8 252.5 335.5 256 320.3 256C305.1 256 290.8 252.5 278 246.2L206.5 371.4C240.4 389.7 279.1 400 320.3 400C409.1 400 486.7 351.8 528.2 280L555.9 296C508.9 377.3 421 432 320.3 432C273.3 432 229.2 420.1 190.6 399.2L94.2 568L86.3 581.9L58.5 566L66.4 552.1L163.4 382.3C131.3 359.6 104.4 330.2 84.7 296.1L112.4 280.1C129.3 309.3 152.2 334.7 179.4 354.4L252 227.4C234.9 210.1 224.4 186.3 224.4 160C224.4 107 267.4 64 320.4 64C373.4 64 416.4 107 416.4 160C416.4 186.3 405.9 210.1 388.8 227.4L437.3 312.3C428.8 318.8 419.8 324.6 410.4 329.6L362.7 246.1zM574.2 552.1L582.1 566L554.3 581.9L546.4 568L473.8 440.9C483.2 435.8 492.3 430.2 501.1 424.1L574.2 552.1z" />
    </svg>
));

export const WindowMaximizeIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M96 160L96 256L544 256L544 160L96 160zM96 288L96 480L544 480L544 288L96 288zM64 128L576 128L576 512L64 512L64 128z" />
    </svg>
));

export const LayerGroupIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M320 284.6L123.2 192L320 99.4L516.8 192L320 284.6zM85.6 209.6L320 320L554.4 209.7L592 192L554.4 174.3L320 64L85.6 174.3L48 192L85.6 209.7zM127.7 282.4C98.8 296.1 72.3 308.6 48 320L85.6 337.7L320 448L554.4 337.7L592 320C567.7 308.6 541.1 296.1 512.4 282.5L474.8 300.2L516.9 320L320.1 412.6L123.3 320L165.4 300.2L127.8 282.5zM85.6 430.3L48 448L85.6 465.7L320 576L554.4 465.7L592 448C567.7 436.6 541.2 424.1 512.4 410.5L474.8 428.2L516.9 448L320.1 540.6L123.3 448L165.4 428.2L127.8 410.5L85.7 430.3z" />
    </svg>
));

export const GearsIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M190.3 25.8C190.3 25.8 215.1 32.4 264.5 45.7L276.9 49C276.7 52.6 275.9 71.1 274.5 104.6C276.2 106.2 277.9 107.9 279.5 109.6C313 108.2 331.6 107.4 335.1 107.2L338.4 119.6L355 181.4L358.3 193.8C355.2 195.4 338.7 204 308.9 219.5C308.4 221.8 307.7 224.1 307.1 226.3C325.1 254.6 335.1 270.3 337 273.3L327.9 282.4L282.6 327.7L273.5 336.8C270.5 334.9 254.8 324.9 226.5 306.9C224.2 307.6 222 308.2 219.6 308.7C204.1 338.4 195.5 354.9 193.9 358.1L181.5 354.8L119.7 338.2L107.3 334.9C107.5 331.3 108.3 312.8 109.7 279.3C108 277.7 106.3 276 104.7 274.3C71.2 275.7 52.6 276.5 49.1 276.7C49.1 276.7 42.5 251.9 29.2 202.5L26 190.1L75.4 164.4C75.9 162.1 76.6 159.8 77.2 157.6C59.2 129.3 49.2 113.6 47.3 110.6L101.6 56.3L110.7 47.2C113.7 49.1 129.4 59.1 157.7 77.1C160 76.4 162.2 75.8 164.6 75.3C180.1 45.6 188.7 29.1 190.3 25.9zM206.8 63.4C192.9 90 185.9 103.5 185.7 103.8L177.8 105.1C172.1 106 166.5 107.5 161.2 109.6L153.7 112.4C153.4 112.2 140.5 104 115.2 87.9L88.1 115C104.2 140.4 112.4 153.2 112.6 153.5L109.8 161C108.8 163.7 107.9 166.4 107.2 169.2C106.5 172 105.8 174.8 105.4 177.6L104 185.5C103.7 185.7 90.2 192.7 63.5 206.6L73.4 243.6L119 241.6L124.1 247.8C127.7 252.2 131.8 256.3 136.3 260L142.5 265.1C142.5 265.5 141.8 280.7 140.5 310.7L177.5 320.6C191.4 294 198.4 280.5 198.6 280.2L206.5 278.9C212.2 278 217.8 276.5 223.1 274.4L230.6 271.6C230.9 271.8 243.8 280 269.1 296.1L296.2 269C280.1 243.7 271.9 230.8 271.7 230.5L274.5 223C275.5 220.3 276.4 217.6 277.1 214.8C277.8 212 278.5 209.2 278.9 206.4L280.2 198.5C280.5 198.3 294 191.3 320.7 177.4L310.8 140.4C280.8 141.7 265.6 142.4 265.2 142.4L260.1 136.2C256.5 131.8 252.4 127.7 247.9 124L241.7 118.9C241.7 118.5 242.4 103.3 243.7 73.3L206.7 63.4zM177.7 246.1C147.8 238.1 130.1 207.4 138.1 177.5C146.1 147.6 176.8 129.9 206.7 137.9C236.6 145.9 254.3 176.6 246.3 206.5C238.3 236.4 207.6 254.1 177.7 246.1zM215.4 198.2C218.8 185.4 211.2 172.2 198.4 168.8C185.6 165.4 172.4 173 169 185.8C165.6 198.6 173.2 211.8 186 215.2C198.8 218.6 212 211 215.4 198.2zM363.4 305.1L375.8 301.8L437.6 285.2L450 281.9C451.6 285.1 460.2 301.5 475.7 331.3C478 331.9 480.3 332.5 482.6 333.1C510.9 315.1 526.6 305.1 529.6 303.2L538.7 312.3L584 357.6L593.1 366.7C591.2 369.7 581.2 385.4 563.2 413.7C563.9 415.9 564.5 418.2 565 420.5C594.8 436 611.2 444.6 614.4 446.2L611.1 458.6L594.5 520.4L591.2 532.8C587.6 532.6 569.1 531.8 535.6 530.4C534 532.1 532.3 533.8 530.6 535.4C532 568.9 532.8 587.4 533 591L520.6 594.3L458.8 610.9L446.4 614.2C444.8 611 436.2 594.6 420.7 564.8C418.4 564.3 416.1 563.6 413.8 563C385.5 581 369.8 591 366.8 592.9L357.7 583.8L312.4 538.5L303.3 529.4C305.2 526.4 315.2 510.7 333.2 482.4C332.9 481.3 332.5 480.1 332.2 479C331.9 477.9 331.6 476.7 331.3 475.6C301.5 460.1 285.1 451.5 281.9 449.9L285.2 437.5L301.8 375.7L305.1 363.3C308.7 363.5 327.2 364.3 360.7 365.7C362.3 364 364 362.3 365.7 360.7C364.3 327.2 363.5 308.7 363.3 305.1zM396.5 329.4L398.1 367L398.4 375L392.2 380.1C387.7 383.8 383.7 387.9 380 392.3L374.9 398.5L366.9 398.2L329.3 396.6L319.4 433.6L352.8 451L359.9 454.7L361.2 462.6C361.7 465.4 362.3 468.2 363 471C363.7 473.8 364.6 476.6 365.6 479.2L368.4 486.7L364.1 493.4L343.9 525.2L371 552.3C396.3 536.2 409.2 528 409.5 527.8L417 530.6C422.4 532.6 427.9 534.1 433.6 535.1L441.5 536.4L445.2 543.5L462.6 576.9L499.6 567L498 529.4L497.7 521.4L503.9 516.3C508.4 512.6 512.4 508.5 516.1 504.1L521.2 497.9L529.2 498.2L566.8 499.8L576.7 462.8L543.3 445.4L536.2 441.7L534.9 433.8C534.4 431 533.8 428.2 533.1 425.4C532.4 422.6 531.5 419.8 530.5 417.2L527.7 409.7C527.9 409.4 536.1 396.5 552.2 371.2L525.1 344.1C499.8 360.2 486.9 368.4 486.6 368.6L479.1 365.8C473.7 363.8 468.2 362.3 462.5 361.3L454.6 360L450.9 352.9L433.5 319.5L396.5 329.4zM462.6 502.2C432.7 510.2 402 492.5 394 462.6C386 432.7 403.7 402 433.6 394C463.5 386 494.2 403.7 502.2 433.6C510.2 463.5 492.5 494.2 462.6 502.2zM471.3 441.9C467.9 429.1 454.7 421.5 441.9 424.9C429.1 428.3 421.5 441.5 424.9 454.3C428.3 467.1 441.5 474.7 454.3 471.3C467.1 467.9 474.7 454.7 471.3 441.9z" />
    </svg>
));
export const UserTieIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M320 288C373 288 416 245 416 192C416 139 373 96 320 96C267 96 224 139 224 192C224 245 267 288 320 288zM448 192C448 262.7 390.7 320 320 320C249.3 320 192 262.7 192 192C192 121.3 249.3 64 320 64C390.7 64 448 121.3 448 192zM272 368L368 368L368 400L347.9 400L379 453.3L424 384L480 384L544 576L510.3 576L457 416L441.4 416L346.9 561.4L337.4 576L302.7 576L293.2 561.4L198.7 416L183.1 416L129.8 576L96.1 576L160.1 384L216.1 384L261.1 453.3L292.2 400L272.1 400L272.1 368zM300.9 514.6L320 544C332.5 524.8 345.7 504.5 359.4 483.3L320 415.7L280.6 483.3L300.9 514.6z" />
    </svg>
));

export const StoreIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M520.1 96L531.9 96L535.4 107.2L583 259.2L587.3 273C581.3 275.6 566.9 281.8 544.1 291.6L544.1 544L96.1 544L96.1 291.7C73.1 281.8 58.5 275.6 52.5 273L56.8 259.2L104.4 107.2L107.9 96L520.1 96zM128.1 305L128.1 384L512.1 384L512.1 305L506.7 303L446 281L390 302.8L384.3 305L378.6 302.9L320 280.9L261.4 302.9L255.7 305L250 302.8L194 281L133.7 302.9L128.2 304.9zM384 270.9L428.1 253.7L410.2 128L336.1 128L336.1 252.9L384 270.9zM508.3 128L442.5 128L460.2 252.2L511.6 270.8L548.1 255L508.3 128zM255.8 270.9L303.7 252.9L303.7 128L229.6 128L211.7 253.7L255.8 270.9zM179.6 252.3L197.3 128.1L131.5 128.1L91.7 255.1L128.6 270.9L179.6 252.3zM128.1 512L512.1 512L512.1 416L128.1 416L128.1 512z" />
    </svg>
));

export const MortarPestleIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M316.3 224L370.2 224L528.5 107.4L530.4 109.6L415.9 224L461.2 224L574 111.2L533.4 64L316.3 224zM544 256L64 256L64 288L96 288L96 320C96 391.6 128.7 450.1 189.8 483C199.2 488 209.2 492.5 219.9 496.3C213.1 504.8 207.4 514.1 203 524.2C200.2 530.6 197.8 537.2 196.1 544.1C193.5 554.3 192.1 565.1 192.1 576.1L448.1 576.1C448.1 565.1 446.7 554.3 444.1 544.1C442.3 537.2 440 530.6 437.2 524.2C432.7 514.2 427 504.8 420.3 496.3C431 492.5 441 488.1 450.4 483C511.5 450.1 544.2 391.6 544.2 320L544.2 288L576.2 288L576.2 256L544.2 256zM410.5 544L229.4 544C233 533.8 238.2 524.5 244.8 516.2L272.8 481.1L230.5 466.1C163.3 442.2 128 389.4 128 320L128 288L512 288L512 320C512 389.4 476.7 442.2 409.4 466.1L367.1 481.1L395.1 516.2C401.7 524.5 407 533.8 410.5 544z" />
    </svg>
));

export const HouseMedicalIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class={['fill-current', className ?? '']}
    >
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M320.1 58.1L331 68.3L571 292.3L582.7 303.2L560.9 326.6C554.7 320.8 543.7 310.6 528.1 296L528.1 576L112.1 576L112.1 296C96.5 310.6 85.6 320.8 79.3 326.6L57.5 303.2L69.2 292.3L309.2 68.3L320.1 58.1zM320.1 101.9L144.1 266.2L144.1 544L496.1 544L496.1 266.2L320.1 101.9zM288.1 256L368.1 256L368.1 304L416.1 304L416.1 400L368.1 400L368.1 448L272.1 448L272.1 400L224.1 400L224.1 304L272.1 304L272.1 256L288.1 256zM304.1 336L256.1 336L256.1 368L304.1 368L304.1 416L336.1 416L336.1 368L384.1 368L384.1 336L336.1 336L336.1 288L304.1 288L304.1 336z" />
    </svg>
));

export const ShieldHalvedIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M304 104.6L304 533.7C224.2 494.1 175.6 430.4 147.2 365.2C117 295.7 109.8 224.5 112.5 178.9L304 104.6zM336 533.7L336 104.6L527.5 178.9C530.2 224.5 523 295.7 492.8 365.2C464.4 430.4 415.8 494.2 336 533.7zM559.5 177L558.3 156.5L539.1 149L331.6 68.5L320 64L308.5 68.5L101 149L81.8 156.5L80.6 177C77.7 226.9 85.5 303.3 117.9 377.9C150.6 453.2 208.9 527.9 307.3 570.5L320 576L332.7 570.5C431.1 527.9 489.4 453.2 522.1 377.9C554.5 303.2 562.3 226.9 559.4 177z" />
    </svg>
));

export const CookieBiteIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M169.9 174L283.8 113.1L293.7 114.5C309.2 170.9 354.7 214.7 412 227.9C425.2 285.5 469.4 331.1 526.2 346.4L526.7 349.2L470.1 465.9L356.2 526.8L228.6 508.8L135.8 418.7L113.4 290.8L170 174.1zM553.9 319.2C492.4 312.5 444 262.1 440.2 199.7C377.8 196 327.5 147.5 320.7 86L277.9 80L145.7 150.7L80 286.1L106 434.4L213.8 539L362.1 560L494.3 489.3L560 353.9L553.9 319.2zM288 280C301.3 280 312 269.3 312 256C312 242.7 301.3 232 288 232C274.7 232 264 242.7 264 256C264 269.3 274.7 280 288 280zM280 416C280 402.7 269.3 392 256 392C242.7 392 232 402.7 232 416C232 429.3 242.7 440 256 440C269.3 440 280 429.3 280 416zM416 376C429.3 376 440 365.3 440 352C440 338.7 429.3 328 416 328C402.7 328 392 338.7 392 352C392 365.3 402.7 376 416 376z" />
    </svg>
));

export const CalendarCheckIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M224 128L416 128L416 64L448 64L448 128L544 128L544 544L96 544L96 128L192 128L192 64L224 64L224 128zM128 512L512 512L512 160L128 160L128 512zM438.3 252.5L428.9 265.4L300.9 441.4L289.9 456.6L201.3 368L223.9 345.4L286 407.5L403 246.7L412.4 233.8L438.3 252.6z" />
    </svg>
));

export const SlidersIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M64 464L144 464L144 400L304 400L304 464L576 464L576 496L304 496L304 560L144 560L144 496L64 496L64 464zM272 496L272 432L176 432L176 528L272 528L272 496zM64 304L336 304L336 240L496 240L496 304L576 304L576 336L496 336L496 400L336 400L336 336L64 336L64 304zM176 176L64 176L64 144L176 144L176 80L336 80L336 144L576 144L576 176L336 176L336 240L176 240L176 176zM208 176L208 208L304 208L304 112L208 112L208 176zM464 304L464 272L368 272L368 368L464 368L464 304z" />
    </svg>
));

export const CircleInfoIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM272 416L256 416L256 448L384 448L384 416L336 416L336 288L256 288L256 320L304 320L304 416L272 416zM344 248L344 200L296 200L296 248L344 248z" />
    </svg>
));

export const BoltIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M576 64L184.5 161.9L491.7 469.1L576 448L384 256L576 64zM148.3 170.9L64 192L256 384L64 576L455.5 478.1L148.3 170.9z" />
    </svg>
));

export const AngleLeftJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M380.6 69.1C390.2 60.5 402.5 56 415 56C450.4 56 474.6 89.7 466.7 122.4C456.7 164 441 243.9 441 336C441 428.1 456.7 508 466.7 549.6C474.6 582.2 450.4 616 415 616C402.5 616 390.2 611.5 380.6 602.9C365.4 589.3 327.5 554.6 286.7 510.9C246.3 467.6 201.7 413.8 174.4 362.2C170 353.8 168 344.7 168 335.9C168 327.1 170 318 174.4 309.6C201.6 258 246.3 204.2 286.7 160.9C327.4 117.2 365.4 82.5 380.6 68.9zM410.3 117.7C392.8 133.6 361.2 163.3 327.7 199.2C288.3 241.5 247.7 291.1 224 336C247.7 380.9 288.2 430.5 327.7 472.8C361.2 508.7 392.8 538.4 410.3 554.3C399.7 508.3 385 428.1 385 336C385 243.9 399.7 163.7 410.3 117.7z" />
    </svg>
))

export const AngleRightJellyIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 672" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M291.4 602.9C281.8 611.5 269.5 616 257 616C221.6 616 197.4 582.3 205.3 549.6C215.3 508 231 428.1 231 336C231 243.9 215.3 164 205.3 122.4C197.4 89.8 221.6 56 257 56C269.5 56 281.8 60.5 291.4 69.1C306.6 82.7 344.5 117.4 385.3 161.1C425.7 204.4 470.3 258.2 497.6 309.8C502 318.2 504 327.3 504 336.1C504 344.9 502 354 497.6 362.4C470.4 414 425.7 467.8 385.3 511.1C344.6 554.8 306.6 589.5 291.4 603.1zM261.7 554.3C279.2 538.4 310.8 508.7 344.3 472.8C383.7 430.5 424.3 380.9 448 336C424.3 291.1 383.8 241.5 344.3 199.2C310.8 163.3 279.2 133.6 261.7 117.7C272.3 163.7 287 243.9 287 336C287 428.1 272.3 508.3 261.7 554.3z"/>
    </svg>
))



// ==================================================================================================================
// Icone Navigazione
// ==================================================================================================================

export const HomeIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* !Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
            <path d="M331 68.3L320.1 58.1L309.2 68.3L69.2 292.3L57.5 303.2L79.3 326.6C85.5 320.8 96.5 310.6 112.1 296L112.1 576L528.1 576L528.1 296C543.7 310.6 554.6 320.8 560.9 326.6L582.7 303.2C580.1 300.8 561.9 283.8 528.1 252.2L528.1 96L416.1 96L416.1 147.7L331 68.3zM496.1 266.2L496.1 544L400.1 544L400.1 368L240.1 368L240.1 544L144.1 544L144.1 266.2L320.1 101.9L496.1 266.2zM272.1 544L272.1 400L368.1 400L368.1 544L272.1 544zM496.1 128L496.1 222.4L448.1 177.6L448.1 128L496.1 128z" />
        </svg>
    )
})

export const BrowserIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
            <path d="M224 160L224 224L544 224L544 160L224 160zM192 160L96 160L96 224L192 224L192 160zM96 256L96 480L544 480L544 256L96 256zM64 128L576 128L576 512L64 512L64 128z" />
        </svg>
    )
})

export const ServicesIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M128 128L128 256L256 256L256 128L128 128zM96 96L288 96L288 288L96 288L96 96zM128 384L128 512L256 512L256 384L128 384zM96 352L288 352L288 544L96 544L96 352zM512 128L384 128L384 256L512 256L512 128zM384 96L544 96L544 288L352 288L352 96L384 96zM384 384L384 512L512 512L512 384L384 384zM352 352L544 352L544 544L352 544L352 352z" />
    </svg>
))

export const ContactIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
            <path d="M80 128L64 128L64 512L576 512L576 128L80 128zM544 184L544 199.9L320 364.2L96 199.9L96 160L544 160L544 184zM544 239.6L544 480L96 480L96 239.6L310.5 396.9L320 403.8L329.5 396.9L544 239.6z" />
        </svg>
    )
})

export const MethodIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
            <path d="M96 128L96 256L224 256L224 128L96 128zM212 288L64 288L64 96L256 96L256 176L384 176L384 96L576 96L576 288L384 288L384 208L256 208L256 288L252 288L300 352L448 352L448 544L256 544L256 352L260 352L212 288zM288 389.3L288 512L416 512L416 384L288 384L288 389.3zM416 208L416 256L544 256L544 128L416 128L416 208z" />
        </svg>
    )
})

export const HowItWorksIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
            <path d="M190.3 25.8C190.3 25.8 215.1 32.4 264.5 45.7L276.9 49C276.7 52.6 275.9 71.1 274.5 104.6C276.2 106.2 277.9 107.9 279.5 109.6C313 108.2 331.6 107.4 335.1 107.2L338.4 119.6L355 181.4L358.3 193.8C355.2 195.4 338.7 204 308.9 219.5C308.4 221.8 307.7 224.1 307.1 226.3C325.1 254.6 335.1 270.3 337 273.3L327.9 282.4L282.6 327.7L273.5 336.8C270.5 334.9 254.8 324.9 226.5 306.9C224.2 307.6 222 308.2 219.6 308.7C204.1 338.4 195.5 354.9 193.9 358.1L181.5 354.8L119.7 338.2L107.3 334.9C107.5 331.3 108.3 312.8 109.7 279.3C108 277.7 106.3 276 104.7 274.3C71.2 275.7 52.6 276.5 49.1 276.7C49.1 276.7 42.5 251.9 29.2 202.5L26 190.1L75.4 164.4C75.9 162.1 76.6 159.8 77.2 157.6C59.2 129.3 49.2 113.6 47.3 110.6L101.6 56.3L110.7 47.2C113.7 49.1 129.4 59.1 157.7 77.1C160 76.4 162.2 75.8 164.6 75.3C180.1 45.6 188.7 29.1 190.3 25.9zM206.8 63.4C192.9 90 185.9 103.5 185.7 103.8L177.8 105.1C172.1 106 166.5 107.5 161.2 109.6L153.7 112.4C153.4 112.2 140.5 104 115.2 87.9L88.1 115C104.2 140.4 112.4 153.2 112.6 153.5L109.8 161C108.8 163.7 107.9 166.4 107.2 169.2C106.5 172 105.8 174.8 105.4 177.6L104 185.5C103.7 185.7 90.2 192.7 63.5 206.6L73.4 243.6L119 241.6L124.1 247.8C127.7 252.2 131.8 256.3 136.3 260L142.5 265.1C142.5 265.5 141.8 280.7 140.5 310.7L177.5 320.6C191.4 294 198.4 280.5 198.6 280.2L206.5 278.9C212.2 278 217.8 276.5 223.1 274.4L230.6 271.6C230.9 271.8 243.8 280 269.1 296.1L296.2 269C280.1 243.7 271.9 230.8 271.7 230.5L274.5 223C275.5 220.3 276.4 217.6 277.1 214.8C277.8 212 278.5 209.2 278.9 206.4L280.2 198.5C280.5 198.3 294 191.3 320.7 177.4L310.8 140.4C280.8 141.7 265.6 142.4 265.2 142.4L260.1 136.2C256.5 131.8 252.4 127.7 247.9 124L241.7 118.9C241.7 118.5 242.4 103.3 243.7 73.3L206.7 63.4zM177.7 246.1C147.8 238.1 130.1 207.4 138.1 177.5C146.1 147.6 176.8 129.9 206.7 137.9C236.6 145.9 254.3 176.6 246.3 206.5C238.3 236.4 207.6 254.1 177.7 246.1zM215.4 198.2C218.8 185.4 211.2 172.2 198.4 168.8C185.6 165.4 172.4 173 169 185.8C165.6 198.6 173.2 211.8 186 215.2C198.8 218.6 212 211 215.4 198.2zM363.4 305.1L375.8 301.8L437.6 285.2L450 281.9C451.6 285.1 460.2 301.5 475.7 331.3C478 331.9 480.3 332.5 482.6 333.1C510.9 315.1 526.6 305.1 529.6 303.2L538.7 312.3L584 357.6L593.1 366.7C591.2 369.7 581.2 385.4 563.2 413.7C563.9 415.9 564.5 418.2 565 420.5C594.8 436 611.2 444.6 614.4 446.2L611.1 458.6L594.5 520.4L591.2 532.8C587.6 532.6 569.1 531.8 535.6 530.4C534 532.1 532.3 533.8 530.6 535.4C532 568.9 532.8 587.4 533 591L520.6 594.3L458.8 610.9L446.4 614.2C444.8 611 436.2 594.6 420.7 564.8C418.4 564.3 416.1 563.6 413.8 563C385.5 581 369.8 591 366.8 592.9L357.7 583.8L312.4 538.5L303.3 529.4C305.2 526.4 315.2 510.7 333.2 482.4C332.9 481.3 332.5 480.1 332.2 479C331.9 477.9 331.6 476.7 331.3 475.6C301.5 460.1 285.1 451.5 281.9 449.9L285.2 437.5L301.8 375.7L305.1 363.3C308.7 363.5 327.2 364.3 360.7 365.7C362.3 364 364 362.3 365.7 360.7C364.3 327.2 363.5 308.7 363.3 305.1zM396.5 329.4L398.1 367L398.4 375L392.2 380.1C387.7 383.8 383.7 387.9 380 392.3L374.9 398.5L366.9 398.2L329.3 396.6L319.4 433.6L352.8 451L359.9 454.7L361.2 462.6C361.7 465.4 362.3 468.2 363 471C363.7 473.8 364.6 476.6 365.6 479.2L368.4 486.7L364.1 493.4L343.9 525.2L371 552.3C396.3 536.2 409.2 528 409.5 527.8L417 530.6C422.4 532.6 427.9 534.1 433.6 535.1L441.5 536.4L445.2 543.5L462.6 576.9L499.6 567L498 529.4L497.7 521.4L503.9 516.3C508.4 512.6 512.4 508.5 516.1 504.1L521.2 497.9L529.2 498.2L566.8 499.8L576.7 462.8L543.3 445.4L536.2 441.7L534.9 433.8C534.4 431 533.8 428.2 533.1 425.4C532.4 422.6 531.5 419.8 530.5 417.2L527.7 409.7C527.9 409.4 536.1 396.5 552.2 371.2L525.1 344.1C499.8 360.2 486.9 368.4 486.6 368.6L479.1 365.8C473.7 363.8 468.2 362.3 462.5 361.3L454.6 360L450.9 352.9L433.5 319.5L396.5 329.4zM462.6 502.2C432.7 510.2 402 492.5 394 462.6C386 432.7 403.7 402 433.6 394C463.5 386 494.2 403.7 502.2 433.6C510.2 463.5 492.5 494.2 462.6 502.2zM471.3 441.9C467.9 429.1 454.7 421.5 441.9 424.9C429.1 428.3 421.5 441.5 424.9 454.3C428.3 467.1 441.5 474.7 454.3 471.3C467.1 467.9 474.7 454.7 471.3 441.9z" />
        </svg>
    )
})

export const TargetIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
            <path d="M544 320C544 196.3 443.7 96 320 96C196.3 96 96 196.3 96 320C96 443.7 196.3 544 320 544C443.7 544 544 443.7 544 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 448C390.7 448 448 390.7 448 320C448 249.3 390.7 192 320 192C249.3 192 192 249.3 192 320C192 390.7 249.3 448 320 448zM320 160C408.4 160 480 231.6 480 320C480 408.4 408.4 480 320 480C231.6 480 160 408.4 160 320C160 231.6 231.6 160 320 160zM320 352C337.7 352 352 337.7 352 320C352 302.3 337.7 288 320 288C302.3 288 288 302.3 288 320C288 337.7 302.3 352 320 352zM320 256C355.3 256 384 284.7 384 320C384 355.3 355.3 384 320 384C284.7 384 256 355.3 256 320C256 284.7 284.7 256 320 256z" />
        </svg>
    )
})

export const ResultsIcon = component$<IconProps>(({ class: className }) => {
    return (
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
            {/* Font Awesome Pro v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. */}
            <path d="M400 160L608 160L608 368L576 368L576 214.6L363.3 427.3L352 438.6L340.7 427.3L224 310.6L59.3 475.3L36.7 452.7L212.7 276.7L224 265.4L235.3 276.7L352 393.4L553.4 192L400 192L400 160z" />
        </svg>
    )
})

export const GuidesIcon = component$<IconProps>(({ class: className }) => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class={['fill-current', className ?? '']}>
        {/* <!--!Font Awesome Pro v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--> */}
        <path d="M304 164L304 542.7C254.2 522.4 201 512 147.2 512L96 512L96 128L147.2 128C193.7 128 239.7 137.2 282.6 155.1L304 164zM336 542.7L336 164L357.4 155.1C400.3 137.2 446.3 128 492.8 128L544 128L544 512L492.8 512C439 512 385.8 522.4 336 542.7zM576 96L492.8 96C442.1 96 391.9 106 345.1 125.5L320 136L294.9 125.5C248.1 106 197.9 96 147.2 96L64 96L64 544L147.2 544C197.9 544 248.1 554 294.9 573.5L320 584L345.1 573.5C391.9 554 442.1 544 492.8 544L576 544L576 96z" />
    </svg>
))
