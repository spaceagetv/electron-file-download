import { app, session } from 'electron'
import EventEmitter from 'events'
import path from 'path'
import TypedEmitter from 'typed-emitter'
import { DeferredPromise, noopLogger } from './utilities'

type Logger = typeof noopLogger

/**
 * Default dependencies for FileDownload
 */
const fileDownloadDependencies = {
  /** Electron.App instance @ignore */
  app,
  /** Node.js path module @ignore */
  path,
  /** Electron.Session instance */
  session: undefined as Electron.Session | undefined,
  /** Logger - use console, electron-log, winston, etc. */
  logger: noopLogger as Logger,
}

/**
 * Optional dependencies for FileDownload
 *
 * @typedef {Object} FileDownloadDependencies
 * @property {Electron.Session} session Electron.Session instance to use for download (defaults to a session called "file-download")
 * @property {Logger} logger Logger - use console, electron-log, winston, etc.
 * @property {Electron.App} app Electron.App instance (for testing)
 * @property {typeof path} path Node.js path module (for testing)
 */
export type FileDownloadDependencies = typeof fileDownloadDependencies

/**
 * The progress of the download
 *
 * @typedef {Object} FileDownloadProgress
 * @property {number} percent The progress of the download as a number between 0 and 1
 * @property {boolean} indeterminate Whether the download is indeterminate (totalBytes is 0)
 * @property {number} bytesDownloaded The total number of bytes downloaded so far
 * @property {number} totalBytes The total number of bytes to download
 *
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 * fileDownload.on('progress', (progress) => {
 *   console.log(`Downloaded ${progress.percent * 100}% of ${progress.totalBytes} bytes`)
 * })
 * ```
 */
export type FileDownloadProgress = {
  /** The progress of the download as a number between 0 and 1 */
  percent: number
  /** Whether the download is indeterminate */
  indeterminate: boolean
  /** The total number of bytes downloaded so far */
  bytesDownloaded: number
  /** The total number of bytes to download */
  totalBytes: number
  /** Start time - milliseconds since epoch */
  startTime: number
  /** Elapsed time in milliseconds */
  elapsedTime: number
  /** Estimated time remaining - milliseconds */
  estimatedMsRemaining: number
}

/**
 * The base Error class for FileDownload
 * @extends Error
 *
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 * fileDownload.on('error', (error) => {
 *  if (error instanceof FileDownloadError) {
 *   // might be a FileDownloadCancelledError or FileDownloadInterruptedError
 *   console.log(error.message)
 *  }
 * }
 * ```
 */
class FileDownloadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileDownloadError'
  }
}

export type { FileDownloadError }

/**
 * An error that occurs when the download is cancelled
 * @extends FileDownloadError
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 * fileDownload.on('error', (error) => {
 *   if (error instanceof FileDownloadCancelledError) {
 *     dialog.showMessageBox({
 *      type: 'warning',
 *      message: i18n('The download was cancelled'),
 *      buttons: [i18n('OK')],
 *   })
 * }
 * ```
 */
class FileDownloadCancelledError extends FileDownloadError {
  constructor() {
    super('Download was cancelled')
    this.name = 'FileDownloadCancelledError'
  }
}

export type { FileDownloadCancelledError }

/**
 * An error that occurs when the download is interrupted
 * @extends FileDownloadError
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 * fileDownload.on('error', (error) => {
 *  if (error instanceof FileDownloadInterruptedError) {
 *  dialog.showMessageBox({
 *   type: 'warning',
 *   message: i18n('The download was interrupted'),
 *   buttons: [i18n('OK')],
 * })
 */
class FileDownloadInterruptedError extends FileDownloadError {
  constructor() {
    super('Download was interrupted')
    this.name = 'FileDownloadInterruptedError'
  }
}

export type { FileDownloadInterruptedError }

/**
 * The events emitted by FileDownload
 * @event
 * @extends EventEmitter
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 * fileDownload.on('progress', (progress) => {
 *   console.log(progress.percent)
 * })
 * fileDownload.on('completed', (destination) => {
 *   console.log(`File downloaded to ${destination}`)
 * })
 * ```
 */
