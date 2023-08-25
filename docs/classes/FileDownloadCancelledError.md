[electron-file-download](../README.md) / FileDownloadCancelledError

# Class: FileDownloadCancelledError

An error that occurs when the download is cancelled

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')
fileDownload.on('error', (error) => {
  if (error instanceof FileDownloadCancelledError) {
    dialog.showMessageBox({
     type: 'warning',
     message: i18n('The download was cancelled'),
     buttons: [i18n('OK')],
  })
}
```

## Hierarchy

- [`FileDownloadError`](FileDownloadError.md)

  ↳ **`FileDownloadCancelledError`**

## Table of contents

### Constructors

- [constructor](FileDownloadCancelledError.md#constructor)

## Constructors

### constructor

• **new FileDownloadCancelledError**()

#### Overrides

[FileDownloadError](FileDownloadError.md).[constructor](FileDownloadError.md#constructor)

#### Defined in

[FileDownload.ts:109](https://github.com/spaceagetv/electron-file-download/blob/0753c2f/src/FileDownload.ts#L109)
