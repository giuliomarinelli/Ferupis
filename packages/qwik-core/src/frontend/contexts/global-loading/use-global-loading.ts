import { useContext } from '@builder.io/qwik'
import { GlobalLoadingContext } from './context'

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext)
}
