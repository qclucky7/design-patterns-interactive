import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "let state = \"stopped\";\nfunction click() {state = state === \"stopped\" ? \"playing\" : \"stopped\";}\nclick();\nconsole.log(state);",
    "let state = \"stopped\";\nfunction click() {\n  if (state === \"playing\") state = \"paused\";\n  else state = \"playing\";\n}\nclick(); click();\nconsole.log(state);",
    "interface State {name: string; click(player: Player): void;}\nclass Player {\n  state: State = new Stopped();\n  click() {this.state.click(this);}\n}\nclass Stopped implements State {\n  name = \"stopped\";\n  click(player: Player) {player.state = new Playing();}\n}\nclass Playing implements State {\n  name = \"playing\";\n  click(player: Player) {player.state = new Stopped();}\n}\nconst player = new Player();\nplayer.click();\nconsole.log(player.state.name);",
    "interface State {name: string; click(player: Player): void;}\nclass Player {\n  state: State = new Stopped();\n  click() {this.state.click(this);}\n}\nclass Stopped implements State {\n  name = \"stopped\";\n  click(player: Player) {player.state = new Playing();}\n}\nclass Playing implements State {\n  name = \"playing\";\n  click(player: Player) {player.state = new Paused();}\n}\nclass Paused implements State {\n  name = \"paused\";\n  click(player: Player) {player.state = new Playing();}\n}\nconst player = new Player();\nplayer.click();\nplayer.click();\nconsole.log(player.state.name);\nplayer.click();\nconsole.log(player.state.name);"
  ],
  "python": [
    "state = \"stopped\"\ndef click():\n    global state\n    state = \"playing\" if state == \"stopped\" else \"stopped\"\n\nclick()\nprint(state)",
    "state = \"stopped\"\ndef click():\n    global state\n    state = \"paused\" if state == \"playing\" else \"playing\"\n\nclick()\nclick()\nprint(state)",
    "class Player:\n    def __init__(self):\n        self.state = Stopped()\n    def click(self):\n        self.state.click(self)\n\nclass Stopped:\n    name = \"stopped\"\n    def click(self, player):\n        player.state = Playing()\n\nclass Playing:\n    name = \"playing\"\n    def click(self, player):\n        player.state = Stopped()\n\nplayer = Player()\nplayer.click()\nprint(player.state.name)",
    "class Player:\n    def __init__(self):\n        self.state = Stopped()\n    def click(self):\n        self.state.click(self)\n\nclass Stopped:\n    name = \"stopped\"\n    def click(self, player):\n        player.state = Playing()\n\nclass Playing:\n    name = \"playing\"\n    def click(self, player):\n        player.state = Paused()\n\nclass Paused:\n    name = \"paused\"\n    def click(self, player):\n        player.state = Playing()\n\nplayer = Player()\nplayer.click()\nplayer.click()\nprint(player.state.name)\nplayer.click()\nprint(player.state.name)"
  ],
  "expected": [
    "playing",
    "paused",
    "playing",
    "paused"
  ]
} satisfies PatternExampleSet;
