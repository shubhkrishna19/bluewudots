/**
 * SKU Master Data - Aligned with Legacy Excel Structure
 * Parent SKUs: Internal referencing (Design/Dimensions/Weight)
 * Child SKUs: Sellable products with color variations
 */

export const SKU_MASTER = [
    // --- PARENT MTPs (Internal Reference) ---
    {
        sku: 'SR-CLM-T',
        name: 'Carlem Tall Design Shoe Rack',
        category: 'Shoe Racks',
        isParent: true,
        dimensions: '204x39x6 cm',
        weight: 26.8,
        bomCost: 4500,
        landingCost: 5200,
        packingCost: 350,
        tmsLevel: 'TL1',
        hsn: '94033000',
        categoryAvgMargin: 22
    },
    {
        sku: 'TU-WBM',
        name: 'Wilbrome TV Unit',
        category: 'TV Units',
        isParent: true,
        dimensions: '140x40x45 cm',
        weight: 15.0,
        bomCost: 5200,
        landingCost: 6100,
        packingCost: 450,
        tmsLevel: 'TL1',
        hsn: '94036000',
        categoryAvgMargin: 18
    },
    {
        sku: 'TU-SKD',
        name: 'Skiddo TV Unit',
        category: 'TV Units',
        isParent: true,
        dimensions: '120x35x40 cm',
        weight: 12.5,
        bomCost: 4100,
        landingCost: 4800,
        packingCost: 300,
        tmsLevel: 'TL2',
        hsn: '94036000',
        categoryAvgMargin: 18
    },
    {
        sku: 'ST-ELT-L',
        name: 'Elite L-Shaped Study Table',
        category: 'Study Tables',
        isParent: true,
        dimensions: '150x60x75 cm',
        weight: 34.2,
        bomCost: 7800,
        landingCost: 8900,
        packingCost: 600,
        tmsLevel: 'TL1',
        hsn: '94033000',
        categoryAvgMargin: 25
    },
    {
        sku: 'CP-MOD-3',
        name: 'Modern 3-Door Cupboard',
        category: 'Cupboards',
        isParent: true,
        dimensions: '120x50x180 cm',
        weight: 78.5,
        bomCost: 14500,
        landingCost: 16800,
        packingCost: 1200,
        tmsLevel: 'TL3',
        hsn: '94036000',
        categoryAvgMargin: 20
    },

    // --- CHILD SKUs (Sellable Products) ---
    {
        sku: 'SR-CLM-TM',
        parentSku: 'SR-CLM-T',
        name: 'Carlem Tall Design Shoe Rack',
        colorFinish: 'Brown Maple',
        isParent: false,
        bauSP: 10199,
        usualPrice: 9499,
        eventPrice: 8499,
        commissionPercent: 18,
        asin: 'B0DG9834LM',
        fkfsn: 'SHKH4FQ2G6XVBAWG'
    },
    {
        sku: 'SR-CLM-TW',
        parentSku: 'SR-CLM-T',
        name: 'Carlem Tall Design Shoe Rack',
        colorFinish: 'Wenge',
        isParent: false,
        bauSP: 10199,
        usualPrice: 9499,
        eventPrice: 8499,
        commissionPercent: 18,
        asin: 'B0DG9834LW',
        fkfsn: 'SHKH4FQ2G6XVBAWW'
    },
    {
        sku: 'TU-WBM-MF',
        parentSku: 'TU-WBM',
        name: 'Wilbrome TV Unit',
        colorFinish: 'Brown Maple & White',
        isParent: false,
        bauSP: 10799,
        usualPrice: 9999,
        eventPrice: 8999,
        commissionPercent: 18,
        asin: 'B0CJC6PTKS',
        fkfsn: 'TVUGUGZ55QPQGEHY'
    },
    {
        sku: 'TU-SKD-WF',
        parentSku: 'TU-SKD',
        name: 'Skiddo TV Unit',
        colorFinish: 'Wenge & White',
        isParent: false,
        bauSP: 9599,
        usualPrice: 8899,
        eventPrice: 7999,
        commissionPercent: 18,
        asin: 'B0BCZ4GVFM',
        fkfsn: 'TVUGG2FKZKVE897E'
    },
    {
        sku: 'ST-ELT-L-OAK',
        parentSku: 'ST-ELT-L',
        name: 'Elite L-Shaped Study Table',
        colorFinish: 'Natural Oak',
        isParent: false,
        bauSP: 18999,
        usualPrice: 17499,
        eventPrice: 15999,
        commissionPercent: 22,
        asin: 'B0DG9834ST',
        fkfsn: 'STKH4FQ2G6XVBAOA'
    },
    {
        sku: 'CP-MOD-3-WAL',
        parentSku: 'CP-MOD-3',
        name: 'Modern 3-Door Cupboard',
        colorFinish: 'Walnut Finish',
        isParent: false,
        bauSP: 34999,
        usualPrice: 31999,
        eventPrice: 28999,
        commissionPercent: 15,
        asin: 'B0DG9834CP',
        fkfsn: 'CPKH4FQ2G6XVBAWL'
    }
];

export const SKU_ALIASES = [
    { alias: 'AMZ-CARLEM-TM', parentCode: 'SR-CLM-TM', platform: 'Amazon' },
    { alias: 'FK-CARLEM-MAPLE', parentCode: 'SR-CLM-TM', platform: 'Flipkart' },
    { alias: 'AMZ-WILBROME-MF', parentCode: 'TU-WBM-MF', platform: 'Amazon' }
];

export default {
    SKU_MASTER,
    SKU_ALIASES
};
