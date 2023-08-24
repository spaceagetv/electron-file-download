[electron-file-download](../README.md) / FileDownloadInterruptedError

# Class: FileDownloadInterruptedError

An error that occurs when the download is interrupted

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')
fileDownload.on('error', (error) => {
 if (error instanceof FileDownloadInterruptedError) {
 dialog.showMessageBox({
  type: 'warning',
  message: i18n('The download was interrupted'),
  buttons: [i18n('OK')],
})

## Hierarchy

- [`FileDownloadError`](FileDownloadError.md)

  ↳ **`FileDownloadInterruptedError`**

## Table of contents

### Constructors

- [constructor](FileDownloadInterruptedError.md#constructor)

## Constructors

### constructor

• **new FileDownloadInterruptedError**()

#### Overrides

[FileDownloadError](FileDownloadError.md).[constructor](FileDownloadError.md#constructor)

#### Defined in

[FileDownload.ts:132](https://github.com/spaceagetv/electron-file-download/blob/d54f0b4/src/FileDownload.ts#L132)
