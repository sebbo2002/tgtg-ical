export const DEFAULT_EMOJI = '🍴';
export const EMOJIS: Record<string, RegExp[]> = {
    '🌭': [/Ikea/],
    '🌮': [/Enchilada/, /Besitos/],
    '🍔': [
        /Burger/,
        /McDonald[‘|']?s/,
        /Burger King/,
        /Hans im Glück/,
        /Peter Pane/,
    ],
    '🍕': [
        /Domino‘s/,
        /Pizza Hut/,
        /L[‘|']Osteria/,
        /Call a Pizza/,
        /Smiley[‘|']s Pizza/,
    ],
    '🍗': [/KFC/],
    '🍝': [/LaTagliatella/, /Vapiano/],
    '🍤': [/Nordsee/],
    '🍩': [/Donut/, /Dunkin/],
    '🍪': [/Starbucks/],
    '🥐': [/LeCroBag/],
    '🥖': [
        /Bäckerei/,
        /Back/,
        /BackWerk/,
        /Kamps/,
        /Kamps Backstuben/,
        /Junge Die Bäckerei/,
        /Back-Factory/,
    ],
    '🥗': [/dean ?& ?david/],
    '🥨': [/Brezel/, /Ditsch/],
    '🥩': [/Steakhouse/, /Block House/, /Jim Block/],
    '🥪': [
        /Sandwich/,
        /Tank ?& ?Rast/,
        /T&R Raststätten/,
        /Autohöfe/,
        /Aral/,
        /Shell/,
        /Jet Tank/,
        /Subway/,
        /Caf[é|e] bonjour/,
        /Total Deutschland/,
        /Esso:? Snack ?& ?Shop/,
    ],
    '🛒': [
        /Edeka/,
        /Netto/,
        /Rewe/,
        /Penny/,
        /Lidl/,
        /Kaufland/,
        /Aldi/,
        /dm/,
        /Rossmann/,
        /Globus/,
        /Metro/,
        /Norma/,
        /Tegut/,
    ],
};

export default function getEmoji(location: string): null | string {
    for (const emoji in EMOJIS) {
        const regExps = EMOJIS[emoji].map((name) => new RegExp(name, 'i'));
        const match = !!regExps.find((regExp) => regExp.test(location));
        if (match) {
            return emoji;
        }
    }

    return null;
}
