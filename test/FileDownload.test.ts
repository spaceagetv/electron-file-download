/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * Tests for the FileDownload class in FileDownload.ts
 */

import { FileDownload } from '../src/FileDownload'
import { expect } from 'chai'
import { session } from 'electron'
import * as sinon from 'sinon'
import { MockDownloadItem } from './MockDownloadItem'
import path from 'path'

describe('FileDownload', () => {
  let stubSession: Electron.Session & {
    emit: (event: string, ...args: unknown[]) => boolean
  }
  before(() => {
    // Stub the downloadURL method of the session
    stubSession = session.defaultSession
    sinon.stub(stubSession, 'downloadURL')
  })

  beforeEach(() => {
    // Reset the history of the stubbed method
    ;(stubSession.downloadURL as sinon.SinonStub).resetHistory()
  })

  after(() => {
    // Restore the stubbed method
    ;(stubSession.downloadURL as sinon.SinonStub).restore()
  })

  async function createMockedFileDownloadInstance(
    url: string,
    destination: string,
  ) {
    const fileDownload = new FileDownload(url, destination, {
      session: stubSession,
    })
    await fileDownload._whenReady()
    return fileDownload
  }

  it('should create a new FileDownload instance', async () => {
    const fileDownload = await createMockedFileDownloadInstance(
      'https://example.com',
      '/tmp',
    )
    expect(fileDownload).to.be.an.instanceOf(FileDownload)
  })

  it('should immediately download the file', async () => {
    const download = await createMockedFileDownloadInstance(
      'https://example.com',
      '/tmp',
    )
    await download._whenReady()
    sinon.assert.calledOnce(stubSession.downloadURL as sinon.SinonSpy)
    sinon.assert.calledWithExactly(
      stubSession.downloadURL as sinon.SinonSpy,
      'https://example.com',
    )
  })

  it('should download the file to the specified destination', async () => {
    const URL = 'https://example.com/file.txt'
    const fileDownload = await createMockedFileDownloadInstance(URL, '/tmp')
    const downloadItem = new MockDownloadItem(URL)
    // emit the event as if it came from Electron
    const session = await fileDownload._session
    session.emit('will-download', {}, downloadItem)
    // wait for the event to be processed
    const fileDownloadItem = await fileDownload.downloadItem
    expect(fileDownloadItem).to.equal(downloadItem)
    const crossPlatformPath = path.join('/tmp', 'file.txt')
    expect(fileDownloadItem.savePath).to.equal(crossPlatformPath)
    expect(fileDownloadItem.getFilename()).to.equal('file.txt')
  })
})
