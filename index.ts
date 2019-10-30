import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import fetch from 'node-fetch';
import https = require('https');
import unzip = require('unzip');
import path = require('path');

class PSMetadata {
    constructor(
        StableReleaseTag: string,
        PreviewReleaseTag: string,
        ServicingReleaseTag: string,
        ReleaseTag: string,
        NextReleaseTag: string) { }
}

class PSDailyMetadata {
    constructor(
        ReleaseTag: string,
        BlobName: string) { }
}

async function run() {
    try {
        const channel: string | undefined = tl.getInput('channel', true);

        let extension:string = '';
        let downloadUrl:string = '';

        const metadataJsonUrl: string = 'https://raw.githubusercontent.com/PowerShell/PowerShell/master/tools/metadata.json'

        const jsonMetdata = await (await fetch(metadataJsonUrl)).json();
        const stableTag: string = jsonMetdata.StableReleaseTag;
        const previewTag: string = jsonMetdata.PreviewReleaseTag;

        let selectedTag = '';

        switch (channel) {
            case 'stable':
                selectedTag = stableTag;
                break;

            case 'preview':
                selectedTag = previewTag;
                break;

            case 'daily':
                const dailyMetaDataUrl = 'https://aka.ms/pwsh-buildinfo-daily';
                const dailyJson = await (await fetch(dailyMetaDataUrl)).json();
                const dailyTag = dailyJson.ReleaseTag;
                selectedTag = dailyTag;
                break;

            default:
                tl.setResult(tl.TaskResult.Failed, 'Invalid Channel: ' + channel);
                break;
        }

        downloadUrl = 'https://pscoretestdata.blob.core.windows.net/' + selectedTag.replace(/[.]/g, '-') + '/';

        const platform: tl.Platform | undefined = tl.getPlatform();

        let packageName = '';

        switch (platform) {
            case tl.Platform.Windows:
                packageName = 'PowerShell-' + selectedTag.substring(1) + '-win-x64.zip';
                downloadUrl += packageName;
                await downloadAndUnzipPackage(packageName, downloadUrl);
                break;

            case tl.Platform.Linux:
                packageName = 'powershell-' + selectedTag.substring(1) + '-linux-x64.tar.gz';
                downloadUrl += packageName;

            case tl.Platform.Linux:
                    packageName = 'powershell-' + selectedTag.substring(1) + '-osx-x64.tar.gz';
                    downloadUrl += packageName;

            default:
                break;
        }



    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

async function downloadAndUnzipPackage(packageName: string, downloadUrl: string) {
    console.log('Download url: ' + downloadUrl );
    const file = fs.createWriteStream(packageName);
        const req = https.get(downloadUrl, resp => {
            resp.pipe(file);
            file.on('finish', () => {
                file.close(); console.log('file download completed');
                var archive = path.join(__dirname, packageName);
                fs.createReadStream(archive).pipe(unzip.Extract({ path: 'output' }));
            })
        });
}

run();