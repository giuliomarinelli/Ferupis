import { component$, Slot } from '@builder.io/qwik'
import { ContainerTag, Poly } from '../UI/poly'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const containerContext = ['content', 'article', 'header', 'footer', null] as const

type ContainerContext = typeof containerContext[number]

type ContainerProps = {
    tag?: ContainerTag
    classOverride?: string | string[]
    context?: ContainerContext
    class?: string | string[]
    lang?: 'it'
}

export const Container = component$<ContainerProps>((props) => {
    const context = props.context === undefined ? 'content' : props.context
    return (
        <Poly as={props.tag} class={[
            props.classOverride ?? [
                `relative z-10 mx-auto flex w-full max-w-7xl items-center`,
                context === null ? '' :
                    context === 'content' ?
                        `px-6 sm:px-8 py-20 lg:px-12` :
                        context === 'article' ?
                            `max-w-[72ch] px-8` :
                            context === 'header' ?
                                `px-3 2xs:px-4 xs:px-5 py-3` :
                                `px-6 sm:px-8 py-3`
            ],
            props.class ?? ''
        ]} lang={context === 'article' ? 'it' : undefined}>
            <Slot />
        </Poly>
    )
})