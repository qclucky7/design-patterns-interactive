const before = [
  `def checkout(amount, method):
    if method == "card":
        return charge_card(amount)
    if method == "wallet":
        return charge_wallet(amount)

def charge_card(amount):
    return f"Card payment ¥{amount}"

def charge_wallet(amount):
    return f"Wallet payment ¥{amount}"

print(checkout(100, "card"))`,
  `def checkout(amount, method):
    if method == "card":
        return charge_card(amount)
    if method == "wallet":
        return charge_wallet(amount)
    # New requirement: edit checkout again
    if method == "points":
        return redeem_points(amount)

def charge_card(amount):
    return f"Card payment ¥{amount}"

def charge_wallet(amount):
    return f"Wallet payment ¥{amount}"

def redeem_points(amount):
    return f"Points redeemed ¥{amount}"

print(checkout(100, "points"))`
];

const after = [
  `from typing import Protocol

class PaymentStrategy(Protocol):
    def pay(self, amount: int) -> str: ...

class CardPayment:
    def pay(self, amount: int) -> str:
        return f"Card payment ¥{amount}"

class WalletPayment:
    def pay(self, amount: int) -> str:
        return f"Wallet payment ¥{amount}"

def checkout(amount: int, strategy: PaymentStrategy) -> str:
    return strategy.pay(amount)

print(checkout(100, CardPayment()))`,
  `from typing import Protocol

class PaymentStrategy(Protocol):
    def pay(self, amount: int) -> str: ...

class CardPayment:
    def pay(self, amount: int) -> str:
        return f"Card payment ¥{amount}"

class WalletPayment:
    def pay(self, amount: int) -> str:
        return f"Wallet payment ¥{amount}"

class PointsPayment:
    def pay(self, amount: int) -> str:
        return f"Points redeemed ¥{amount}"

def checkout(amount: int, strategy: PaymentStrategy) -> str:
    return strategy.pay(amount)

print(checkout(100, PointsPayment()))`
];

const stages = [before[0], before[1], after[0], after[1]];

export const pythonExample = {
  id: "python",
  label: "Python",
  fileName: "checkout.py",
  focusByStage: [[2, 3, 4, 5], [6, 7, 8], [3, 4, 14, 15], [14, 15, 16, 18, 19]],
  getStageCode(stage: number) {
    return stages[stage].split("\n").map((text, index) => ({text, sourceLine: index + 1}));
  }
};
