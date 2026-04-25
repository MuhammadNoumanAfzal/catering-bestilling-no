import { useState } from "react";
import {
  FiCheckCircle,
  FiGift,
  FiX,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  vendorRewardActions,
  vendorRewardBenefits,
  vendorRewardRedemptionOptions,
  vendorRewardTips,
} from "../data/vendorDashboardData";

function getRewardModalContent(action) {
  if (!action) {
    return null;
  }

  if (action.title === "Place Orders") {
    return {
      eyebrow: "Earn Points",
      title: "Start earning rewards with every order",
      description:
        "Every placed order helps you build your rewards balance. Larger food totals can unlock even more points from bonus restaurants.",
      bullets: [
        "Points are added after the order is fulfilled.",
        "Bonus reward vendors can earn up to 5 points per $1 spent.",
        "Rewards can later be redeemed toward future orders.",
      ],
      confirmLabel: "Go to Orders",
      confirmAction: "navigate-orders",
    };
  }

  if (action.title === "Invite Friends") {
    return {
      eyebrow: "Referral Rewards",
      title: "Invite friends and grow your rewards",
      description:
        "Share your referral with friends. When they place a qualifying order, you receive extra reward points on your account.",
      bullets: [
        "Invite links can be shared by email or message.",
        "Reward points are added after the referred order is completed.",
        "You can track reward progress from this screen.",
      ],
      confirmLabel: "Sounds Good",
      confirmAction: "close",
    };
  }

  return {
    eyebrow: "Past Order Reviews",
    title: "Review completed orders to unlock points",
    description:
      "Sharing feedback helps improve the platform and gives you extra reward points for every eligible order you review.",
    bullets: [
      "Each completed review can earn 1000 points.",
      "Only fulfilled past orders are eligible.",
      "Reviews help restaurants improve food and delivery quality.",
    ],
    confirmLabel: "View Recent Orders",
    confirmAction: "navigate-orders",
  };
}

function RewardActionCard({ title, description, cta, icon: Icon, onOpen }) {
  return (
    <article className="rounded-[22px] border border-[#e8dfd6] bg-white px-4 py-5 text-center shadow-[0_8px_22px_rgba(28,28,28,0.04)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cb6033]">
        <Icon className="text-[28px]" />
      </div>
      <h3 className="mt-3 type-h5 ">{title}</h3>
      <p className="mt-2 type-para ">{description}</p>
      <button
        type="button"
        onClick={onOpen}
        className="type-h5 mt-4 cursor-pointer rounded-full bg-[#cf5c2f] px-4 py-2.5 text-white transition hover:bg-[#bb5127]"
      >
        {cta}
      </button>
    </article>
  );
}

function RewardActionModal({ action, onClose, onConfirm }) {
  const content = getRewardModalContent(action);

  if (!action || !content) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[#eadfd4] bg-[linear-gradient(180deg,#fffaf6_0%,#ffffff_100%)] shadow-[0_28px_60px_rgba(20,15,10,0.22)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#eadfd4] bg-white text-[#3e332b] transition hover:border-[#cf5c2f] hover:text-[#cf5c2f]"
          aria-label="Close reward popup"
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="border-b border-[#f0e7df] bg-[linear-gradient(135deg,#fff1e8_0%,#fff8f4_100%)] px-6 py-7">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-[#cf5c2f] shadow-[0_10px_24px_rgba(207,92,47,0.16)]">
            {action.icon ? <action.icon className="text-[28px]" /> : <FiGift className="text-[28px]" />}
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#cf5c2f]">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#181310]">
            {content.title}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#62564c]">
            {content.description}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-3">
            {content.bullets.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[18px] border border-[#efe4db] bg-[#fffdfb] px-4 py-3"
              >
                <FiCheckCircle className="mt-0.5 shrink-0 text-[18px] text-[#cf5c2f]" />
                <p className="text-[14px] leading-6 text-[#564d46]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#ddd3ca] px-5 py-2.5 text-sm font-semibold text-[#49413b] transition hover:bg-[#faf6f2]"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={() => onConfirm(content.confirmAction)}
              className="cursor-pointer rounded-full bg-[#cf5c2f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bb5127]"
            >
              {content.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  const navigate = useNavigate();
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [selectedRewardAction, setSelectedRewardAction] = useState(null);

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
          <RewardActionCard
            key={action.title}
            {...action}
            onOpen={() => setSelectedRewardAction(action)}
          />
        ))}
      </section>

      <section className="rounded-[22px] border border-[#ddd4cb] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(28,28,28,0.04)]">
        <button
          type="button"
          onClick={() => setRewardsEnabled((current) => !current)}
          className="flex w-full cursor-pointer flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center"
        >
          <div>
            <p className="type-h5 ">Enable Rewards</p>
            <p className="mt-2 type-para ">
              Turn the rewards program on or off for your account.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
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

      <RewardActionModal
        action={selectedRewardAction}
        onClose={() => setSelectedRewardAction(null)}
        onConfirm={(actionType) => {
          setSelectedRewardAction(null);

          if (actionType === "navigate-orders") {
            navigate("/vendor-dashboard/orders");
          }
        }}
      />
    </div>
  );
}
