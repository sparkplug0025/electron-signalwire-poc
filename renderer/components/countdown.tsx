import { useCountdown } from "../hooks/utils";

interface CountdownProps {
  endTime: Date;
}

export const Countdown = ({ endTime }: CountdownProps) => {
  const { hmmss } = useCountdown({ endTime });
  return <p>{hmmss}</p>;
};

export default Countdown;
