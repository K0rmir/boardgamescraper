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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var chromium = require("playwright").chromium;
var boardgamedata_1 = require("./boardgamedata");
function getBoardGamePrices() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, gamesOnSaleArr, _i, boardGameData_1, boardGame, priceString, price, listPriceString, listPrice, error_1, priceElement, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chromium.launch({ headless: false })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _a.sent();
                    gamesOnSaleArr = [];
                    _i = 0, boardGameData_1 = boardgamedata_1.boardGameData;
                    _a.label = 4;
                case 4:
                    if (!(_i < boardGameData_1.length)) return [3 /*break*/, 17];
                    boardGame = boardGameData_1[_i];
                    priceString = void 0;
                    price = void 0;
                    listPriceString = void 0;
                    listPrice = void 0;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, page.goto(boardGame.gameUrl, { timeout: 2 * 60 * 1000 })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    if (error_1.name === 'TimeoutError' || error_1.message.includes('NetworkError')) {
                        console.error('Failed to establish connection to Amazon. (Network Error)');
                        throw new Error("Failed to establish connection. Aborting...");
                    }
                    return [3 /*break*/, 8];
                case 8:
                    console.log("Connected to ".concat(boardGame.gameTitle, " Amazon product page!"));
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    priceElement = page.locator('span.priceToPay').nth(0);
                    return [4 /*yield*/, priceElement.textContent({ timeout: 3000 })];
                case 10:
                    priceString = _a.sent();
                    price = parseFloat(priceString.replace(/£/, ''));
                    console.log("Current Price =", price);
                    return [3 /*break*/, 12];
                case 11:
                    error_2 = _a.sent();
                    console.error;
                    throw new Error("Could not find sale price. priceToPay may have been renamed.");
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, page.locator('span.basisPrice .a-offscreen').nth(0).textContent({ timeout: 3000 })];
                case 13:
                    listPriceString = _a.sent();
                    listPrice = parseFloat(listPriceString.replace(/£/, ''));
                    console.log('List Price =', listPrice);
                    return [3 /*break*/, 15];
                case 14:
                    error_3 = _a.sent();
                    listPrice = price;
                    console.log('List Price =', listPrice);
                    console.error('Game not on sale.');
                    return [3 /*break*/, 15];
                case 15:
                    // Determine whether or not product is on sale by checking if current price is less than list price //
                    if (price < listPrice) {
                        console.log('Game on sale.');
                        gamesOnSaleArr.push(boardGame.gameTitle);
                        console.log("These games are on sale: ".concat(gamesOnSaleArr));
                    }
                    _a.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 4];
                case 17: return [2 /*return*/];
            }
        });
    });
}
getBoardGamePrices();
