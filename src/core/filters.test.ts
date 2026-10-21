import { EMPTY_FILTERS, activeFilterCount, filterCrystals } from './filters.ts'
import { makeCrystal } from '../test/fixtures.ts'

const rose = makeCrystal({ name: 'Rose Quartz', chakras: ['heart'], colors: ['pink'] })
const aventurine = makeCrystal({ name: 'Aventurine', chakras: ['heart'], colors: ['green'] })
const sodalite = makeCrystal({ name: 'Sodalite', chakras: ['throat'], colors: ['blue'] })
const jasper = makeCrystal({ name: 'Jasper', chakras: ['root'], colors: ['red'] })
const all = [rose, aventurine, sodalite, jasper]

test('empty filters return everything', () => {
  expect(filterCrystals(all, EMPTY_FILTERS)).toEqual(all)
})

test('values within a facet are ORed', () => {
  const result = filterCrystals(all, { ...EMPTY_FILTERS, chakras: ['heart', 'throat'] })
  expect(result).toEqual([rose, aventurine, sodalite])
})

test('facets are ANDed', () => {
  const result = filterCrystals(all, { ...EMPTY_FILTERS, chakras: ['heart'], colors: ['pink'] })
  expect(result).toEqual([rose])
})

test('activeFilterCount counts selected values across facets', () => {
  expect(activeFilterCount(EMPTY_FILTERS)).toBe(0)
  expect(activeFilterCount({ ...EMPTY_FILTERS, chakras: ['heart', 'root'], zodiac: ['leo'] })).toBe(3)
})
