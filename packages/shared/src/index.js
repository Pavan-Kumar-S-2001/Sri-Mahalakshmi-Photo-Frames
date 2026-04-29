export function computeCustomizationPricePaise(basePricePaise, customization) {
    const sizeAdd = customization.size === '8x10'
        ? 0
        : customization.size === '12x18'
            ? 35000
            : 70000;
    const styleAdd = customization.style === 'minimal'
        ? 0
        : customization.style === 'classic'
            ? 15000
            : 25000;
    const glassAdd = customization.glass === 'standard'
        ? 0
        : customization.glass === 'antiGlare'
            ? 20000
            : 45000;
    const designAdd = customization.designService ? 19900 : 0;
    return {
        basePricePaise,
        customizationPaise: sizeAdd + styleAdd + glassAdd + designAdd,
        subtotalPaise: basePricePaise + sizeAdd + styleAdd + glassAdd + designAdd,
    };
}
export function computeDeliveryFeePaise(subtotalPaise) {
    if (subtotalPaise >= 300000)
        return 0;
    if (subtotalPaise >= 200000)
        return 14900;
    return 19900;
}
