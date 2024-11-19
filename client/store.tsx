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
    props.purchaseCoralCallback(props.coralType);
  }, [props.purchaseCoralCallback]);

  return (
    <a className="storeListItem" href="#" onClick={clickHandler}><li>{props.coralType.name}</li></a>
  );
};

interface StoreProps {
  money: number;
  subtractBalance: (amount: number) => void;
  spawnCoralCallback: (newCoralModelId: number) => void;
};

const coralNames: string[] = [
  'Seaweed', 'Blue Cabbage', 'Blue Leafy Coral', 'Yellow Cabbage', 'Amethyst shit', 'Tree type', 'Blue pickle', 'Blue Pickle v2', 'Blue thicky', 'Part the blue sea',
  'Blue bulbs', 'Grassy', 'Royal Coral', 'Tiny Blue', 'MF got the blue top', 'Flat seaweed', 'Blue playdough', 'Purple Oak Tree', 'Actual Pickle', 'Hermit crab sea weed',
  'Balding tree', 'Orange Cabbage'
];

const coralPrices: number[] = [
  // TODO: IMPLEMENT PRICES
];

const Store: React.FC<StoreProps> = (props: StoreProps) => {
  const [coralTypes, setCoralTypes] = useState<CoralType[]>();

  let purchaseCoral = useCallback((coralType: CoralType) => {
    if (props.money >= coralType.price) {
      props.subtractBalance(coralType.price);
      props.spawnCoralCallback(coralType.modelId);
    } else {
      // TODO: IMPLEMENT POPUP FOR NOT ENOUGH MONEY
    }
  }, [props.money, props.spawnCoralCallback, props.subtractBalance]);

  useEffect(() => {
    const newCoralTypes: CoralType[] = coralNames.map((val, index) => {
      const coralType: CoralType = {
        modelId: index,
        price: 10,
        name: val
      };
      return coralType;
    });
    setCoralTypes(newCoralTypes);
  }, []);

  return (
    <div className="storeWrapper">
      <h3 style={{ fontSize: '1.5rem',marginTop:9,marginBottom:2 }}>Store</h3>
      <div className="bubble-bank" style={{ fontSize: '1rem', textAlign: 'center', color: 'white', marginBottom: '05px' }}>
        Bubble Bank: 🫧
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
