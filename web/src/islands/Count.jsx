// Número que cuenta al entrar en pantalla (React Bits · CountUp).
import CountUp from "../reactbits/CountUp.jsx";

export default function Count({ to = 0, duration = 1.4 }) {
  return <CountUp to={to} duration={duration} separator="." />;
}
