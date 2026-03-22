import leoProfanity from 'leo-profanity'

const filter = leoProfanity

filter.loadDictionary('ru')
filter.loadDictionary('en')

export const cleanText = (text) => filter.clean(text)
export const isProfane = (text) => filter.check(text)
