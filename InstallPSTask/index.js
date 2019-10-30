"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var fs = require("fs");
var node_fetch_1 = __importDefault(require("node-fetch"));
var https = require("https");
var unzip = require("unzipper");
var path = require("path");
var tar = require("tar");
var rimraf = require("rimraf");
var PSMetadata = /** @class */ (function () {
    function PSMetadata(StableReleaseTag, PreviewReleaseTag, ServicingReleaseTag, ReleaseTag, NextReleaseTag) {
    }
    return PSMetadata;
}());
var PSDailyMetadata = /** @class */ (function () {
    function PSDailyMetadata(ReleaseTag, BlobName) {
    }
    return PSDailyMetadata;
}());
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var channel, extension, downloadUrl, metadataJsonUrl, jsonMetdata, stableTag, previewTag, selectedTag, _a, dailyMetaDataUrl, dailyJson, dailyTag, platform, packageName, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 18, , 19]);
                    channel = tl.getInput('channel', true);
                    extension = '';
                    downloadUrl = '';
                    metadataJsonUrl = 'https://raw.githubusercontent.com/PowerShell/PowerShell/master/tools/metadata.json';
                    return [4 /*yield*/, node_fetch_1.default(metadataJsonUrl)];
                case 1: return [4 /*yield*/, (_c.sent()).json()];
                case 2:
                    jsonMetdata = _c.sent();
                    stableTag = jsonMetdata.StableReleaseTag;
                    previewTag = jsonMetdata.PreviewReleaseTag;
                    selectedTag = '';
                    _a = channel;
                    switch (_a) {
                        case 'stable': return [3 /*break*/, 3];
                        case 'preview': return [3 /*break*/, 4];
                        case 'daily': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 8];
                case 3:
                    selectedTag = stableTag;
                    return [3 /*break*/, 9];
                case 4:
                    selectedTag = previewTag;
                    return [3 /*break*/, 9];
                case 5:
                    dailyMetaDataUrl = 'https://aka.ms/pwsh-buildinfo-daily';
                    return [4 /*yield*/, node_fetch_1.default(dailyMetaDataUrl)];
                case 6: return [4 /*yield*/, (_c.sent()).json()];
                case 7:
                    dailyJson = _c.sent();
                    dailyTag = dailyJson.ReleaseTag;
                    selectedTag = dailyTag;
                    return [3 /*break*/, 9];
                case 8:
                    tl.setResult(tl.TaskResult.Failed, 'Invalid Channel: ' + channel);
                    return [3 /*break*/, 9];
                case 9:
                    downloadUrl = 'https://pscoretestdata.blob.core.windows.net/' + selectedTag.replace(/[.]/g, '-') + '/';
                    platform = tl.getPlatform();
                    packageName = '';
                    _b = platform;
                    switch (_b) {
                        case tl.Platform.Windows: return [3 /*break*/, 10];
                        case tl.Platform.Linux: return [3 /*break*/, 12];
                        case tl.Platform.Linux: return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 10:
                    packageName = 'PowerShell-' + selectedTag.substring(1) + '-win-x64.zip';
                    downloadUrl += packageName;
                    return [4 /*yield*/, downloadAndUnzipPackage(packageName, downloadUrl)];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 12:
                    packageName = 'powershell-' + selectedTag.substring(1) + '-linux-x64.tar.gz';
                    downloadUrl += packageName;
                    return [4 /*yield*/, downloadAndUntarPackage(packageName, downloadUrl)];
                case 13:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 14:
                    packageName = 'powershell-' + selectedTag.substring(1) + '-osx-x64.tar.gz';
                    downloadUrl += packageName;
                    return [4 /*yield*/, downloadAndUntarPackage(packageName, downloadUrl)];
                case 15:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 16: return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 19];
                case 18:
                    error_1 = _c.sent();
                    tl.setResult(tl.TaskResult.Failed, error_1.message);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
function downloadAndUnzipPackage(packageName, downloadUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var file, req;
        return __generator(this, function (_a) {
            console.log('Download url: ' + downloadUrl);
            file = fs.createWriteStream(packageName);
            req = https.get(downloadUrl, function (resp) {
                resp.pipe(file);
                file.on('finish', function () {
                    file.close();
                    console.log('file download completed');
                    var archive = path.join(__dirname, packageName);
                    var outputPath = path.join(__dirname, 'output');
                    fs.createReadStream(archive).pipe(unzip.Extract({ path: outputPath }));
                });
            });
            return [2 /*return*/];
        });
    });
}
function downloadAndUntarPackage(packageName, downloadUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var file, req;
        return __generator(this, function (_a) {
            console.log('Download url: ' + downloadUrl);
            file = fs.createWriteStream(packageName);
            req = https.get(downloadUrl, function (resp) {
                resp.pipe(file);
                file.on('finish', function () {
                    file.close();
                    console.log('file download completed');
                    var archive = path.join(__dirname, packageName);
                    var outputPath = path.join(__dirname, 'output');
                    if (fs.existsSync(outputPath)) {
                        rimraf.sync(outputPath);
                    }
                    fs.mkdirSync(outputPath);
                    fs.createReadStream(archive).pipe(tar.x({
                        C: outputPath
                    }));
                });
            });
            return [2 /*return*/];
        });
    });
}
run();
