import React, { useState } from 'react';

export default function Store() {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const items = [
    { id: 1, name: 'Bubble Booster', price: 10 },

  ];

  const handlePurchase = (itemName: string) => {
    setPurchasedItems([...purchasedItems, itemName]);
    alert(`You purchased: ${itemName}`);
  };

  return (
    <div className="store-container">
      <h1>Store</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name} - {item.price} Bubbles</span>
            <button onClick={() => handlePurchase(item.name)} style={{ marginLeft: '10px' }}>
              Buy
            </button>
          </li>
        ))}
      </ul>
      {purchasedItems.length > 0 && (
        <div className="purchased-items">
          <h2>Purchased Items</h2>
          <ul>
            {purchasedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
