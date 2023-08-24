[electron-file-download](../README.md) / FileDownload

# Class: FileDownload

Download a file from a url to a specified directory

**`See`**

FileDownloadEvents for the events emitted by FileDownload

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')

fileDownload.on('progress', (progress) => {
  console.log(`Downloaded ${progress.percent * 100}% of ${progress.totalBytes} bytes`)
})

fileDownload.on('error', (error) => {
  if (error instanceof FileDownloadCancelledError) {
    dialog.showMessageBox({
      type: 'warning',
      message: i18n('The download was cancelled'),
      buttons: [i18n('OK')],
    })
  } else if (error instanceof FileDownloadInterruptedError) {
    dialog.showMessageBox({
      type: 'warning',
      message: i18n('The download was interrupted'),
      buttons: [i18n('OK')],
    })
  }
})

fileDownload.on('completed', (destination) => {
  console.log(`File downloaded to ${destination}`)
})
```

## Hierarchy

- `TypedEventEmitter`<[`FileDownloadEvents`](../README.md#filedownloadevents), `this`\>

  ↳ **`FileDownload`**

## Table of contents

### Constructors

- [constructor](FileDownload.md#constructor)

### Properties

- [destinationDir](FileDownload.md#destinationdir)
- [destinationPath](FileDownload.md#destinationpath)
- [downloadItem](FileDownload.md#downloaditem)
- [logger](FileDownload.md#logger)
- [url](FileDownload.md#url)

### Methods

- [cancel](FileDownload.md#cancel)
- [pause](FileDownload.md#pause)
- [resume](FileDownload.md#resume)
- [waitForDownload](FileDownload.md#waitfordownload)

## Constructors

### constructor

• **new FileDownload**(`url`, `destinationDir?`, `dependencies?`)

Create a new FileDownload instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The url to download from |
| `destinationDir?` | `string` | The directory to download to |
| `dependencies?` | `Partial`<{ `app`: `App` ; `logger`: { `debug`: (...`_args`: `unknown`[]) => `void` ; `error`: (...`_args`: `unknown`[]) => `void` ; `info`: (...`_args`: `unknown`[]) => `void` ; `warn`: (...`_args`: `unknown`[]) => `void`  } ; `path`: `PlatformPath` ; `session`: `Session`  }\> | Dependencies to override... |

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com', '/tmp')
fileDownload.on('progress', (progress) => {
  console.log(progress.percent)
})
fileDownload.on('completed', (destination) => {
  console.log(destination)
})
```

#### Overrides

(EventEmitter as new () &#x3D;\&gt; TypedEmitter&lt;FileDownloadEvents\&gt;).constructor

#### Defined in

[FileDownload.ts:267](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L267)

## Properties

### destinationDir

• **destinationDir**: `string`

The directory to download to. Will default to app.getPath('temp' + '/DL_TEMP')

#### Defined in

[FileDownload.ts:227](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L227)

___

### destinationPath

• **destinationPath**: `string`

The path to the downloaded file to (including filename)

#### Defined in

[FileDownload.ts:214](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L214)

___

### downloadItem

• **downloadItem**: `DeferredPromise`<`DownloadItem`\>

The Electron DownloadItem instance as a thenable deferred promise

```js
const fileDownload = new FileDownload('https://example.com')
await fileDownload.downloadItem
```

**`See`**

https://www.electronjs.org/docs/api/download-item

#### Defined in

[FileDownload.ts:238](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L238)

___

### logger

• **logger**: `Object`

The logger to use - console, electron-log, winston, etc - defaults to no-op functions

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (...`_args`: `unknown`[]) => `void` |
| `error` | (...`_args`: `unknown`[]) => `void` |
| `info` | (...`_args`: `unknown`[]) => `void` |
| `warn` | (...`_args`: `unknown`[]) => `void` |

#### Defined in

[FileDownload.ts:217](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L217)

___

### url

• `Readonly` **url**: `string`

The url to download from

#### Defined in

[FileDownload.ts:211](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L211)

## Methods

### cancel

▸ **cancel**(): `Promise`<`void`\>

Cancel the download

Calls the Electron DownloadItem.cancel() method

#### Returns

`Promise`<`void`\>

#### Defined in

[FileDownload.ts:455](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L455)

___

### pause

▸ **pause**(): `Promise`<`void`\>

Pause the download.

Calls the Electron DownloadItem.pause() method

#### Returns

`Promise`<`void`\>

#### Defined in

[FileDownload.ts:433](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L433)

___

### resume

▸ **resume**(): `Promise`<`void`\>

Resume the download.

Calls the Electron DownloadItem.resume() method

#### Returns

`Promise`<`void`\>

#### Defined in

[FileDownload.ts:444](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L444)

___

### waitForDownload

▸ **waitForDownload**(): `Promise`<`string`\>

Returns a promise that resolves when the download is complete

#### Returns

`Promise`<`string`\>

The path to the downloaded file

#### Defined in

[FileDownload.ts:403](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L403)
