import { component$ } from "@builder.io/qwik";
import { ComeBackBtn } from "./come-back-btn";
import { GoToTopBtn } from "./go-to-top-btn";

export const EndPageBtnBlock = component$(() => (
    <>
        <hr class="site-hr" />
        <div class="my-12 sm:my-0 grid grid-cols-1 grid-rows-2 max-w-96 sm:max-w-2xl sm:grid-cols-2 sm:grid-rows-1 gap-6 sm:gap-4 px-6 sm:px-0 mx-auto">
            <ComeBackBtn class="sm:my-12 w-full" />
            <GoToTopBtn class="sm:my-12 w-full" />
        </div>
    </>
))