import "./tekanan-darah.css";
import { BpPercentileForm } from "@/features/bp-percentile";

export const metadata = {
  title: "Persentil Tekanan Darah Anak (AAP 2017)",
};

export default function TekananDarahPage() {
  return <BpPercentileForm />;
}