export type FileDownloadEvents = {
  /** Emitted when the download progress changes @event */
  progress: (progress: FileDownloadProgress) => void
  /** Emitted when the download is completed @event */
  completed: (destination: string) => void
  /** Emitted when the download is cancelled @event */
  cancelled: () => void
  /** Emitted when the download is paused @event */
  paused: () => void
  /** Emitted when the download is resumed @event */
  resumed: () => void
  /** Emitted when the download is interrupted @event */
  error: (error: FileDownloadError) => void
}

/**
 * Download a file from a url to a specified directory
 *
 * @extends EventEmitter
 *
 * @see FileDownloadEvents for the events emitted by FileDownload
 *
 * @example
 * ```js
 * const fileDownload = new FileDownload('https://example.com')
 *
 * fileDownload.on('progress', (progress) => {
 *   console.log(`Downloaded ${progress.percent * 100}% of ${progress.totalBytes} bytes`)
 * })
 *
 * fileDownload.on('error', (error) => {
 *   if (error instanceof FileDownloadCancelledError) {
 *     dialog.showMessageBox({
 *       type: 'warning',
 *       message: i18n('The download was cancelled'),
 *       buttons: [i18n('OK')],
 *     })
 *   } else if (error instanceof FileDownloadInterruptedError) {
 *     dialog.showMessageBox({
 *       type: 'warning',
 *       message: i18n('The download was interrupted'),
 *       buttons: [i18n('OK')],
 *     })
 *   }
 * })
 *
 * fileDownload.on('completed', (destination) => {
 *   console.log(`File downloaded to ${destination}`)
 * })
 * ```
 */
export class FileDownload extends (EventEmitter as new () => TypedEmitter<FileDownloadEvents>) {
  /** @ignore */
  static dependencies = fileDownloadDependencies

  /** The url to download from */
  readonly url: string

  /** The path to the downloaded file to (including filename) */
  destinationPath: string

  /** The logger to use - console, electron-log, winston, etc - defaults to no-op functions */
  logger: Logger

  /** @ignore */
  _session: Promise<Electron.Session>
  /** @ignore */
  _app: Electron.App
  /** @ignore */
  _path: typeof path

  /** The directory to download to. Will default to app.getPath('temp' + '/DL_TEMP') */
  destinationDir: string

  /** The Electron DownloadItem instance as a thenable deferred promise
   *
   * ```js
   * const fileDownload = new FileDownload('https://example.com')
   * await fileDownload.downloadItem
   * ```
   *
   * @see https://www.electronjs.org/docs/api/download-item
   **/
  downloadItem: DeferredPromise<Electron.DownloadItem>

  /** @ignore */
  _paused = false
  /** @ignore */
  _cancelled = false
  /** @ignore */
  _done = false

  /**
   * Create a new FileDownload instance
   *
   * @param {string} url The url to download from
   * @param {string} [destinationDir] The directory to download to
   * @param {Partial<FileDownloadDependencies>} [dependencies] Dependencies to override...
   * @param {Logger} [dependencies.logger] Logger - use console, electron-log, winston, etc.
   * @param {Electron.Session} [dependencies.session] Electron.Session instance to use - defaults to a new session
   * @returns {FileDownload} A new FileDownload instance
   * @example
   * ```js
   * const fileDownload = new FileDownload('https://example.com', '/tmp')
   * fileDownload.on('progress', (progress) => {
   *   console.log(progress.percent)
   * })
   * fileDownload.on('completed', (destination) => {
   *   console.log(destination)
   * })
   * ```
   */
  constructor(
    url: string,
    destinationDir?: string,
    dependencies: Partial<FileDownloadDependencies> = {},
  ) {
    super()
    const {
      session: s,
      app: a,
      path: p,
      logger,
    } = {
      ...FileDownload.dependencies,
      ...dependencies,
    }
    this.logger = logger
    this.logger.debug(
      `FileDownload() :: downloading ${url} to ${destinationDir}`,
    )
    this.url = url
    this._session = new Promise(async (resolve) => {
      await app.whenReady()
      if (s) {
        resolve(s)
      } else {
        resolve(session.fromPartition('file-download'))
      }
    })
    this._app = a
    this._path = p
    this.destinationDir =
      destinationDir ?? path.join(this._app.getPath('temp'), 'DL_TEMP')
    this.downloadItem = new DeferredPromise()
    // start the download immediately
    this.downloadFile()
  }

