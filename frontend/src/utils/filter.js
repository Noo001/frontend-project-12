import leoProfanity from 'leo-profanity'

const filter = leoProfanity

filter.loadDictionary('ru')
filter.loadDictionary('en')

export const cleanText = (text) => {
  return filter.clean(text)
}
export const isProfane = (text) => {
  return filter.check(text)
}
