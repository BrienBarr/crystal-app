import { searchCrystals } from './search.ts'
import { makeCrystal } from '../test/fixtures.ts'

const names = (list: { name: string }[]) => list.map((c) => c.name)

const quartz = makeCrystal({ name: 'Quartz' })
const rose = makeCrystal({ name: 'Rose Quartz', aliases: ['Pink Quartz'] })
const smoky = makeCrystal({ name: 'Smoky Quartz' })
const amethyst = makeCrystal({ name: 'Amethyst', intentions: ['quartz-like calm'] })
const tiger = makeCrystal({ name: "Tiger's Eye" })
const citrine = makeCrystal({ name: 'Citrine' })
const creme = makeCrystal({ name: 'Creme' })
const anxious = makeCrystal({ name: 'Zeta', intentions: ['anxiety'] })
const textOnly = makeCrystal({ name: 'Alpha', healing: 'Said to ease anxiety.' })
const all = [smoky, amethyst, quartz, rose, tiger, citrine, creme, anxious, textOnly]

test('empty or whitespace query returns everything alphabetically', () => {
  expect(names(searchCrystals(all, '   '))).toEqual(names(all).sort((a, b) => a.localeCompare(b)))
})

test('ranks exact name, then name contains, then intention matches', () => {
  expect(names(searchCrystals(all, 'quartz'))).toEqual(['Quartz', 'Rose Quartz', 'Smoky Quartz', 'Amethyst'])
})

test('exact alias match ranks like an exact name', () => {
  expect(names(searchCrystals(all, 'pink quartz'))[0]).toBe('Rose Quartz')
})

test('exact intention ranks above a description text match', () => {
  expect(names(searchCrystals(all, 'anxiety'))).toEqual(['Zeta', 'Alpha'])
})

test('excludes non-matches', () => {
  expect(searchCrystals(all, 'zzzz')).toEqual([])
})

test('ignores apostrophes, case, hyphens, extra spaces, and accents', () => {
  for (const q of ['tigers eye', "TIGER'S EYE", 'tiger’s eye']) {
    expect(names(searchCrystals(all, q))[0]).toBe("Tiger's Eye")
  }
  expect(names(searchCrystals(all, '  ROSE quartz '))[0]).toBe('Rose Quartz')
  expect(names(searchCrystals(all, 'rose-quartz'))[0]).toBe('Rose Quartz')
  expect(names(searchCrystals(all, 'citrin'))[0]).toBe('Citrine')
  expect(names(searchCrystals(all, 'crème'))[0]).toBe('Creme')
})
