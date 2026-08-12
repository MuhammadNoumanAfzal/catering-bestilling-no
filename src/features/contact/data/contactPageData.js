import {
  FiMail,
  FiMapPin,
  FiPhoneCall,
} from "react-icons/fi";

export const contactCards = [
  {
    title: "General support",
    value: "dev@gocatering.com",
    description:
      "Help with catering bookings, delivery details, account questions, and order updates.",
    icon: FiMail,
    accent: "from-[#fff1e7] to-[#fffaf5]",
  },
  {
    title: "Call our team",
    value: "+47 22 40 88 10",
    description:
      "Best for urgent event changes, delivery coordination, and kitchen timing questions.",
    icon: FiPhoneCall,
    accent: "from-[#fff6ec] to-[#fffdf8]",
  },
  {
    title: "Visit the kitchen desk",
    value: "Bryggen 14, Bergen",
    description:
      "Meet the team for partnership conversations, menu tastings, and full event planning support.",
    icon: FiMapPin,
    accent: "from-[#fff3ed] to-[#fffaf7]",
  },
];

export const responseSteps = [
  {
    title: "Tell us what you need",
    text: "Share your guest count, delivery date, event type, and what kind of support you need.",
  },
  {
    title: "We match the right team",
    text: "Order questions go to support, large events go to planning, and vendor issues go to operations.",
  },
  {
    title: "You get a clear next step",
    text: "Expect a practical reply with menu direction, timing, availability, and next steps.",
  },
];

export const faqItems = [
  {
    question: "How fast do you reply?",
    answer:
      "Most contact requests are answered within one business day, and urgent order issues are prioritized faster.",
  },
  {
    question: "Can you help with large office catering?",
    answer:
      "Yes. We support office lunches, launches, weddings, private parties, and one-off large group events.",
  },
  {
    question: "Do you work with vendors too?",
    answer:
      "Yes. Restaurants and catering partners can contact us for onboarding, menu setup, and operations support.",
  },
];

export const contactFormTopics = [
  "Event planning",
  "Office catering",
  "Order support",
  "Vendor partnership",
  "General question",
  "Other",
];

export const initialContactFormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  topic: "Event planning",
  message: "",
};
