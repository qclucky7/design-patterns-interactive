import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "class LegacySdk {\n  charge(cents: number) {return \"charged:\" + cents;}\n}\nconst sdk = new LegacySdk();\nconsole.log(sdk.charge(10));",
    "class LegacySdk {\n  charge(cents: number) {return \"charged:\" + cents;}\n}\nconst sdk = new LegacySdk();\nconsole.log(sdk.charge(10 * 100));",
    "interface Payment {pay(amount: number): string;}\nclass LegacySdk {\n  charge(cents: number) {return \"charged:\" + cents;}\n}\nclass PaymentAdapter implements Payment {\n  private sdk = new LegacySdk();\n  pay(amount: number) {return this.sdk.charge(amount * 100);}\n}\nfunction checkout(payment: Payment, amount: number) {\n  return payment.pay(amount);\n}\nconsole.log(checkout(new PaymentAdapter(), 10));",
    "interface Payment {pay(amount: number): string;}\nclass LegacySdk {\n  charge(cents: number) {return \"charged:\" + cents;}\n}\nclass PaymentAdapter implements Payment {\n  private sdk = new LegacySdk();\n  pay(amount: number) {return this.sdk.charge(amount * 100);}\n}\nfunction checkout(payment: Payment, amount: number) {\n  return payment.pay(amount);\n}\nconsole.log(checkout(new PaymentAdapter(), 20));"
  ],
  "python": [
    "class LegacySdk:\n    def charge(self, cents):\n        return f\"charged:{cents}\"\n\nsdk = LegacySdk()\nprint(sdk.charge(10))",
    "class LegacySdk:\n    def charge(self, cents):\n        return f\"charged:{cents}\"\n\nsdk = LegacySdk()\nprint(sdk.charge(10 * 100))",
    "class LegacySdk:\n    def charge(self, cents):\n        return f\"charged:{cents}\"\n\nclass PaymentAdapter:\n    def __init__(self):\n        self.sdk = LegacySdk()\n    def pay(self, amount):\n        return self.sdk.charge(amount * 100)\n\ndef checkout(payment, amount):\n    return payment.pay(amount)\n\nprint(checkout(PaymentAdapter(), 10))",
    "class LegacySdk:\n    def charge(self, cents):\n        return f\"charged:{cents}\"\n\nclass PaymentAdapter:\n    def __init__(self):\n        self.sdk = LegacySdk()\n    def pay(self, amount):\n        return self.sdk.charge(amount * 100)\n\ndef checkout(payment, amount):\n    return payment.pay(amount)\n\nprint(checkout(PaymentAdapter(), 20))"
  ],
  "expected": [
    "charged:10",
    "charged:1000",
    "charged:1000",
    "charged:2000"
  ]
} satisfies PatternExampleSet;
