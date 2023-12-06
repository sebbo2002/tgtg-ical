export const DEFAULT_EMOJI = '🍴';
export const EMOJIS: Record<string, RegExp[]> = {
    '🍔': [
        /Burger/,
        /McDonald[‘|']?s/,
        /Burger King/,
        /Hans im Glück/,
        /Peter Pane/,

    ],
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
    '🍕': [
        /Domino‘s/,
        /Pizza Hut/,
        /L[‘|']Osteria/,
        /Call a Pizza/,
        /Smiley[‘|']s Pizza/,

    ],
    '🍗': [
        /KFC/,

    ],
    '🍝': [
        /LaTagliatella/,
        /Vapiano/,

    ],
    '🍤': [
        /Nordsee/
    ],
    '🥩': [
        /Steakhouse/,
        /Block House/,
        /Jim Block/,

    ],
    '🌮': [
        /Enchilada/,
        /Besitos/,

    ],
    '🌭': [
        /Ikea/,

    ],
    '🥗': [
        /dean ?& ?david/
    ],
    '🥖': [
        /Bäckerei/,
        /Back/,
        /BackWerk/,
        /Kamps/,
        /Kamps Backstuben/,
        /Junge Die Bäckerei/,
        /Back-Factory/,

    ],
    '🥨': [
        /Brezel/,
        /Ditsch/,

    ],
    '🥐': [
        /LeCroBag/,

    ],
    '🍪': [
        /Starbucks/
    ],
    '🍩': [
        /Donut/,
        /Dunkin/,

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

    ]
};

export default function getEmoji(location: string): string | null {
    for (const emoji in EMOJIS) {
        const regExps = EMOJIS[emoji].map((name) => new RegExp(name, 'i'));
        const match = !!regExps.find(regExp => regExp.test(location));
        if(match) {
            return emoji;
        }
    }

    return null;
}
