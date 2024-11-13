import { useState } from 'react';
const Sand: React.FC = () => {
  const [scale] = useState(1.3);

  return (
    <mesh receiveShadow>
      <boxGeometry args={[scale, scale / 55, scale]} />
      <meshStandardMaterial color={'#f0d897'} />
    </mesh>
  );
}

export default Sand;
