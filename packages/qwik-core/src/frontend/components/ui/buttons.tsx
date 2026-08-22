import { $, component$, Slot, type QRL } from '@builder.io/qwik'
import { Link, useNavigate } from '@builder.io/qwik-city'
import { LargeCloseIcon, PhoneIcon, ThinCloseIcon, type IconProps } from './icons/icons'
import { useOverlay } from './overlay'

export type CtaButtonContext = 'nav' | 'header'

export type BtnProps = {
  label: string
  shortLabel?: string
  title?: string
  fontSize?: string
  adjunctiveTwClassList?: string
  action?: QRL<() => void>
  icon?: IconName
  context: CtaButtonContext
}

export interface BtnLinkProps extends BtnProps {
  href?: string
}

export type BtnLinkActionProps = Omit<
  BtnLinkProps,
  | 'shortLabel'
  | 'context'
  | 'icon'
  | 'fontSize'
> & {
  isLink: boolean
  disabled?: boolean
  buttonType?: 'button' | 'submit'
}

export type IconBtnProps = Omit<
  BtnProps,
  | 'label'
  | 'shortLabel'
  | 'fontSize'
  | 'adjunctiveTwClassList'
  | 'context'
> &
  IconProps

export type IconBtnLinkProps = IconBtnProps & BtnLinkProps
export type IcontBtnLinkProps = IconBtnLinkProps

export type IconName = 'phone'

export type OverlayCloseBtnProps = IconBtnProps & {
  redirectToPathname?: string
} 

export const OverlayCloseBtn = component$<OverlayCloseBtnProps>((props) => {
  const { close$ } = useOverlay()  
  const nav = useNavigate()
  const closeExtended$ = $(() => {
    close$()
    if (!props.redirectToPathname || typeof props.redirectToPathname !== 'string') {
      return
    }
    nav(props.redirectToPathname)
  })
  return (
    <button class="p-1 rounded-md border-2 border-neutral-500 hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors duration-200" onClick$={closeExtended$}>
      <ThinCloseIcon classList={props.classList ?? 'size-6'} />
    </button>
  )
})

export const CtaPrimaryBtnSqLink = component$<BtnLinkProps>((props) => {
  const {
    label,
    shortLabel,
    title,
    fontSize,
    adjunctiveTwClassList,
    href,
    context,
    action,
    icon,
  } = props

  if (typeof href !== 'string' || !href.trim()) {
    throw new Error('href required in CtaPrimaryBtnSqLink')
  }

  const normalizedShortLabel = shortLabel ?? label
  const normalizedTitle = title?.trim() || undefined
  const normalizedFontSize = fontSize?.trim()
  const fontSizeValue = normalizedFontSize
    ? /[a-z%)]$/i.test(normalizedFontSize)
      ? normalizedFontSize
      : `${normalizedFontSize}rem`
    : undefined

  const labelClassList =
    context === 'header' ? 'hidden lg:inline' : ''
  const shortLabelClassList =
    context === 'header' ? 'hidden md:inline lg:hidden' : 'hidden'
  const linkClassList =
    context === 'header'
      ? 'hidden md:inline-flex md:col-start-3 w-full justify-center whitespace-nowrap'
      : 'inline-flex col-start-3 hover:scale-[1.01] transition-transform duration-300'

  return (
    <Link
      href={href}
      class={`${linkClassList}
        ${fontSizeValue ? '' : 'text-[0.925rem]'} font-medium ${context === 'header' ? 'mr-4' : ''} px-3 py-1.5 rounded-sm
        border border-indigo-700 dark:border-indigo-500
        bg-transparent text-indigo-800 hover:bg-indigo-200/30
        dark:bg-indigo-300 dark:text-slate-950 dark:hover:bg-indigo-300/90
        transition-colors duration-200 flex items-center gap-2
        ${adjunctiveTwClassList ?? ''}
      `}
      style={fontSizeValue ? { fontSize: fontSizeValue } : undefined}
      title={normalizedTitle}
      onClick$={action}
    >
      {icon === 'phone' && <PhoneIcon classList="size-5" />}
      <span class={labelClassList}>{label}</span>
      <span class={shortLabelClassList}>{normalizedShortLabel}</span>
    </Link>
  )
})

