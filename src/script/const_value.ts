export enum State {
  None,
  stoppedUP,
  stalledDL,
  downloading,
  stalledUP,
  uploading,
  missingFiles,
  metaDL
}
export const StateEmoji = {
  "None": "⬜",
  "stoppedUP": "✅",
  "stalledDL": "🔽",
  "metaDL": "ℹ️",
  "downloading": "⬇️",
  "stalledUP": "⬆️",
  "uploading": "⬆️",
  "missingFiles": "⚠️",
  "stoppedDL": "⏹️",
};export const mag_regex = /^(?:magnet:\?xt=urn:btih:)([0-9A-Fa-f]{40})/;
export const gettTorrentEmoji = (state: State) => {
  if (state === State.None) return "⬜";

  //@ts-ignore
  else if (StateEmoji[state as string]) return StateEmoji[state as string];
  else return "❔";
};

