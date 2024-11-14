import { useState, useCallback, MouseEventHandler, MouseEvent } from 'react';

interface StoreItemProps {
  coralName: string;
  coralId: number;
  spawnCoralCallback: (id: number) => void;
};

const StoreItem: React.FC<StoreItemProps> = (props: StoreItemProps) => {
  const clickHandler = useCallback((e: MouseEvent) => {
    props.spawnCoralCallback(props.coralId);
  }, []);

  return (
    <a className="storeListItem" href="#" onClick={clickHandler}><li>{props.coralName}</li></a>
  );
};

interface StoreProps {
  spawnCoralCallback: (id: number) => void;
};

const Store: React.FC<StoreProps> = (props: StoreProps) => {
  const corals: string[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22'
  ];

  return (
    <div className="storeWrapper">
      <ul className="storeList">
        {
          corals.map((item, index) => (
            <StoreItem key={index} coralId={index} coralName={item} spawnCoralCallback={props.spawnCoralCallback} />
          ))
        }
      </ul>
    </div >
  );
}

export default Store;