export const LargeCloseBtn = component$<IconBtnProps>((props) => {
  const { action, classList, title } = props
  const handleClick = $(() => {
    action?.()
  })

  return (
    <button
      type="button"
      title={title}
      onClick$={handleClick}
      class={classList ?? ''}
    >
      <LargeCloseIcon />
    </button>
  )
})


export const PrimaryActionBtn = component$<BtnLinkActionProps>((props) => {
  const {
    label,
    isLink,
    action,
    adjunctiveTwClassList,
    href,
    title,
    disabled,
    buttonType,
  } = props
  const isDisabled = Boolean(disabled)
  const baseClassList = `
    shadow-md px-4 py-3 text-slate-50 dark:text-neutral-950 font-medium rounded-sm
    flex items-center justify-center gap-2 w-12/12 transition-colors duration-150
    ${adjunctiveTwClassList ?? ''}
  `
  const enabledStateClassList =
    'bg-light-primary dark:bg-bright-primary hover:bg-indigo-800/78 dark:hover:bg-indigo-300/85'
  const disabledStateClassList =
    'bg-indigo-400/70 hover:bg-indigo-400/70 dark:bg-indigo-300/68 dark:hover:bg-indigo-300/68 cursor-not-allowed'
  const classList = `${isDisabled ? disabledStateClassList : enabledStateClassList} ${baseClassList}`
  if (isLink) {
    return (
      <Link
        href={isDisabled ? undefined : href}
        title={title?.trim() || undefined}
        class={classList}
        aria-disabled={isDisabled ? 'true' : undefined}
        tabIndex={isDisabled ? -1 : undefined}
      >
        <Slot />
        {label.trim() && <span>{label}</span>}
        <Slot name="end" />
      </Link>
    )
  }

  return (
    <button
      type={buttonType ?? 'button'}
      title={title?.trim() || undefined}
      onClick$={action}
      class={classList}
      disabled={isDisabled}
      style={isDisabled ? { cursor: 'not-allowed' } : undefined}
    >
      <Slot />
      {label.trim() && <span>{label}</span>}
      <Slot name="end" />
    </button>
  )
})

export const SecondaryActionOutlineBtn = component$<BtnLinkActionProps>(
  (props) => {
    const {
      label,
      isLink,
      action,
      adjunctiveTwClassList,
      href,
      title,
      disabled,
      buttonType,
    } = props
    const isDisabled = Boolean(disabled)
    const baseClassList = `
      px-4 py-3 text-light-primary dark:text-bright-primary font-medium rounded-sm
      flex items-center justify-center gap-2 w-12/12 transition-colors duration-150
      ${adjunctiveTwClassList ?? ''}
    `
    const enabledStateClassList =
      'bg-transparent hover:bg-indigo-100/90 dark:hover:bg-indigo-50/8 border border-light-primary dark:border-bright-primary'
    const disabledStateClassList =
      'bg-indigo-400/70 hover:bg-indigo-400/70 dark:bg-indigo-300/68 dark:hover:bg-indigo-300/68 cursor-not-allowed'
    const classList = `${isDisabled ? disabledStateClassList : enabledStateClassList} ${baseClassList}`
    if (isLink) {
      return (
        <Link
          href={isDisabled ? undefined : href}
          title={title}
          class={classList}
          aria-disabled={isDisabled ? 'true' : undefined}
          tabIndex={isDisabled ? -1 : undefined}
        >
          <Slot />
          <span>{label}</span>
          <Slot name="end" />
        </Link>
      )
    }

    return (
      <button
        type={buttonType ?? 'button'}
        title={title}
        onClick$={action}
        class={classList}
        disabled={isDisabled}
        style={isDisabled ? { cursor: 'not-allowed' } : undefined}
      >
        <Slot />
        <span>{label}</span>
        <Slot name="end" />
      </button>
    )
  },
)
