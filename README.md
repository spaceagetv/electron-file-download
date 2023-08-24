# electron-file-download

[![npm](https://img.shields.io/npm/v/electron-file-download.svg)](https://www.npmjs.com/package/electron-file-download)
[![GitHub release](https://img.shields.io/github/release/spaceagetv/electron-file-download.svg)](https://github.com/spaceagetv/electron-file-download/releases)
[![npm](https://img.shields.io/npm/dm/electron-file-download)](https://www.npmjs.com/package/electron-file-download)
[![NPM](https://img.shields.io/npm/l/electron-file-download)](/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/spaceagetv/electron-file-download.svg)](https://github.com/spaceagetv/electron-file-download/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/spaceagetv/electron-file-download.svg)](https://github.com/spaceagetv/electron-file-download/pull-requests)

## Description

A simple module to download files via Electron's main process. Manages the download process and exposes a simple API to listen for events including progress, success, failure, and cancellation. The module also exposes Electron's `DownloadItem` methods for pausing, resuming, and canceling the download.

## Installation

```bash
npm install electron-file-download
```

## Usage

```javascript
const { FileDownload } = require('electron-file-download');

// Download will start automatically when instantiated
const download = new FileDownload(
  "https://example.com/file.txt", 
  "/download-directory"
);
download.on('progress', (progress) => {
  console.log(`Download progress: ${progress.percent * 100}%`);
});
download.on('success', (filePath) => {
  console.log(`Download complete: ${filePath}`);
});
download.on('error', (error) => {
  console.log(`Download failed: ${error.message}`);
});
download.on('cancel', () => {
  console.log(`Download canceled`);
});
```

## API

[Full Documentation](docs/Exports.md)

### `new FileDownload(url, destination, dependencies)`

Creates a new download instance. The download will start automatically when instantiated.

#### `url`

Type: `string`

The URL to download.

#### `destination`

Type: `string`

The directory to save the file to.

#### `dependencies` (optional)

Type: `object`

##### `dependencies.session` (optional)

An Electron `Session` instance to use for the download. Defaults to `session.fromPartition('file-download')`.

```javascript

##### `dependencies.logger` (optional)

A `console`-compatible logger (such as electron-log or winston) to use when debugging the module.

```javascript
const download = new FileDownload(
  "https://example.com/file.txt", 
  "/download-directory",
  {
    logger: console
  }
);
```

### `download.on(event, callback)`

#### `event`

Type: `string`

The event to listen for. Can be one of the following:

- `progress`: Emitted when the download progress changes.
- `completed`: Emitted when the download completes successfully.
- `cancelled`: Emitted when the download is cancelled.
- `paused`: Emitted when the download is paused.
- `resumed`: Emitted when the download is resumed.
- `error`: Emitted when the download fails.

### `download.waitForDownload()`

Returns a `Promise` that resolves with the path of the downloaded file when the download completes successfully or fails.

### `download.pause()`

Pauses the download.

### `download.resume()`

Resumes the download.

### `download.cancel()`

Cancels the download.

### `download.downloadItem`

A Promise-like object that resolves to the Electron `DownloadItem` instance when the download starts. @see https://www.electronjs.org/docs/api/download-item

```javascript
const download = new FileDownload(
  "https://example.com/file.txt", 
  "/download-directory"
);
const mimeType = (await download.downloadItem).getMimeType();
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

