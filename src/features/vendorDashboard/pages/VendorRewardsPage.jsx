import { useState } from "react";
import {
  FiGift,
  FiShoppingBag,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
} from "react-icons/fi";

const rewardActions = [
  {
    title: "Place Orders",
    description: "All placed orders give points!",
    cta: "Start order",
    icon: FiShoppingBag,
  },
  {
    title: "Invite Friends",
    description: "Invite 1 pal. If they order, send Eq. to 25,000 points friend!",
    cta: "Invite 1 friend",
    icon: FiUsers,
  },
  {
    title: "Write Reviews",
    description: "1000 points for each order you review.",
    cta: "Review a past order",
    icon: FiStar,
  },
];

const rewardBenefits = [
  "Every time you order food, you earn Rewards based on what you spent on food.",
  "As a reward member you collect points.",
  "As much as 5 points for 5 spent when you order from restaurants offering bonus Rewards.",
];

const rewardTiers = [
  "Order food and you earn a total of 500 more Rewards by choosing 'Add points' during checkout.",
  "At 20,000 points: Get a 2,500 points bonus between 1st-25th March (offer does minimum earnings).",
  "At 35,000 points: You get a gift card voucher to eat at your favorite restaurant.",
];

const rewardTips = [
  "Rewards expire one year after your last order.",
  "Points are added to your balance once an order is fulfilled.",
  "You must spend at least 1,500 points to redeem for an Amazon, Gift Card.",
  "You can't transfer Rewards points to anyone else or exchange for cash.",
  "Points can only be redeemed on orders totaling 15,000 or more.",
];

function RewardActionCard({ title, description, cta, icon: Icon }) {
  return (
    <article className="rounded-[22px] border border-[#e8dfd6] bg-white px-4 py-5 text-center shadow-[0_8px_22px_rgba(28,28,28,0.04)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cb6033]">
        <Icon className="text-[22px]" />
      </div>
      <h3 className="mt-3 type-h6 text-[#1f1f1f]">{title}</h3>
      <p className="mt-2 type-subpara text-[#7b7269]">{description}</p>
      <button
        type="button"
        className="type-h6 mt-4 cursor-pointer rounded-full bg-[#cf5c2f] px-4 py-2.5 text-white transition hover:bg-[#bb5127]"
      >
        {cta}
      </button>
    </article>
  );
}

function RewardBulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="type-subpara text-[#5f584f]">
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
        <h1 className="type-h2 text-[#191919]">Reward</h1>
        <p className="mt-2 type-subpara text-[#635b53]">
          Earn points for orders, reviews, referrals, and more.
        </p>
        <p className="mt-4 type-h3 text-[#cf5c2f]">0 points</p>
      </section>

      <section className="rounded-[26px] border border-[#ddd4cb] bg-white p-5 shadow-[0_14px_32px_rgba(28,28,28,0.05)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
            <FiGift className="text-[25px]" />
          </div>
          <h2 className="mt-3 type-h5 text-[#1f1f1f]">Order and be rewarded</h2>
          <p className="mt-2 max-w-[430px] type-subpara text-[#7a726a]">
            No points yet. Place an order to start earning.
          </p>
          <button
            type="button"
            className="type-h6 mt-5 cursor-pointer rounded-full bg-[#cf5c2f] px-6 py-3 text-white transition hover:bg-[#b95127]"
          >
            Start an order
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {rewardActions.map((action) => (
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
            <p className="type-h6 text-[#1f1f1f]">Enable Rewards</p>
            <p className="mt-1 type-subpara text-[#7a726a]">
              Turn the rewards program on or off for your account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="type-subpara text-[#5a534b]">
              {rewardsEnabled ? "On" : "Off"}
            </span>
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
          <h2 className="type-h6 text-[#1f1f1f]">
            Every time you order with us, you earn Rewards based on what you spent on food:
          </h2>
          <div className="mt-3">
            <RewardBulletList items={rewardBenefits} />
          </div>
        </div>

        <div>
          <h2 className="type-h6 text-[#1f1f1f]">
            Three extra ways to redeem Rewards:
          </h2>
          <div className="mt-3">
            <RewardBulletList items={rewardTiers} />
          </div>
        </div>

        <div>
          <h2 className="type-h6 text-[#1f1f1f]">The fine print:</h2>
          <div className="mt-3">
            <RewardBulletList items={rewardTips} />
          </div>
        </div>
      </section>
    </div>
  );
}
