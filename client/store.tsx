import { useEffect, useState, useCallback, MouseEvent } from 'react';

interface CoralType {
  modelId: number;
  price: number;
  name: string;
};

interface StoreItemProps {
  coralType: CoralType;
  purchaseCoralCallback: (coralType: CoralType) => void;
};

const StoreItem: React.FC<StoreItemProps> = (props: StoreItemProps) => {
  const clickHandler = useCallback((e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation on <a>
    props.purchaseCoralCallback(props.coralType);
  }, [props.purchaseCoralCallback]);

  return (
    <a className="storeListItem" href="#" onClick={clickHandler}>
      <li>
        {props.coralType.name} - {props.coralType.price} 🫧
      </li>
    </a>
  );
};

interface StoreProps {
  money: number;
  subtractBalance: (amount: number) => void;
  spawnCoralCallback: (newCoralModelId: number) => void;
};

const coralNames: string[] = [
  'Seaweed', 'Green Leafy Coral', 'Bubble Wisps', 'Golden Sunburst', 'Rosy Ripple ', 'Glowlet', 'Azure Bloom', 'Ocean Mist Wisp', 'Saphire Spark', 'Part the Blue Sea',
  'Bubble bulbs', 'Ocean Fern', 'Royal Coral', 'Blueberry Spark', 'Aqua Crown', 'Lemon Loop', 'Mini Wavelet', 'Amethyst Bloom', 'Solar Blossom', 'Coral Seaweed',
  'Xenia Coral', 'Amber Waves'
];

const coralPrices: number[] = [
  100, 505, 150, 250, 250, 100, 180, 220, 30, 35,
  800, 300, 280, 100, 400, 600, 105, 50, 450, 170,
  300, 100
];

const Store: React.FC<StoreProps> = (props: StoreProps) => {
  const [coralTypes, setCoralTypes] = useState<CoralType[]>();

  const purchaseCoral = useCallback((coralType: CoralType) => {
    if (props.money >= coralType.price) {
      props.subtractBalance(coralType.price);
      props.spawnCoralCallback(coralType.modelId);
    } else {
      alert("Not enough money!"); // Simple popup for insufficient funds
    }
  }, [props.money, props.spawnCoralCallback, props.subtractBalance]);

  useEffect(() => {
    const newCoralTypes: CoralType[] = coralNames.map((val, index) => ({
      modelId: index,
      price: coralPrices[index] || 10, // Use coralPrices, fallback to 10 if undefined
      name: val,
    }));
    setCoralTypes(newCoralTypes);
  }, []);

  return (
    <div className="storeWrapper">
      <h3 style={{ fontSize: '1.5rem', marginTop: 9, marginBottom: 2 }}>Store</h3>
      <div className="bubble-bank" style={{ fontSize: '1rem', textAlign: 'center', color: 'white', marginBottom: '05px' }}>
        Bubble Bank: {props.money} 🫧
      </div>
      <ul className="storeList">
        {coralTypes &&
          coralTypes.map((item, index) => (
            <StoreItem key={index} coralType={item} purchaseCoralCallback={purchaseCoral} />
          ))
        }
      </ul>
    </div >
  );
}

export default Store;
