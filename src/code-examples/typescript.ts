const before = `type Method = "card" | "wallet" | "points";

function checkout(amount: number, method: Method) {
  if (method === "card") {
    return chargeCard(amount);
  }
  if (method === "wallet") {
    return chargeWallet(amount);
  }
  // New requirement: edit checkout again
  if (method === "points") {
    return redeemPoints(amount);
  }
}

function chargeCard(amount: number) { return "Card payment ¥" + amount; }
function chargeWallet(amount: number) { return "Wallet payment ¥" + amount; }
function redeemPoints(amount: number) { return "Points redeemed ¥" + amount; }
console.log(checkout(100, "card"));`;

const after = `interface PaymentStrategy {
  pay(amount: number): string;
}

class CardPayment implements PaymentStrategy {
  pay(amount: number) { return chargeCard(amount); }
}

class WalletPayment implements PaymentStrategy {
  pay(amount: number) { return chargeWallet(amount); }
}

class PointsPayment implements PaymentStrategy {
  pay(amount: number) { return redeemPoints(amount); }
}

function checkout(amount: number, strategy: PaymentStrategy) {
  return strategy.pay(amount);
}

function chargeCard(amount: number) { return "Card payment ¥" + amount; }
function chargeWallet(amount: number) { return "Wallet payment ¥" + amount; }
function redeemPoints(amount: number) { return "Points redeemed ¥" + amount; }
console.log(checkout(100, new PointsPayment()));`;

export const focusByStage: [number[], number[], number[], number[]] = [
  [3, 4, 7], [10, 11, 12, 13], [1, 2, 5, 9, 17, 18], [13, 14, 17, 18],
];

export function getStageCode(stage: number) {
  const lines = (stage < 2 ? before : after)
    .split("\n")
    .map((text, index) => ({ text, sourceLine: index + 1 }))
    .filter(({ sourceLine }) => {
      if (stage === 0) return sourceLine < 10 || sourceLine > 13;
      if (stage === 2) return sourceLine < 12 || sourceLine > 16;
      return true;
    })
    .filter(({ text }) => (stage === 0 || stage === 2) ? !text.startsWith("function redeemPoints") : true)
    .map((line) => {
      if (stage === 0 && line.sourceLine === 1) return { ...line, text: `type Method = "card" | "wallet";` };
      if (stage === 1 && line.text === `console.log(checkout(100, "card"));`) return { ...line, text: `console.log(checkout(100, "points"));` };
      if (stage === 2 && line.text === `console.log(checkout(100, new PointsPayment()));`) return { ...line, text: `console.log(checkout(100, new CardPayment()));` };
      return line;
    });
  return lines;
}