  /**
   * Returns a promise that resolves when the FileDownload instance is
   * ready for interaction. This is useful for testing. Probably not
   * needed in most development scenarios.
   *
   * @returns {Promise<void>} A promise that resolves when the session is ready
   * @ignore
   * @private
   */
  _whenReady(): Promise<void> {
    return new Promise((resolve) => {
      this._session.then(() => {
        resolve()
      })
    })
  }

  /**
   * Download the update to the specified directory
   * This gets called automatically when the FileDownload instance is created
   *
   * @returns {Promise<string | null>} The path to the downloaded file
   * @ignore
   * @private
   */
  private async downloadFile(): Promise<string | null> {
    await this._whenReady()
    const s = await this._session
    const deferred = new DeferredPromise<string | null>()
    s.on('will-download', (event, item) => {
      this.downloadItem.resolve(item)
      // write to the readonly property
      this.destinationPath = path.join(
        this.destinationDir,
        item.getFilename() ?? '',
      )
      item.setSavePath(this.destinationPath)
      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          if (!this._cancelled) {
            this.emit('error', new FileDownloadInterruptedError())
          }
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            this._paused = true
            this.emit('paused')
          } else {
            if (this._paused) {
              this._paused = false
              this.emit('resumed')
            }
            const bytesDownloaded = item.getReceivedBytes()
            // number of milliseconds since epoch (double)
            const startTime = item.getStartTime() * 1000
            // elapsed time in milliseconds
            const elapsedTime = Date.now() - startTime
            // bytes per millisecond
            const bytesPerMillisecond = bytesDownloaded / elapsedTime
            // total bytes to download
            const totalBytes = item.getTotalBytes()
            const bytesRemaining = totalBytes ? totalBytes - bytesDownloaded : 0
            // milliseconds remaining
            const estimatedMsRemaining = bytesRemaining / bytesPerMillisecond
            const percent = totalBytes ? bytesDownloaded / totalBytes : 0
            const indeterminate = totalBytes === 0
            const progress: FileDownloadProgress = {
              percent,
              indeterminate,
              bytesDownloaded,
              totalBytes,
              startTime,
              elapsedTime,
              estimatedMsRemaining,
            }
            this.emit('progress', progress)
          }
        }
      })
      item.on('done', (event, state) => {
        this._done = true
        if (state === 'completed') {
          deferred.resolve(item.getSavePath())
          this.emit('completed', item.getSavePath())
        } else {
          deferred.resolve(null)
          this._cancelled = true
          this.emit('cancelled')
        }
      })
    })
    s.downloadURL(this.url)
    return await deferred
  }

  /**
   * Returns a promise that resolves when the download is complete
   *
   * @returns {Promise<string>} The path to the downloaded file
   */
  waitForDownload(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const downloadItem = await this.downloadItem
      if (this._cancelled) {
        reject(new FileDownloadCancelledError())
      }
      if (this._done) {
        // the download may have saved to a different path
        resolve(downloadItem.getSavePath())
      }
      downloadItem.on('done', (event, state) => {
        if (state === 'completed') {
          // the download may have saved to a different path
          resolve(downloadItem.getSavePath())
        } else if (state === 'cancelled') {
          reject(new FileDownloadCancelledError())
        } else if (state === 'interrupted') {
          reject(new FileDownloadInterruptedError())
        } else {
          reject(new FileDownloadError('Unknown error'))
        }
      })
    })
  }

  /**
   * Pause the download.
   *
   * Calls the Electron DownloadItem.pause() method
   */
  async pause() {
    ;(await this.downloadItem).pause()
    // this should trigger 'updated' event which will
    // update this._paused and emit
  }

  /**
   * Resume the download.
   *
   * Calls the Electron DownloadItem.resume() method
   */
  async resume() {
    ;(await this.downloadItem).resume()
    // this should trigger 'updated' event which will
    // update this._paused and emit
  }

  /**
   * Cancel the download
   *
   * Calls the Electron DownloadItem.cancel() method
   */
  async cancel() {
    ;(await this.downloadItem).cancel()
    this._cancelled = true
    this.emit('cancelled')
  }
}
