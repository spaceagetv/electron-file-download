import { expect } from 'chai'
import { testMe } from '../src/index'

describe('test', () => {
  it('should work', () => {
    expect(true).to.be.true
  })

  it('should return Hello World', () => {
    expect(testMe()).to.equal('Hello World!')
  })
})
