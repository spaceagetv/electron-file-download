import { DownloadItem } from 'electron'
import * as sinon from 'sinon'
import { EventEmitter } from 'events'

export class MockDownloadItem extends EventEmitter implements DownloadItem {
  _filename: string
  _URL: string
  savePath = ''
  _receivedBytes: number
  _totalBytes: number

  cancel = sinon.spy()
  canResume = sinon.spy()
  getContentDisposition = sinon.spy(() => '')
  getETag = sinon.spy(() => '')
  getFilename = sinon.spy(() => this._filename)
  getLastModifiedTime = sinon.spy(() => '')
  getMimeType = sinon.spy(() => '')
  getReceivedBytes = sinon.spy(() => 123)
  getSavePath = sinon.spy(() => '')
  getStartTime = sinon.spy(() => Date.now())
  getState = sinon.spy(() => 'completed' as const)
  getTotalBytes = sinon.spy(() => 0)
  getURL = sinon.spy(() => '')
  getURLChain = sinon.spy(() => [])
  hasUserGesture = sinon.spy(() => false)
  isPaused = sinon.spy(() => false)
  pause = sinon.spy()
  resume = sinon.spy()
  setSaveDialogOptions = sinon.spy()
  getSaveDialogOptions = sinon.spy(() => ({}))
  setSavePath = sinon.spy((path: string) => {
    this.savePath = path
  })

  constructor(url: string) {
    super()
    this._URL = url
    this._filename = url.split('/').pop() || ''
    this._receivedBytes = 0
    this._totalBytes = 0
  }
}
