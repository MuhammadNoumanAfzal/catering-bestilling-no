import { useState } from "react";
import {
  FiGift,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import {
  vendorRewardActions,
  vendorRewardBenefits,
  vendorRewardRedemptionOptions,
  vendorRewardTips,
} from "../data/vendorDashboardData";

function RewardActionCard({ title, description, cta, icon: Icon }) {
  return (
    <article className="rounded-[22px] border border-[#e8dfd6] bg-white px-4 py-5 text-center shadow-[0_8px_22px_rgba(28,28,28,0.04)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cb6033]">
        <Icon className="text-[28px]" />
      </div>
      <h3 className="mt-3 type-h5 ">{title}</h3>
      <p className="mt-2 type-para ">{description}</p>
      <button
        type="button"
        className="type-h5 mt-4 cursor-pointer rounded-full bg-[#cf5c2f] px-4 py-2.5 text-white transition hover:bg-[#bb5127]"
      >
        {cta}
      </button>
    </article>
  );
}

function RewardBulletList({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item} className="type-para pl-1 text-[#5f584f]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function VendorRewardsPage() {
  const [rewardsEnabled, setRewardsEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 ">Reward</h1>
        <p className="mt-2 type-para ">
          Earn points for orders, reviews, referrals, and more.
        </p>
        <p className="mt-4 type-h3 text-[#cf5c2f]">0 points</p>
      </section>

      <section className="rounded-[26px] border border-[#ddd4cb] bg-white p-5 shadow-[0_14px_32px_rgba(28,28,28,0.05)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
            <FiGift className="text-[28px]" />
          </div>
          <h2 className="mt-3 type-h4 text-[#1f1f1f]">Order and be rewarded</h2>
          <p className="mt-2 max-w-[430px] type-para ">
            No points yet. Place an order to start earning.
          </p>
          <button
            type="button"
            className="type-h5 mt-5 cursor-pointer rounded-full bg-[#cf5c2f] px-6 py-3 text-white transition hover:bg-[#b95127]"
          >
            Start an order
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {vendorRewardActions.map((action) => (
          <RewardActionCard key={action.title} {...action} />
        ))}
      </section>

      <section className="rounded-[22px] border border-[#ddd4cb] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(28,28,28,0.04)]">
        <button
          type="button"
          onClick={() => setRewardsEnabled((current) => !current)}
          className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="type-h5 ">Enable Rewards</p>
            <p className="mt-2 type-para ">
              Turn the rewards program on or off for your account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="type-para ">{rewardsEnabled ? "On" : "Off"}</span>
            {rewardsEnabled ? (
              <FiToggleRight className="text-[30px] text-[#cf5c2f]" />
            ) : (
              <FiToggleLeft className="text-[30px] text-[#a7a09a]" />
            )}
          </div>
        </button>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="type-h5 ">
            Every time you order with us, you earn Rewards based on what you
            spent on food:
          </h2>
          <div className="mt-3">
            <RewardBulletList items={vendorRewardBenefits} />
          </div>
        </div>

        <div>
          <h2 className="type-h5 ">
            There are two ways to redeem Rewards:
          </h2>
          <div className="mt-3">
            <RewardBulletList items={vendorRewardRedemptionOptions} />
          </div>
        </div>

        <div>
          <h2 className="type-h5 ">The fine print:</h2>
          <div className="mt-3">
            <RewardBulletList items={vendorRewardTips} />
          </div>
        </div>
      </section>
    </div>
  );
}
