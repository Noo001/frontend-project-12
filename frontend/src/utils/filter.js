import Filter from 'leo-profanity'

const filter = new Filter()

filter.loadDictionary('ru')
filter.loadDictionary('en')

export const cleanText = (text) => filter.clean(text)
export const isProfane = (text) => filter.check(text)
