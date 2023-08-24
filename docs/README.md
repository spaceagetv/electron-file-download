electron-file-download

# electron-file-download

## Table of contents

### Classes

- [FileDownload](classes/FileDownload.md)
- [FileDownloadCancelledError](classes/FileDownloadCancelledError.md)
- [FileDownloadError](classes/FileDownloadError.md)
- [FileDownloadInterruptedError](classes/FileDownloadInterruptedError.md)

### Type Aliases

- [FileDownloadDependencies](README.md#filedownloaddependencies)
- [FileDownloadProgress](README.md#filedownloadprogress)

### Events

- [FileDownloadEvents](README.md#filedownloadevents)

## Type Aliases

### FileDownloadDependencies

Ƭ **FileDownloadDependencies**: typeof `fileDownloadDependencies`

Optional dependencies for FileDownload

#### Defined in

[FileDownload.ts:32](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L32)

___

### FileDownloadProgress

Ƭ **FileDownloadProgress**: `Object`

The progress of the download

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')
fileDownload.on('progress', (progress) => {
  console.log(`Downloaded ${progress.percent * 100}% of ${progress.totalBytes} bytes`)
})
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytesDownloaded` | `number` | The total number of bytes downloaded so far |
| `elapsedTime` | `number` | Elapsed time in milliseconds |
| `estimatedMsRemaining` | `number` | Estimated time remaining - milliseconds |
| `indeterminate` | `boolean` | Whether the download is indeterminate |
| `percent` | `number` | The progress of the download as a number between 0 and 1 |
| `startTime` | `number` | Start time - milliseconds since epoch |
| `totalBytes` | `number` | The total number of bytes to download |

#### Defined in

[FileDownload.ts:51](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L51)

## Events

### FileDownloadEvents

Ƭ **FileDownloadEvents**: `Object`

The events emitted by FileDownload

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')
fileDownload.on('progress', (progress) => {
  console.log(progress.percent)
})
fileDownload.on('completed', (destination) => {
  console.log(`File downloaded to ${destination}`)
})
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cancelled` | () => `void` |
| `completed` | (`destination`: `string`) => `void` |
| `error` | (`error`: [`FileDownloadError`](classes/FileDownloadError.md)) => `void` |
| `paused` | () => `void` |
| `progress` | (`progress`: [`FileDownloadProgress`](README.md#filedownloadprogress)) => `void` |
| `resumed` | () => `void` |

#### Defined in

[FileDownload.ts:155](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L155)
