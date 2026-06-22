export function attachAddOnsToMenuItem(menuItem, addOns) {
  if (!menuItem || !Array.isArray(addOns) || addOns.length === 0) {
    return menuItem;
  }

  return {
    ...menuItem,
    modal: {
      ...menuItem.modal,
      optionalSelections: [
        {
          title: "Select Add-ons",
          options: addOns.map((item) => ({
            id: item.id,
            productId: item.id,
            label: item.name,
            price: parseFloat(item.priceWithTax || 0),
            image: item.coverImage?.fileUrl || "",
          })),
        },
      ],
    },
  };
}
