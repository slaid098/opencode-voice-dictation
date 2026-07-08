export type DictationState = "idle" | "recording" | "processing";

export interface AppConfig {
  groqApiKey: string;
  model: string;
  language: string;
  whisperPrompt: string;
  autoSubmit: boolean;
}

export interface TranscriptionResult {
  text: string;
}
