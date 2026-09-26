import type { Metadata } from "next";
import { PatientPaymentView } from "@/components/views/PatientPaymentView";

export const metadata: Metadata = {
  title: "LifeDispatch | Patient Billing & Invoice",
  description:
    "Patient medical transport bill, mileage tariff, and digital invoice payment portal.",
};

export default async function PatientPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PatientPaymentView paymentId={resolvedParams.id} />;
}
