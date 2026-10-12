import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "class NormalEmail {send(text: string) {return \"email:\" + text;}}\nclass NormalSms {send(text: string) {return \"sms:\" + text;}}\nconsole.log(new NormalEmail().send(\"hello\"));",
    "class NormalEmail {send(text: string) {return \"email:\" + text;}}\nclass NormalSms {send(text: string) {return \"sms:\" + text;}}\nclass UrgentEmail {send(text: string) {return \"email:URGENT \" + text;}}\nclass UrgentSms {send(text: string) {return \"sms:URGENT \" + text;}}\nconsole.log(new UrgentSms().send(\"hello\"));",
    "interface Sender {send(text: string): string;}\nclass EmailSender implements Sender {\n  send(text: string) {return \"email:\" + text;}\n}\nclass SmsSender implements Sender {\n  send(text: string) {return \"sms:\" + text;}\n}\nclass Message {\n  protected sender: Sender;\n  constructor(sender: Sender) {this.sender = sender;}\n  send(text: string) {return this.sender.send(text);}\n}\nclass UrgentMessage extends Message {\n  send(text: string) {return this.sender.send(\"URGENT \" + text);}\n}\nconsole.log(new Message(new EmailSender()).send(\"hello\"));",
    "interface Sender {send(text: string): string;}\nclass EmailSender implements Sender {\n  send(text: string) {return \"email:\" + text;}\n}\nclass SmsSender implements Sender {\n  send(text: string) {return \"sms:\" + text;}\n}\nclass Message {\n  protected sender: Sender;\n  constructor(sender: Sender) {this.sender = sender;}\n  send(text: string) {return this.sender.send(text);}\n}\nclass UrgentMessage extends Message {\n  send(text: string) {return this.sender.send(\"URGENT \" + text);}\n}\nconsole.log(new UrgentMessage(new SmsSender()).send(\"hello\"));"
  ],
  "python": [
    "class NormalEmail:\n    def send(self, text):\n        return \"email:\" + text\n\nclass NormalSms:\n    def send(self, text):\n        return \"sms:\" + text\n\nprint(NormalEmail().send(\"hello\"))",
    "class NormalEmail:\n    def send(self, text):\n        return \"email:\" + text\n\nclass NormalSms:\n    def send(self, text):\n        return \"sms:\" + text\n\nclass UrgentEmail:\n    def send(self, text):\n        return \"email:URGENT \" + text\n\nclass UrgentSms:\n    def send(self, text):\n        return \"sms:URGENT \" + text\n\nprint(UrgentSms().send(\"hello\"))",
    "class EmailSender:\n    def send(self, text):\n        return \"email:\" + text\n\nclass SmsSender:\n    def send(self, text):\n        return \"sms:\" + text\n\nclass Message:\n    def __init__(self, sender):\n        self.sender = sender\n    def send(self, text):\n        return self.sender.send(text)\n\nclass UrgentMessage(Message):\n    def send(self, text):\n        return self.sender.send(\"URGENT \" + text)\n\nprint(Message(EmailSender()).send(\"hello\"))",
    "class EmailSender:\n    def send(self, text):\n        return \"email:\" + text\n\nclass SmsSender:\n    def send(self, text):\n        return \"sms:\" + text\n\nclass Message:\n    def __init__(self, sender):\n        self.sender = sender\n    def send(self, text):\n        return self.sender.send(text)\n\nclass UrgentMessage(Message):\n    def send(self, text):\n        return self.sender.send(\"URGENT \" + text)\n\nprint(UrgentMessage(SmsSender()).send(\"hello\"))"
  ],
  "expected": [
    "email:hello",
    "sms:URGENT hello",
    "email:hello",
    "sms:URGENT hello"
  ]
} satisfies PatternExampleSet;
