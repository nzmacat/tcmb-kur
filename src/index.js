import "@babel/polyfill";
import request from "request";
import {parseString} from "xml2js";

export const Fetch = async () => {
    const xml = await new Promise((acc, rej) => request
        .get(`https://www.tcmb.gov.tr/kurlar/today.xml?_=${(new Date().getMilliseconds())}`, (err, res, body) => {
            err ? rej(err) : acc(body)
        }));

    const {Tarih_Date: {Currency}} = await new Promise((acc, rej) => parseString(xml, (err, res) => err ? rej(err) : acc(res)));

    return Currency.filter(c => ['USD', 'EUR'].indexOf(c.$.Kod) !== -1).reduce((p, n) => {
        const {$: {CurrencyCode: code}, BanknoteBuying: [buying], BanknoteSelling: [selling]} = n;
        p[code] = {code, buying: parseFloat(buying), selling: parseFloat(selling)};
        return p;
    }, {});
};
