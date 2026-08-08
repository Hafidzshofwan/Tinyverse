import "./tekanan-darah.css";
import { BpPercentileForm } from "@/features/bp-percentile";

export const metadata = {
  title: "Tekanan Darah",
};

export default function TekananDarahPage() {
  return <BpPercentileForm />;
}
