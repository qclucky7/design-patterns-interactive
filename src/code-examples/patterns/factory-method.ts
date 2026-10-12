import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "function notify(channel: string, text: string) {\n  return \"email:\" + text.trim();\n}\nconsole.log(notify(\"email\", \" hello \"));",
    "function notify(channel: string, text: string) {\n  const formatted = text.trim();\n  if (channel === \"sms\") return \"sms:\" + formatted;\n  return \"email:\" + formatted;\n}\nconsole.log(notify(\"sms\", \" hello \"));",
    "interface Sender {send(text: string): string;}\nclass EmailSender implements Sender {\n  send(text: string) {return \"email:\" + text;}\n}\nabstract class Notification {\n  abstract createSender(): Sender;\n  notify(text: string) {\n    return this.createSender().send(text.trim());\n  }\n}\nclass EmailNotification extends Notification {\n  createSender() {return new EmailSender();}\n}\nconsole.log(new EmailNotification().notify(\" hello \"));",
    "interface Sender {send(text: string): string;}\nclass EmailSender implements Sender {\n  send(text: string) {return \"email:\" + text;}\n}\nabstract class Notification {\n  abstract createSender(): Sender;\n  notify(text: string) {\n    return this.createSender().send(text.trim());\n  }\n}\nclass EmailNotification extends Notification {\n  createSender() {return new EmailSender();}\n}\nclass SmsSender implements Sender {\n  send(text: string) {return \"sms:\" + text;}\n}\nclass SmsNotification extends Notification {\n  createSender() {return new SmsSender();}\n}\nconsole.log(new SmsNotification().notify(\" hello \"));"
  ],
  "python": [
    "def notify(channel, text):\n    return \"email:\" + text.strip()\n\nprint(notify(\"email\", \" hello \"))",
    "def notify(channel, text):\n    formatted = text.strip()\n    if channel == \"sms\":\n        return \"sms:\" + formatted\n    return \"email:\" + formatted\n\nprint(notify(\"sms\", \" hello \"))",
    "from abc import ABC, abstractmethod\n\nclass EmailSender:\n    def send(self, text):\n        return \"email:\" + text\n\nclass Notification(ABC):\n    @abstractmethod\n    def create_sender(self):\n        pass\n\n    def notify(self, text):\n        return self.create_sender().send(text.strip())\n\nclass EmailNotification(Notification):\n    def create_sender(self):\n        return EmailSender()\n\nprint(EmailNotification().notify(\" hello \"))",
    "from abc import ABC, abstractmethod\n\nclass EmailSender:\n    def send(self, text):\n        return \"email:\" + text\n\nclass Notification(ABC):\n    @abstractmethod\n    def create_sender(self):\n        pass\n\n    def notify(self, text):\n        return self.create_sender().send(text.strip())\n\nclass EmailNotification(Notification):\n    def create_sender(self):\n        return EmailSender()\n\nclass SmsSender:\n    def send(self, text):\n        return \"sms:\" + text\n\nclass SmsNotification(Notification):\n    def create_sender(self):\n        return SmsSender()\n\nprint(SmsNotification().notify(\" hello \"))"
  ],
  "expected": [
    "email:hello",
    "sms:hello",
    "email:hello",
    "sms:hello"
  ]
} satisfies PatternExampleSet;
