// Titular de la portada: nombre de universidad que va cambiando (React Bits · RotatingText).
import RotatingText from "../reactbits/RotatingText.jsx";

export default function Rotate({ texts = [] }) {
  return (
    <RotatingText
      texts={texts}
      mainClassName="rot-text"
      effect="blur"
      splitBy="words"
      rotationInterval={2400}
      animatePresenceInitial={false}
    />
  );
}
