import { useContext } from '@builder.io/qwik'
import { QuestionnaireSessionContext } from './context.ts'

export const useQuestionnaireSession = () =>
  useContext(QuestionnaireSessionContext)
