import { FiGift } from "react-icons/fi";

export default function VendorRewardsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2">Reward</h1>
        <p className="mt-2 type-para">
          Rewards data is not connected for this account yet.
        </p>
      </section>

      <section className="rounded-[26px] border border-dashed border-[#ddd4cb] bg-white p-8 text-center shadow-[0_14px_32px_rgba(28,28,28,0.05)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
          <FiGift className="text-[28px]" />
        </div>
        <h2 className="mt-4 type-h4 text-[#1f1f1f]">Rewards unavailable</h2>
        <p className="mt-2 type-para text-[#635b53]">
          This page no longer shows sample reward content. Add a real rewards
          API integration to display account points and redemption options.
        </p>
      </section>
    </div>
  );
}
