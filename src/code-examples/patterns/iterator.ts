import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const songs = [\"A\", \"B\", \"C\"];\nconst visited: string[] = [];\nfor (let i = 0; i < songs.length; i++) visited.push(songs[i]);\nconsole.log(visited.join(\",\"));",
    "const songs = [\"A\", \"B\", \"C\"];\nconst visited: string[] = [];\nfor (let i = songs.length - 1; i >= 0; i--) visited.push(songs[i]);\nconsole.log(visited.join(\",\"));",
    "class Playlist implements Iterable<string> {\n  private songs: string[];\n  constructor(songs: string[]) {this.songs = [...songs];}\n  [Symbol.iterator](): Iterator<string> {return this.iterate(false);}\n  iterate(reverse: boolean): IterableIterator<string> {\n    const snapshot = [...this.songs];\n    if (reverse) snapshot.reverse();\n    return snapshot[Symbol.iterator]();\n  }\n}\nconst playlist = new Playlist([\"A\", \"B\", \"C\"]);\nconsole.log([...playlist].join(\",\"));",
    "class Playlist implements Iterable<string> {\n  private songs: string[];\n  constructor(songs: string[]) {this.songs = [...songs];}\n  [Symbol.iterator](): Iterator<string> {return this.iterate(false);}\n  iterate(reverse: boolean): IterableIterator<string> {\n    const snapshot = [...this.songs];\n    if (reverse) snapshot.reverse();\n    return snapshot[Symbol.iterator]();\n  }\n}\nconst playlist = new Playlist([\"A\", \"B\", \"C\"]);\nconsole.log([...playlist.iterate(true)].join(\",\"));"
  ],
  "python": [
    "songs = [\"A\", \"B\", \"C\"]\nvisited = []\nfor i in range(len(songs)):\n    visited.append(songs[i])\nprint(\",\".join(visited))",
    "songs = [\"A\", \"B\", \"C\"]\nvisited = []\nfor i in range(len(songs)-1, -1, -1):\n    visited.append(songs[i])\nprint(\",\".join(visited))",
    "class Playlist:\n    def __init__(self, songs):\n        self._songs = list(songs)\n    def __iter__(self):\n        return self.iterate(False)\n    def iterate(self, reverse=False):\n        snapshot = list(self._songs)\n        if reverse:\n            snapshot.reverse()\n        return iter(snapshot)\n\nplaylist = Playlist([\"A\", \"B\", \"C\"])\nprint(\",\".join(playlist))",
    "class Playlist:\n    def __init__(self, songs):\n        self._songs = list(songs)\n    def __iter__(self):\n        return self.iterate(False)\n    def iterate(self, reverse=False):\n        snapshot = list(self._songs)\n        if reverse:\n            snapshot.reverse()\n        return iter(snapshot)\n\nplaylist = Playlist([\"A\", \"B\", \"C\"])\nprint(\",\".join(playlist.iterate(True)))"
  ],
  "expected": [
    "A,B,C",
    "C,B,A",
    "A,B,C",
    "C,B,A"
  ]
} satisfies PatternExampleSet;
