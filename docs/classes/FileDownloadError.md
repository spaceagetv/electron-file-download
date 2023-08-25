[electron-file-download](../README.md) / FileDownloadError

# Class: FileDownloadError

The base Error class for FileDownload

**`Example`**

```js
const fileDownload = new FileDownload('https://example.com')
fileDownload.on('error', (error) => {
 if (error instanceof FileDownloadError) {
  // might be a FileDownloadCancelledError or FileDownloadInterruptedError
  console.log(error.message)
 }
}
```

## Hierarchy

- `Error`

  ↳ **`FileDownloadError`**

  ↳↳ [`FileDownloadCancelledError`](FileDownloadCancelledError.md)

  ↳↳ [`FileDownloadInterruptedError`](FileDownloadInterruptedError.md)

## Table of contents

### Constructors

- [constructor](FileDownloadError.md#constructor)

## Constructors

### constructor

• **new FileDownloadError**(`message`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Overrides

Error.constructor

#### Defined in

[FileDownload.ts:84](https://github.com/spaceagetv/electron-file-download/blob/0753c2f/src/FileDownload.ts#L84)
