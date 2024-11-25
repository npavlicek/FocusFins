import { useState, useEffect, useCallback, MouseEvent } from 'react';

interface CoralType {
  modelId: number;
  price: number;
  name: string;
};

interface StoreItemProps {
  index: number;
  coralType: CoralType;
  initiatePurchaseCallback: (coralType: CoralType) => void;
};

const StoreItem: React.FC<StoreItemProps> = (props: StoreItemProps) => {
  const clickHandler = useCallback((e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation on <a>
    props.initiatePurchaseCallback(props.coralType);
  }, [props.initiatePurchaseCallback]);

  const path = `/public/${props.index}.png`;

  return (
    <a className="storeListItem" href="#" onClick={clickHandler}>
      <li>
        <img width={75} src={path} />
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoral, setSelectedCoral] = useState<CoralType | null>(null);

  const toggleStore = () => {
    setIsOpen(!isOpen);
  };

  const confirmPurchase = useCallback(() => {
    if (selectedCoral) {
      if (props.money >= selectedCoral.price) {
        props.subtractBalance(selectedCoral.price);
        props.spawnCoralCallback(selectedCoral.modelId);
        setSelectedCoral(null); // Close popup after purchase
      } else {
        alert("Not enough money!");
      }
    }
  }, [props.money, props.spawnCoralCallback, props.subtractBalance, selectedCoral]);

  const initiatePurchase = (coralType: CoralType) => {
    setSelectedCoral(coralType); // Show popup with selected coral
  };

  useEffect(() => {
    const newCoralTypes: CoralType[] = coralNames.map((val, index) => ({
      modelId: index,
      price: coralPrices[index] || 10, // Use coralPrices, fallback to 10 if undefined
      name: val,
    }));
    setCoralTypes(newCoralTypes);
  }, []);

  return (
    <div className="storeContainer">
      <button onClick={toggleStore} className="store-toggle-button">
        {isOpen ? 'Close Store' : 'Open Store'}
      </button>
      {isOpen && (
        <div className={`storeWrapper ${isOpen ? 'store-open' : ''}`}>
          <h3 style={{ fontSize: '1.5rem', marginTop: 9, marginBottom: 2 }}>Store</h3>
          <div className="bubble-bank" style={{ fontSize: '.8rem', textAlign: 'center', color: 'white', marginBottom: '5px' }}>
            Bubble Bank: {props.money} 🫧
          </div>
          <ul className="storeList">
            {coralTypes &&
              coralTypes.map((item, index) => (
                <StoreItem key={index} index={index} coralType={item} initiatePurchaseCallback={initiatePurchase} />
              ))
            }
          </ul>
        </div>
      )}
      {selectedCoral && (
        <div className="popup">
          <div className="popup-content">
            <p>Confirm purchase of <strong>{selectedCoral.name}</strong> for <strong>{selectedCoral.price} 🫧</strong>?</p>
            <button onClick={() => setSelectedCoral(null)}>Cancel</button>
            <button onClick={confirmPurchase}>Confirm</button>
        
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
